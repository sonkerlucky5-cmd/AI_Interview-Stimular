const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const ApiError = require("../utils/ApiError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class User {
  constructor(row) {
    this.id = row.id;
    this._id = row.id;
    this.name = row.name;
    this.email = row.email;
    this.password = row.password;
    this.role = row.role || "candidate";
    this.createdAt = row.created_at || row.createdAt;
    this.updatedAt = row.updated_at || row.updatedAt;
  }

  async comparePassword(candidatePassword) {
    if (!this.password || !candidatePassword) {
      return false;
    }
    return bcrypt.compare(candidatePassword, this.password);
  }

  toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  static findOne(criteria = {}) {
    const promise = (async () => {
      const clauses = [];
      const values = [];

      if (criteria.email) {
        values.push(criteria.email.toLowerCase().trim());
        clauses.push(`LOWER(email) = LOWER($${values.length})`);
      }

      if (criteria.id) {
        values.push(criteria.id);
        clauses.push(`id = $${values.length}`);
      }

      const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
      const queryText = `
        SELECT id, name, email, password, role, created_at, updated_at
        FROM users
        ${whereClause}
        LIMIT 1
      `;

      const { rows } = await pool.query(queryText, values);
      if (rows.length === 0) {
        return null;
      }

      return new User(rows[0]);
    })();

    // Support chaining .select() for mongoose backwards compatibility
    promise.select = function () {
      return promise;
    };

    return promise;
  }

  static async findById(id) {
    if (!id) {
      return null;
    }

    const queryText = `
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(queryText, [id]);
    if (rows.length === 0) {
      return null;
    }

    return new User(rows[0]);
  }

  static async create({ name, email, password, role = "candidate" }) {
    if (!name || name.trim().length < 2) {
      throw new ApiError(400, "Name must be at least 2 characters long.");
    }

    if (name.trim().length > 60) {
      throw new ApiError(400, "Name must be at most 60 characters long.");
    }

    const normalizedEmail = (email || "").toLowerCase().trim();
    if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
      throw new ApiError(400, "Please provide a valid email address.");
    }

    if (!password || password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long.");
    }

    const validRoles = ["candidate", "admin"];
    const userRole = validRoles.includes(role) ? role : "candidate";

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = crypto.randomUUID();

    const insertText = `
      INSERT INTO users (id, name, email, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, name, email, password, role, created_at, updated_at
    `;

    const { rows } = await pool.query(insertText, [
      id,
      name.trim(),
      normalizedEmail,
      hashedPassword,
      userRole,
    ]);

    return new User(rows[0]);
  }
}

module.exports = User;
