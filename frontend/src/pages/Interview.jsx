import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { mockQuestions } from "../data/mockData";

export default function Interview() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Frontend");
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const startSession = () => {
    setHasStarted(true);
    const firstQ = mockQuestions.find((q) => q.role === selectedRole) || mockQuestions[0];
    setMessages([
      {
        sender: "ai",
        text: `Welcome to your ${selectedRole} Technical Interview! I will be evaluating your conceptual understanding, practical architecture choices, and problem-solving depth. Here is your first question:`,
      },
      {
        sender: "ai",
        text: firstQ.question,
        isQuestion: true,
        category: firstQ.category,
      },
    ]);
  };

  const handleSendAnswer = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim()) return;

    const userText = inputAnswer.trim();
    setInputAnswer("");

    // Append user message
    const updatedMessages = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      const nextIdx = currentIdx + 1;

      if (nextIdx < 5) {
        setCurrentIdx(nextIdx);
        const nextQ = mockQuestions[nextIdx % mockQuestions.length];
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `Good point. Let's move to question ${nextIdx + 1}: ${nextQ.question}`,
            isQuestion: true,
            category: nextQ.category,
          },
        ]);
      } else {
        toast.success("Interview completed! Generating rubric scorecard...");
        navigate("/results");
      }
    }, 1200);
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem 1.5rem 4rem",
        minHeight: "85vh",
      }}
    >
      {/* Top Header */}
      <div
        className="glass-panel"
        style={{
          padding: "1.25rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          borderRadius: "20px",
          marginBottom: "1.5rem",
          border: "1px solid rgba(0, 255, 208, 0.25)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-cyan)", fontWeight: 700 }}>
            Live Mock Environment
          </span>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0.2rem 0", color: "#fff" }}>
            {selectedRole} Practice Session
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {hasStarted && (
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>Progress</span>
              <strong style={{ color: "var(--accent-cyan)", fontSize: "1.05rem" }}>
                Question {Math.min(5, currentIdx + 1)} / 5
              </strong>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/results")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "999px",
              background: "rgba(255, 110, 199, 0.15)",
              border: "1px solid rgba(255, 110, 199, 0.35)",
              color: "var(--accent-pink)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            End Interview →
          </button>
        </div>
      </div>

      {!hasStarted ? (
        /* Role Selection Screen */
        <div
          className="glass-panel"
          style={{
            padding: "3rem 2rem",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>🎙️</span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
            Select Your Target Domain
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
            Our AI interviewer will dynamically tailor questions based on your chosen track.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {["Frontend", "Backend", "HR"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: "1.25rem 1rem",
                  borderRadius: "16px",
                  background: selectedRole === role ? "rgba(0, 255, 208, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  border: selectedRole === role ? "2px solid var(--accent-cyan)" : "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {role === "Frontend" ? "🎨 Frontend" : role === "Backend" ? "⚙️ Backend" : "🤝 HR Behavioral"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={startSession}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
              border: "none",
              color: "#05060f",
              fontWeight: 800,
              fontSize: "1.05rem",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0, 255, 208, 0.3)",
            }}
          >
            Launch Interview Session →
          </button>
        </div>
      ) : (
        /* Live Chat Interactive UI */
        <div
          className="glass-panel"
          style={{
            borderRadius: "24px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "580px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Scrollable messages container with data-lenis-prevent */}
          <div
            data-lenis-prevent="true"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              background: "rgba(11, 14, 30, 0.6)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background:
                    m.sender === "user"
                      ? "linear-gradient(135deg, #7b61ff, #ff6ec7)"
                      : m.isQuestion
                      ? "rgba(0, 255, 208, 0.08)"
                      : "rgba(255, 255, 255, 0.06)",
                  border:
                    m.sender === "user"
                      ? "none"
                      : m.isQuestion
                      ? "1px solid rgba(0, 255, 208, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "1rem 1.25rem",
                  borderRadius: m.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  color: "#fff",
                  fontSize: "0.95rem",
                  lineHeight: 1.55,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                }}
              >
                {m.sender === "ai" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                      AI INTERVIEWER
                    </span>
                    {m.category && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          background: "rgba(0, 255, 208, 0.15)",
                          color: "var(--accent-cyan)",
                        }}
                      >
                        {m.category}
                      </span>
                    )}
                  </div>
                )}
                {m.text}
              </div>
            ))}

            {isAiThinking && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "var(--accent-cyan)",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span className="btn-spinner" /> Evaluating your response & preparing next challenge...
              </div>
            )}
          </div>

          {/* Form input */}
          <form
            onSubmit={handleSendAnswer}
            style={{
              padding: "1rem 1.25rem",
              background: "rgba(14, 18, 38, 0.95)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              gap: "0.75rem",
            }}
          >
            <input
              type="text"
              placeholder="Structure your reasoning, explain underlying tradeoffs..."
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              disabled={isAiThinking}
              style={{
                flex: 1,
                padding: "0.85rem 1.15rem",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isAiThinking || !inputAnswer.trim()}
              style={{
                padding: "0.85rem 1.75rem",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
                border: "none",
                color: "#05060f",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Submit Answer →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
