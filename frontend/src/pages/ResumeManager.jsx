import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  getResumesRequest,
  uploadResumeRequest,
  deleteResumeRequest,
  getResumeByIdRequest,
} from "../services/resumeService";
import { getApiErrorMessage } from "../services/api";

function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const res = await getResumesRequest();
      if (res.success) {
        setResumes(res.data || []);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load resumes."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const validExtensions = [".pdf", ".docx"];
    const fileExt = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setIsUploading(true);
      const res = await uploadResumeRequest(formData);
      if (res.success) {
        toast.success("Resume uploaded and parsed successfully!");
        fetchResumes();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Resume upload failed."));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await deleteResumeRequest(id);
      toast.success("Resume deleted.");
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (selectedResume?.id === id) {
        setSelectedResume(null);
        setIsInspecting(false);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete resume."));
    }
  };

  const handleInspect = async (id) => {
    try {
      setIsInspecting(true);
      const res = await getResumeByIdRequest(id);
      if (res.success) {
        setSelectedResume(res.data);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load resume details."));
      setIsInspecting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Document Intelligence</span>
              <h1>Resume Library & Parser</h1>
              <p>
                Upload your resumes (PDF or DOCX). Our parser securely extracts text and identifies your core technical skills, ready for job matching and mock interviews.
              </p>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            className={`glass-card upload-dropzone ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              cursor: "pointer",
              border: "2px dashed var(--blue)",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              marginBottom: "2rem",
              background: dragActive ? "rgba(79, 140, 255, 0.08)" : "var(--panel)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />

            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📄</div>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--title)" }}>
              {isUploading ? "Uploading & Parsing Resume..." : "Click or Drag & Drop Resume Here"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
              Supports PDF and DOCX files up to 5MB. Private & ownership-protected.
            </p>
            {isUploading && (
              <div style={{ marginTop: "1rem" }}>
                <Loader />
              </div>
            )}
          </div>

          {/* Resume List */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.4rem", margin: 0 }}>Uploaded Resumes ({resumes.length})</h2>
            </div>

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <Loader />
              </div>
            ) : resumes.length === 0 ? (
              <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                  No resumes uploaded yet. Upload your first resume above to get started!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {resumes.map((resume) => {
                  const skills = resume.extracted_data?.skills || [];
                  return (
                    <article key={resume.id} className="glass-card" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                            <span style={{ fontSize: "1.5rem" }}>📑</span>
                            <strong style={{ fontSize: "1.15rem", color: "var(--title)" }}>{resume.file_name}</strong>
                            <span className="status-pill" style={{ fontSize: "0.75rem" }}>
                              {formatBytes(resume.size_bytes)}
                            </span>
                          </div>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
                            Uploaded on {new Date(resume.created_at).toLocaleDateString()} at {new Date(resume.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn btn--outline"
                            style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                            onClick={() => handleInspect(resume.id)}
                          >
                            Inspect Details
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger"
                            style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
                            onClick={() => handleDelete(resume.id, resume.file_name)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {skills.length > 0 && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                            Detected Skills ({skills.length}):
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {skills.slice(0, 12).map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  background: "var(--blue-dim)",
                                  color: "var(--blue)",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  fontWeight: 500,
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {skills.length > 12 && (
                              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", alignSelf: "center" }}>
                                +{skills.length - 12} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inspect Modal */}
          {isInspecting && selectedResume && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "1rem",
              }}
              onClick={() => setIsInspecting(false)}
            >
              <div
                className="glass-card"
                style={{
                  maxWidth: "750px",
                  width: "100%",
                  maxHeight: "85vh",
                  overflowY: "auto",
                  padding: "2rem",
                  background: "#080e1a",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Parsed Resume Details</h2>
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={{ padding: "0.3rem 0.7rem" }}
                    onClick={() => setIsInspecting(false)}
                  >
                    ✕ Close
                  </button>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <strong>File:</strong> {selectedResume.file_name} ({formatBytes(selectedResume.size_bytes)})
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <span className="eyebrow">Detected Skills</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                    {(selectedResume.extracted_data?.skills || []).map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: "var(--blue-dim)",
                          color: "var(--blue)",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="eyebrow">Extracted Text Content</span>
                  <pre
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      padding: "1rem",
                      borderRadius: "8px",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      maxHeight: "300px",
                      overflowY: "auto",
                      border: "1px solid var(--panel-border)",
                    }}
                  >
                    {selectedResume.parsed_text || "No text available."}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResumeManager;
