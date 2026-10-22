const { pool, withTransaction } = require("../config/db");

class Dsa {
  static async listProblems() {
    const { rows } = await pool.query(
      `SELECT id, slug, title, statement, difficulty, topics, constraints, examples,
              starter_code, time_limit_ms, memory_limit_kb
       FROM coding_questions WHERE is_active = true ORDER BY title ASC`
    );
    return rows;
  }

  static async findProblemById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM coding_questions WHERE id = $1 AND is_active = true`, [id]
    );
    return rows[0] || null;
  }

  static async createSubmission({ userId, problemId, language, code, status }) {
    const { rows } = await pool.query(
      `INSERT INTO coding_submissions (question_id, user_id, language, source_code, status, finished_at)
       VALUES ($1, $2, $3, $4, $5, CASE WHEN $5 = 'running' THEN NULL ELSE CURRENT_TIMESTAMP END)
       RETURNING id, created_at`,
      [problemId, userId, language, code, status]
    );
    return rows[0];
  }

  static async finishSubmission({ submissionId, verdict, runnerReference, results, passed, total, executionMs, memoryKb }) {
    await withTransaction(async (client) => {
      await client.query(
        `UPDATE coding_submissions SET status = $2, runner_reference = $3, finished_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [submissionId, verdict, runnerReference || null]
      );
      await client.query(
        `INSERT INTO coding_test_results (submission_id, passed_count, total_count, execution_ms, memory_kb, summary, verdict, test_results)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
        [submissionId, passed, total, executionMs, memoryKb, `${passed}/${total} tests passed`, verdict, JSON.stringify(results)]
      );
    });
  }
}

module.exports = Dsa;
