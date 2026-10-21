import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import SkillRadarChart from "../components/SkillRadarChart";
import ProgressRing from "../components/ProgressRing";
import useAuth from "../hooks/useAuth";
import { getResumesRequest } from "../services/resumeService";
import { getJobsRequest } from "../services/jobService";
import { getMatchesRequest } from "../services/matchService";
import { getAnalyticsOverviewRequest } from "../services/analyticsService";
import { getInterviewsRequest } from "../services/interviewService";

const emptyWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  count: 0,
}));

export default function Dashboard() {
  const { user } = useAuth();
  const [interviewCount, setInterviewCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [averageScore, setAverageScore] = useState(null);
  const [dimensionAverages, setDimensionAverages] = useState({});
  const [resumeCount, setResumeCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState(emptyWeek);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rRes, jRes, mRes, aRes, iRes] = await Promise.allSettled([
          getResumesRequest(),
          getJobsRequest(),
          getMatchesRequest(),
          getAnalyticsOverviewRequest(),
          getInterviewsRequest({ limit: 5 }),
        ]);

        if (rRes.status === "fulfilled" && rRes.value.success) {
          setResumeCount(rRes.value.data?.length || 0);
        }
        if (jRes.status === "fulfilled" && jRes.value.success) {
          setJobCount(jRes.value.data?.length || 0);
        }
        if (mRes.status === "fulfilled" && mRes.value.success) {
          setMatchCount(mRes.value.data?.length || 0);
        }
        if (aRes.status === "fulfilled" && aRes.value.success) {
          const metrics = aRes.value.data?.metrics || {};
          setInterviewCount(metrics.totalInterviews || 0);
          setCompletedCount(metrics.completedCount || 0);
          setInProgressCount(metrics.inProgressCount || 0);
          setAverageScore(
            metrics.completedCount > 0 ? metrics.averageOverallScore : null
          );
          if (aRes.value.data?.dimensionAverages) {
            setDimensionAverages(aRes.value.data.dimensionAverages);
          }
          const week = aRes.value.data?.weeklyActivity;
          if (Array.isArray(week) && week.length > 0) {
            setWeeklyActivity(week);
          }
        }
        if (iRes.status === "fulfilled" && iRes.value.success) {
          setRecentInterviews(iRes.value.data || []);
        }

        if (
          rRes.status === "rejected" &&
          jRes.status === "rejected" &&
          aRes.status === "rejected"
        ) {
          setLoadError("Could not load dashboard stats. Retry in a moment.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const maxWeekly = Math.max(1, ...weeklyActivity.map((day) => day.count || 0));
  const hasAnyActivity = interviewCount > 0 || resumeCount > 0 || jobCount > 0;
  const targetLabel = user?.targetRole || "Full Stack Engineer";
  const readinessPercent = averageScore !== null ? averageScore : (completedCount > 0 ? 50 : 0);

  return (
    <div className="page page--dashboard" style={{ maxWidth: "1320px", margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Welcome Banner matching Panel 04 */}
          <div className="dashboard-hero">
            <div style={{ flex: 1 }}>
              <div className="target-role-badge">
                <span aria-hidden="true">🎯</span>
                <span>Target Role: {targetLabel}</span>
              </div>

              <h1>
                Welcome back, {user?.name || "Candidate"}.
              </h1>

              <p>
                Real-time preparation metrics from your saved interviews, uploaded resumes,
                and AI evaluation rubrics.
              </p>

              <div style={{ display: "flex", gap: "0.85rem", marginTop: "1.4rem", flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  to="/interviews/new"
                  className="pill-btn-primary"
                  style={{
                    padding: "0.65rem 1.4rem",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  }}
                >
                  + Start New Mock Session →
                </Link>
                <Link
                  to="/resumes"
                  style={{
                    padding: "0.65rem 1.25rem",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    borderRadius: "999px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(0, 245, 184, 0.25)",
                    color: "var(--title)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  📄 Manage Resumes
                </Link>
              </div>
            </div>

            {/* Preparation Ring and AI Assistant Visual */}
            <div className="dashboard-hero__widgets">
              <ProgressRing percent={readinessPercent} size={115} label="Readiness" />

              <div className="ai-assistant-card">
                <div className="ai-assistant-avatar" aria-hidden="true">
                  ⚡
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "999px",
                        background: "var(--accent-mint)",
                        boxShadow: "0 0 8px var(--accent-mint)",
                      }}
                    />
                    <strong style={{ fontSize: "0.85rem", color: "#fff", letterSpacing: "0.02em" }}>
                      AI Copilot Active
                    </strong>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginTop: "0.15rem" }}>
                    {inProgressCount > 0 ? `${inProgressCount} active session` : "Ready for mock session"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {loadError && (
            <p role="alert" style={{ color: "#ff6ec7", margin: "0 0 1rem" }}>
              {loadError}
            </p>
          )}

          {/* 4 Responsive Statistic Cards */}
          <div className="metrics-grid">
            <StatCard
              label="Mock Interviews"
              value={isLoading ? "…" : `${interviewCount}`}
              icon="🎙️"
              color="cyan"
              change={completedCount ? `${completedCount} completed sessions` : "No completed sessions yet"}
            />
            <StatCard
              label="Average Rubric Score"
              value={isLoading ? "…" : averageScore === null ? "—" : `${averageScore}%`}
              icon="⭐"
              color="violet"
              badge={completedCount < 3 && completedCount > 0 ? "Initial Sample" : undefined}
              change={averageScore === null ? "Complete an interview to see scores" : "Across evaluated sessions"}
            />
            <StatCard
              label="Resumes & Target Jobs"
              value={isLoading ? "…" : `${resumeCount} / ${jobCount}`}
              icon="📄"
              color="pink"
              change={matchCount ? `${matchCount} role match analyses` : "Upload a resume to match jobs"}
            />
            <StatCard
              label="Active Sessions"
              value={isLoading ? "…" : `${inProgressCount}`}
              icon="🎯"
              color="blue"
              change={inProgressCount ? `${inProgressCount} interview in progress` : "Ready to practice"}
            />
          </div>

          {/* Empty state prompt for brand new accounts */}
          {!isLoading && !hasAnyActivity && (
            <article
              className="glass-panel"
              style={{
                padding: "1.5rem 1.75rem",
                borderRadius: "20px",
                border: "1px solid rgba(0, 245, 184, 0.22)",
                background: "rgba(10, 30, 26, 0.72)",
              }}
            >
              <h2 style={{ fontSize: "1.15rem", margin: "0 0 0.4rem", color: "#fff" }}>Start your first session</h2>
              <p style={{ color: "var(--text-muted)", margin: "0 0 1rem" }}>
                You do not have saved interviews or resumes yet. Set up a mock interview to generate questions and keep answers in your account.
              </p>
              <Link to="/interviews/new" style={{ color: "var(--accent-mint)", fontWeight: 700 }}>
                Create interview setup →
              </Link>
            </article>
          )}

          {/* Middle Row: Radar Chart + Weekly Activity */}
          <div className="dashboard-columns">
            {/* Skill Performance Radar Chart */}
            <article
              className="glass-panel"
              style={{
                padding: "1.8rem 2rem",
                borderRadius: "24px",
                border: "1px solid rgba(0, 245, 184, 0.22)",
                background: "rgba(10, 30, 26, 0.72)",
                backdropFilter: "blur(18px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--accent-mint)", marginBottom: "0.2rem" }}>
                    Competency Matrix
                  </span>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Skill Performance Radar
                  </h2>
                </div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", background: "rgba(255, 255, 255, 0.05)", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                  5 Rubric Dimensions
                </span>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 1rem" }}>
                Evaluated across Technical Correctness, Reasoning, Tradeoffs, Completeness, and Relevance.
              </p>

              <div style={{ width: "100%", padding: "0.5rem 0" }}>
                <SkillRadarChart dimensions={dimensionAverages} size={300} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.85rem" }}>
                <span>Scored sessions: <strong>{completedCount}</strong></span>
                <Link to="/analytics" style={{ color: "var(--accent-mint)", fontWeight: 600 }}>
                  Detailed Breakdown →
                </Link>
              </div>
            </article>

            {/* Weekly Practice Activity */}
            <article
              className="glass-panel"
              style={{
                padding: "1.8rem 2rem",
                borderRadius: "24px",
                border: "1px solid rgba(0, 245, 184, 0.22)",
                background: "rgba(10, 30, 26, 0.72)",
                backdropFilter: "blur(18px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--accent-mint)", marginBottom: "0.2rem" }}>
                    Last 7 days
                  </span>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Weekly Practice Activity
                  </h2>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>From saved sessions</span>
              </div>

              <div
                style={{
                  height: "190px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "1rem 0.5rem 0",
                  borderBottom: "1px solid rgba(0, 245, 184, 0.15)",
                }}
              >
                {weeklyActivity.map((w) => (
                  <div
                    key={w.date || w.day}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "flex-end",
                      gap: "0.45rem",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "34px",
                        height: `${Math.max(8, ((w.count || 0) / maxWeekly) * 100)}%`,
                        background: w.count
                          ? "linear-gradient(180deg, #00F5B8 0%, #00DDA5 100%)"
                          : "rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px 8px 2px 2px",
                        boxShadow: w.count ? "0 0 16px rgba(0, 245, 184, 0.35)" : "none",
                        transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      title={`${w.count} sessions on ${w.day}`}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      {w.day}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.2rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                <span>
                  Sessions this week:{" "}
                  <strong style={{ color: "#fff" }}>
                    {weeklyActivity.reduce((sum, day) => sum + (day.count || 0), 0)}
                  </strong>
                </span>
                <Link to="/interviews" style={{ color: "var(--accent-mint)", fontWeight: 600 }}>
                  View history →
                </Link>
              </div>
            </article>
          </div>

          {/* Lower Row: Recent Mock Interviews & Quick Launch */}
          <div className="dashboard-columns">
            {/* Recent Interviews List */}
            <article className="recent-sessions-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--accent-mint)", marginBottom: "0.2rem" }}>
                    Recent Activity
                  </span>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Recent Mock Interviews
                  </h2>
                </div>
                <Link to="/interviews" style={{ fontSize: "0.82rem", color: "var(--accent-mint)", fontWeight: 600 }}>
                  View All ({interviewCount}) →
                </Link>
              </div>

              {recentInterviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)" }}>
                  <p style={{ margin: "0 0 0.8rem", fontSize: "0.92rem" }}>No recent interview sessions recorded.</p>
                  <Link to="/interviews/new" style={{ color: "var(--accent-mint)", fontWeight: 700, fontSize: "0.88rem" }}>
                    Start your first interview session →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {recentInterviews.slice(0, 4).map((item) => (
                    <div key={item.id} className="session-item">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <strong style={{ color: "#fff", fontSize: "0.95rem" }}>
                            {item.target_role || item.targetRole || "Technical Interview"}
                          </strong>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "999px",
                              background: "rgba(0, 245, 184, 0.1)",
                              color: "var(--accent-mint)",
                              border: "1px solid rgba(0, 245, 184, 0.25)",
                              textTransform: "capitalize",
                            }}
                          >
                            {item.difficulty || "intermediate"}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.25rem 0.65rem",
                            borderRadius: "999px",
                            background: item.status === "completed" ? "rgba(0, 245, 184, 0.15)" : "rgba(255, 193, 7, 0.15)",
                            color: item.status === "completed" ? "var(--accent-mint)" : "#ffc107",
                            border: `1px solid ${item.status === "completed" ? "rgba(0, 245, 184, 0.3)" : "rgba(255, 193, 7, 0.3)"}`,
                            textTransform: "capitalize",
                          }}
                        >
                          {item.status === "completed" ? "Completed ✓" : item.status === "in_progress" ? "In Progress" : item.status || "Pending"}
                        </span>

                        <Link
                          to={item.status === "completed" ? `/interviews/${item.id}/result` : `/interviews/${item.id}`}
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "var(--accent-mint)",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.status === "completed" ? "Review →" : "Resume →"}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* Preparation Track / Next Step Card */}
            <article
              className="glass-panel"
              style={{
                padding: "2rem",
                borderRadius: "24px",
                border: "1px solid rgba(0, 245, 184, 0.28)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background:
                  "radial-gradient(circle at top right, rgba(0, 245, 184, 0.12), transparent 60%), rgba(10, 30, 26, 0.8)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.22rem 0.65rem",
                      borderRadius: "999px",
                      background: "rgba(0, 245, 184, 0.15)",
                      color: "var(--accent-mint)",
                      border: "1px solid rgba(0, 245, 184, 0.3)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Recommended Next Drill
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>AI Curated</span>
                </div>

                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", marginBottom: "0.6rem" }}>
                  Practise {targetLabel}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
                  Step into an interactive mock session. AI evaluates technical correctness, architectural reasoning, and practical tradeoffs in real time.
                </p>
              </div>

              <Link
                to="/interviews/new"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "0.88rem",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #00F5B8 0%, #00DDA5 100%)",
                  color: "#030907",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(0, 245, 184, 0.35)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
              >
                Launch Mock Session Now 🎙️
              </Link>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
