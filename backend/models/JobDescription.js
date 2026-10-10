const { pool } = require("../config/db");

class JobDescription {
  static async create({ userId, title, company = null, description, requirements = [] }) {
    const query = `
      INSERT INTO job_descriptions (
        user_id, title, company, description, requirements
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      userId,
      title,
      company,
      description,
      JSON.stringify(Array.isArray(requirements) ? requirements : []),
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUser(userId) {
    const query = `
      SELECT *
      FROM job_descriptions
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async findByIdAndUser(id, userId) {
    const query = `
      SELECT *
      FROM job_descriptions
      WHERE id = $1 AND user_id = $2;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }

  static async updateByIdAndUser(id, userId, { title, company, description, requirements }) {
    const fields = [];
    const values = [id, userId];
    let idx = 3;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (company !== undefined) {
      fields.push(`company = $${idx++}`);
      values.push(company);
    }
    if (description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (requirements !== undefined) {
      fields.push(`requirements = $${idx++}`);
      values.push(JSON.stringify(Array.isArray(requirements) ? requirements : []));
    }

    if (fields.length === 0) return this.findByIdAndUser(id, userId);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE job_descriptions
      SET ${fields.join(", ")}
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async deleteByIdAndUser(id, userId) {
    const query = `
      DELETE FROM job_descriptions
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] || null;
  }
}

module.exports = JobDescription;
