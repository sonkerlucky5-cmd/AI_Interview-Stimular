const { pool } = require("../config/db");

class InterviewAnswer {
  static async createOrUpdate({
    questionId,
    answerText,
    transcript = null,
    idempotencyKey = null,
  }) {
    const query = `
      INSERT INTO interview_answers (
        question_id, answer_text, transcript, idempotency_key
      ) VALUES ($1, $2, $3, $4)
      ON CONFLICT (question_id) DO UPDATE
      SET answer_text = EXCLUDED.answer_text,
          transcript = EXCLUDED.transcript,
          idempotency_key = EXCLUDED.idempotency_key,
          submitted_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [questionId, answerText, transcript, idempotencyKey];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByQuestionId(questionId) {
    const query = `
      SELECT *
      FROM interview_answers
      WHERE question_id = $1;
    `;
    const { rows } = await pool.query(query, [questionId]);
    return rows[0] || null;
  }
}

module.exports = InterviewAnswer;
