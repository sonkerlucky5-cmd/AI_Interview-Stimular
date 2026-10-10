import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { getInterviewEvaluationsRequest } from "../services/interviewService";
import { getApiErrorMessage } from "../services/api";

function InterviewResult() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--teal)";
    if (score >= 60) return "var(--blue)";
    return "var(--danger)";
  };

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

  const { interview, summary, evaluations } = data || {};
  const dimAvg = summary?.dimensionAverages || {};

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Performance Assessment</span>
              <h1>Interview Performance Scorecard</h1>
              <p>
                Target Role: <strong>{interview?.target_role}</strong> ({interview?.difficulty} level). Comprehensive rubric feedback based on your submitted responses.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link to="/interviews/new" className="btn btn--primary">
                + Practice Another Role
              </Link>
            </div>
          </div>

          {/* Overall Score Banner */}
          <div
            className="glass-card"
            style={{
              padding: "2rem",
              marginBottom: "2rem",
              border: "1px solid var(--panel-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <span className="eyebrow">Overall Evaluated Score</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 800,
                      color: getScoreColor(summary?.averageOverallScore || 0),
                      lineHeight: 1,
                    }}
                  >
                    {summary?.averageOverallScore || 0}
                  </span>
                  <span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>/ 100</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>
                  Assessed across {summary?.evaluatedCount} of {summary?.totalQuestions} questions
                </p>
              </div>

              {/* Rubric Category Dimensions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "0.75rem",
                  flex: 1,
                  maxWidth: "650px",
                }}
              >
                {[
                  { label: "Relevance", score: dimAvg.relevance || 0 },
                  { label: "Technical Accuracy", score: dimAvg.technical_correctness || 0 },
                  { label: "Depth & Scope", score: dimAvg.completeness || 0 },
                  { label: "Structure", score: dimAvg.reasoning_structure || 0 },
                  { label: "Trade-offs", score: dimAvg.practical_tradeoffs || 0 },
                ].map((dim) => (
                  <div
                    key={dim.label}
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      textAlign: "center",
                      border: "1px solid var(--panel-border)",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                      {dim.label}
                    </span>
                    <strong style={{ fontSize: "1.2rem", color: getScoreColor(dim.score) }}>
                      {dim.score}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(79, 140, 255, 0.08)",
                borderLeft: "3px solid var(--blue)",
                padding: "0.75rem 1rem",
                borderRadius: "4px",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
              }}
            >
              ℹ️ Rubric evaluations are designed to benchmark technical depth and clarity. Scores reflect structured engineering rubrics and do not infer hiring guarantee.
            </div>
          </div>

          {/* Question-by-Question Deep Dive */}
          <div>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "1.25rem" }}>
              Detailed Question Feedback ({evaluations?.length || 0})
            </h2>

            {evaluations?.length === 0 ? (
              <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "var(--text-muted)" }}>No evaluations recorded for this session.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.75rem" }}>
                {evaluations?.map((item, idx) => {
                  const qScores = item.scores || {};
                  return (
                    <article
                      key={item.id || idx}
                      className="glass-card"
                      style={{ padding: "1.75rem" }}
                    >
                      {/* Question Header */}
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
                        <div>
                          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                            <span
                              style={{
                                background: "var(--blue-dim)",
                                color: "var(--blue)",
                                padding: "0.2rem 0.55rem",
                                borderRadius: "6px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                            >
                              Question {item.position}
                            </span>
                            <span className="status-pill" style={{ fontSize: "0.75rem" }}>
                              {item.category}
                            </span>
                          </div>
                          <h3 style={{ margin: 0, color: "var(--title)", fontSize: "1.15rem", lineHeight: 1.4 }}>
                            {item.question_text}
                          </h3>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: "1.6rem",
                              fontWeight: 700,
                              color: getScoreColor(qScores.overall || 0),
                            }}
                          >
                            {qScores.overall || 0}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                            Score
                          </span>
                        </div>
                      </div>

                      {/* Candidate Answer */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                          Your Submitted Answer:
                        </span>
                        <div
                          style={{
                            background: "rgba(0,0,0,0.3)",
                            padding: "0.85rem 1rem",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            color: "var(--text)",
                            lineHeight: 1.5,
                            borderLeft: "3px solid var(--panel-border)",
                          }}
                        >
                          {item.answer_text}
                        </div>
                      </div>

                      {/* Strengths & Improvements */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1.25rem",
                        }}
                      >
                        {/* Strengths */}
                        <div
                          style={{
                            background: "rgba(57, 208, 199, 0.05)",
                            border: "1px solid rgba(57, 208, 199, 0.2)",
                            borderRadius: "8px",
                            padding: "1rem",
                          }}
                        >
                          <strong style={{ color: "var(--teal)", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
                            ✔ Key Strengths
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text)" }}>
                            {(item.strengths || []).map((s, sIdx) => (
                              <li key={sIdx} style={{ marginBottom: "0.25rem" }}>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div
                          style={{
                            background: "rgba(255, 107, 138, 0.05)",
                            border: "1px solid rgba(255, 107, 138, 0.2)",
                            borderRadius: "8px",
                            padding: "1rem",
                          }}
                        >
                          <strong style={{ color: "var(--danger)", fontSize: "0.9rem", display: "block", marginBottom: "0.4rem" }}>
                            ⚠ Areas for Improvement
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text)" }}>
                            {(item.improvements || []).map((imp, iIdx) => (
                              <li key={iIdx} style={{ marginBottom: "0.25rem" }}>
                                {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Ideal Benchmark Answer */}
                      {item.ideal_answer && (
                        <div
                          style={{
                            background: "rgba(79, 140, 255, 0.06)",
                            border: "1px solid rgba(79, 140, 255, 0.2)",
                            borderRadius: "8px",
                            padding: "1rem",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                            <strong style={{ color: "var(--blue)", fontSize: "0.9rem" }}>
                              💡 Exemplary Benchmark Response
                            </strong>
                            <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                              One possible model response, not the only valid answer
                            </small>
                          </div>
                          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.55 }}>
                            {item.ideal_answer}
                          </p>
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
