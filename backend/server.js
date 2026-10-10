const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { env, validateEnv } = require("./config/env");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.CLIENT_URLS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Real AI Interview Simulator API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
