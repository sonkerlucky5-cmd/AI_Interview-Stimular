const { pool } = require("../config/db");

class Report {
  static async createOrUpdate({ interviewId, userId, summary, storageKey = null }) {
    const query = `
      INSERT INTO interview_reports (
        interview_id, user_id, summary, storage_key, status, generated_at
      ) VALUES ($1, $2, $3, $4, 'ready', CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [interviewId, userId, JSON.stringify(summary), storageKey];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByInterviewAndUser(interviewId, userId) {
    const query = `
      SELECT ir.*, i.target_role, i.difficulty, i.completed_at
      FROM interview_reports ir
      JOIN interviews i ON i.id = ir.interview_id
      WHERE ir.interview_id = $1 AND ir.user_id = $2
      ORDER BY ir.created_at DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [interviewId, userId]);
    return rows[0] || null;
  }

  static async findByUser(userId) {
    const query = `
      SELECT ir.*, i.target_role, i.difficulty, i.completed_at
      FROM interview_reports ir
      JOIN interviews i ON i.id = ir.interview_id
      WHERE ir.user_id = $1
      ORDER BY ir.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
}

module.exports = Report;
