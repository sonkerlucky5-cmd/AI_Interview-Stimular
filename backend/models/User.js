const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const ApiError = require("../utils/ApiError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_COLUMNS = "id, name, email, password, role, target_role, experience_years, bio, created_at, updated_at";

class User {
  constructor(row) {
    this.id = row.id;
    this._id = row.id;
    this.name = row.name;
    this.email = row.email;
    this.password = row.password;
    this.role = row.role || "candidate";
    this.targetRole = row.target_role || row.targetRole || "";
    this.experienceYears = row.experience_years ?? row.experienceYears ?? null;
    this.bio = row.bio || "";
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
      targetRole: this.targetRole || "",
      experienceYears: this.experienceYears,
      bio: this.bio || "",
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
        SELECT ${USER_COLUMNS}
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
      SELECT ${USER_COLUMNS}
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

  static async create({ name, email, password, role = "candidate", targetRole = "" }) {
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
    const trimmedTargetRole = (targetRole || "").trim().slice(0, 100);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = crypto.randomUUID();

    const insertText = `
      INSERT INTO users (id, name, email, password, role, target_role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING ${USER_COLUMNS}
    `;

    const { rows } = await pool.query(insertText, [
      id,
      name.trim(),
      normalizedEmail,
      hashedPassword,
      userRole,
      trimmedTargetRole || null,
    ]);

    return new User(rows[0]);
  }

  static async updateById(id, { name, targetRole, experienceYears, bio }) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const nextName = name !== undefined ? String(name).trim() : user.name;
    if (!nextName || nextName.length < 2) {
      throw new ApiError(400, "Name must be at least 2 characters long.");
    }
    if (nextName.length > 60) {
      throw new ApiError(400, "Name must be at most 60 characters long.");
    }

    const nextTargetRole =
      targetRole !== undefined ? String(targetRole).trim().slice(0, 100) : user.targetRole;

    let nextExperience = user.experienceYears;
    if (experienceYears !== undefined && experienceYears !== null && experienceYears !== "") {
      const parsed = Number(experienceYears);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 50) {
        throw new ApiError(400, "Experience years must be between 0 and 50.");
      }
      nextExperience = Math.round(parsed);
    } else if (experienceYears === null || experienceYears === "") {
      nextExperience = null;
    }

    const nextBio =
      bio !== undefined ? String(bio).trim().slice(0, 1000) : user.bio;

    const { rows } = await pool.query(
      `
        UPDATE users
        SET name = $2,
            target_role = $3,
            experience_years = $4,
            bio = $5,
            updated_at = NOW()
        WHERE id = $1
        RETURNING ${USER_COLUMNS}
      `,
      [id, nextName, nextTargetRole || null, nextExperience, nextBio || null]
    );

    return new User(rows[0]);
  }
}

module.exports = User;
