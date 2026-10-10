const { query } = require("../config/db");

class LearningPlan {
  static async create({
    userId,
    sourceInterviewId = null,
    targetRole,
    availableMinutesPerDay = 45,
    startDate = new Date(),
    targetDate = null,
    status = "active",
    title = null,
    learningStyle = "balanced",
    skillGaps = [],
  }) {
    const planTitle =
      title ||
      `${targetRole} Preparation Roadmap (${learningStyle.charAt(0).toUpperCase() + learningStyle.slice(1)})`;

    const sql = `
      INSERT INTO learning_plans (
        user_id, source_interview_id, target_role, available_minutes_per_day,
        start_date, target_date, status, title, learning_style, skill_gaps
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      userId,
      sourceInterviewId,
      targetRole,
      availableMinutesPerDay,
      startDate,
      targetDate,
      status,
      planTitle,
      learningStyle,
      JSON.stringify(skillGaps),
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async createItems(planId, items = []) {
    if (!items || items.length === 0) return [];

    const inserted = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const sql = `
        INSERT INTO learning_plan_items (
          plan_id, position, topic, task, estimated_minutes, target_date,
          status, stage, practice_outcome, resource_url, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      const values = [
        planId,
        item.position || i + 1,
        item.topic,
        item.task,
        item.estimatedMinutes || item.estimated_minutes || 30,
        item.targetDate || item.target_date || null,
        item.status || "pending",
        item.stage || "Stage 1",
        item.practiceOutcome || item.practice_outcome || "",
        item.resourceUrl || item.resource_url || null,
        item.notes || null,
      ];
      const res = await query(sql, values);
      inserted.push(res.rows[0]);
    }

    return inserted;
  }

  static async findByUser(userId) {
    const sql = `
      SELECT 
        lp.*,
        COUNT(lpi.id)::int AS total_items,
        COUNT(CASE WHEN lpi.status = 'completed' THEN 1 END)::int AS completed_items,
        COALESCE(SUM(lpi.estimated_minutes), 0)::int AS total_minutes,
        COALESCE(SUM(CASE WHEN lpi.status = 'completed' THEN lpi.estimated_minutes ELSE 0 END), 0)::int AS completed_minutes
      FROM learning_plans lp
      LEFT JOIN learning_plan_items lpi ON lp.id = lpi.plan_id
      WHERE lp.user_id = $1
      GROUP BY lp.id
      ORDER BY lp.created_at DESC;
    `;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const planSql = `
      SELECT * FROM learning_plans
      WHERE id = $1 AND user_id = $2;
    `;
    const planRes = await query(planSql, [id, userId]);
    if (planRes.rows.length === 0) return null;

    const plan = planRes.rows[0];

    const itemsSql = `
      SELECT * FROM learning_plan_items
      WHERE plan_id = $1
      ORDER BY position ASC, id ASC;
    `;
    const itemsRes = await query(itemsSql, [id]);
    plan.items = itemsRes.rows;

    const total = plan.items.length;
    const completed = plan.items.filter((it) => it.status === "completed").length;
    plan.progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    plan.totalItems = total;
    plan.completedItems = completed;

    return plan;
  }

  static async update(id, userId, updates = {}) {
    const allowed = ["title", "target_date", "available_minutes_per_day", "status"];
    const setClauses = [];
    const values = [id, userId];

    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) {
        values.push(updates[key]);
        setClauses.push(`${key} = $${values.length}`);
      }
    });

    if (setClauses.length === 0) return null;

    setClauses.push("updated_at = CURRENT_TIMESTAMP");

    const sql = `
      UPDATE learning_plans
      SET ${setClauses.join(", ")}
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  static async delete(id, userId) {
    const sql = `
      DELETE FROM learning_plans
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const result = await query(sql, [id, userId]);
    return result.rowCount > 0;
  }

  static async updateItem(itemId, planId, userId, updates = {}) {
    // Verify plan ownership first
    const ownerCheck = await query(
      "SELECT id FROM learning_plans WHERE id = $1 AND user_id = $2",
      [planId, userId]
    );
    if (ownerCheck.rows.length === 0) return null;

    const allowed = ["status", "task", "notes", "estimated_minutes", "target_date"];
    const setClauses = [];
    const values = [itemId, planId];

    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) {
        values.push(updates[key]);
        setClauses.push(`${key} = $${values.length}`);
      }
    });

    if (updates.status === "completed") {
      setClauses.push("completed_at = CURRENT_TIMESTAMP");
    } else if (updates.status && updates.status !== "completed") {
      setClauses.push("completed_at = NULL");
    }

    if (setClauses.length === 0) return null;

    const sql = `
      UPDATE learning_plan_items
      SET ${setClauses.join(", ")}
      WHERE id = $1 AND plan_id = $2
      RETURNING *;
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  static async addItem(planId, userId, itemData) {
    const ownerCheck = await query(
      "SELECT id FROM learning_plans WHERE id = $1 AND user_id = $2",
      [planId, userId]
    );
    if (ownerCheck.rows.length === 0) return null;

    const maxPosRes = await query(
      "SELECT COALESCE(MAX(position), 0) as max_pos FROM learning_plan_items WHERE plan_id = $1",
      [planId]
    );
    const nextPos = (maxPosRes.rows[0].max_pos || 0) + 1;

    const sql = `
      INSERT INTO learning_plan_items (
        plan_id, position, topic, task, estimated_minutes, target_date,
        status, stage, practice_outcome, resource_url, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const values = [
      planId,
      nextPos,
      itemData.topic,
      itemData.task,
      itemData.estimatedMinutes || 30,
      itemData.targetDate || null,
      "pending",
      itemData.stage || "Custom Tasks",
      itemData.practiceOutcome || "",
      itemData.resourceUrl || null,
      itemData.notes || null,
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  static async deleteItem(itemId, planId, userId) {
    const ownerCheck = await query(
      "SELECT id FROM learning_plans WHERE id = $1 AND user_id = $2",
      [planId, userId]
    );
    if (ownerCheck.rows.length === 0) return false;

    const result = await query(
      "DELETE FROM learning_plan_items WHERE id = $1 AND plan_id = $2 RETURNING id",
      [itemId, planId]
    );
    return result.rowCount > 0;
  }

  static async regeneratePlanPreservingCompleted(planId, userId, newItems = []) {
    const ownerCheck = await query(
      "SELECT id FROM learning_plans WHERE id = $1 AND user_id = $2",
      [planId, userId]
    );
    if (ownerCheck.rows.length === 0) return null;

    // Fetch existing completed items
    const completedRes = await query(
      "SELECT * FROM learning_plan_items WHERE plan_id = $1 AND status = 'completed' ORDER BY position ASC",
      [planId]
    );
    const completedItems = completedRes.rows;

    // Delete pending/in_progress items
    await query(
      "DELETE FROM learning_plan_items WHERE plan_id = $1 AND status != 'completed'",
      [planId]
    );

    // Insert new generated items with incremented positions after completed ones
    let currentPosition = completedItems.length + 1;
    const addedItems = [];

    for (const item of newItems) {
      const sql = `
        INSERT INTO learning_plan_items (
          plan_id, position, topic, task, estimated_minutes, target_date,
          status, stage, practice_outcome, resource_url, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      const values = [
        planId,
        currentPosition++,
        item.topic,
        item.task,
        item.estimatedMinutes || 30,
        item.targetDate || null,
        "pending",
        item.stage || "Regenerated Stage",
        item.practiceOutcome || "",
        item.resourceUrl || null,
        item.notes || null,
      ];
      const res = await query(sql, values);
      addedItems.push(res.rows[0]);
    }

    // Touch updated_at
    await query(
      "UPDATE learning_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [planId]
    );

    return this.findById(planId, userId);
  }
}

module.exports = LearningPlan;
