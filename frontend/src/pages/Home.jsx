import { useState } from "react";
import { Link } from "react-router-dom";
import HoloHero from "../components/HoloHero";
import InterviewSimulationPreview from "../components/InterviewSimulationPreview";
import Reveal from "../components/Reveal";
import Footer from "../components/Footer";
import { features, howItWorksSteps, pricingPlans, faqItems } from "../data/mockData";

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleScrollTo = (selector) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(selector, { offset: -80 });
    } else {
      const el = document.querySelector(selector);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-main)", overflow: "hidden" }}>
      {/* 3D Emerald Torus & Hero Section */}
      <HoloHero />

      {/* Quick Jump Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1rem",
          borderTop: "1px solid var(--border-glass, rgba(150, 255, 195, 0.15))",
          borderBottom: "1px solid var(--border-glass, rgba(150, 255, 195, 0.15))",
          background: "var(--bg-card, rgba(5, 9, 7, 0.88))",
          backdropFilter: "blur(14px)",
          position: "sticky",
          top: 0,
          zIndex: 80,
          fontSize: "0.9rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => handleScrollTo("#simulation-preview")}
          style={{ background: "none", border: "none", color: "var(--accent-lime, #94FF00)", cursor: "pointer", fontWeight: 700 }}
        >
          Simulation Preview
        </button>
        <button
          type="button"
          onClick={() => handleScrollTo("#features")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          Capabilities
        </button>
        <button
          type="button"
          onClick={() => handleScrollTo("#how-it-works")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          Process
        </button>
        <button
          type="button"
          onClick={() => handleScrollTo("#pricing")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          Pricing
        </button>
        <Link to="/dsa" style={{ color: "var(--accent-mint)", fontWeight: 700, textDecoration: "none" }}>
          DSA Arena →
        </Link>
        <Link to="/interview" style={{ color: "var(--accent-mint-soft)", fontWeight: 700, textDecoration: "none" }}>
          Live Mock →
        </Link>
      </nav>

      {/* ── INTERACTIVE PRODUCT PREVIEW SECTION ── */}
      <InterviewSimulationPreview />

      {/* ── BENTO OVERVIEW SECTION (Matching Reference Section 1) ── */}
      <section id="features" style={{ padding: "6rem 4% 4rem", maxWidth: "1320px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#FFFFFF",
                maxWidth: "880px",
                margin: 0,
              }}
            >
              From <span style={{ color: "var(--accent-mint)" }}>preparation</span> to{" "}
              <span style={{ color: "var(--accent-mint)" }}>offer</span>, our tools are{" "}
              <span className="italic-accent">designed to unlock what&apos;s next</span>
            </h2>
          </div>
        </Reveal>

        {/* 2-Column Bento Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "stretch",
          }}
        >
          {/* Left Column: Big Highlight Metric Card (Reference Style) */}
          <Reveal>
            <div
              className="glass-panel"
              style={{
                padding: "3rem 2.5rem",
                borderRadius: "28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                background: "linear-gradient(145deg, rgba(16, 24, 22, 0.9) 0%, rgba(8, 14, 11, 0.95) 100%)",
                border: "1px solid rgba(150, 255, 195, 0.18)",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--accent-mint)",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "1rem",
                  }}
                >
                  ENGINEERED PERFORMANCE
                </span>

                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(3.5rem, 5.5vw, 5rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "#FFFFFF",
                    marginBottom: "0.5rem",
                  }}
                >
                  4-Pillar
                </div>
                <div style={{ color: "var(--accent-lime, #94FF00)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                  Granular Rubric Evaluation
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 2rem" }}>
                  We engineer realistic, multi-turn AI interview simulations that test architectural depth, analyze live speech delivery, and benchmark code correctness against tier-1 engineering standards.
                </p>

                {/* Sub-Metrics Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div style={{ padding: "1.2rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(150, 255, 195, 0.1)" }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#94FF00" }}>Adaptive</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "0.2rem" }}>Dynamic Questioning</div>
                  </div>
                  <div style={{ padding: "1.2rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(150, 255, 195, 0.1)" }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#00F5B8" }}>Real-time</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "0.2rem" }}>Rubric Feedback</div>
                  </div>
                </div>
              </div>

              <Link to="/interview" className="pill-btn-primary" style={{ width: "fit-content" }}>
                <span>Start Practice</span>
                <span className="arrow-circle">↗</span>
              </Link>
            </div>
          </Reveal>

          {/* Right Column: 2x2 Feature Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div
                  className="glass-panel"
                  style={{
                    padding: "1.8rem",
                    borderRadius: "22px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "2rem" }}>{f.icon}</span>
                      <span className="pill-tag" style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem" }}>
                        {f.tag}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.2rem", color: "#FFFFFF", marginBottom: "0.6rem", fontWeight: 700 }}>
                      {f.title}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                      {f.description}
                    </p>
                  </div>
                  <div
                    style={{
                      height: "2px",
                      width: "35px",
                      background: "var(--accent-mint)",
                      borderRadius: "2px",
                      marginTop: "1.5rem",
                    }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION (Matching Reference Section 2) ── */}
      <section id="how-it-works" style={{ padding: "6rem 4%", maxWidth: "1320px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "3.5rem" }}>
            <span className="pill-tag" style={{ marginBottom: "1rem" }}>
              HOW IT WORKS
            </span>
            <h2
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              From <span style={{ color: "var(--accent-mint)" }}>setup</span> to{" "}
              <span className="italic-accent">dream offer</span>
            </h2>
            <p style={{ maxWidth: "580px", margin: "0.8rem 0 0", color: "var(--text-muted)", fontSize: "1rem" }}>
              Our methodology is transparent, repeatable, and tailored to give you an unfair advantage in technical interviews.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {howItWorksSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 120}>
              <div
                className="glass-panel"
                style={{
                  padding: "2.2rem 2rem",
                  borderRadius: "24px",
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: 900,
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(98, 245, 160, 0.45)",
                      lineHeight: 1,
                      marginBottom: "1.2rem",
                    }}
                  >
                    {s.step}
                  </div>
                  <h3 style={{ fontSize: "1.25rem", color: "#FFFFFF", marginBottom: "0.6rem", fontWeight: 700 }}>
                    {s.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.65, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
                <div>
                  <span className="pill-tag" style={{ marginTop: "1.5rem", fontSize: "0.75rem" }}>
                    {s.badge}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING PLANS (Matching Reference Section 3) ── */}
      <section id="pricing" style={{ padding: "6rem 4%", maxWidth: "1320px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span className="pill-tag" style={{ marginBottom: "1rem" }}>
              TRANSPARENT PLANS
            </span>
            <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>
              Pricing <span style={{ color: "var(--accent-mint)" }}>Plans</span> —{" "}
              <span className="italic-accent">for every stage of your growth</span>
            </h2>
            <p style={{ maxWidth: "560px", margin: "0.8rem auto 0", color: "var(--text-muted)", fontSize: "1rem" }}>
              Practice mock rounds, benchmark your algorithm skills, and follow personalized roadmaps.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "2rem",
            alignItems: "stretch",
          }}
        >
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 120}>
              <div
                className="glass-panel"
                style={{
                  padding: "2.8rem 2.2rem",
                  borderRadius: "26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  position: "relative",
                  border: plan.popular ? "2px solid #62F5A0" : "1px solid rgba(150, 255, 195, 0.14)",
                  boxShadow: plan.popular
                    ? "0 20px 60px rgba(98, 245, 160, 0.18), var(--shadow-glass)"
                    : "var(--shadow-glass)",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "0.3rem 1.1rem",
                      background: "var(--accent-mint)",
                      color: "#050907",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      borderRadius: "999px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Recommended
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: "1.45rem", color: "#FFFFFF", marginBottom: "0.5rem", fontWeight: 700 }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.75rem", minHeight: "40px" }}>
                    {plan.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "2rem" }}>
                    <span style={{ fontSize: "3rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>/{plan.period}</span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "grid", gap: "0.85rem" }}>
                    {plan.features.map((feat) => (
                      <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.92rem", color: "var(--text-main)" }}>
                        <span style={{ color: "var(--accent-mint)", fontWeight: 800 }}>✔</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  className={plan.popular ? "pill-btn-primary" : "pill-btn-ghost"}
                  style={{ width: "100%", textAlign: "center", justifyContent: "center" }}
                >
                  {plan.cta} {plan.popular && "↗"}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EVALUATION METHODOLOGY (Replacing Fake Testimonials) ── */}
      <section id="rubric-methodology" style={{ padding: "5rem 4% 6rem", maxWidth: "1320px", margin: "0 auto" }}>
        <Reveal>
          <div
            className="glass-panel"
            style={{
              padding: "clamp(2.5rem, 5vw, 4.5rem)",
              borderRadius: "32px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3rem",
              alignItems: "center",
              background: "linear-gradient(145deg, rgba(10, 30, 26, 0.95) 0%, rgba(6, 18, 15, 0.98) 100%)",
              border: "1px solid rgba(0, 245, 184, 0.25)",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 245, 184, 0.12)",
            }}
          >
            <div>
              <span className="pill-tag" style={{ marginBottom: "1rem" }}>
                EVALUATION FRAMEWORK
              </span>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0 0 1rem", color: "#FFFFFF" }}>
                How Your Responses Are Evaluated —{" "}
                <span className="italic-accent">Objective engineering criteria.</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, margin: "0 0 2rem" }}>
                Every answer is analyzed across standard technical dimensions without subjective bias. Detailed rubric breakdowns help you pinpoint exact growth areas before actual interview loops.
              </p>
              <Link to="/interview" className="pill-btn-primary">
                <span>Start Practice</span>
                <span className="arrow-circle">→</span>
              </Link>
            </div>

            {/* Rubric Breakdown Grid */}
            <div
              style={{
                padding: "2.2rem",
                borderRadius: "24px",
                background: "rgba(3, 9, 7, 0.75)",
                border: "1px solid rgba(0, 245, 184, 0.2)",
                display: "grid",
                gap: "1.1rem",
              }}
            >
              {[
                { name: "Technical Accuracy", desc: "Correctness of algorithmic logic, API usage, and system boundaries" },
                { name: "System Depth", desc: "Understanding of failure modes, concurrency, scalability, and latency" },
                { name: "Reasoning Structure", desc: "Clear step-by-step problem breakdown from requirements to solution" },
                { name: "Trade-off Analysis", desc: "Explicit comparison of competing approaches, costs, and constraints" },
                { name: "Communication Clarity", desc: "Structured, concise technical articulation without rambling" },
              ].map((dim) => (
                <div key={dim.name} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--accent-mint)",
                      marginTop: "0.45rem",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <strong style={{ color: "#FFFFFF", fontSize: "0.95rem", display: "block" }}>{dim.name}</strong>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.5 }}>{dim.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FAQ SECTION (Matching Navbar Link #faq) ── */}
      <section id="faq" style={{ padding: "5rem 4% 6rem", maxWidth: "980px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="pill-tag" style={{ marginBottom: "1rem" }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>
              Everything You Need to <span style={{ color: "var(--accent-mint)" }}>Know</span>
            </h2>
            <p style={{ maxWidth: "520px", margin: "0.8rem auto 0", color: "var(--text-muted)", fontSize: "1rem" }}>
              Answers to common questions about mock interview scoring, speech recognition, and preparation tracks.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gap: "1rem" }}>
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <Reveal key={idx} delay={idx * 60}>
                <div
                  className="glass-panel"
                  style={{
                    borderRadius: "18px",
                    border: isOpen ? "1px solid var(--accent-mint)" : "1px solid rgba(0, 245, 184, 0.2)",
                    background: isOpen ? "rgba(10, 30, 26, 0.85)" : "rgba(10, 30, 26, 0.55)",
                    transition: "all 0.25s ease",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    style={{
                      width: "100%",
                      padding: "1.35rem 1.75rem",
                      background: "none",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      cursor: "pointer",
                      textAlign: "left",
                      color: isOpen ? "#FFFFFF" : "var(--text-main)",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                    }}
                  >
                    <span>{item.q}</span>
                    <span
                      style={{
                        color: "var(--accent-mint)",
                        fontSize: "1.4rem",
                        lineHeight: 1,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 1.75rem 1.5rem", color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION BANNER ── */}
      <section style={{ padding: "0 4% 6rem", maxWidth: "1320px", margin: "0 auto" }}>
        <Reveal>
          <div
            className="glass-panel"
            style={{
              padding: "4.5rem 2rem",
              borderRadius: "32px",
              textAlign: "center",
              background: "radial-gradient(ellipse at 50% 0%, rgba(148, 255, 0, 0.16), transparent 70%), rgba(10, 30, 26, 0.75)",
              border: "1px solid rgba(148, 255, 0, 0.35)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(148, 255, 0, 0.15)",
            }}
          >
            <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 800, margin: "0 0 1rem", color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Build confidence <span style={{ color: "var(--accent-lime, #94FF00)" }}>before the real interview.</span>
            </h2>
            <p style={{ maxWidth: "620px", margin: "0 auto 2.2rem", color: "var(--text-muted, #9CB5AD)", fontSize: "1.08rem", lineHeight: 1.65 }}>
              Practice in a risk-free environment with intelligent feedback designed to turn interview anxiety into offer letters.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                to="/interview"
                className="hero-pill-btn hero-pill-btn--primary"
                style={{
                  display: "inline-flex",
                  padding: "0.95rem 2.5rem",
                  fontSize: "1.05rem",
                  borderRadius: "9999px",
                  background: "var(--accent-mint, #00F5B8)",
                  color: "#030907",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 10px 30px rgba(0, 245, 184, 0.4)",
                }}
              >
                Start Your First Interview Free →
              </Link>
              <Link
                to="/dsa"
                className="hero-pill-btn hero-pill-btn--ghost"
                style={{
                  padding: "0.95rem 2rem",
                  fontSize: "1.05rem",
                }}
              >
                Explore DSA Arena
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
