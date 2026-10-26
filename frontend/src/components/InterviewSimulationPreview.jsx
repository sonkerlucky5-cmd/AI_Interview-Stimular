import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

function TrackIcon({ id }) {
  if (id === "backend") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    );
  }
  if (id === "dsa") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

const SIMULATION_TRACKS = [
  {
    id: "backend",
    label: "Backend Systems",
    level: "Senior Systems Engineer (L5 / IC4)",
    timer: "04:18",
    question:
      "How would you prevent cache stampede in a high-traffic microservices cluster, and what are the trade-offs between mutex locking and probabilistic early expiration (XFetch)?",
    transcript:
      "“To prevent thundering herd on cache expiration, we utilize the XFetch algorithm. When a worker computes that remaining TTL is less than delta * beta * log(random()), it preemptively regenerates the cache key in background before actual eviction occurs, achieving zero spike on the primary database...”",
    codeSnippet: `// Probabilistic Early Expiration (XFetch Algorithm)
function shouldRegenerate(key, ttlSeconds, beta = 1.0) {
  const delta = computeGenerationTime(key); // e.g. 120ms
  const randomVal = Math.random();
  // XFetch early refresh decision
  return -delta * beta * Math.log(randomVal) >= ttlSeconds;
}`,
    scores: [
      { name: "Technical Accuracy", val: 94, color: "#94FF00" },
      { name: "System Architecture", val: 92, color: "#00F5B8" },
      { name: "Communication & Pacing", val: 89, color: "#10B981" },
      { name: "Edge Case Handling", val: 95, color: "#94FF00" },
    ],
    aiInsight:
      "Strong breakdown of XFetch probability distribution. Excellent point on asynchronous background mutex lock to prevent redundant re-computations under high QPS.",
  },
  {
    id: "dsa",
    label: "DSA & Algorithms",
    level: "Full-Stack / Algorithms Track",
    timer: "08:42",
    question:
      "Design an LRU Cache with O(1) get and put operations, and explain how doubly linked list nodes are managed concurrently under thread contention.",
    transcript:
      "“We combine a Hash Map with a Doubly Linked List. The hash map maps keys to node pointers for O(1) retrieval, while the doubly linked list maintains usage order. When a node is accessed, we detach it and move it to the head in O(1)...”",
    codeSnippet: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  // O(1) get and put with pointer updates
}`,
    scores: [
      { name: "Time Complexity", val: 98, color: "#94FF00" },
      { name: "Space Complexity", val: 94, color: "#00F5B8" },
      { name: "Code Cleanliness", val: 91, color: "#10B981" },
      { name: "Concurrency Awareness", val: 88, color: "#94FF00" },
    ],
    aiInsight:
      "Optimal O(1) design. Candidate proactively identified sentinel dummy nodes to eliminate null checks for head and tail updates.",
  },
  {
    id: "frontend",
    label: "Frontend Architecture",
    level: "Staff Frontend Architect",
    timer: "06:05",
    question:
      "How would you optimize Interaction to Next Paint (INP) on a dashboard rendering 10,000 live streaming price ticks per second?",
    transcript:
      "“We decouple the WebSocket packet stream from the React rendering tree using a requestAnimationFrame batch buffer and web workers. We use OffscreenCanvas or CSS transform layers so main thread event handlers remain under 16ms...”",
    codeSnippet: `// Batching high-frequency telemetry ticks
const buffer = [];
function onWebSocketTick(tick) {
  buffer.push(tick);
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(flushBatchUpdates);
  }
}`,
    scores: [
      { name: "Core Web Vitals", val: 96, color: "#94FF00" },
      { name: "Rendering Pipeline", val: 93, color: "#00F5B8" },
      { name: "Main Thread Offloading", val: 90, color: "#10B981" },
      { name: "State Architecture", val: 94, color: "#94FF00" },
    ],
    aiInsight:
      "Exceptional grasp of the browser event loop, layout thrashing prevention, and CSS containment to minimize reflow triggers.",
  },
  {
    id: "behavioral",
    label: "Behavioral & Leadership",
    icon: "🤝",
    level: "Engineering Management & Leadership",
    timer: "05:30",
    question:
      "Describe a situation where engineering priorities conflicted with tight marketing deadlines. How did you resolve the trade-off without incurring catastrophic tech debt?",
    transcript:
      "“I structured our discussion around customer SLA risk rather than pure code purity. We carved out a phased delivery: Phase 1 shipped the core revenue flow on an isolated feature flag, while Phase 2 hard-scheduled refactoring in the very next sprint with sign-off from Product...”",
    codeSnippet: `// Phased Scope Matrix:
// Phase 1 (Launch): Core Checkout flow + Observability
// Phase 2 (Hard-scheduled sprint N+1): Schema normalization, load testing
// Decision: Feature-flagged rollback with 99.95% error budget threshold`,
    scores: [
      { name: "STAR Method Structure", val: 95, color: "#94FF00" },
      { name: "Stakeholder Alignment", val: 92, color: "#00F5B8" },
      { name: "Risk Management", val: 94, color: "#10B981" },
      { name: "Empathy & Leadership", val: 91, color: "#94FF00" },
    ],
    aiInsight:
      "Clear STAR structure with quantifiable risk management. Great emphasis on constructive cross-functional negotiation rather than defensive engineering silos.",
  },
];

export default function InterviewSimulationPreview() {
  const [activeTab, setActiveTab] = useState("backend");
  const current = SIMULATION_TRACKS.find((t) => t.id === activeTab) || SIMULATION_TRACKS[0];

  return (
    <section
      id="simulation-preview"
      style={{
        padding: "5rem 4% 6rem",
        maxWidth: "1320px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              background: "rgba(148, 255, 0, 0.08)",
              border: "1px solid rgba(148, 255, 0, 0.28)",
              color: "var(--accent-lime, #94FF00)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            <span>⚡ REAL-TIME SIMULATION ENGINE</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
              fontWeight: 800,
              color: "var(--text-main, #FFFFFF)",
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Experience the <span style={{ color: "var(--accent-lime, #94FF00)" }}>Simulation Terminal</span>
          </h2>

          <p
            style={{
              maxWidth: "640px",
              margin: "0.9rem auto 0",
              color: "var(--text-muted, #9CB5AD)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            Inspect how NEXA AI analyzes speech, evaluates code structure, and produces
            frame-by-frame rubric feedback in real-time.
          </p>

          {/* Interactive Track Tabs */}
          <div
            style={{
              display: "inline-flex",
              gap: "0.5rem",
              padding: "0.4rem",
              borderRadius: "999px",
              background: "rgba(10, 30, 26, 0.75)",
              border: "1px solid rgba(0, 245, 184, 0.25)",
              backdropFilter: "blur(16px)",
              marginTop: "2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {SIMULATION_TRACKS.map((track) => {
              const active = track.id === activeTab;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setActiveTab(track.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.55rem 1.15rem",
                    borderRadius: "999px",
                    border: active ? "1px solid #94FF00" : "1px solid transparent",
                    background: active ? "rgba(148, 255, 0, 0.16)" : "transparent",
                    color: active ? "#94FF00" : "var(--text-muted, #9CB5AD)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <TrackIcon id={track.id} />
                  <span>{track.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ── Terminal Window Container ── */}
      <Reveal delay={120}>
        <div
          className="glass-panel"
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(0, 245, 184, 0.28)",
            background: "linear-gradient(150deg, rgba(8, 24, 20, 0.94) 0%, rgba(4, 12, 10, 0.98) 100%)",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.7), 0 0 40px rgba(148, 255, 0, 0.12)",
            overflow: "hidden",
          }}
        >
          {/* Terminal Title Bar */}
          <div
            style={{
              padding: "1rem 1.6rem",
              background: "rgba(5, 15, 12, 0.85)",
              borderBottom: "1px solid rgba(0, 245, 184, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F56" }} />
                <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FFBD2E" }} />
                <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#27C93F" }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                  fontSize: "0.82rem",
                  color: "var(--accent-lime, #94FF00)",
                  fontWeight: 600,
                }}
              >
                NEXA_TERMINAL_v2.5 // {current.label.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "999px",
                  background: "rgba(148, 255, 0, 0.12)",
                  border: "1px solid rgba(148, 255, 0, 0.35)",
                  color: "var(--accent-lime, #94FF00)",
                }}
              >
                Demo preview
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", color: "#94FF00" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#94FF00",
                    boxShadow: "0 0 8px #94FF00",
                  }}
                />
                <span style={{ fontWeight: 700, letterSpacing: "0.05em" }}>LIVE AI EVALUATION</span>
              </div>

              <div
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "0.78rem",
                  fontFamily: "monospace",
                  color: "var(--text-muted, #9CB5AD)",
                }}
              >
                SESSION: {current.timer}
              </div>
            </div>
          </div>

          {/* Terminal Main Body Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "1.75rem",
              padding: "clamp(1rem, 2.5vw, 2rem)",
            }}
          >
            {/* Left Column: AI Question & Audio Speech Visualizer */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Question Card */}
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  background: "rgba(10, 30, 26, 0.7)",
                  border: "1px solid rgba(0, 245, 184, 0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: "rgba(148, 255, 0, 0.15)",
                        border: "1px solid rgba(148, 255, 0, 0.4)",
                        color: "#94FF00",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                      }}
                    >
                      Q
                    </span>
                    <strong style={{ fontSize: "0.88rem", color: "#F5FFFC" }}>Interviewer Prompt</strong>
                  </div>
                  <span
                    style={{
                      fontSize: "0.74rem",
                      color: "var(--accent-mint, #00F5B8)",
                      background: "rgba(0, 245, 184, 0.1)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      fontWeight: 600,
                    }}
                  >
                    {current.level}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.6, color: "#FFFFFF", fontWeight: 600 }}>
                  &ldquo;{current.question}&rdquo;
                </p>
              </div>

              {/* Candidate Voice Transcription & Animated Waveform */}
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  background: "rgba(6, 18, 15, 0.8)",
                  border: "1px solid rgba(148, 255, 0, 0.22)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>🎙️</span>
                    <strong style={{ fontSize: "0.85rem", color: "#F5FFFC" }}>Live Speech Transcription</strong>
                  </div>

                  {/* Simulated Waveform Bars */}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "18px" }}>
                    {[12, 18, 8, 22, 14, 20, 10, 24, 16, 8, 19, 11].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          width: "3px",
                          height: `${h}px`,
                          borderRadius: "2px",
                          background: "#94FF00",
                          opacity: 0.85,
                          animation: `pulseWave 1.2s ease-in-out infinite ${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "var(--text-muted, #9CB5AD)",
                    fontStyle: "italic",
                  }}
                >
                  {current.transcript}
                </p>
              </div>

              {/* AI Real-Time Feedback Coach Insight */}
              <div
                style={{
                  padding: "1.35rem",
                  borderRadius: "18px",
                  background: "rgba(148, 255, 0, 0.05)",
                  border: "1px solid rgba(148, 255, 0, 0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#94FF00", fontSize: "1.1rem" }}>💡</span>
                  <strong style={{ fontSize: "0.85rem", color: "#94FF00", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    AI Evaluator Note
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#E2E8F0", lineHeight: 1.55 }}>
                  {current.aiInsight}
                </p>
              </div>
            </div>

            {/* Right Column: Code Studio & Live Rubric Scorecard */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Code Snippet Box */}
              <div
                style={{
                  padding: "1.4rem",
                  borderRadius: "20px",
                  background: "rgba(3, 9, 7, 0.88)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: 'var(--font-mono, "JetBrains Mono", Consolas, monospace)',
                  fontSize: "0.84rem",
                  lineHeight: 1.6,
                  color: "#94FF00",
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "0.74rem", marginBottom: "0.8rem" }}>
                  <span>candidate_response.js</span>
                  <span>JavaScript (ES2024)</span>
                </div>
                <pre style={{ margin: 0, color: "#E2E8F0" }}>
                  <code>{current.codeSnippet}</code>
                </pre>
              </div>

              {/* Rubric Scorecard */}
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  background: "rgba(10, 30, 26, 0.7)",
                  border: "1px solid rgba(0, 245, 184, 0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
                  <strong style={{ fontSize: "0.92rem", color: "#FFFFFF" }}>Instant Rubric Scorecard</strong>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "#94FF00",
                    }}
                  >
                    93% Overall
                  </span>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {current.scores.map((score) => (
                    <div key={score.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.35rem" }}>
                        <span style={{ color: "var(--text-muted, #9CB5AD)" }}>{score.name}</span>
                        <span style={{ fontWeight: 800, color: score.color }}>{score.val}%</span>
                      </div>
                      <div
                        style={{
                          height: "7px",
                          borderRadius: "999px",
                          background: "rgba(255, 255, 255, 0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${score.val}%`,
                            height: "100%",
                            background: `linear-gradient(90deg, #00F5B8 0%, ${score.color} 100%)`,
                            borderRadius: "999px",
                            boxShadow: `0 0 10px ${score.color}`,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Full Interview CTA */}
              <Link
                to="/interview"
                className="hero-pill-btn hero-pill-btn--primary"
                style={{
                  width: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                  padding: "0.95rem 1.5rem",
                  fontSize: "1rem",
                }}
              >
                <span>Launch This Simulation Track</span>
                <span className="hero-pill-btn__arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
