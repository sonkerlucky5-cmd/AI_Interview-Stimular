const { pool } = require("../config/db");

class Interview {
  static async create({
    userId,
    resumeId = null,
    jobDescriptionId = null,
    interviewType = "technical",
    targetRole,
    language = "English",
    difficulty = "intermediate",
    questionLimit = 5,
  }) {
    const query = `
      INSERT INTO interviews (
        user_id, resume_id, job_description_id, interview_type,
        target_role, language, difficulty, question_limit, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *;
    `;
    const values = [
      userId,
      resumeId,
      jobDescriptionId,
      interviewType,
      targetRole,
      language,
      difficulty,
      questionLimit,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByIdAndUser(id, userId) {
    const query = `
      SELECT 
        i.*,
        r.file_name AS resume_file_name,
        r.parsed_text AS resume_parsed_text,
        jd.title AS job_title,
        jd.description AS job_description
      FROM interviews i
      LEFT JOIN resumes r ON r.id = i.resume_id
      LEFT JOIN job_descriptions jd ON jd.id = i.job_description_id
      WHERE i.id = $1 AND i.user_id = $2;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }

  static async findByUser(userId, { status, search, limit = 10, offset = 0 } = {}) {
    let whereClauses = ["i.user_id = $1"];
    let values = [userId];
    let idx = 2;

    if (status && status !== "all") {
      whereClauses.push(`i.status = $${idx++}`);
      values.push(status);
    }

    if (search && search.trim()) {
      whereClauses.push(`(i.target_role ILIKE $${idx} OR COALESCE(jd.title, '') ILIKE $${idx})`);
      values.push(`%${search.trim()}%`);
      idx++;
    }

    const whereStr = whereClauses.join(" AND ");

    const query = `
      SELECT 
        i.*,
        r.file_name AS resume_file_name,
        jd.title AS job_title,
        COUNT(DISTINCT iq.id) AS questions_created,
        COUNT(DISTINCT ia.id) AS answers_submitted,
        ROUND(AVG((ae.scores->>'overall')::numeric), 0) AS average_score
      FROM interviews i
      LEFT JOIN resumes r ON r.id = i.resume_id
      LEFT JOIN job_descriptions jd ON jd.id = i.job_description_id
      LEFT JOIN interview_questions iq ON iq.interview_id = i.id
      LEFT JOIN interview_answers ia ON ia.question_id = iq.id
      LEFT JOIN answer_evaluations ae ON ae.answer_id = ia.id
      WHERE ${whereStr}
      GROUP BY i.id, r.file_name, jd.title
      ORDER BY i.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++};
    `;

    const countValues = [...values];
    values.push(limit, offset);
    const { rows } = await pool.query(query, values);

    const countQuery = `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM interviews i
      LEFT JOIN job_descriptions jd ON jd.id = i.job_description_id
      WHERE ${whereStr};
    `;
    const countRes = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countRes.rows[0]?.total || "0", 10);

    return {
      items: rows,
      totalCount,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit) || 1,
    };
  }

  static async updateStatus(id, userId, status) {
    let timeField = "";
    if (status === "in_progress") {
      timeField = ", started_at = COALESCE(started_at, CURRENT_TIMESTAMP)";
    } else if (status === "completed" || status === "abandoned") {
      timeField = ", completed_at = CURRENT_TIMESTAMP";
    }

    const query = `
      UPDATE interviews
      SET status = $1, updated_at = CURRENT_TIMESTAMP ${timeField}
      WHERE id = $2 AND user_id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, id, userId]);
    return rows[0] || null;
  }

  static async getFullSessionDetails(id, userId) {
    const interview = await this.findByIdAndUser(id, userId);
    if (!interview) return null;

    const questionsQuery = `
      SELECT 
        iq.id AS question_id,
        iq.position,
        iq.question_text,
        iq.category,
        iq.difficulty,
        iq.created_at AS question_created_at,
        ia.id AS answer_id,
        ia.answer_text,
        ia.transcript,
        ia.submitted_at AS answer_submitted_at,
        ae.id AS evaluation_id,
        ae.scores,
        ae.strengths,
        ae.improvements,
        ae.ideal_answer,
        ae.follow_up_suggestion
      FROM interview_questions iq
      LEFT JOIN interview_answers ia ON ia.question_id = iq.id
      LEFT JOIN answer_evaluations ae ON ae.answer_id = ia.id
      WHERE iq.interview_id = $1
      ORDER BY iq.position ASC;
    `;
    const { rows } = await pool.query(questionsQuery, [id]);

    return {
      interview,
      items: rows,
    };
  }
}

module.exports = Interview;
