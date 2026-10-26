import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import AudioWaveform from "../components/AudioWaveform";
import {
  getInterviewByIdRequest,
  startInterviewRequest,
  submitAnswerRequest,
  nextQuestionRequest,
  abandonInterviewRequest,
} from "../services/interviewService";
import { getApiErrorMessage } from "../services/api";

function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Voice speech mode state
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(true);
  const [voiceNotice, setVoiceNotice] = useState("");
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize browser WebSpeech if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasVoiceSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setAnswerText((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceNotice("Microphone permission was denied. Text mode is fully available.");
          toast.error("Microphone permission was denied.");
        } else if (event.error !== "no-speech") {
          setVoiceNotice(`Speech recognition notice: ${event.error}.`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setHasVoiceSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!hasVoiceSupport) {
      toast("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsRecording(false);
    } else {
      setVoiceNotice("");
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        toast.success("Listening... Speak your answer now.");
      } catch {
        setIsRecording(false);
        toast.error("Unable to start speech recognition.");
      }
    }
  };

  // Optional Browser Text-To-Speech to read question
  const handleReadAloud = () => {
    if ("speechSynthesis" in window && currentQuestion?.question_text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      toast("Reading question aloud...");
    } else {
      toast("Speech synthesis not supported in this browser.");
    }
  };

  // Timer Effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Fetch / Resume Session
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const res = await getInterviewByIdRequest(id);
        if (!res.success || !res.data) {
          toast.error("Interview session not found.");
          navigate("/dashboard");
          return;
        }

        const { interview, items } = res.data;

        if (interview.status === "completed") {
          navigate(`/interviews/${id}/result`);
          return;
        }

        if (interview.status === "abandoned") {
          toast.error("This interview was previously abandoned.");
          navigate("/dashboard");
          return;
        }

        setSession(interview);

        // Find current unanswered question or start session
        const unanswered = items.find((item) => !item.answer_text);
        if (unanswered) {
          setCurrentQuestion({
            id: unanswered.question_id,
            position: unanswered.position,
            question_text: unanswered.question_text,
            category: unanswered.category,
            difficulty: unanswered.difficulty,
          });
        } else if (items.length > 0 && items.length >= interview.question_limit) {
          navigate(`/interviews/${id}/result`);
          return;
        } else {
          // If pending or starting next question
          const startRes = await startInterviewRequest(id);
          if (startRes.success && startRes.data?.currentQuestion) {
            setCurrentQuestion(startRes.data.currentQuestion);
          }
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load interview room."));
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [id, navigate]);

  const handleSubmitAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!answerText.trim()) {
      toast.error("Please provide an answer before continuing.");
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsRecording(false);
    }

    try {
      setIsSubmitting(true);
      // 1. Submit answer and trigger evaluation
      const subRes = await submitAnswerRequest(id, {
        questionId: currentQuestion.id,
        position: currentQuestion.position,
        answerText: answerText.trim(),
        transcript: answerText.trim(),
        idempotencyKey: `ans_${id}_q${currentQuestion.position}_${Date.now()}`,
      });

      if (!subRes.success) {
        throw new Error("Failed to save answer.");
      }

      toast.success(`Question ${currentQuestion.position} evaluated!`);
      setAnswerText("");

      // 2. Request next question or completion
      const nextRes = await nextQuestionRequest(id);
      if (nextRes.isCompleted) {
        toast.success("Interview completed! Generating report...");
        navigate(`/interviews/${id}/result`);
      } else if (nextRes.data) {
        setCurrentQuestion(nextRes.data);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit answer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandon = async () => {
    if (!window.confirm("Are you sure you want to exit this mock interview? Progress will be preserved in your account.")) {
      return;
    }

    try {
      await abandonInterviewRequest(id);
      toast("Interview session exited.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to abandon session."));
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl + Enter to submit
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmitAnswer();
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
  const progressPercent = session && currentQuestion
    ? Math.round(((currentQuestion.position - 1) / session.question_limit) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="page" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader />
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Loading interview environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>
      {/* Session Top Bar matching Panel 06 */}
      <div className="room-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div className="target-role-badge" style={{ marginBottom: 0 }}>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "999px",
                background: "var(--accent-mint)",
                boxShadow: "0 0 10px var(--accent-mint)",
              }}
            />
            <span>Live AI Mock Interview</span>
          </div>

          <h1 style={{ margin: 0, fontSize: "1.25rem", color: "#fff", fontWeight: 800 }}>
            {session?.target_role}
          </h1>

          <span
            style={{
              fontSize: "0.75rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background: "rgba(0, 245, 184, 0.12)",
              color: "var(--accent-mint)",
              border: "1px solid rgba(0, 245, 184, 0.25)",
              textTransform: "capitalize",
              fontWeight: 700,
            }}
          >
            {session?.difficulty} level
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Elapsed:</span>
            <strong style={{ fontSize: "1.2rem", fontFamily: "monospace", color: "var(--accent-mint)", letterSpacing: "0.05em" }}>
              ⏱ {formatTimer(secondsElapsed)}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleAbandon}
            style={{
              padding: "0.45rem 1rem",
              fontSize: "0.82rem",
              fontWeight: 700,
              borderRadius: "999px",
              background: "rgba(255, 75, 75, 0.12)",
              border: "1px solid rgba(255, 75, 75, 0.3)",
              color: "#ff6b8a",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Exit Session
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--title)", fontWeight: 700 }}>
            Question {currentQuestion?.position} of {session?.question_limit}
          </span>
          <span style={{ color: "var(--accent-mint)", fontWeight: 700 }}>
            {progressPercent}% Completed
          </span>
        </div>
        <div className="room-progress-track">
          <div
            className="room-progress-fill"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Main 2-Column Split Stage */}
      <div className="room-layout">
        {/* Left Column: AI Question & Response Area */}
        <section>
          {/* Question Stage Card */}
          <div className="question-card-stage">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span
                  style={{
                    background: "rgba(0, 245, 184, 0.12)",
                    color: "var(--accent-mint)",
                    border: "1px solid rgba(0, 245, 184, 0.25)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {currentQuestion?.category || "Core Engineering"}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Question #{currentQuestion?.position}
                </span>
              </div>

              <button
                type="button"
                onClick={handleReadAloud}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(0, 245, 184, 0.2)",
                  color: "var(--title)",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
                title="Read question aloud with text-to-speech"
              >
                🔊 Read Aloud
              </button>
            </div>

            <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.65rem)", lineHeight: 1.5, color: "var(--title)", margin: 0, fontWeight: 700 }}>
              {currentQuestion?.question_text}
            </h2>
          </div>

          {/* Answer Form Card */}
          <div
            className="glass-card"
            style={{
              padding: "1.8rem 2rem",
              borderRadius: "24px",
              border: "1px solid rgba(0, 245, 184, 0.22)",
              background: "var(--bg-card, rgba(10, 30, 26, 0.72))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            <form onSubmit={handleSubmitAnswer}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <label htmlFor="answer-input" style={{ fontWeight: 700, color: "var(--title)", fontSize: "1rem" }}>
                  Your Engineering Response
                </label>

                {/* Voice & Audio Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  {hasVoiceSupport ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <AudioWaveform isRecording={isRecording} />
                      <button
                        type="button"
                        onClick={toggleRecording}
                        disabled={isSubmitting}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontSize: "0.85rem",
                          padding: "0.45rem 1rem",
                          borderRadius: "999px",
                          cursor: "pointer",
                          fontWeight: 700,
                          background: isRecording
                            ? "linear-gradient(135deg, #ff4b6b 0%, #d82b4b 100%)"
                            : "rgba(0, 245, 184, 0.12)",
                          border: isRecording ? "none" : "1px solid rgba(0, 245, 184, 0.3)",
                          color: isRecording ? "#fff" : "var(--accent-mint)",
                          boxShadow: isRecording ? "0 0 20px rgba(255, 75, 107, 0.6)" : "none",
                          transition: "all 0.25s ease",
                        }}
                      >
                        {isRecording ? "⏹ Stop Listening" : "🎙 Speak Answer"}
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      🎙 Text Mode Active
                    </span>
                  )}
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {wordCount} words
                  </span>
                </div>
              </div>

              {voiceNotice && (
                <div style={{ fontSize: "0.82rem", color: "#ffc107", marginBottom: "0.85rem", background: "rgba(255, 193, 7, 0.1)", padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid rgba(255, 193, 7, 0.25)" }}>
                  ⚠️ {voiceNotice}
                </div>
              )}

              <textarea
                id="answer-input"
                className="form-input"
                rows="9"
                placeholder="Type or dictate your response here. Clearly structure your reasoning, explain underlying architectural decisions, and discuss practical engineering trade-offs..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  marginBottom: "1.2rem",
                  borderRadius: "16px",
                  padding: "1.1rem 1.25rem",
                  background: "rgba(6, 18, 15, 0.85)",
                  border: "1px solid rgba(0, 245, 184, 0.25)",
                  color: "#fff",
                }}
                autoFocus
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  💡 Press <strong>Ctrl + Enter</strong> to submit directly.
                </span>

                <button
                  type="submit"
                  id="submit-answer-btn"
                  className="button button--primary pill-btn-primary"
                  disabled={isSubmitting || !answerText.trim()}
                  style={{
                    padding: "0.85rem 2.2rem",
                    fontSize: "1rem",
                    borderRadius: "999px",
                    fontWeight: 800,
                    cursor: isSubmitting || !answerText.trim() ? "not-allowed" : "pointer",
                    boxShadow: !answerText.trim() ? "none" : "0 4px 25px rgba(0, 245, 184, 0.4)",
                    opacity: !answerText.trim() ? 0.5 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" />
                      Evaluating Answer…
                    </>
                  ) : currentQuestion?.position === session?.question_limit ? (
                    "Submit & Finish Interview →"
                  ) : (
                    "Submit & Next Question →"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column: Live Analysis & Speaking Tips */}
        <aside className="room-sidebar">
          {/* Speaking Guidance Card */}
          <div className="speaking-tip-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🎯</span>
              <strong style={{ fontSize: "1.05rem", color: "#fff" }}>AI Speaking Guidance</strong>
            </div>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div className="speaking-tip-item">
                <span style={{ color: "var(--accent-mint)", fontWeight: 800 }}>1.</span>
                <span>Structure answers with the <strong>STAR</strong> framework: Situation, Task, Action, Result.</span>
              </div>
              <div className="speaking-tip-item">
                <span style={{ color: "var(--accent-mint)", fontWeight: 800 }}>2.</span>
                <span>Explicitly address <strong>architectural tradeoffs</strong> (latency vs cost, consistency vs availability).</span>
              </div>
              <div className="speaking-tip-item">
                <span style={{ color: "var(--accent-mint)", fontWeight: 800 }}>3.</span>
                <span>Quantify outcomes wherever possible (e.g. <em>40% latency reduction</em>, <em>99.99% uptime</em>).</span>
              </div>
            </div>
          </div>

          {/* Evaluation Rubric Criteria Card */}
          <div className="speaking-tip-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📊</span>
              <strong style={{ fontSize: "1.05rem", color: "#fff" }}>Evaluation Rubric</strong>
            </div>

            <div style={{ display: "grid", gap: "0.65rem" }}>
              {[
                { title: "Technical Correctness", desc: "Precision of framework & algorithmic knowledge" },
                { title: "Reasoning & Structure", desc: "Logical flow and clear breakdown of problems" },
                { title: "Practical Tradeoffs", desc: "Realistic edge cases, scalability, and limits" },
                { title: "Completeness & Relevance", desc: "Directly answering all components of the prompt" },
              ].map((dim, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "0.7rem 0.85rem",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(0, 245, 184, 0.12)",
                  }}
                >
                  <strong style={{ display: "block", color: "var(--accent-mint)", fontSize: "0.85rem", marginBottom: "0.15rem" }}>
                    ✓ {dim.title}
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {dim.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default InterviewRoom;
