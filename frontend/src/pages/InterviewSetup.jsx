import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { createInterviewRequest } from "../services/interviewService";
import { getResumesRequest } from "../services/resumeService";
import { getJobsRequest } from "../services/jobService";
import { getApiErrorMessage } from "../services/api";

const COMMON_ROLES = [
  "Full Stack Engineer",
  "Frontend Engineer (React)",
  "Backend Engineer (Node.js)",
  "System Architect",
  "DevOps & Cloud Engineer",
  "Software Engineer (General)",
];

function InterviewSetup() {
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [interviewType, setInterviewType] = useState("technical");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionLimit, setQuestionLimit] = useState(5);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");

  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchContextOptions = async () => {
      try {
        const [rRes, jRes] = await Promise.allSettled([
          getResumesRequest(),
          getJobsRequest(),
        ]);
        if (rRes.status === "fulfilled" && rRes.value.success) {
          setResumes(rRes.value.data || []);
        }
        if (jRes.status === "fulfilled" && jRes.value.success) {
          setJobs(jRes.value.data || []);
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchContextOptions();
  }, []);

  const handleLaunch = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      toast.error("Please enter a target role.");
      return;
    }

    try {
      setIsStarting(true);
      const res = await createInterviewRequest({
        targetRole: targetRole.trim(),
        interviewType,
        difficulty,
        questionLimit: Number(questionLimit),
        resumeId: selectedResumeId || null,
        jobDescriptionId: selectedJobId || null,
      });

      if (res.success && res.data?.id) {
        toast.success("Interview session initialized!");
        navigate(`/interviews/${res.data.id}`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to launch interview session."));
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Realistic Simulation</span>
              <h1>Configure Mock Interview</h1>
              <p>
                Customize your practice session. Choose your target role, difficulty, interview style, and optionally attach your resume for tailored technical questions.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ maxWidth: "800px", padding: "2rem" }}>
            <form onSubmit={handleLaunch}>
              {/* Role Selection */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--title)" }}>
                  Target Role / Position *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                  {COMMON_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      style={{
                        background: targetRole === role ? "var(--blue)" : "rgba(79, 140, 255, 0.1)",
                        color: targetRole === role ? "#fff" : "var(--blue)",
                        border: "none",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                      onClick={() => setTargetRole(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Type */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--title)" }}>
                  Interview Style / Focus
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                  {[
                    { id: "technical", label: "💻 Technical & Architecture", desc: "System design, frameworks, APIs, databases" },
                    { id: "behavioral", label: "🤝 Behavioral (STAR)", desc: "Conflict resolution, leadership, past ownership" },
                    { id: "mixed", label: "⚡ Mixed Comprehensive", desc: "Combination of technical deep-dives and behavioral" },
                  ].map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setInterviewType(type.id)}
                      style={{
                        background: interviewType === type.id ? "rgba(79, 140, 255, 0.15)" : "var(--panel)",
                        border: interviewType === type.id ? "2px solid var(--blue)" : "1px solid var(--panel-border)",
                        padding: "1rem",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <strong style={{ display: "block", color: "var(--title)", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                        {type.label}
                      </strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{type.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty & Question Count */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--title)" }}>
                    Seniority / Difficulty Level
                  </label>
                  <select
                    className="form-input"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="entry">Entry-Level / Junior (0-2 YOE)</option>
                    <option value="intermediate">Mid-Level Engineer (2-5 YOE)</option>
                    <option value="senior">Senior Engineer (5-8 YOE)</option>
                    <option value="lead">Staff / Principal / Lead (8+ YOE)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--title)" }}>
                    Number of Questions
                  </label>
                  <select
                    className="form-input"
                    value={questionLimit}
                    onChange={(e) => setQuestionLimit(Number(e.target.value))}
                  >
                    <option value={3}>3 Questions (Quick Sprint ~15 mins)</option>
                    <option value={5}>5 Questions (Standard Mock ~25 mins)</option>
                    <option value={7}>7 Questions (Comprehensive ~40 mins)</option>
                    <option value={10}>10 Questions (Deep-Dive ~60 mins)</option>
                  </select>
                </div>
              </div>

              {/* Optional Context */}
              <div style={{ marginBottom: "2rem" }}>
                <span className="eyebrow">Tailored Personalization (Optional)</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginTop: "0.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Attach Resume Context
                    </label>
                    <select
                      className="form-input"
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                    >
                      <option value="">None (Ask general role questions)</option>
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.file_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Attach Target Job Context
                    </label>
                    <select
                      className="form-input"
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                    >
                      <option value="">None (General role rubric)</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} {j.company ? `(${j.company})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isStarting}
                style={{ width: "100%", padding: "0.9rem", fontSize: "1.05rem" }}
              >
                {isStarting ? "Initializing Interview Environment..." : "🚀 Launch Practice Interview Room"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InterviewSetup;
