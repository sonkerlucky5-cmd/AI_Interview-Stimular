import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { getInterviewEvaluationsRequest } from "../services/interviewService";
import { getPrintableReportUrl } from "../services/reportService";
import { getApiErrorMessage } from "../services/api";

function InterviewResult() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState("strengths"); // 'strengths' | 'improvements'
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const res = await getInterviewEvaluationsRequest(id);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load interview results."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const toggleQuestionExpanded = (idx) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--accent-mint)";
    if (score >= 60) return "var(--accent-mint-soft)";
    return "var(--accent-coral)";
  };

  const { interview, summary, evaluations } = data || {};
  const dimAvg = summary?.dimensionAverages || {};
  const overallScore = Math.round(summary?.averageOverallScore || 0);

  // Derive score-based performance metadata (Option A - Authentic thresholds)
  const performanceData = useMemo(() => {
    if (overallScore >= 80) {
      return {
        tagline: "Great Performance!",
        description: "Demonstrated strong technical depth, structured reasoning, and comprehensive answers across evaluated questions.",
        color: "var(--accent-mint)",
        badge: "Exceptional",
      };
    }
    if (overallScore >= 60) {
      return {
        tagline: "Solid Foundation!",
        description: "Good conceptual understanding with clear potential. Focus on deepening trade-off analysis and practical examples.",
        color: "var(--accent-mint-soft)",
        badge: "Competent",
      };
    }
    return {
      tagline: "Needs Practice",
      description: "Foundational gaps identified. Review detailed feedback and follow your tailored study roadmap to improve.",
      color: "var(--accent-coral)",
      badge: "Developing",
    };
  }, [overallScore]);

  // Aggregate unique strengths and improvements from all questions
  const aggregatedFeedback = useMemo(() => {
    if (!evaluations || evaluations.length === 0) {
      return { strengths: [], improvements: [] };
    }
    const strSet = new Set();
    const impSet = new Set();

    evaluations.forEach((item) => {
      (item.strengths || []).forEach((s) => {
        if (typeof s === "string" && s.trim()) strSet.add(s.trim());
      });
      (item.improvements || []).forEach((i) => {
        if (typeof i === "string" && i.trim()) impSet.add(i.trim());
      });
    });

    return {
      strengths: Array.from(strSet),
      improvements: Array.from(impSet),
    };
  }, [evaluations]);

  // SVG Circular Ring Math
  const ringSize = 150;
  const strokeWidth = 11;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // 5 Real Rubric Dimensions mapped directly to backend schema
  const rubricDimensions = [
    { label: "Technical Accuracy", score: Math.round(dimAvg.technical_correctness || 0) },
    { label: "Relevance & Context", score: Math.round(dimAvg.relevance || 0) },
    { label: "Depth & Scope", score: Math.round(dimAvg.completeness || 0) },
    { label: "Structure & Reasoning", score: Math.round(dimAvg.reasoning_structure || 0) },
    { label: "Practical Trade-offs", score: Math.round(dimAvg.practical_tradeoffs || 0) },
  ];

  if (isLoading) {
    return (
      <div className="page" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader />
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Loading evaluation scorecard...</p>
        </div>
      </div>
    );
  }

  const hasEvaluations = Boolean(evaluations && evaluations.length > 0);

  return (
    <div className="page page--dashboard" style={{ overflowX: "hidden" }}>
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main" style={{ minWidth: 0 }}>
          {/* ═════════════════════════════════════════════
              1. TOP HEADER & ACTION BAR
              ═════════════════════════════════════════════ */}
          <div
            className="glass-card"
            style={{
              padding: "1.75rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.25rem",
              background: "linear-gradient(135deg, rgba(10, 30, 26, 0.85) 0%, rgba(6, 18, 15, 0.95) 100%)",
              border: "1px solid rgba(0, 245, 184, 0.25)",
            }}
          >
            <div>
              <span className="eyebrow" style={{ color: "var(--accent-mint)", letterSpacing: "0.12em" }}>
                Performance Assessment
              </span>
              <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.3rem)", fontWeight: 800, margin: "0.25rem 0", color: "#FFFFFF" }}>
                Interview Results
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
                Detailed analysis and feedback for{" "}
                <strong style={{ color: "var(--accent-mint)" }}>{interview?.target_role || "Engineering"}</strong>{" "}
                ({interview?.difficulty || "Intermediate"} difficulty)
              </p>
            </div>

            {/* Preserved Actions with responsive touch-friendly styling */}
            <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={getPrintableReportUrl(id)}
                target="_blank"
                rel="noreferrer"
                className="button button--ghost"
                id="btn-export-pdf"
                style={{
                  minHeight: "44px",
                  padding: "0.65rem 1.15rem",
                  fontSize: "0.88rem",
                  borderColor: "rgba(0, 245, 184, 0.28)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                🖨️ Export PDF Report
              </a>
              <Link
                to="/interviews"
                className="button button--ghost"
                style={{
                  minHeight: "44px",
                  padding: "0.65rem 1.15rem",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                📋 All Sessions
              </Link>
              <Link
                to={`/roadmap?role=${encodeURIComponent(interview?.target_role || "")}&sourceInterviewId=${id}`}
                className="button button--ghost"
                id="btn-generate-roadmap"
                style={{
                  minHeight: "44px",
                  padding: "0.65rem 1.15rem",
                  fontSize: "0.88rem",
                  borderColor: "rgba(0, 245, 184, 0.28)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                🗺️ Study Roadmap
              </Link>
              <Link
                to="/interviews/new"
                className="button button--primary"
                style={{
                  minHeight: "44px",
                  padding: "0.65rem 1.35rem",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontWeight: 700,
                }}
              >
                + Practice Another Role
              </Link>
            </div>
          </div>

          {/* ═════════════════════════════════════════════
              2. REFERENCE PANEL 07: 3-CARD ASSESSMENT GRID
              ═════════════════════════════════════════════ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "1.5rem",
              alignItems: "stretch",
            }}
          >
            {/* ── CARD 1: OVERALL SCORE ── */}
            <div
              className="glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "2rem 1.5rem",
                border: "1px solid rgba(0, 245, 184, 0.25)",
                background: "rgba(10, 30, 26, 0.72)",
                boxShadow: "var(--shadow-glass)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ width: "100%", textAlign: "left", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Overall Score
                </h2>
              </div>

              {/* Glowing SVG Progress Ring */}
              <div
                style={{
                  position: "relative",
                  width: `${ringSize}px`,
                  height: `${ringSize}px`,
                  margin: "0.75rem 0 1.25rem",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <svg
                  width={ringSize}
                  height={ringSize}
                  viewBox={`0 0 ${ringSize} ${ringSize}`}
                  style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 0 14px rgba(0, 245, 184, 0.35))" }}
                >
                  {/* Background Track */}
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(0, 245, 184, 0.12)"
                    strokeWidth={strokeWidth}
                  />
                  {/* Active Neon Mint Ring */}
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="transparent"
                    stroke={performanceData.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                </svg>

                {/* Score Text in Center */}
                <div style={{ position: "absolute", textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      lineHeight: 1,
                      display: "block",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {overallScore}%
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Score
                  </span>
                </div>
              </div>

              {/* Authentic Score Tagline (Option A - No Fake Percentile) */}
              <div style={{ marginTop: "auto", width: "100%" }}>
                <strong
                  style={{
                    fontSize: "1.15rem",
                    color: performanceData.color,
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "0.35rem",
                  }}
                >
                  {performanceData.tagline}
                </strong>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 0.75rem" }}>
                  {performanceData.description}
                </p>
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    background: "rgba(0, 245, 184, 0.08)",
                    border: "1px solid rgba(0, 245, 184, 0.2)",
                    fontSize: "0.75rem",
                    color: "var(--accent-mint-soft)",
                    fontWeight: 600,
                  }}
                >
                  Assessed across {summary?.evaluatedCount || 0} of {summary?.totalQuestions || 0} questions
                </div>
              </div>
            </div>

            {/* ── CARD 2: SKILL BREAKDOWN ── */}
            <div
              className="glass-card"
              style={{
                padding: "2rem 1.75rem",
                border: "1px solid rgba(0, 245, 184, 0.25)",
                background: "rgba(10, 30, 26, 0.72)",
                boxShadow: "var(--shadow-glass)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Skill Breakdown
                </h2>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Engineering rubric dimension averages
                </span>
              </div>

              {/* Stack of 5 Real Horizontal Skill Progress Bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "auto", marginBottom: "auto" }}>
                {rubricDimensions.map((dim) => (
                  <div key={dim.label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.86rem", color: "var(--text-main)", fontWeight: 500 }}>
                        {dim.label}
                      </span>
                      <strong style={{ fontSize: "0.86rem", color: getScoreColor(dim.score), fontWeight: 700 }}>
                        {dim.score}%
                      </strong>
                    </div>

                    {/* Progress Track */}
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "9999px",
                        background: "rgba(0, 245, 184, 0.12)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* Animated Fill Bar */}
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(0, dim.score))}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #00DDA5 0%, #00F5B8 100%)",
                          borderRadius: "9999px",
                          boxShadow: "0 0 10px rgba(0, 245, 184, 0.4)",
                          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CARD 3: AI FEEDBACK ── */}
            <div
              className="glass-card"
              style={{
                padding: "2rem 1.75rem",
                border: "1px solid rgba(0, 245, 184, 0.25)",
                background: "rgba(10, 30, 26, 0.72)",
                boxShadow: "var(--shadow-glass)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  AI Feedback
                </h2>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Aggregated insights from submitted answers
                </span>
              </div>

              {/* Tab Selector Pills (Strengths vs Areas for Improvement) */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1.25rem",
                  background: "rgba(0, 0, 0, 0.25)",
                  padding: "0.3rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(0, 245, 184, 0.18)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFeedbackTab("strengths")}
                  style={{
                    flex: 1,
                    minHeight: "44px",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: activeFeedbackTab === "strengths" ? 700 : 500,
                    color: activeFeedbackTab === "strengths" ? "#030907" : "var(--text-muted)",
                    background: activeFeedbackTab === "strengths" ? "var(--accent-mint)" : "transparent",
                    boxShadow: activeFeedbackTab === "strengths" ? "0 4px 14px rgba(0, 245, 184, 0.35)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Strengths ({aggregatedFeedback.strengths.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeedbackTab("improvements")}
                  style={{
                    flex: 1,
                    minHeight: "44px",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.82rem",
                    fontWeight: activeFeedbackTab === "improvements" ? 700 : 500,
                    color: activeFeedbackTab === "improvements" ? "#030907" : "var(--text-muted)",
                    background: activeFeedbackTab === "improvements" ? "var(--accent-amber)" : "transparent",
                    boxShadow: activeFeedbackTab === "improvements" ? "0 4px 14px rgba(245, 208, 98, 0.35)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Improvements ({aggregatedFeedback.improvements.length})
                </button>
              </div>

              {/* Dynamic Feedback Bullets with Neon Glow Icons */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: "250px" }}>
                {activeFeedbackTab === "strengths" ? (
                  aggregatedFeedback.strengths.length > 0 ? (
                    aggregatedFeedback.strengths.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.65rem",
                          fontSize: "0.85rem",
                          color: "var(--text-main)",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "rgba(0, 245, 184, 0.15)",
                            color: "var(--accent-mint)",
                            border: "1px solid rgba(0, 245, 184, 0.4)",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.75rem",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "auto 0" }}>
                      No specific strengths recorded yet. Submit complete answers to generate AI feedback.
                    </p>
                  )
                ) : (
                  aggregatedFeedback.improvements.length > 0 ? (
                    aggregatedFeedback.improvements.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.65rem",
                          fontSize: "0.85rem",
                          color: "var(--text-main)",
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: "rgba(245, 208, 98, 0.15)",
                            color: "var(--accent-amber)",
                            border: "1px solid rgba(245, 208, 98, 0.4)",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "0.7rem",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          ▲
                        </span>
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "auto 0" }}>
                      No improvement areas recorded. Excellent performance!
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════
              3. RUBRIC INTEGRITY NOTICE STRIP
              ═════════════════════════════════════════════ */}
          <div
            style={{
              background: "rgba(0, 245, 184, 0.05)",
              border: "1px solid rgba(0, 245, 184, 0.2)",
              borderLeft: "4px solid var(--accent-mint)",
              padding: "0.85rem 1.25rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span>ℹ️</span>
            <span>
              Rubric evaluations benchmark technical depth, structure, and communication. Scores reflect structured engineering rubrics and do not infer an employment guarantee.
            </span>
          </div>

          {/* ═════════════════════════════════════════════
              4. QUESTION-BY-QUESTION DEEP DIVE SECTION
              ════════════════════════════════════════════ */}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#FFFFFF" }}>
                Detailed Question Feedback ({evaluations?.length || 0})
              </h2>
              {hasEvaluations && (
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Click benchmark answers to review model responses
                </span>
              )}
            </div>

            {!hasEvaluations ? (
              /* Clean Empty State (Shart 3) */
              <div
                className="glass-card"
                style={{
                  textAlign: "center",
                  padding: "3.5rem 2rem",
                  border: "1px dashed rgba(0, 245, 184, 0.3)",
                  background: "rgba(10, 30, 26, 0.5)",
                }}
              >
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>📋</span>
                <h3 style={{ fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
                  No Question Evaluations Recorded
                </h3>
                <p style={{ color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 1.5rem", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  You have not submitted responses for this mock interview session yet. Join the interview room to answer questions and generate your full performance report.
                </p>
                <Link
                  to={`/interviews/${id}`}
                  className="button button--primary"
                  style={{ minHeight: "44px", padding: "0.75rem 1.75rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  Enter Mock Interview Room ➔
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {evaluations.map((item, idx) => {
                  const qScores = item.scores || {};
                  const isExpanded = Boolean(expandedQuestions[idx]);

                  return (
                    <article
                      key={item.id || idx}
                      className="glass-card"
                      style={{
                        padding: "1.75rem",
                        border: "1px solid rgba(0, 245, 184, 0.22)",
                        background: "rgba(10, 30, 26, 0.72)",
                      }}
                    >
                      {/* Question Top Metadata & Score */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: "260px" }}>
                          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.45rem", flexWrap: "wrap", alignItems: "center" }}>
                            <span
                              style={{
                                background: "rgba(0, 245, 184, 0.15)",
                                color: "var(--accent-mint)",
                                border: "1px solid rgba(0, 245, 184, 0.35)",
                                padding: "0.2rem 0.65rem",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                              }}
                            >
                              Question {item.position || idx + 1}
                            </span>
                            {item.category && (
                              <span
                                style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  color: "var(--text-muted)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  padding: "0.2rem 0.65rem",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {item.category}
                              </span>
                            )}
                          </div>
                          <h3 style={{ margin: 0, color: "#FFFFFF", fontSize: "1.15rem", lineHeight: 1.45, fontWeight: 700 }}>
                            {item.question_text}
                          </h3>
                        </div>

                        {/* Overall Question Score */}
                        <div
                          style={{
                            textAlign: "center",
                            background: "rgba(0, 0, 0, 0.35)",
                            border: `1px solid ${getScoreColor(qScores.overall || 0)}33`,
                            borderRadius: "var(--radius-sm)",
                            padding: "0.5rem 1rem",
                            minWidth: "75px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.6rem",
                              fontWeight: 800,
                              color: getScoreColor(qScores.overall || 0),
                              lineHeight: 1,
                              display: "block",
                            }}
                          >
                            {qScores.overall || 0}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Score
                          </span>
                        </div>
                      </div>

                      {/* Candidate Submitted Answer */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
                          Your Submitted Answer:
                        </span>
                        <div
                          style={{
                            background: "rgba(0, 0, 0, 0.35)",
                            padding: "1rem 1.2rem",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.9rem",
                            color: "var(--text-main)",
                            lineHeight: 1.6,
                            borderLeft: "3px solid var(--accent-mint)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.03)",
                          }}
                        >
                          {item.answer_text || item.candidate_answer || (
                            <em style={{ color: "var(--text-dim)" }}>No answer text recorded for this question.</em>
                          )}
                        </div>
                      </div>

                      {/* Strengths & Improvements Responsive 2-Col Grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                          gap: "1rem",
                          marginBottom: "1.25rem",
                        }}
                      >
                        {/* Strengths Card */}
                        <div
                          style={{
                            background: "rgba(0, 245, 184, 0.05)",
                            border: "1px solid rgba(0, 245, 184, 0.22)",
                            borderRadius: "var(--radius-sm)",
                            padding: "1.1rem",
                          }}
                        >
                          <strong style={{ color: "var(--accent-mint)", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                            <span>✓</span> Key Strengths
                          </strong>
                          {item.strengths && item.strengths.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.84rem", color: "var(--text-main)", lineHeight: 1.6 }}>
                              {item.strengths.map((s, sIdx) => (
                                <li key={sIdx} style={{ marginBottom: "0.25rem" }}>{s}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>None noted.</p>
                          )}
                        </div>

                        {/* Improvements Card */}
                        <div
                          style={{
                            background: "rgba(255, 77, 109, 0.05)",
                            border: "1px solid rgba(255, 77, 109, 0.22)",
                            borderRadius: "var(--radius-sm)",
                            padding: "1.1rem",
                          }}
                        >
                          <strong style={{ color: "var(--accent-coral)", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                            <span>▲</span> Areas for Improvement
                          </strong>
                          {item.improvements && item.improvements.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.84rem", color: "var(--text-main)", lineHeight: 1.6 }}>
                              {item.improvements.map((imp, iIdx) => (
                                <li key={iIdx} style={{ marginBottom: "0.25rem" }}>{imp}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>None noted.</p>
                          )}
                        </div>
                      </div>

                      {/* Exemplary Benchmark Response (Accordion / Toggle) */}
                      {item.ideal_answer && (
                        <div
                          style={{
                            background: "rgba(0, 245, 184, 0.04)",
                            border: "1px solid rgba(0, 245, 184, 0.18)",
                            borderRadius: "var(--radius-sm)",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleQuestionExpanded(idx)}
                            style={{
                              width: "100%",
                              padding: "0.85rem 1.15rem",
                              background: "transparent",
                              border: "none",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                              textAlign: "left",
                              color: "var(--accent-mint)",
                              fontWeight: 600,
                              fontSize: "0.88rem",
                            }}
                          >
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span>💡</span>
                              <span>Exemplary Benchmark Model Response</span>
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                              {isExpanded ? "Hide ▲" : "Show Model Answer ▼"}
                            </span>
                          </button>

                          {isExpanded && (
                            <div style={{ padding: "0 1.15rem 1rem", borderTop: "1px solid rgba(0, 245, 184, 0.12)", paddingTop: "0.75rem" }}>
                              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.6 }}>
                                {item.ideal_answer}
                              </p>
                              <small style={{ color: "var(--text-dim)", fontSize: "0.75rem", display: "block", marginTop: "0.5rem" }}>
                                Note: This is an exemplary benchmark response demonstrating structured reasoning, not the only acceptable answer.
                              </small>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default InterviewResult;

