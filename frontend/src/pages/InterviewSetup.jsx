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

const INTERVIEW_TYPES = [
  {
    id: "technical",
    icon: "💻",
    title: "Technical & Architecture",
    desc: "System architecture, core data structures, language internals, performance optimizations.",
    badge: "Core Engineering",
  },
  {
    id: "behavioral",
    icon: "🤝",
    title: "Behavioral (STAR Method)",
    desc: "Conflict resolution, cross-functional leadership, project ownership, incident post-mortems.",
    badge: "Leadership & Culture",
  },
  {
    id: "mixed",
    icon: "⚡",
    title: "Mixed Comprehensive",
    desc: "High-yield balanced combination of architectural deep-dives and behavioral leadership scenarios.",
    badge: "Most Popular",
  },
];

const DIFFICULTY_LEVELS = [
  { id: "entry", title: "Junior / Entry-Level", exp: "0–2 YOE", desc: "Foundational principles, core syntax, standard algorithms" },
  { id: "intermediate", title: "Mid-Level Engineer", exp: "2–5 YOE", desc: "System components, design patterns, framework mastery" },
  { id: "senior", title: "Senior Engineer", exp: "5–8 YOE", desc: "High-scale systems, failure modes, trade-off analysis" },
  { id: "lead", title: "Staff / Principal / Lead", exp: "8+ YOE", desc: "Cross-org architecture, tech strategy, organizational impact" },
];

const QUESTION_LIMITS = [
  { count: 3, label: "3 Questions", time: "~15 mins", desc: "Quick focus sprint" },
  { count: 5, label: "5 Questions", time: "~25 mins", desc: "Standard mock session" },
  { count: 7, label: "7 Questions", time: "~40 mins", desc: "Comprehensive evaluation" },
  { count: 10, label: "10 Questions", time: "~60 mins", desc: "Full onsite simulation" },
];

function InterviewSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    if (e) e.preventDefault();
    if (!targetRole.trim()) {
      toast.error("Please enter a target role.");
      setCurrentStep(1);
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

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!targetRole.trim()) {
        toast.error("Please enter a target role to proceed.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      handleLaunch();
    }
  };

  return (
    <div className="page page--dashboard" style={{ maxWidth: "1320px", margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header Banner */}
          <div className="dashboard-hero">
            <div>
              <div className="target-role-badge">
                <span aria-hidden="true">⚙️</span>
                <span>Session Configurator</span>
              </div>
              <h1>Configure Mock Interview</h1>
              <p>
                3-step guided interview wizard. Set your target role, focus track, seniority level,
                and attach your resume or job description for personalized AI questions.
              </p>
            </div>
          </div>

          {/* 3-Step Wizard Tracker */}
          <div className="wizard-steps-container">
            {[
              { num: 1, label: "Role & Context" },
              { num: 2, label: "Interview Focus" },
              { num: 3, label: "Difficulty & Length" },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`wizard-step-node ${isActive ? "wizard-step-node--active" : ""} ${isCompleted ? "wizard-step-node--completed" : ""}`}
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  style={{ cursor: step.num < currentStep ? "pointer" : "default" }}
                >
                  <span className="wizard-step-num">
                    {isCompleted ? "✓" : step.num}
                  </span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Wizard Card Body */}
          <div
            className="glass-card"
            style={{
              padding: "2.2rem 2.4rem",
              borderRadius: "24px",
              border: "1px solid rgba(0, 245, 184, 0.25)",
              background: "rgba(10, 30, 26, 0.72)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            <form onSubmit={handleNextStep}>
              {/* STEP 1: Target Role & Personalization */}
              {currentStep === 1 && (
                <div style={{ display: "grid", gap: "1.8rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <label htmlFor="target-role-input" style={{ fontWeight: 700, color: "var(--title)", fontSize: "1rem" }}>
                        Target Engineering Role *
                      </label>
                      <span style={{ fontSize: "0.78rem", color: "var(--accent-mint)", fontWeight: 600 }}>Step 1 of 3</span>
                    </div>

                    <input
                      id="target-role-input"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Senior Full Stack Engineer, React Specialist"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      required
                      style={{
                        padding: "0.95rem 1.1rem",
                        fontSize: "1rem",
                        borderRadius: "12px",
                        border: "1px solid rgba(0, 245, 184, 0.25)",
                        background: "rgba(6, 18, 15, 0.8)",
                        color: "#fff",
                      }}
                    />

                    {/* Quick role pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                      {COMMON_ROLES.map((role) => (
                        <button
                          key={role}
                          type="button"
                          className="auth-deco-pill"
                          style={{
                            background: targetRole === role ? "rgba(0, 245, 184, 0.2)" : "rgba(0, 245, 184, 0.06)",
                            borderColor: targetRole === role ? "var(--accent-mint)" : "rgba(0, 245, 184, 0.2)",
                            color: targetRole === role ? "#fff" : "var(--accent-mint)",
                            fontWeight: targetRole === role ? 700 : 500,
                            cursor: "pointer",
                          }}
                          onClick={() => setTargetRole(role)}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context Selection (Resume & Job) */}
                  <div
                    style={{
                      padding: "1.4rem",
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(0, 245, 184, 0.15)",
                      display: "grid",
                      gap: "1.2rem",
                    }}
                  >
                    <div>
                      <strong style={{ display: "block", color: "var(--title)", fontSize: "0.92rem", marginBottom: "0.2rem" }}>
                        Personalized Context (Optional)
                      </strong>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        Attach your uploaded resume or a saved target job to generate tailored scenario questions.
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem" }}>
                      <div>
                        <label htmlFor="select-resume" style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          Attach Resume
                        </label>
                        <select
                          id="select-resume"
                          className="form-input"
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          style={{ borderRadius: "10px", padding: "0.8rem 1rem", border: "1px solid rgba(0, 245, 184, 0.2)" }}
                        >
                          <option value="">None (General role questions)</option>
                          {resumes.map((r) => (
                            <option key={r.id} value={r.id}>
                              📄 {r.file_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="select-job" style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          Attach Target Job
                        </label>
                        <select
                          id="select-job"
                          className="form-input"
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                          style={{ borderRadius: "10px", padding: "0.8rem 1rem", border: "1px solid rgba(0, 245, 184, 0.2)" }}
                        >
                          <option value="">None (Standard industry rubric)</option>
                          {jobs.map((j) => (
                            <option key={j.id} value={j.id}>
                              💼 {j.title} {j.company ? `(${j.company})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Interview Style & Focus */}
              {currentStep === 2 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.2rem", color: "#fff", margin: "0 0 0.25rem" }}>Select Interview Focus</h2>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Choose the evaluation style for your mock session</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--accent-mint)", fontWeight: 600 }}>Step 2 of 3</span>
                  </div>

                  <div style={{ display: "grid", gap: "1rem" }}>
                    {INTERVIEW_TYPES.map((type) => {
                      const isSelected = interviewType === type.id;
                      return (
                        <div
                          key={type.id}
                          className={`setup-option-card ${isSelected ? "setup-option-card--selected" : ""}`}
                          onClick={() => setInterviewType(type.id)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span style={{ fontSize: "1.6rem" }}>{type.icon}</span>
                              <strong style={{ fontSize: "1.05rem", color: "#fff" }}>
                                {type.title}
                              </strong>
                            </div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.6rem",
                                borderRadius: "999px",
                                background: isSelected ? "var(--accent-mint)" : "rgba(255, 255, 255, 0.08)",
                                color: isSelected ? "#030907" : "var(--accent-mint)",
                              }}
                            >
                              {type.badge}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "0.4rem 0 0 2.35rem", lineHeight: 1.55 }}>
                            {type.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Difficulty & Question Count */}
              {currentStep === 3 && (
                <div style={{ display: "grid", gap: "1.8rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <strong style={{ fontSize: "1rem", color: "#fff" }}>Seniority / Difficulty Level</strong>
                      <span style={{ fontSize: "0.78rem", color: "var(--accent-mint)", fontWeight: 600 }}>Step 3 of 3</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
                      {DIFFICULTY_LEVELS.map((diff) => {
                        const isSelected = difficulty === diff.id;
                        return (
                          <div
                            key={diff.id}
                            className={`setup-option-card ${isSelected ? "setup-option-card--selected" : ""}`}
                            onClick={() => setDifficulty(diff.id)}
                            style={{ padding: "1rem 1.15rem" }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                              <strong style={{ fontSize: "0.95rem", color: "#fff" }}>{diff.title}</strong>
                              <span style={{ fontSize: "0.75rem", color: "var(--accent-mint)", fontWeight: 700 }}>{diff.exp}</span>
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, display: "block" }}>
                              {diff.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <strong style={{ display: "block", fontSize: "1rem", color: "#fff", marginBottom: "0.8rem" }}>
                      Number of Questions
                    </strong>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem" }}>
                      {QUESTION_LIMITS.map((q) => {
                        const isSelected = questionLimit === q.count;
                        return (
                          <div
                            key={q.count}
                            className={`setup-option-card ${isSelected ? "setup-option-card--selected" : ""}`}
                            onClick={() => setQuestionLimit(q.count)}
                            style={{ padding: "1rem 1.15rem", textAlign: "center" }}
                          >
                            <strong style={{ display: "block", fontSize: "1.1rem", color: isSelected ? "var(--accent-mint)" : "#fff", marginBottom: "0.2rem" }}>
                              {q.label}
                            </strong>
                            <span style={{ fontSize: "0.82rem", color: "var(--accent-mint)", fontWeight: 700, display: "block" }}>
                              ⏱ {q.time}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginTop: "0.2rem" }}>
                              {q.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "2.2rem",
                  paddingTop: "1.4rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    style={{
                      padding: "0.75rem 1.4rem",
                      borderRadius: "999px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "var(--title)",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="submit"
                    className="button button--primary pill-btn-primary"
                    style={{
                      padding: "0.85rem 1.8rem",
                      fontSize: "0.95rem",
                      borderRadius: "999px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="button button--primary pill-btn-primary"
                    disabled={isStarting}
                    style={{
                      padding: "0.95rem 2.2rem",
                      fontSize: "1.05rem",
                      borderRadius: "999px",
                      fontWeight: 800,
                      cursor: isStarting ? "wait" : "pointer",
                      boxShadow: "0 4px 25px rgba(0, 245, 184, 0.4)",
                    }}
                  >
                    {isStarting ? "Initializing Interview Environment..." : "🚀 Launch Practice Interview Room ↗"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InterviewSetup;
