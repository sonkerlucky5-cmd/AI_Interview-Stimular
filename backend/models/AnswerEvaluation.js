const { pool } = require("../config/db");

class AnswerEvaluation {
  static async createOrUpdate({
    answerId,
    scores,
    strengths = [],
    improvements = [],
    idealAnswer = "",
    followUpSuggestion = "",
    rubricVersion = "standard_rubric_v1",
    modelVersion = "gemini-1.5-flash",
  }) {
    const query = `
      INSERT INTO answer_evaluations (
        answer_id, scores, strengths, improvements, ideal_answer,
        follow_up_suggestion, rubric_version, model_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (answer_id) DO UPDATE
      SET scores = EXCLUDED.scores,
          strengths = EXCLUDED.strengths,
          improvements = EXCLUDED.improvements,
          ideal_answer = EXCLUDED.ideal_answer,
          follow_up_suggestion = EXCLUDED.follow_up_suggestion,
          rubric_version = EXCLUDED.rubric_version,
          model_version = EXCLUDED.model_version,
          created_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [
      answerId,
      JSON.stringify(scores),
      JSON.stringify(strengths),
      JSON.stringify(improvements),
      idealAnswer,
      followUpSuggestion,
      rubricVersion,
      modelVersion,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByAnswerId(answerId) {
    const query = `
      SELECT *
      FROM answer_evaluations
      WHERE answer_id = $1;
    `;
    const { rows } = await pool.query(query, [answerId]);
    return rows[0] || null;
  }

  static async listByInterviewId(interviewId, userId) {
    const query = `
      SELECT 
        ae.*,
        ia.answer_text,
        iq.position,
        iq.question_text,
        iq.category
      FROM answer_evaluations ae
      JOIN interview_answers ia ON ia.id = ae.answer_id
      JOIN interview_questions iq ON iq.id = ia.question_id
      JOIN interviews i ON i.id = iq.interview_id
      WHERE i.id = $1 AND i.user_id = $2
      ORDER BY iq.position ASC;
    `;
    const { rows } = await pool.query(query, [interviewId, userId]);
    return rows;
  }
}

module.exports = AnswerEvaluation;
