import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import useAuth from "../hooks/useAuth";
import { getResumesRequest } from "../services/resumeService";
import { getJobsRequest } from "../services/jobService";
import { getMatchesRequest } from "../services/matchService";
import { getAnalyticsOverviewRequest } from "../services/analyticsService";

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
  const [resumeCount, setResumeCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState(emptyWeek);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [rRes, jRes, mRes, aRes] = await Promise.allSettled([
          getResumesRequest(),
          getJobsRequest(),
          getMatchesRequest(),
          getAnalyticsOverviewRequest(),
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
          const week = aRes.value.data?.weeklyActivity;
          if (Array.isArray(week) && week.length > 0) {
            setWeeklyActivity(week);
          }
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

    fetchCounts();
  }, []);

  const maxWeekly = Math.max(1, ...weeklyActivity.map((day) => day.count || 0));
  const hasAnyActivity = interviewCount > 0 || resumeCount > 0 || jobCount > 0;
  const targetLabel = user?.targetRole || "your target role";

  return (
    <div className="page page--dashboard" style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          <div className="dashboard-hero" style={{ border: "1px solid rgba(0, 255, 208, 0.25)" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--accent-cyan)" }}>
                Practice workspace
              </span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>
                Welcome back, {user?.name || "Candidate"}.
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "560px", margin: 0 }}>
                Stats below come from your saved interviews, resumes, and job descriptions.
                {user?.targetRole ? ` Target role: ${user.targetRole}.` : " Set a target role in Profile."}
              </p>
            </div>

            <div className="dashboard-hero__status">
              <span className="status-pill" style={{ color: "var(--accent-cyan)", border: "1px solid rgba(0, 255, 208, 0.3)" }}>
                {inProgressCount > 0 ? `${inProgressCount} in progress` : "Ready to practise"}
              </span>
              <Link
                to="/interviews/new"
                style={{
                  padding: "0.55rem 1.25rem",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
                  color: "#05060f",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                + New Mock Session
              </Link>
            </div>
          </div>

          {loadError && (
            <p role="alert" style={{ color: "#ff6ec7", margin: "0 0 1rem" }}>
              {loadError}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.2rem",
            }}
          >
            <StatCard
              label="Mock Interviews"
              value={isLoading ? "…" : `${interviewCount}`}
              icon="🎙️"
              color="cyan"
              change={completedCount ? `${completedCount} completed` : "No completed sessions yet"}
            />
            <StatCard
              label="Average Rubric Score"
              value={isLoading ? "…" : averageScore === null ? "—" : `${averageScore}`}
              icon="⭐"
              color="violet"
              badge={completedCount < 3 && completedCount > 0 ? "Small sample" : undefined}
              change={averageScore === null ? "Complete an interview to see scores" : `${completedCount} scored sessions`}
            />
            <StatCard
              label="Resumes"
              value={isLoading ? "…" : `${resumeCount}`}
              icon="📄"
              color="pink"
              change={jobCount ? `${jobCount} job descriptions` : "Add a resume to match roles"}
            />
            <StatCard
              label="Resume matches"
              value={isLoading ? "…" : `${matchCount}`}
              icon="🎯"
              color="blue"
              change={inProgressCount ? `${inProgressCount} interview(s) in progress` : "No active sessions"}
            />
          </div>

          {!isLoading && !hasAnyActivity && (
            <article
              className="glass-panel"
              style={{
                marginTop: "1.2rem",
                padding: "1.5rem 1.75rem",
                borderRadius: "20px",
                border: "1px solid rgba(0, 255, 208, 0.2)",
              }}
            >
              <h2 style={{ fontSize: "1.15rem", margin: "0 0 0.4rem" }}>Start your first session</h2>
              <p style={{ color: "var(--text-muted)", margin: "0 0 1rem" }}>
                You do not have saved interviews or resumes yet. Set up a mock interview to generate questions and keep answers in your account.
              </p>
              <Link to="/interviews/new" style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>
                Create interview setup →
              </Link>
            </article>
          )}

          <div className="dashboard-columns">
            <article
              className="glass-panel"
              style={{
                padding: "2rem",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--accent-cyan)", marginBottom: "0.2rem" }}>
                    Last 7 days
                  </span>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Weekly Practice Activity
                  </h2>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>From your interviews</span>
              </div>

              <div
                style={{
                  height: "180px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "1rem 0.5rem 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
                      gap: "0.4rem",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "32px",
                        height: `${Math.max(6, ((w.count || 0) / maxWeekly) * 100)}%`,
                        background: w.count
                          ? "linear-gradient(180deg, #00ffd0 0%, #7b61ff 100%)"
                          : "rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px 8px 2px 2px",
                        boxShadow: w.count ? "0 0 15px rgba(0, 255, 208, 0.3)" : "none",
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

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                <span>
                  Sessions this week:{" "}
                  <strong>{weeklyActivity.reduce((sum, day) => sum + (day.count || 0), 0)}</strong>
                </span>
                <Link to="/interviews" style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
                  View history →
                </Link>
              </div>
            </article>

            <article
              className="glass-panel"
              style={{
                padding: "2rem",
                borderRadius: "24px",
                border: "1px solid rgba(123, 97, 255, 0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(160deg, rgba(123, 97, 255, 0.1) 0%, rgba(11, 13, 26, 0.9) 100%)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      background: "rgba(123, 97, 255, 0.2)",
                      color: "var(--accent-violet)",
                    }}
                  >
                    NEXT STEP
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Text mock</span>
                </div>

                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.6rem" }}>
                  Practise {targetLabel}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.55, margin: "0 0 1.25rem" }}>
                  Start a saved interview session. Questions and answers persist in your account so you can review scoring later.
                </p>
              </div>

              <Link
                to="/interviews/new"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "0.85rem",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
                  color: "#05060f",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  textDecoration: "none",
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
