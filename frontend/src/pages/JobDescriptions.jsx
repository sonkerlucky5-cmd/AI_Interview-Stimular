import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  getJobsRequest,
  createJobRequest,
  deleteJobRequest,
  updateJobRequest,
} from "../services/jobService";
import { getApiErrorMessage } from "../services/api";

function JobDescriptions() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [requirements, setRequirements] = useState("");
  const [description, setDescription] = useState("");

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await getJobsRequest();
      if (res.success) {
        setJobs(res.data || []);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load job descriptions."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setRequirements("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (job) => {
    setEditingId(job.id);
    setTitle(job.title);
    setCompany(job.company || "");
    setRequirements(Array.isArray(job.requirements) ? job.requirements.join(", ") : "");
    setDescription(job.description);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in Job Title and Description.");
      return;
    }

    const payload = {
      title: title.trim(),
      company: company.trim() || null,
      requirements: requirements
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: description.trim(),
    };

    try {
      setIsSubmitting(true);
      if (editingId) {
        const res = await updateJobRequest(editingId, payload);
        if (res.success) {
          toast.success("Job description updated!");
          fetchJobs();
          resetForm();
        }
      } else {
        const res = await createJobRequest(payload);
        if (res.success) {
          toast.success("Job description created!");
          fetchJobs();
          resetForm();
        }
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save job description."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, jobTitle) => {
    if (!window.confirm(`Delete job description for "${jobTitle}"?`)) return;

    try {
      await deleteJobRequest(id);
      toast.success("Job description deleted.");
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete job description."));
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
              <span className="eyebrow">Target Role Calibration</span>
              <h1>Target Job Descriptions</h1>
              <p>
                Save job descriptions you are aiming for. Compare your resume against role expectations and uncover your exact skill gaps.
              </p>
            </div>
            <div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (showForm) resetForm();
                  else setShowForm(true);
                }}
              >
                {showForm ? "Cancel" : "+ Add Job Description"}
              </button>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="glass-card" style={{ marginBottom: "2rem", padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                {editingId ? "Edit Job Description" : "Add New Job Description"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Role / Job Title *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Stripe, Google, Startup"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Key Skills / Requirements (Comma-separated)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React, TypeScript, GraphQL, Next.js, Redux"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Full Job Description *
                  </label>
                  <textarea
                    className="form-input"
                    rows="6"
                    placeholder="Paste the requirements, responsibilities, and qualifications from the job posting..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingId ? "Update Job" : "Save Job Description"}
                  </button>
                  <button type="button" className="btn btn--outline" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "1.25rem" }}>Saved Roles ({jobs.length})</h2>

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <Loader />
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1rem" }}>
                  No job descriptions added yet.
                </p>
                <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)}>
                  Add Your First Target Job
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {jobs.map((job) => {
                  const reqs = Array.isArray(job.requirements) ? job.requirements : [];
                  return (
                    <article key={job.id} className="glass-card" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <h3 style={{ margin: "0 0 0.25rem", color: "var(--title)", fontSize: "1.2rem" }}>
                            {job.title}
                          </h3>
                          {job.company && (
                            <span style={{ color: "var(--blue)", fontSize: "0.9rem", fontWeight: 500 }}>
                              🏢 {job.company}
                            </span>
                          )}
                          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.5rem 0" }}>
                            Added on {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn btn--primary"
                            style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                            onClick={() => navigate(`/matches?jobId=${job.id}`)}
                          >
                            🎯 Match with Resume
                          </button>
                          <button
                            type="button"
                            className="btn btn--outline"
                            style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                            onClick={() => handleEditClick(job)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger"
                            style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                            onClick={() => handleDelete(job.id, job.title)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {reqs.length > 0 && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {reqs.map((req) => (
                              <span
                                key={req}
                                style={{
                                  background: "rgba(57, 208, 199, 0.12)",
                                  color: "var(--teal)",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <p
                        style={{
                          color: "var(--text)",
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                          marginTop: "0.75rem",
                          maxHeight: "80px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {job.description}
                      </p>
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

export default JobDescriptions;
