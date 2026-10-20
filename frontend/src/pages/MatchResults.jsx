import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { getResumesRequest } from "../services/resumeService";
import { getJobsRequest } from "../services/jobService";
import { createMatchRequest, getMatchesRequest } from "../services/matchService";
import { getApiErrorMessage } from "../services/api";

function MatchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryJobId = searchParams.get("jobId");

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [matchesHistory, setMatchesHistory] = useState([]);

  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(queryJobId || "");

  const [isComputing, setIsComputing] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [resumesRes, jobsRes, matchesRes] = await Promise.all([
          getResumesRequest(),
          getJobsRequest(),
          getMatchesRequest(),
        ]);

        if (resumesRes.success) {
          setResumes(resumesRes.data || []);
          if (resumesRes.data?.length > 0) {
            setSelectedResumeId(resumesRes.data[0].id);
          }
        }

        if (jobsRes.success) {
          setJobs(jobsRes.data || []);
          if (!queryJobId && jobsRes.data?.length > 0) {
            setSelectedJobId(jobsRes.data[0].id);
          }
        }

        if (matchesRes.success) {
          setMatchesHistory(matchesRes.data || []);
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load matching data."));
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [queryJobId]);

  const handleRunMatch = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !selectedJobId) {
      toast.error("Please select both a resume and a job description.");
      return;
    }

    try {
      setIsComputing(true);
      const res = await createMatchRequest({
        resumeId: selectedResumeId,
        jobDescriptionId: selectedJobId,
      });

      if (res.success) {
        toast.success("Match analysis complete!");
        setActiveMatch(res.data);
        // Refresh history
        const updatedHistory = await getMatchesRequest();
        if (updatedHistory.success) {
          setMatchesHistory(updatedHistory.data || []);
        }
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to compute match."));
    } finally {
      setIsComputing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--teal)";
    if (score >= 50) return "var(--blue)";
    return "var(--danger)";
  };

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Gap Analysis & Relevance</span>
              <h1>Resume-to-Job Matching</h1>
              <p>
                Evaluate your resume against specific job requirements. Identify missing keywords, inspect evidence snippets, and prepare targeted practice.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <Loader />
            </div>
          ) : (
            <>
              {/* Match Selector Form */}
              <div className="glass-card" style={{ marginBottom: "2rem", padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Select Target Documents</h2>

                {resumes.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                      You need to upload at least one resume first.
                    </p>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => navigate("/resumes")}
                    >
                      Upload Resume
                    </button>
                  </div>
                ) : jobs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                      You need to add at least one job description first.
                    </p>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => navigate("/jobs")}
                    >
                      Add Job Description
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRunMatch}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1.25rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.4rem",
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Select Resume *
                        </label>
                        <select
                          className="form-input"
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                        >
                          {resumes.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.file_name} ({new Date(r.created_at).toLocaleDateString()})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.4rem",
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Select Job Description *
                        </label>
                        <select
                          className="form-input"
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                          {jobs.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.title} {j.company ? `(${j.company})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={isComputing}
                      style={{ width: "100%", padding: "0.75rem" }}
                    >
                      {isComputing ? "Computing Skill Overlap..." : "⚡ Run Match Analysis"}
                    </button>
                  </form>
                )}
              </div>

              {/* Active Match Report */}
              {activeMatch && (
                <div style={{ marginBottom: "2.5rem" }}>
                  <div
                    className="glass-card"
                    style={{
                      padding: "2rem",
                      border: "1px solid var(--blue)",
                      boxShadow: "var(--glow-blue)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div>
                        <span className="eyebrow">Match Report</span>
                        <h2 style={{ margin: "0.2rem 0", fontSize: "1.5rem" }}>
                          {activeMatch.job_title}
                        </h2>
                        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
                          Compared against: <strong>{activeMatch.resume_file_name}</strong>
                        </p>
                      </div>

                      {/* Score Badge */}
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "2.75rem",
                            fontWeight: 800,
                            color: getScoreColor(activeMatch.match_data?.score),
                            lineHeight: 1,
                          }}
                        >
                          {activeMatch.match_data?.score}%
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Skill Match Index
                        </span>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div
                      style={{
                        background: "rgba(98, 245, 160, 0.08)",
                        borderLeft: "3px solid var(--accent-mint)",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        marginBottom: "1.5rem",
                      }}
                    >
                      ℹ️ {activeMatch.match_data?.disclaimer}
                    </div>

                    {/* Matched vs Missing Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {/* Matched Skills */}
                      <div
                        style={{
                          background: "rgba(98, 245, 160, 0.05)",
                          border: "1px solid rgba(98, 245, 160, 0.22)",
                          borderRadius: "12px",
                          padding: "1.25rem",
                        }}
                      >
                        <h3 style={{ margin: "0 0 0.75rem", color: "var(--accent-mint)", fontSize: "1.05rem" }}>
                          ✔ Matched Competencies ({activeMatch.match_data?.matchedSkills?.length || 0})
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                          {(activeMatch.match_data?.matchedSkills || []).map((skill) => (
                            <span
                              key={skill}
                              style={{
                                background: "rgba(98, 245, 160, 0.15)",
                                color: "var(--accent-mint)",
                                border: "1px solid rgba(98, 245, 160, 0.25)",
                                padding: "0.28rem 0.7rem",
                                borderRadius: "9999px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Gaps */}
                      <div
                        style={{
                          background: "rgba(255, 107, 138, 0.05)",
                          border: "1px solid rgba(255, 107, 138, 0.2)",
                          borderRadius: "12px",
                          padding: "1.25rem",
                        }}
                      >
                        <h3 style={{ margin: "0 0 0.75rem", color: "var(--danger)", fontSize: "1.05rem" }}>
                          ⚠ Skill Gaps Detected ({activeMatch.match_data?.missingSkills?.length || 0})
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                          {(activeMatch.match_data?.missingSkills || []).map((skill) => (
                            <span
                              key={skill}
                              style={{
                                background: "rgba(255, 107, 138, 0.15)",
                                color: "var(--danger)",
                                padding: "0.25rem 0.6rem",
                                borderRadius: "6px",
                                fontSize: "0.85rem",
                                fontWeight: 500,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {activeMatch.match_data?.missingSkills?.length > 0 && (
                          <div style={{ marginTop: "1rem" }}>
                            <Link
                              to={`/roadmap?role=${encodeURIComponent(activeMatch.job_role || "")}&gaps=${encodeURIComponent((activeMatch.match_data?.missingSkills || []).join(","))}`}
                              className="btn btn--outline"
                              style={{ fontSize: "0.82rem", padding: "0.35rem 0.75rem" }}
                            >
                              🗺️ Create Learning Roadmap for Gaps →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actionable Suggestions */}
                    {activeMatch.match_data?.suggestions?.length > 0 && (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem", color: "var(--title)" }}>
                          Recommendations & Action Plan
                        </h3>
                        <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "var(--text)" }}>
                          {activeMatch.match_data.suggestions.map((s, idx) => (
                            <li key={idx} style={{ marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Evidence Snippets */}
                    {activeMatch.match_data?.evidence?.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem", color: "var(--title)" }}>
                          Verified Resume Evidence Snippets
                        </h3>
                        <div style={{ display: "grid", gap: "0.6rem" }}>
                          {activeMatch.match_data.evidence.map((ev, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: "rgba(0,0,0,0.3)",
                                padding: "0.75rem 1rem",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                                borderLeft: "3px solid var(--teal)",
                              }}
                            >
                              <strong style={{ color: "var(--teal)" }}>{ev.skill}:</strong>{" "}
                              <span style={{ color: "var(--text-muted)" }}>"{ev.snippet}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Match History */}
              {matchesHistory.length > 0 && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Previous Match Reports</h2>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {matchesHistory.map((m) => (
                      <article
                        key={m.id}
                        className="glass-card"
                        style={{
                          padding: "1rem 1.5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveMatch(m)}
                      >
                        <div>
                          <strong style={{ color: "var(--title)", fontSize: "1.05rem" }}>
                            {m.job_title}
                          </strong>
                          <p style={{ margin: "0.2rem 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Resume: {m.resume_file_name} • {new Date(m.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span
                            style={{
                              fontSize: "1.3rem",
                              fontWeight: 700,
                              color: getScoreColor(Number(m.score)),
                            }}
                          >
                            {m.score}%
                          </span>
                          <span className="btn btn--outline" style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem" }}>
                            View Report
                          </span>
                        </div>
                      </article>
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

export default MatchResults;
