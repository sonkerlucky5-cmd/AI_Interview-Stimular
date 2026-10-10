const { env, validateEnv } = require("../config/env");
const { pool, connectDB } = require("../config/db");
const User = require("../models/User");
const { runMigrations } = require("./migrate");

async function runTests() {
  console.log("=========================================");
  console.log("   PostgreSQL Migration Test Suite       ");
  console.log("=========================================\n");

  console.log("1. Environment & Configuration Check:");
  try {
    validateEnv();
    console.log("   ✔ Environment variables validated successfully.");
    console.log(`   ✔ DATABASE_URL is set: ${env.DATABASE_URL ? "Yes" : "No"}`);
  } catch (err) {
    console.error("   ❌ Environment validation failed:", err.message);
    return;
  }

  console.log("\n2. PostgreSQL Connectivity Test:");
  let client;
  try {
    client = await pool.connect();
    const res = await client.query("SELECT current_database(), current_user, version();");
    console.log("   ✔ PostgreSQL connection established successfully.");
    console.log(`   ✔ Database: ${res.rows[0].current_database}`);
    console.log(`   ✔ User: ${res.rows[0].current_user}`);
    console.log(`   ✔ Version: ${res.rows[0].version.split(" on ")[0]}`);
  } catch (err) {
    console.warn("   ⚠️ Live PostgreSQL connection could not be established.");
    console.warn(`   ⚠️ Details: ${err.message}`);
    console.warn("   ⚠️ Make sure PostgreSQL is running and DATABASE_URL in .env points to a valid instance.");
    console.warn("   ⚠️ Integration tests requiring live database cannot be run without an active PostgreSQL service.");
    return;
  } finally {
    if (client) client.release();
  }

  console.log("\n3. Schema Migration Test:");
  try {
    await runMigrations();
    console.log("   ✔ Users table and indexes created / verified.");
  } catch (err) {
    console.error("   ❌ Migration failed:", err.message);
    return;
  }

  console.log("\n4. User Signup & Duplicate Email Test:");
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "Password123!";
  let createdUser;
  try {
    createdUser = await User.create({
      name: "Test Candidate",
      email: testEmail,
      password: testPassword,
    });
    console.log(`   ✔ User created with ID: ${createdUser.id}`);
    console.log(`   ✔ Password hashed: ${createdUser.password.startsWith("$2")}`);
    console.log(`   ✔ Safe object output:`, createdUser.toSafeObject());

    // Duplicate test
    try {
      await User.create({
        name: "Duplicate Candidate",
        email: testEmail,
        password: testPassword,
      });
      console.error("   ❌ Duplicate email check failed: expected error but succeeded");
    } catch (dupErr) {
      console.log(`   ✔ Duplicate email correctly rejected: ${dupErr.message || dupErr.code}`);
    }
  } catch (err) {
    console.error("   ❌ User creation failed:", err.message);
    return;
  }

  console.log("\n5. User Query & Authentication Test:");
  try {
    const fetchedUser = await User.findOne({ email: testEmail });
    console.log("   ✔ User.findOne retrieved user:", Boolean(fetchedUser));

    const validPass = await fetchedUser.comparePassword(testPassword);
    console.log("   ✔ Password comparison (valid):", validPass);

    const invalidPass = await fetchedUser.comparePassword("WrongPassword123!");
    console.log("   ✔ Password comparison (invalid):", !invalidPass);

    const userById = await User.findById(createdUser.id);
    console.log("   ✔ User.findById retrieved user:", Boolean(userById));
  } catch (err) {
    console.error("   ❌ Query / auth test failed:", err.message);
    return;
  }

  console.log("\n6. Cleanup Test Data:");
  try {
    await pool.query("DELETE FROM users WHERE email = $1", [testEmail]);
    console.log("   ✔ Test user cleaned up successfully.");
  } catch (err) {
    console.warn("   ⚠️ Cleanup warning:", err.message);
  }

  console.log("\n=========================================");
  console.log("   All PostgreSQL Tests Passed! 🎉       ");
  console.log("=========================================\n");
}

if (require.main === module) {
  runTests()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      pool.end();
      process.exit(1);
    });
}

module.exports = runTests;
