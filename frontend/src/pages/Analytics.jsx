import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  getAnalyticsOverviewRequest,
  getSkillsAnalyticsRequest,
} from "../services/analyticsService";
import { getApiErrorMessage } from "../services/api";

function Analytics() {
  const [overview, setOverview] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const [ovRes, skRes] = await Promise.allSettled([
          getAnalyticsOverviewRequest(),
          getSkillsAnalyticsRequest(),
        ]);

        if (ovRes.status === "fulfilled" && ovRes.value.success) {
          setOverview(ovRes.value.data);
        }
        if (skRes.status === "fulfilled" && skRes.value.success) {
          setSkillsData(skRes.value.data);
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load analytics data."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--teal)";
    if (score >= 60) return "var(--blue)";
    return "var(--danger)";
  };

  const metrics = overview?.metrics || {};
  const dimAvg = overview?.dimensionAverages || {};
  const timeline = overview?.progressionTimeline || [];
  const topStrengths = skillsData?.topStrengths || [];
  const practiceGaps = skillsData?.practiceGaps || [];

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Measurable Growth</span>
              <h1>Candidate Analytics & Trends</h1>
              <p>
                Track your rubric performance over time. Identify your strongest technical competencies and pinpoint high-impact areas for study.
              </p>
            </div>
            <div>
              <Link to="/interviews/new" className="btn btn--primary">
                + Start Mock Session
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <Loader />
            </div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div className="metrics-grid" style={{ marginBottom: "2rem" }}>
                <article className="glass-card">
                  <span className="metric-card__label">Average Rubric Score</span>
                  <strong style={{ color: getScoreColor(metrics.averageOverallScore || 0) }}>
                    {metrics.averageOverallScore || 0}%
                  </strong>
                  <p>Aggregate score across all completed interviews.</p>
                </article>

                <article className="glass-card">
                  <span className="metric-card__label">Completed Interviews</span>
                  <strong>{metrics.completedCount || 0}</strong>
                  <p>Full mock sessions evaluated and archived.</p>
                </article>

                <article className="glass-card">
                  <span className="metric-card__label">Session Completion Rate</span>
                  <strong style={{ color: "var(--teal)" }}>
                    {metrics.completionRate || 0}%
                  </strong>
                  <p>{metrics.totalInterviews || 0} total sessions initiated.</p>
                </article>
              </div>

              {/* Small Sample Notice */}
              {metrics.isSmallSample && (
                <div
                  style={{
                    background: "rgba(98, 245, 160, 0.08)",
                    borderLeft: "3px solid var(--accent-mint)",
                    padding: "1rem 1.25rem",
                    borderRadius: "8px",
                    marginBottom: "2rem",
                    fontSize: "0.9rem",
                    color: "var(--text)",
                  }}
                >
                  ℹ️ <strong>Small Sample Size:</strong> {metrics.sampleNotice}
                </div>
              )}

              {/* Dimension Scorecard Grid */}
              <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem" }}>
                <span className="eyebrow">Rubric Dimensions</span>
                <h2 style={{ fontSize: "1.25rem", margin: "0.2rem 0 1.25rem" }}>
                  Engineering Competency Averages
                </h2>

                <div style={{ display: "grid", gap: "1.25rem" }}>
                  {[
                    { label: "Relevance & Direct Answers", score: dimAvg.relevance || 0, desc: "Addresses the exact question asked without wandering" },
                    { label: "Technical Accuracy & Concepts", score: dimAvg.technical_correctness || 0, desc: "Accurate terminology, mechanisms, and syntax" },
                    { label: "Completeness & Architectural Depth", score: dimAvg.completeness || 0, desc: "Covers core components and subtle edge cases" },
                    { label: "Reasoning Structure & Clarity", score: dimAvg.reasoning_structure || 0, desc: "Logical narrative flow and articulate explanations" },
                    { label: "Practical Trade-offs & Production Realities", score: dimAvg.practical_tradeoffs || 0, desc: "Evaluates memory, latency, and maintainability trade-offs" },
                  ].map((dim) => (
                    <div key={dim.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <div>
                          <strong style={{ color: "var(--title)", fontSize: "0.95rem" }}>{dim.label}</strong>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                            {dim.desc}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", color: getScoreColor(dim.score) }}>
                          {dim.score}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: "7px",
                          background: "rgba(120, 148, 210, 0.15)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.max(2, dim.score)}%`,
                            background: getScoreColor(dim.score),
                            borderRadius: "4px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competencies: Top Strengths vs Practice Gaps */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Top Strengths */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.5rem",
                    border: "1px solid rgba(98, 245, 160, 0.25)",
                  }}
                >
                  <h3 style={{ margin: "0 0 1rem", color: "var(--accent-mint)", fontSize: "1.1rem" }}>
                    ⭐ Top Competency Strengths
                  </h3>

                  {topStrengths.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Complete more interview questions to unlock your top technical strengths.
                    </p>
                  ) : (
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      {topStrengths.map((item) => (
                        <div
                          key={item.category}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(98, 245, 160, 0.08)",
                            padding: "0.6rem 0.85rem",
                            borderRadius: "8px",
                          }}
                        >
                          <span style={{ color: "var(--title)", fontSize: "0.9rem", fontWeight: 500 }}>
                            {item.category}
                          </span>
                          <span style={{ color: "var(--accent-mint)", fontWeight: 700, fontSize: "0.95rem" }}>
                            {item.averageScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Practice Gaps */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.5rem",
                    border: "1px solid rgba(255, 107, 138, 0.2)",
                  }}
                >
                  <h3 style={{ margin: "0 0 1rem", color: "var(--danger)", fontSize: "1.1rem" }}>
                    🎯 Recommended Focus Areas
                  </h3>

                  {practiceGaps.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      No critical gaps detected. Keep challenging yourself at senior and lead difficulty levels!
                    </p>
                  ) : (
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      {practiceGaps.map((item) => (
                        <div
                          key={item.category}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(255, 107, 138, 0.08)",
                            padding: "0.6rem 0.85rem",
                            borderRadius: "6px",
                          }}
                        >
                          <span style={{ color: "var(--title)", fontSize: "0.9rem", fontWeight: 500 }}>
                            {item.category}
                          </span>
                          <span style={{ color: "var(--danger)", fontWeight: 700, fontSize: "0.95rem" }}>
                            {item.averageScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Historical Timeline */}
              {timeline.length > 0 && (
                <div className="glass-card" style={{ padding: "1.75rem" }}>
                  <h3 style={{ fontSize: "1.15rem", margin: "0 0 1rem" }}>
                    Historical Session Progression
                  </h3>

                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {timeline.map((item, idx) => (
                      <div
                        key={item.interviewId || idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "var(--panel)",
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          border: "1px solid var(--panel-border)",
                        }}
                      >
                        <div>
                          <strong style={{ color: "var(--title)", fontSize: "0.95rem" }}>
                            {item.targetRole}
                          </strong>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                            {new Date(item.date).toLocaleDateString()} • {item.difficulty} level
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              color: getScoreColor(item.score),
                            }}
                          >
                            {item.score}%
                          </span>
                          <Link
                            to={`/interviews/${item.interviewId}/result`}
                            className="btn btn--outline"
                            style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem" }}
                          >
                            Scorecard →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Analytics;
