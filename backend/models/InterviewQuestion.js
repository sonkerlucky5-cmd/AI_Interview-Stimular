const { pool } = require("../config/db");

class InterviewQuestion {
  static async create({
    interviewId,
    position,
    questionText,
    category = "General",
    difficulty = "intermediate",
    metadata = {},
  }) {
    const query = `
      INSERT INTO interview_questions (
        interview_id, position, question_text, category, difficulty, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      interviewId,
      position,
      questionText,
      category,
      difficulty,
      JSON.stringify(metadata),
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByInterviewAndPosition(interviewId, position) {
    const query = `
      SELECT *
      FROM interview_questions
      WHERE interview_id = $1 AND position = $2;
    `;
    const { rows } = await pool.query(query, [interviewId, position]);
    return rows[0] || null;
  }

  static async listByInterview(interviewId) {
    const query = `
      SELECT *
      FROM interview_questions
      WHERE interview_id = $1
      ORDER BY position ASC;
    `;
    const { rows } = await pool.query(query, [interviewId]);
    return rows;
  }
}

module.exports = InterviewQuestion;
