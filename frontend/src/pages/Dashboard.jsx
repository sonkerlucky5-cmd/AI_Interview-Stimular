import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAuth from "../hooks/useAuth";
import { getResumesRequest } from "../services/resumeService";
import { getJobsRequest } from "../services/jobService";
import { getMatchesRequest } from "../services/matchService";

function Dashboard() {
  const { user } = useAuth();
  const [resumeCount, setResumeCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Unavailable";

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [rRes, jRes, mRes] = await Promise.allSettled([
          getResumesRequest(),
          getJobsRequest(),
          getMatchesRequest(),
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Hero */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Candidate Dashboard</span>
              <h1>Welcome back, {user?.name}.</h1>
              <p>
                Your candidate preparation hub is active. Upload your resume, configure target job descriptions, and evaluate your skill gaps before starting mock interviews.
              </p>
            </div>

            <div className="dashboard-hero__status">
              <span className="status-pill">Role: {user?.role}</span>
              <span className="status-pill">Member Since: {formattedDate}</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="metrics-grid">
            <article className="glass-card">
              <span className="metric-card__label">📄 Resumes Uploaded</span>
              <strong>{isLoading ? "…" : resumeCount}</strong>
              <p>Active documents parsed and ready for role matching.</p>
              <Link to="/resumes" className="btn btn--outline" style={{ marginTop: "0.75rem", display: "inline-block", fontSize: "0.85rem" }}>
                Manage Resumes →
              </Link>
            </article>

            <article className="glass-card">
              <span className="metric-card__label">💼 Target Job Profiles</span>
              <strong>{isLoading ? "…" : jobCount}</strong>
              <p>Calibrated job descriptions with extracted requirements.</p>
              <Link to="/jobs" className="btn btn--outline" style={{ marginTop: "0.75rem", display: "inline-block", fontSize: "0.85rem" }}>
                Manage Jobs →
              </Link>
            </article>

            <article className="glass-card">
              <span className="metric-card__label">🎯 Match Reports</span>
              <strong>{isLoading ? "…" : matchCount}</strong>
              <p>Calculated skill overlaps and actionable suggestions.</p>
              <Link to="/matches" className="btn btn--outline" style={{ marginTop: "0.75rem", display: "inline-block", fontSize: "0.85rem" }}>
                View Matches →
              </Link>
            </article>
          </div>

          {/* Quick Actions & Launchpad */}
          <div className="dashboard-columns">
            <article className="glass-card">
              <span className="eyebrow">Next Steps</span>
              <h2>Prepare Your Interview Profile</h2>
              <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem" }}>1️⃣</span>
                  <div>
                    <strong>Upload your resume</strong>
                    <p style={{ margin: "0.2rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      Upload in PDF or DOCX format to extract skills automatically.
                    </p>
                    <Link to="/resumes" style={{ color: "var(--blue)", fontSize: "0.85rem", fontWeight: 500 }}>
                      Go to Resume Library →
                    </Link>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem" }}>2️⃣</span>
                  <div>
                    <strong>Add your dream role</strong>
                    <p style={{ margin: "0.2rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      Paste job descriptions to calibrate the interview simulator.
                    </p>
                    <Link to="/jobs" style={{ color: "var(--blue)", fontSize: "0.85rem", fontWeight: 500 }}>
                      Add Target Job →
                    </Link>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem" }}>3️⃣</span>
                  <div>
                    <strong>Check skill gap & evidence</strong>
                    <p style={{ margin: "0.2rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      Run instant heuristic analysis to see what to prepare.
                    </p>
                    <Link to="/matches" style={{ color: "var(--blue)", fontSize: "0.85rem", fontWeight: 500 }}>
                      Run Match Analysis →
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <article className="glass-card glass-card--accent">
              <span className="eyebrow">User profile</span>
              <h2>Authenticated session details</h2>
              <dl className="detail-list">
                <div>
                  <dt>Name</dt>
                  <dd>{user?.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user?.email}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{user?.role}</dd>
                </div>
                <div>
                  <dt>Database</dt>
                  <dd>PostgreSQL 18</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
