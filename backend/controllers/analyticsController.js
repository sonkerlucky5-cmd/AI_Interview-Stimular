const { pool } = require("../config/db");
const ApiError = require("../utils/ApiError");

const getAnalyticsOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Session status counts
    const statusCountsQuery = `
      SELECT 
        COUNT(*) AS total_interviews,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_count,
        COUNT(*) FILTER (WHERE status = 'abandoned') AS abandoned_count,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending_count
      FROM interviews
      WHERE user_id = $1;
    `;
    const statusRes = await pool.query(statusCountsQuery, [userId]);
    const counts = statusRes.rows[0];

    const total = parseInt(counts.total_interviews, 10);
    const completed = parseInt(counts.completed_count, 10);
    const inProgress = parseInt(counts.in_progress_count, 10);
    const abandoned = parseInt(counts.abandoned_count, 10);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 2. Score progression & overall average
    const scoresQuery = `
      SELECT 
        i.id,
        i.target_role,
        i.difficulty,
        i.created_at,
        ROUND(AVG((ae.scores->>'overall')::numeric), 0) AS overall_score,
        ROUND(AVG((ae.scores->>'relevance')::numeric), 0) AS relevance,
        ROUND(AVG((ae.scores->>'technical_correctness')::numeric), 0) AS technical_correctness,
        ROUND(AVG((ae.scores->>'completeness')::numeric), 0) AS completeness,
        ROUND(AVG((ae.scores->>'reasoning_structure')::numeric), 0) AS reasoning_structure,
        ROUND(AVG((ae.scores->>'practical_tradeoffs')::numeric), 0) AS practical_tradeoffs
      FROM interviews i
      JOIN interview_questions iq ON iq.interview_id = i.id
      JOIN interview_answers ia ON ia.question_id = iq.id
      JOIN answer_evaluations ae ON ae.answer_id = ia.id
      WHERE i.user_id = $1 AND i.status = 'completed'
      GROUP BY i.id
      ORDER BY i.created_at ASC;
    `;
    const scoresRes = await pool.query(scoresQuery, [userId]);
    const history = scoresRes.rows.map((r) => ({
      interviewId: r.id,
      targetRole: r.target_role,
      difficulty: r.difficulty,
      date: r.created_at,
      score: parseInt(r.overall_score || "0", 10),
      dimensions: {
        relevance: parseInt(r.relevance || "0", 10),
        technical_correctness: parseInt(r.technical_correctness || "0", 10),
        completeness: parseInt(r.completeness || "0", 10),
        reasoning_structure: parseInt(r.reasoning_structure || "0", 10),
        practical_tradeoffs: parseInt(r.practical_tradeoffs || "0", 10),
      },
    }));

    // Calculate aggregated dimension averages
    let avgOverall = 0;
    const dimensionAverages = {
      relevance: 0,
      technical_correctness: 0,
      completeness: 0,
      reasoning_structure: 0,
      practical_tradeoffs: 0,
    };

    if (history.length > 0) {
      const sumOverall = history.reduce((acc, h) => acc + h.score, 0);
      avgOverall = Math.round(sumOverall / history.length);

      Object.keys(dimensionAverages).forEach((key) => {
        const sumDim = history.reduce((acc, h) => acc + h.dimensions[key], 0);
        dimensionAverages[key] = Math.round(sumDim / history.length);
      });
    }

    const weeklyRes = await pool.query(
      `
        SELECT timezone('UTC', created_at)::date AS day, COUNT(*)::int AS count
        FROM interviews
        WHERE user_id = $1
          AND created_at >= (CURRENT_TIMESTAMP - INTERVAL '6 days')
        GROUP BY day
      `,
      [userId]
    );
    const weeklyMap = new Map(
      weeklyRes.rows.map((row) => {
        const raw = row.day;
        const key = raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw).slice(0, 10);
        return [key, Number(row.count)];
      })
    );
    const weeklyActivity = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - offset);
      const key = date.toISOString().slice(0, 10);
      weeklyActivity.push({
        date: key,
        day: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        count: weeklyMap.get(key) || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalInterviews: total,
          completedCount: completed,
          inProgressCount: inProgress,
          abandonedCount: abandoned,
          completionRate,
          averageOverallScore: avgOverall,
          isSmallSample: completed < 3,
          sampleNotice:
            completed < 3
              ? "Sample size is small (< 3 completed interviews). Complete more mock interviews for reliable statistical trends."
              : null,
        },
        dimensionAverages,
        progressionTimeline: history,
        weeklyActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSkillsAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        iq.category,
        COUNT(ae.id) AS questions_evaluated,
        ROUND(AVG((ae.scores->>'overall')::numeric), 0) AS category_average_score
      FROM interview_questions iq
      JOIN interview_answers ia ON ia.question_id = iq.id
      JOIN answer_evaluations ae ON ae.answer_id = ia.id
      JOIN interviews i ON i.id = iq.interview_id
      WHERE i.user_id = $1
      GROUP BY iq.category
      HAVING COUNT(ae.id) > 0
      ORDER BY category_average_score DESC;
    `;
    const { rows } = await pool.query(query, [userId]);

    const categories = rows.map((r) => ({
      category: r.category,
      questionsEvaluated: parseInt(r.questions_evaluated, 10),
      averageScore: parseInt(r.category_average_score, 10),
    }));

    const topStrengths = categories.filter((c) => c.averageScore >= 75);
    const practiceGaps = categories.filter((c) => c.averageScore < 75);

    res.status(200).json({
      success: true,
      data: {
        categories,
        topStrengths,
        practiceGaps,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsOverview,
  getSkillsAnalytics,
};
