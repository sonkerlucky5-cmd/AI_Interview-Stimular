const { Pool } = require("pg");
const { env } = require("./env");

const getSslConfig = () => {
  if (process.env.PGSSLMODE === "disable") {
    return false;
  }

  if (env.NODE_ENV === "production") {
    // In production, enforce certificate verification
    return {
      rejectUnauthorized: true,
    };
  }

  // In development/test, enable SSL if required by cloud providers
  if (
    env.DATABASE_URL &&
    (env.DATABASE_URL.includes("sslmode=require") ||
      env.DATABASE_URL.includes("sslmode=verify-full") ||
      env.DATABASE_URL.includes("ssl=true"))
  ) {
    return {
      rejectUnauthorized: false,
    };
  }

  return false;
};

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: getSslConfig(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

const query = (text, params) => pool.query(text, params);

const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const initTables = async () => {
  const createSchemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'candidate',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users (LOWER(email));
    CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
  `;

  await pool.query(createSchemaSql);
};

const connectDB = async () => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT current_database(), current_user;");
      const dbInfo = result.rows[0];
      console.log(`PostgreSQL connected: database '${dbInfo.current_database}' as user '${dbInfo.current_user}'`);

      await initTables();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`PostgreSQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

connectDB.pool = pool;
connectDB.query = query;
connectDB.withTransaction = withTransaction;
connectDB.connectDB = connectDB;

module.exports = connectDB;
