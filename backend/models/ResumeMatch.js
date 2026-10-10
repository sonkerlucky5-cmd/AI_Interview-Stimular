const { pool } = require("../config/db");

class ResumeMatch {
  static async create({
    userId,
    resumeId,
    jobDescriptionId,
    matchData,
    scoringVersion = "heuristic_v1",
    modelVersion = null,
  }) {
    const query = `
      INSERT INTO resume_matches (
        user_id, resume_id, job_description_id, match_data, scoring_version, model_version
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      userId,
      resumeId,
      jobDescriptionId,
      JSON.stringify(matchData),
      scoringVersion,
      modelVersion,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByIdAndUser(id, userId) {
    const query = `
      SELECT 
        rm.*,
        r.file_name AS resume_file_name,
        jd.title AS job_title,
        jd.company AS job_company
      FROM resume_matches rm
      JOIN resumes r ON r.id = rm.resume_id
      JOIN job_descriptions jd ON jd.id = rm.job_description_id
      WHERE rm.id = $1 AND rm.user_id = $2;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }

  static async findByUser(userId) {
    const query = `
      SELECT 
        rm.id,
        rm.user_id,
        rm.resume_id,
        rm.job_description_id,
        rm.match_data->>'score' AS score,
        rm.match_data->'summary' AS summary,
        rm.created_at,
        r.file_name AS resume_file_name,
        jd.title AS job_title,
        jd.company AS job_company
      FROM resume_matches rm
      JOIN resumes r ON r.id = rm.resume_id
      JOIN job_descriptions jd ON jd.id = rm.job_description_id
      WHERE rm.user_id = $1
      ORDER BY rm.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
}

module.exports = ResumeMatch;
