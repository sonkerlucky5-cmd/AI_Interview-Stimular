import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import useAuth from "../hooks/useAuth";
import { getResumesRequest } from "../services/resumeService";
import { getJobsRequest } from "../services/jobService";
import { getMatchesRequest } from "../services/matchService";
import { getInterviewsRequest } from "../services/interviewService";

export default function Dashboard() {
  const { user } = useAuth();
  const [interviewCount, setInterviewCount] = useState(14);
  const [resumeCount, setResumeCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Weekly activity data for CSS bar chart
  const weeklyActivity = [
    { day: "Mon", height: "45%", count: 2 },
    { day: "Tue", height: "70%", count: 4 },
    { day: "Wed", height: "35%", count: 1 },
    { day: "Thu", height: "90%", count: 5 },
    { day: "Fri", height: "60%", count: 3 },
    { day: "Sat", height: "100%", count: 6 },
    { day: "Sun", height: "50%", count: 2 },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [rRes, jRes, mRes, iRes] = await Promise.allSettled([
          getResumesRequest(),
          getJobsRequest(),
          getMatchesRequest(),
          getInterviewsRequest({ limit: 1 }),
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
        if (iRes.status === "fulfilled" && iRes.value.success) {
          const total = iRes.value.pagination?.totalCount ?? (iRes.value.data?.length || 0);
          if (total > 0) setInterviewCount(total);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="page page--dashboard" style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Welcome Banner */}
          <div className="dashboard-hero" style={{ border: "1px solid rgba(0, 255, 208, 0.25)" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--accent-cyan)" }}>
                Active Session Hub
              </span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, margin: "0.2rem 0 0.5rem" }}>
                Welcome back, {user?.name || "Candidate"}.
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "560px", margin: 0 }}>
                Track your real-time interview performance, solve algorithm challenges, and practice live AI rounds.
              </p>
            </div>

            <div className="dashboard-hero__status">
              <span className="status-pill" style={{ color: "var(--accent-cyan)", border: "1px solid rgba(0, 255, 208, 0.3)" }}>
                ● Active Practice Streak
              </span>
              <Link
                to="/interview"
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

          {/* 4 Stat Cards */}
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
              change="+3 this week"
            />
            <StatCard
              label="Average Rubric Score"
              value="92%"
              icon="⭐"
              color="violet"
              badge="Top 8%"
            />
            <StatCard
              label="DSA Solved"
              value="112"
              icon="⚡"
              color="pink"
              change="112 / 300 problems"
            />
            <StatCard
              label="Current Streak"
              value="7 Days"
              icon="🔥"
              color="blue"
              badge="Active"
            />
          </div>

          {/* Activity Chart & Next Interview Cards */}
          <div className="dashboard-columns">
            {/* Weekly Activity Bar Chart (CSS) */}
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
                    Performance Velocity
                  </span>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                    Weekly Practice Activity
                  </h2>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Last 7 Days</span>
              </div>

              {/* CSS Bar Chart */}
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
                    key={w.day}
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
                        height: w.height,
                        background: "linear-gradient(180deg, #00ffd0 0%, #7b61ff 100%)",
                        borderRadius: "8px 8px 2px 2px",
                        boxShadow: "0 0 15px rgba(0, 255, 208, 0.3)",
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
                <span>🎯 Consistency: <strong>High (94%)</strong></span>
                <Link to="/interview" style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
                  Practice Today →
                </Link>
              </div>
            </article>

            {/* Next Interview Card */}
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
                    RECOMMENDED NEXT
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>~25 mins</span>
                </div>

                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: "0.6rem" }}>
                  Frontend Architecture & State Management
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.55, margin: "0 0 1.25rem" }}>
                  Evaluate component lifecycles, memoization performance pitfalls, and micro-frontend patterns.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#fff" }}>
                    React 19
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#fff" }}>
                    Virtual DOM
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", background: "rgba(255, 255, 255, 0.05)", color: "#fff" }}>
                    System Design
                  </span>
                </div>
              </div>

              <Link
                to="/interview"
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
