const { pool } = require("../config/db");

class Resume {
  static async create({
    userId,
    fileName,
    storageKey,
    mimeType,
    sizeBytes,
    parsedText = "",
    extractedData = {},
  }) {
    const query = `
      INSERT INTO resumes (
        user_id, file_name, storage_key, mime_type, size_bytes, parsed_text, extracted_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      userId,
      fileName,
      storageKey,
      mimeType,
      sizeBytes,
      parsedText,
      JSON.stringify(extractedData),
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUser(userId) {
    const query = `
      SELECT 
        id, user_id, file_name, mime_type, size_bytes, status, 
        extracted_data, created_at, updated_at
      FROM resumes
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async findByIdAndUser(id, userId) {
    const query = `
      SELECT *
      FROM resumes
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }

  static async softDelete(id, userId) {
    const query = `
      UPDATE resumes
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }

  static async hardDelete(id, userId) {
    const query = `
      DELETE FROM resumes
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }
}

module.exports = Resume;
