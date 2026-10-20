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
      {/* 3D Emerald Torus & Hero Section */}
      <HoloHero />

      {/* Quick Jump Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1rem",
          borderTop: "1px solid rgba(150, 255, 195, 0.1)",
          borderBottom: "1px solid rgba(150, 255, 195, 0.1)",
          background: "rgba(5, 9, 7, 0.85)",
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
          onClick={() => handleScrollTo("#overview")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}
        >
          Overview
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
          Live Mock 🎙️
        </Link>
      </nav>

      {/* ── BENTO OVERVIEW SECTION (Matching Reference Section 1) ── */}
      <section id="overview" style={{ padding: "6rem 4% 4rem", maxWidth: "1320px", margin: "0 auto" }}>
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
                    fontSize: "clamp(3.8rem, 6vw, 5.5rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "#FFFFFF",
                    marginBottom: "0.5rem",
                  }}
                >
                  20k+
                </div>
                <div style={{ color: "var(--accent-mint)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                  Practice Questions Completed
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 2rem" }}>
                  We engineer realistic interview simulations that help software engineers think faster, answer with architectural precision, and speak with unwavering confidence.
                </p>

                {/* Sub-Metrics Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div style={{ padding: "1.2rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(150, 255, 195, 0.1)" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF" }}>130k+</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "0.2rem" }}>Evaluations Run</div>
                  </div>
                  <div style={{ padding: "1.2rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(150, 255, 195, 0.1)" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF" }}>24+</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", marginTop: "0.2rem" }}>Roles Covered</div>
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
                    Best Deal ⭐
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

      {/* ── TESTIMONIALS (Matching Reference Section 4) ── */}
      <section style={{ padding: "5rem 4% 6rem", maxWidth: "1320px", margin: "0 auto" }}>
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
              background: "linear-gradient(145deg, rgba(16, 24, 22, 0.95) 0%, rgba(8, 14, 11, 0.98) 100%)",
              border: "1px solid rgba(150, 255, 195, 0.2)",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(98, 245, 160, 0.12)",
            }}
          >
            <div>
              <span className="pill-tag" style={{ marginBottom: "1rem" }}>
                COMMUNITY SUCCESS
              </span>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0 0 1rem", color: "#FFFFFF" }}>
                What Our Candidates Say —{" "}
                <span className="italic-accent">Real engineers. Real results.</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, margin: "0 0 2rem" }}>
                Join engineers practicing across Frontend, Backend, System Design, and Behavioral tracks.
              </p>
              <Link to="/interview" className="pill-btn-primary">
                <span>Start Free Practice</span>
                <span className="arrow-circle">↗</span>
              </Link>
            </div>

            {/* Testimonial Quote Card */}
            <div
              style={{
                padding: "2.2rem",
                borderRadius: "24px",
                background: "rgba(5, 9, 7, 0.75)",
                border: "1px solid rgba(150, 255, 195, 0.16)",
              }}
            >
              <div style={{ color: "var(--accent-mint)", fontSize: "1.2rem", marginBottom: "1rem" }}>
                ★★★★★
              </div>
              <p style={{ color: "#E2E8F0", fontSize: "1.05rem", lineHeight: 1.65, fontStyle: "italic", margin: "0 0 1.5rem" }}>
                &ldquo;The real-time speech dictation and rubric score breakdowns helped me identify my weak spots in system design before my Google round. Landed the L5 offer!&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "var(--accent-mint)",
                    color: "#050907",
                    fontWeight: 800,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  SK
                </div>
                <div>
                  <strong style={{ color: "#FFFFFF", display: "block", fontSize: "0.95rem" }}>Sarah K.</strong>
                  <span style={{ color: "var(--accent-mint)", fontSize: "0.82rem" }}>Senior Full Stack Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
