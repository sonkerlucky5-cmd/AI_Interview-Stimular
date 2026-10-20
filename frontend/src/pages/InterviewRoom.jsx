import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
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
          setVoiceNotice("Microphone access was denied. Text mode is fully available.");
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
    if (!window.confirm("Are you sure you want to abandon this interview session? Your progress will be saved.")) {
      return;
    }

    try {
      await abandonInterviewRequest(id);
      toast("Interview session abandoned.");
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
    <div className="page" style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Session Top Bar */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1rem 1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <span className="eyebrow" style={{ marginBottom: "0.2rem" }}>Active Mock Interview</span>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "var(--title)" }}>
            {session?.target_role}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Elapsed Time</span>
            <strong style={{ fontSize: "1.1rem", fontFamily: "monospace", color: "var(--blue)" }}>
              ⏱ {formatTimer(secondsElapsed)}
            </strong>
          </div>

          <button
            type="button"
            className="btn btn--danger"
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}
            onClick={handleAbandon}
          >
            Abandon Session
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--title)", fontWeight: 600 }}>
            Question {currentQuestion?.position} of {session?.question_limit}
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            {progressPercent}% Complete
          </span>
        </div>
        <div
          style={{
            height: "8px",
            background: "rgba(120, 148, 210, 0.15)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.max(5, progressPercent)}%`,
              background: "linear-gradient(90deg, var(--blue), var(--teal))",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Current Question Card */}
      <div
        className="glass-card"
        style={{
          padding: "2rem",
          marginBottom: "1.75rem",
          borderLeft: "4px solid var(--blue)",
          boxShadow: "var(--glow-blue)",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span
            style={{
              background: "var(--blue-dim)",
              color: "var(--blue)",
              padding: "0.25rem 0.65rem",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {currentQuestion?.category || "Core Engineering"}
          </span>
          <span className="status-pill" style={{ fontSize: "0.75rem" }}>
            Difficulty: {session?.difficulty}
          </span>
        </div>

        <h3 style={{ fontSize: "1.35rem", lineHeight: 1.5, color: "var(--title)", margin: 0 }}>
          {currentQuestion?.question_text}
        </h3>
      </div>

      {/* Answer Form */}
      <div className="glass-card" style={{ padding: "1.75rem" }}>
        <form onSubmit={handleSubmitAnswer}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600, color: "var(--title)", fontSize: "0.95rem" }}>
              Your Response
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {hasVoiceSupport ? (
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isSubmitting}
                  className={`btn ${isRecording ? "btn--danger" : "btn--secondary"}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "20px",
                    cursor: "pointer",
                    boxShadow: isRecording ? "0 0 15px rgba(255, 107, 138, 0.5)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isRecording ? "⏹ Stop Listening" : "🎙 Speak Answer"}
                </button>
              ) : (
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  🎙 Text Mode Active
                </span>
              )}
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {wordCount} words
              </span>
            </div>
          </div>

          {voiceNotice && (
            <div style={{ fontSize: "0.8rem", color: "var(--warning)", marginBottom: "0.6rem" }}>
              ⚠️ {voiceNotice}
            </div>
          )}

          <textarea
            className="form-input"
            rows="8"
            placeholder="Type your response here. Clearly structure your reasoning, highlight underlying principles, and discuss real-world trade-offs..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1rem" }}
            autoFocus
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              💡 Press <strong>Ctrl + Enter</strong> to submit directly.
            </span>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || !answerText.trim()}
              style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}
            >
              {isSubmitting
                ? "Evaluating Answer..."
                : currentQuestion?.position === session?.question_limit
                ? "Submit & Finish Interview 🏁"
                : "Submit & Next Question →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewRoom;
