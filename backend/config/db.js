const { Client, Pool } = require("pg");
const { env } = require("./env");

const normalizeDatabaseUrl = (urlStr) => {
  if (!urlStr) return urlStr;
  try {
    new URL(urlStr);
    return urlStr;
  } catch {
    const protocolMatch = urlStr.match(/^([a-z]+:\/\/)(.*)$/i);
    if (!protocolMatch) return urlStr;
    const rest = protocolMatch[2];
    const lastAtIndex = rest.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const authPart = rest.slice(0, lastAtIndex);
      const hostPart = rest.slice(lastAtIndex + 1);
      const colonIndex = authPart.indexOf(":");
      if (colonIndex !== -1) {
        const user = authPart.slice(0, colonIndex);
        const pass = authPart.slice(colonIndex + 1);
        return `${protocolMatch[1]}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostPart}`;
      }
    }
    return urlStr;
  }
};

const getSslConfig = () => {
  if (process.env.PGSSLMODE === "disable") {
    return false;
  }

  if (env.NODE_ENV === "production") {
    return {
      rejectUnauthorized: true,
    };
  }

  const rawUrl = env.DATABASE_URL || "";
  if (
    rawUrl.includes("sslmode=require") ||
    rawUrl.includes("sslmode=verify-full") ||
    rawUrl.includes("ssl=true")
  ) {
    return {
      rejectUnauthorized: false,
    };
  }

  return false;
};

const normalizedUrl = normalizeDatabaseUrl(env.DATABASE_URL);

const pool = new Pool({
  connectionString: normalizedUrl,
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
  const { fullSchemaSql } = require("../scripts/migrate");
  await pool.query(fullSchemaSql);
};

const ensureDatabaseExists = async () => {
  try {
    const parsed = new URL(normalizedUrl);
    const dbName = parsed.pathname.slice(1);
    if (!dbName || dbName === "postgres") return;

    const adminUrl = new URL(normalizedUrl);
    adminUrl.pathname = "/postgres";

    const adminClient = new Client({
      connectionString: adminUrl.toString(),
      ssl: getSslConfig(),
    });

    await adminClient.connect();
    try {
      const checkRes = await adminClient.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );
      if (checkRes.rows.length === 0) {
        console.log(`Database '${dbName}' not found. Creating database...`);
        await adminClient.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database '${dbName}' created successfully.`);
      }
    } finally {
      await adminClient.end();
    }
  } catch {
    // If adminClient cannot connect or lacks privileges, ignore and let primary pool attempt
  }
};

const connectDB = async () => {
  try {
    await ensureDatabaseExists();

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
    if (error.code === "3D000") {
      console.error(`PostgreSQL: Database does not exist. Attempting auto-creation...`);
      try {
        await ensureDatabaseExists();
        const client = await pool.connect();
        try {
          await initTables();
          console.log(`PostgreSQL connected successfully after database creation.`);
          return;
        } finally {
          client.release();
        }
      } catch (retryErr) {
        console.error(`Failed to auto-create database: ${retryErr.message}`);
      }
    } else if (error.code === "28P01") {
      console.error(`PostgreSQL authentication failed for user. Please check your password in .env`);
    } else if (error.code === "ECONNREFUSED") {
      console.error(`Could not connect to PostgreSQL server. Please make sure PostgreSQL service is running on port 5432.`);
    } else {
      console.error(`PostgreSQL connection failed: ${error.message}`);
    }
    process.exit(1);
  }
};

connectDB.pool = pool;
connectDB.query = query;
connectDB.withTransaction = withTransaction;
connectDB.connectDB = connectDB;
connectDB.normalizeDatabaseUrl = normalizeDatabaseUrl;

module.exports = connectDB;
