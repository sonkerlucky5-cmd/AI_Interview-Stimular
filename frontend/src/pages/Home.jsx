import { Link } from "react-router-dom";
import HoloHero from "../components/HoloHero";
import Reveal from "../components/Reveal";
import Footer from "../components/Footer";
import { features, howItWorksSteps, pricingPlans } from "../data/mockData";

export default function Home() {
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
      {/* 3D Holo Cards Hero Section */}
      <HoloHero />

      {/* Quick Jump Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          background: "rgba(11, 13, 26, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 80,
          fontSize: "0.9rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => handleScrollTo("#features")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          ⚡ Features
        </button>
        <button
          type="button"
          onClick={() => handleScrollTo("#how-it-works")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          🎯 How It Works
        </button>
        <button
          type="button"
          onClick={() => handleScrollTo("#pricing")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          💎 Pricing
        </button>
        <Link to="/dsa" style={{ color: "var(--accent-cyan)", fontWeight: 700, textDecoration: "none" }}>
          DSA Arena →
        </Link>
        <Link to="/interview" style={{ color: "var(--accent-pink)", fontWeight: 700, textDecoration: "none" }}>
          Live Mock →
        </Link>
      </nav>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{ padding: "6rem 6% 4rem", maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span
              style={{
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--accent-cyan)",
                fontWeight: 700,
                padding: "0.3rem 0.85rem",
                borderRadius: "999px",
                background: "rgba(0, 255, 208, 0.1)",
                border: "1px solid rgba(0, 255, 208, 0.25)",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              Core Capabilities
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, margin: 0, color: "#fff" }}>
              Engineered for High-Stakes Tech Rounds
            </h2>
            <p style={{ maxWidth: "600px", margin: "1rem auto 0", color: "var(--text-muted)", fontSize: "1.05rem" }}>
              Practice realistic questions across data structures, system design, and behavioral frameworks.
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
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div
                className="glass-panel"
                style={{
                  padding: "2rem",
                  borderRadius: "20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "2.2rem" }}>{f.icon}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "999px",
                        background: "rgba(123, 97, 255, 0.15)",
                        color: "var(--accent-violet)",
                        fontWeight: 700,
                        border: "1px solid rgba(123, 97, 255, 0.3)",
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem", fontWeight: 700 }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
                    {f.description}
                  </p>
                </div>
                <div
                  style={{
                    height: "3px",
                    width: "40px",
                    background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
                    borderRadius: "2px",
                    marginTop: "1.5rem",
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "5rem 6%", maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span
              style={{
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--accent-violet)",
                fontWeight: 700,
                padding: "0.3rem 0.85rem",
                borderRadius: "999px",
                background: "rgba(123, 97, 255, 0.1)",
                border: "1px solid rgba(123, 97, 255, 0.25)",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              Process Flow
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, margin: 0, color: "#fff" }}>
              How InterviewAI Works
            </h2>
            <p style={{ maxWidth: "540px", margin: "1rem auto 0", color: "var(--text-muted)", fontSize: "1.05rem" }}>
              Go from zero to interview-ready in 3 seamless steps.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {howItWorksSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 150}>
              <div
                className="glass-panel"
                style={{
                  padding: "2.25rem",
                  borderRadius: "24px",
                  position: "relative",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(0, 255, 208, 0.5)",
                    lineHeight: 1,
                    marginBottom: "1rem",
                  }}
                >
                  {s.step}
                </div>
                <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "0.75rem", fontWeight: 700 }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "1.5rem",
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "var(--accent-cyan)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {s.badge}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING PLANS ── */}
      <section id="pricing" style={{ padding: "5rem 6%", maxWidth: "1280px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span
              style={{
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--accent-pink)",
                fontWeight: 700,
                padding: "0.3rem 0.85rem",
                borderRadius: "999px",
                background: "rgba(255, 110, 199, 0.1)",
                border: "1px solid rgba(255, 110, 199, 0.25)",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              Subscription
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 800, margin: 0, color: "#fff" }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ maxWidth: "500px", margin: "1rem auto 0", color: "var(--text-muted)", fontSize: "1.05rem" }}>
              Get unlimited interviews and DSA practice. Cancel anytime.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            alignItems: "stretch",
          }}
        >
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 120}>
              <div
                className="glass-panel"
                style={{
                  padding: "2.5rem 2rem",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  position: "relative",
                  border: plan.popular ? "2px solid rgba(0, 255, 208, 0.5)" : "var(--border-glass)",
                  boxShadow: plan.popular
                    ? "0 20px 60px rgba(0, 255, 208, 0.15), var(--shadow-glass)"
                    : "var(--shadow-glass)",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-13px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "0.25rem 0.85rem",
                      background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
                      color: "#05060f",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      borderRadius: "999px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: "1.4rem", color: "#fff", marginBottom: "0.5rem", fontWeight: 700 }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                    {plan.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "2rem" }}>
                    <span style={{ fontSize: "2.8rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>/{plan.period}</span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "grid", gap: "0.85rem" }}>
                    {plan.features.map((feat) => (
                      <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem", color: "var(--text-main)" }}>
                        <span style={{ color: "var(--accent-cyan)", fontWeight: 800 }}>✔</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/register"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.9rem",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    background: plan.popular ? "linear-gradient(90deg, #00ffd0, #7b61ff)" : "rgba(255, 255, 255, 0.08)",
                    color: plan.popular ? "#05060f" : "#fff",
                    border: plan.popular ? "none" : "1px solid rgba(255, 255, 255, 0.15)",
                    transition: "transform 0.2s",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "5rem 6% 6rem", maxWidth: "1000px", margin: "0 auto" }}>
        <Reveal>
          <div
            className="glass-panel"
            style={{
              padding: "clamp(2rem, 5vw, 4rem)",
              borderRadius: "32px",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(123, 97, 255, 0.15) 0%, rgba(0, 255, 208, 0.1) 100%), #10142a",
              border: "1px solid rgba(0, 255, 208, 0.3)",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(123, 97, 255, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--accent-cyan)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Get Started In Seconds
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0.75rem 0 1.25rem", color: "#fff" }}>
              Ready to Land Your Dream Offer?
            </h2>
            <p style={{ maxWidth: "500px", margin: "0 auto 2rem", color: "var(--text-muted)", fontSize: "1.05rem" }}>
              Join thousands of engineers practicing with real-time AI feedback and curated DSA challenges.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link
                to="/interview"
                style={{
                  padding: "0.95rem 2rem",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
                  color: "#05060f",
                  fontWeight: 800,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Start Practice Interview →
              </Link>
              <Link
                to="/dsa"
                style={{
                  padding: "0.95rem 2rem",
                  borderRadius: "999px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Solve DSA Problems
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
