const { pool } = require("../config/db");

const verifyTables = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("Existing tables in public schema:");
    res.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.table_name}`);
    });

    const expected = [
      "users",
      "resumes",
      "job_descriptions",
      "resume_matches",
      "interviews",
      "interview_questions",
      "interview_answers",
      "answer_evaluations",
      "coding_questions",
      "coding_submissions",
      "coding_test_results",
      "learning_plans",
      "learning_plan_items",
      "interview_reports",
      "ai_usage_events"
    ];

    const actual = res.rows.map(r => r.table_name);
    const missing = expected.filter(t => !actual.includes(t));

    if (missing.length === 0) {
      console.log("\nSUCCESS: All 15 required tables exist in PostgreSQL!");
    } else {
      console.log("\nWARNING: Missing tables:", missing);
    }
  } catch (err) {
    console.error("Verification failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
};

verifyTables();
