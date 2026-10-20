import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #050907 0%, #030604 100%)",
        borderTop: "1px solid rgba(150, 255, 195, 0.12)",
        padding: "4.5rem 6% 2.5rem",
        color: "var(--text-muted)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(98, 245, 160, 0.12)",
                border: "1px solid rgba(98, 245, 160, 0.28)",
                display: "grid",
                placeItems: "center",
                color: "#62F5A0",
                fontWeight: 800,
                fontSize: "14px",
              }}
            >
              AI
            </span>
            <strong style={{ fontSize: "1.2rem", color: "#fff", letterSpacing: "-0.015em" }}>
              Interview<span style={{ color: "var(--accent-mint)" }}>AI</span>
            </strong>
          </div>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.65, maxWidth: "300px", color: "var(--text-muted)" }}>
            The candidate-first AI interview simulator. Realistic questions, instant scoring, and tailored DSA practice.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "1.1rem", letterSpacing: "0.06em" }}>
            PRACTICE
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.65rem", fontSize: "0.88rem" }}>
            <li>
              <Link to="/interview" style={{ color: "inherit", transition: "color 0.2s" }}>
                🎙️ Mock Interview
              </Link>
            </li>
            <li>
              <Link to="/dsa" style={{ color: "inherit", transition: "color 0.2s" }}>
                ⚡ DSA Practice
              </Link>
            </li>
            <li>
              <Link to="/results" style={{ color: "inherit", transition: "color 0.2s" }}>
                📊 Evaluation & Rubric
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ color: "inherit", transition: "color 0.2s" }}>
                📈 Performance Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "1.1rem", letterSpacing: "0.06em" }}>
            PLATFORM
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.65rem", fontSize: "0.88rem" }}>
            <li>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  window.__lenis?.scrollTo("#features", { offset: -80 });
                }}
                style={{ color: "inherit" }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  window.__lenis?.scrollTo("#how-it-works", { offset: -80 });
                }}
                style={{ color: "inherit" }}
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  window.__lenis?.scrollTo("#pricing", { offset: -80 });
                }}
                style={{ color: "inherit" }}
              >
                Pricing Plans
              </a>
            </li>
            <li>
              <Link to="/admin" style={{ color: "inherit" }}>
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "1.1rem", letterSpacing: "0.06em" }}>
            STAY CONNECTED
          </h4>
          <p style={{ fontSize: "0.88rem", marginBottom: "1.2rem", color: "var(--text-muted)" }}>
            Ready to ace your next technical or behavioral round?
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              background: "rgba(98, 245, 160, 0.08)",
              border: "1px solid rgba(150, 255, 195, 0.22)",
              color: "var(--accent-mint)",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ↑ Back to Top
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(150, 255, 195, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.82rem",
        }}
      >
        <div>© {new Date().getFullYear()} InterviewAI Inc. All rights reserved.</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security</span>
        </div>
      </div>
    </footer>
  );
}
