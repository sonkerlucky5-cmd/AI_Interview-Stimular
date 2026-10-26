import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import aiAvatar from "../assets/ai_interviewer_avatar.webp";

function HeroDemoModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 3000);
    const timer3 = setTimeout(() => setStep(3), 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3, 7, 18, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.5rem, 3vw, 1.5rem)",
        zIndex: 2000,
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "760px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#080d1e",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 240, 255, 0.15)",
          borderRadius: "20px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(10, 17, 36, 0.8)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#00f0ff",
                boxShadow: "0 0 10px #00f0ff",
              }}
            />
            <strong style={{ color: "#fff", fontSize: "0.95rem", letterSpacing: "0.05em" }}>
              LIVE INTERVIEW SIMULATION DEMO
            </strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "var(--text-muted)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "1.75rem" }}>
          {/* AI Question Section */}
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src={aiAvatar}
              alt="AI Interviewer"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                objectFit: "cover",
                border: "2px solid #00f0ff",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.3)",
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#00f0ff", fontWeight: 600 }}>
                  AI Interviewer (Technical Round)
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.5rem",
                    background: "rgba(0, 240, 255, 0.15)",
                    borderRadius: "4px",
                    color: "#00f0ff",
                  }}
                >
                  Speaking
                </span>
              </div>

              <div
                style={{
                  background: "rgba(0, 240, 255, 0.06)",
                  border: "1px solid rgba(0, 240, 255, 0.2)",
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                "Can you explain the architectural difference between SQL and NoSQL databases, and when you would select MongoDB over PostgreSQL in a high-scale application?"
              </div>
            </div>
          </div>

          {/* Candidate Response Simulation */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Candidate Voice Transcription:
              </span>
              <span style={{ fontSize: "0.75rem", color: step >= 1 ? "var(--teal)" : "var(--text-muted)" }}>
                {step >= 1 ? "✔ Audio Captured (Web Speech API)" : "Listening..."}
              </span>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "0.85rem 1rem",
                fontSize: "0.9rem",
                color: step >= 1 ? "var(--text)" : "var(--text-muted)",
                lineHeight: 1.5,
                fontStyle: step >= 1 ? "normal" : "italic",
              }}
            >
              {step >= 1
                ? "SQL databases use structured schemas and ACID guarantees suitable for transactional systems. NoSQL handles flexible document schemas and horizontal partitioning. I would choose PostgreSQL for relational integrity, but MongoDB if document structures evolve rapidly and write throughput is partitioned across sharded clusters."
                : "Capturing candidate microphone input..."}
            </div>
          </div>

          {/* AI Rubric Evaluation Breakdown */}
          {step >= 2 && (
            <div
              style={{
                background: "rgba(98, 245, 160, 0.08)",
                border: "1px solid rgba(98, 245, 160, 0.25)",
                borderRadius: "12px",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <strong style={{ color: "var(--accent-mint)", fontSize: "0.95rem" }}>
                  Sample Rubric Evaluation (Demo)
                </strong>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-mint)" }}>
                  94 / 100
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                {[
                  { label: "Technical Accuracy", score: "96%" },
                  { label: "System Trade-offs", score: "92%" },
                  { label: "Communication", score: "94%" },
                  { label: "Structure", score: "95%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>
                      {item.label}
                    </span>
                    <strong style={{ color: "var(--teal)", fontSize: "0.9rem" }}>{item.score}</strong>
                  </div>
                ))}
              </div>

              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text)", lineHeight: 1.45 }}>
                ✔ <strong>AI Insight:</strong> Strong articulation of ACID vs BASE guarantees and sharding trade-offs. Recommendation: mention concrete replication lag considerations.
              </p>
            </div>
          )}

          {/* Footer CTAs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              No credit card required • Instant access
            </span>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn btn--outline"
                onClick={onClose}
                style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
              >
                Close Preview
              </button>
              <Link
                to="/signup"
                className="button button--primary pill-btn-primary"
                onClick={onClose}
                style={{
                  fontSize: "0.85rem",
                  padding: "0.55rem 1.4rem",
                  borderRadius: "9999px",
                }}
              >
                Start Your Own Interview ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroDemoModal;
