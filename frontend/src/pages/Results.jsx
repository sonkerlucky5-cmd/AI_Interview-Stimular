import { Link } from "react-router-dom";
import { mockEvaluationResult } from "../data/mockData";

export default function Results() {
  const { overallScore, targetRole, date, skills, aiSuggestions } = mockEvaluationResult;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Top Banner */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span
          style={{
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--accent-cyan)",
            fontWeight: 700,
            padding: "0.3rem 0.85rem",
            borderRadius: "999px",
            background: "rgba(0, 255, 208, 0.1)",
            border: "1px solid rgba(0, 255, 208, 0.25)",
            display: "inline-block",
            marginBottom: "1rem",
          }}
        >
          Session Complete • Evaluated
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: 0, color: "#fff" }}>
          AI Interview Rubric Report
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.6rem", fontSize: "0.95rem" }}>
          Track: <strong style={{ color: "#fff" }}>{targetRole}</strong> • Session Date: {date}
        </p>
      </div>

      {/* Main Grid: Score Ring + Skill Progress Bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Score Ring Card */}
        <div
          className="glass-panel"
          style={{
            padding: "2.5rem 2rem",
            borderRadius: "24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0, 255, 208, 0.3)",
          }}
        >
          {/* Circular SVG Donut */}
          <div style={{ position: "relative", width: "170px", height: "170px", marginBottom: "1.5rem" }}>
            <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * overallScore) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00ffd0" />
                  <stop offset="100%" stopColor="#7b61ff" />
                </linearGradient>
              </defs>
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <strong style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                {overallScore}
              </strong>
              <small style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>/ 100</small>
            </div>
          </div>

          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem" }}>
            Strong Hire Potential 🚀
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0, maxWidth: "260px" }}>
            You demonstrated high clarity in system trade-offs and foundational algorithms.
          </p>
        </div>

        {/* Skill Progress Bars */}
        <div
          className="glass-panel"
          style={{
            padding: "2.25rem 2rem",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
            Competency Breakdown
          </h3>

          <div style={{ display: "grid", gap: "1.25rem" }}>
            {skills.map((s) => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{s.name}</span>
                  <strong style={{ color: s.color }}>{s.score}%</strong>
                </div>
                <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${s.score}%`,
                      background: `linear-gradient(90deg, ${s.color}, #7b61ff)`,
                      borderRadius: "999px",
                      boxShadow: `0 0 10px ${s.color}66`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Scored against mid-to-senior rubric standards across top tier engineering orgs.
          </div>
        </div>
      </div>

      {/* AI Suggestions List */}
      <div
        className="glass-panel"
        style={{
          padding: "2.25rem",
          borderRadius: "24px",
          marginBottom: "2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "1.4rem" }}>💡</span>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", margin: 0 }}>
            Targeted AI Improvement Recommendations
          </h3>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
          {aiSuggestions.map((sug, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.85rem",
                padding: "1rem 1.25rem",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                fontSize: "0.92rem",
                color: "#e2e8f0",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "var(--accent-cyan)", fontWeight: 800 }}>✔</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          to="/interview"
          style={{
            padding: "0.9rem 2rem",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
            color: "#05060f",
            fontWeight: 800,
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          Retake or New Session →
        </Link>
        <Link
          to="/dashboard"
          style={{
            padding: "0.9rem 2rem",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "0.95rem",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          View Dashboard Progress
        </Link>
      </div>
    </div>
  );
}
