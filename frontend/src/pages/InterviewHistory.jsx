import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { getInterviewsRequest } from "../services/interviewService";
import { getPrintableReportUrl } from "../services/reportService";
import { getApiErrorMessage } from "../services/api";

function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async (page = 1, status = statusFilter, search = searchTerm) => {
    try {
      setIsLoading(true);
      const res = await getInterviewsRequest({
        page,
        status: status === "all" ? undefined : status,
        search: search.trim() || undefined,
        limit: 8,
      });

      if (res.success) {
        setInterviews(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load interview history."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, statusFilter, searchTerm);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory(1, statusFilter, searchTerm);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="status-pill" style={{ background: "rgba(98, 245, 160, 0.15)", color: "var(--accent-mint)", border: "1px solid rgba(98, 245, 160, 0.3)" }}>✔ Completed</span>;
      case "in_progress":
        return <span className="status-pill" style={{ background: "rgba(245, 208, 98, 0.15)", color: "var(--warning)", border: "1px solid rgba(245, 208, 98, 0.3)" }}>⏳ In Progress</span>;
      case "abandoned":
        return <span className="status-pill" style={{ background: "rgba(255, 110, 138, 0.15)", color: "var(--danger)", border: "1px solid rgba(255, 110, 138, 0.3)" }}>✕ Abandoned</span>;
      default:
        return <span className="status-pill">Pending</span>;
    }
  };

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Session Archive</span>
              <h1>Interview History & Sessions</h1>
              <p>
                Browse your previous practice interviews. Review evaluations, track your historical scores, and resume unfinished sessions.
              </p>
            </div>
            <div>
              <Link to="/interviews/new" className="btn btn--primary">
                + New Interview
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            className="glass-card"
            style={{
              padding: "1.25rem",
              marginBottom: "1.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* Status Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "All Sessions" },
                { id: "completed", label: "Completed" },
                { id: "in_progress", label: "In Progress" },
                { id: "abandoned", label: "Abandoned" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  style={{
                    background: statusFilter === tab.id ? "var(--accent-mint)" : "rgba(98, 245, 160, 0.08)",
                    color: statusFilter === tab.id ? "#050907" : "var(--text)",
                    border: statusFilter === tab.id ? "none" : "1px solid rgba(98, 245, 160, 0.18)",
                    padding: "0.4rem 0.95rem",
                    borderRadius: "9999px",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontWeight: statusFilter === tab.id ? 700 : 500,
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setStatusFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Role Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", width: "200px" }}
              />
              <button type="submit" className="btn btn--outline" style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}>
                Search
              </button>
            </form>
          </div>

          {/* Session Cards Grid */}
          <div>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <Loader />
              </div>
            ) : interviews.length === 0 ? (
              <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1rem" }}>
                  No interview sessions found matching your filter criteria.
                </p>
                <Link to="/interviews/new" className="btn btn--primary">
                  Start Your First Mock Interview
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {interviews.map((item) => (
                  <article key={item.id} className="glass-card" style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                          <strong style={{ fontSize: "1.2rem", color: "var(--title)" }}>
                            {item.target_role}
                          </strong>
                          {getStatusBadge(item.status)}
                        </div>

                        <p style={{ margin: "0 0 0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          Level: <span style={{ textTransform: "capitalize" }}>{item.difficulty}</span> • Type: <span style={{ textTransform: "capitalize" }}>{item.interview_type}</span> • Started on {new Date(item.created_at).toLocaleDateString()}
                        </p>

                        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text)" }}>
                          <span>
                            Questions: <strong>{item.answers_submitted || 0} / {item.question_limit} answered</strong>
                          </span>
                          {item.resume_file_name && (
                            <span style={{ color: "var(--text-muted)" }}>
                              Resume: {item.resume_file_name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right side Score & Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        {item.status === "completed" && item.average_score && (
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: Number(item.average_score) >= 75 ? "var(--teal)" : "var(--blue)", lineHeight: 1 }}>
                              {item.average_score}%
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Avg Score</span>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {item.status === "completed" ? (
                            <>
                              <Link
                                to={`/interviews/${item.id}/result`}
                                className="btn btn--outline"
                                style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
                              >
                                View Scorecard
                              </Link>
                              <a
                                href={getPrintableReportUrl(item.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn--primary"
                                style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
                              >
                                🖨️ PDF Report
                              </a>
                            </>
                          ) : item.status === "in_progress" ? (
                            <Link
                              to={`/interviews/${item.id}`}
                              className="btn btn--primary"
                              style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
                            >
                              ▶ Resume Interview
                            </Link>
                          ) : (
                            <Link
                              to="/interviews/new"
                              className="btn btn--outline"
                              style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
                            >
                              Restart Practice
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem", alignItems: "center" }}>
              <button
                type="button"
                className="btn btn--outline"
                disabled={pagination.page <= 1}
                onClick={() => fetchHistory(pagination.page - 1)}
              >
                ← Previous
              </button>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                className="btn btn--outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchHistory(pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default InterviewHistory;
