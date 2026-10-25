import { Link } from "react-router-dom";
import NexaLogo from "./NexaLogo";

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
        background: "var(--bg-primary, #030806)",
        borderTop: "1px solid var(--border-glass, rgba(0, 245, 184, 0.15))",
        padding: "4.5rem 6% 2.5rem",
        color: "var(--text-muted, #9CB5AD)",
        position: "relative",
        zIndex: 10,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3.5rem",
        }}
      >
        {/* Brand Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link to="/" aria-label="NEXA AI Home" style={{ textDecoration: "none", width: "fit-content" }}>
            <NexaLogo variant="full" size={34} />
          </Link>
          <p
            style={{
              fontSize: "0.88rem",
              lineHeight: 1.65,
              maxWidth: "320px",
              color: "var(--text-muted, #9CB5AD)",
              margin: 0,
            }}
          >
            Next-generation AI Interview Simulator engineered to benchmark code correctness,
            analyze speech delivery, and turn interview anxiety into offer letters.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              background: "rgba(148, 255, 0, 0.08)",
              border: "1px solid rgba(148, 255, 0, 0.25)",
              color: "var(--accent-lime, #94FF00)",
              fontSize: "0.75rem",
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#94FF00",
                boxShadow: "0 0 8px #94FF00",
              }}
            />
            <span>NEXA v2.5 Engine Operational</span>
          </div>
        </div>

        {/* Tracks Column */}
        <div>
          <h4
            style={{
              color: "var(--text-main, #FFFFFF)",
              fontSize: "0.85rem",
              fontWeight: 800,
              marginBottom: "1.2rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SIMULATION TRACKS
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            <li>
              <Link to="/interview" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                🎙️ AI Mock Interviews
              </Link>
            </li>
            <li>
              <Link to="/dsa" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                ⚡ DSA Coding Lab
              </Link>
            </li>
            <li>
              <Link to="/resumes" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                📄 Resume Intelligence &amp; ATS
              </Link>
            </li>
            <li>
              <Link to="/roadmap" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>
                🗺️ Targeted Roadmaps
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Column */}
        <div>
          <h4
            style={{
              color: "var(--text-main, #FFFFFF)",
              fontSize: "0.85rem",
              fontWeight: 800,
              marginBottom: "1.2rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            CAPABILITIES
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            <li>
              <Link to="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>
                📈 Candidate Dashboard
              </Link>
            </li>
            <li>
              <Link to="/results" style={{ color: "inherit", textDecoration: "none" }}>
                📊 Rubric Analytics
              </Link>
            </li>
            <li>
              <a
                href="#simulation-preview"
                onClick={(e) => {
                  e.preventDefault();
                  window.__lenis?.scrollTo("#simulation-preview", { offset: -80 });
                }}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                ⚡ Live Terminal Preview
              </a>
            </li>
            <li>
              <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>
                🛡️ Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Status & Back to Top */}
        <div>
          <h4
            style={{
              color: "var(--text-main, #FFFFFF)",
              fontSize: "0.85rem",
              fontWeight: 800,
              marginBottom: "1.2rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SYSTEM TELEMETRY
          </h4>
          <p style={{ fontSize: "0.84rem", marginBottom: "0.85rem", color: "var(--text-muted, #9CB5AD)", lineHeight: 1.6 }}>
            Sub-second latency calibration benchmarked for FAANG &amp; tier-1 engineering interviews.
          </p>
          <div style={{ fontSize: "0.8rem", color: "var(--accent-mint, #00F5B8)", marginBottom: "1.2rem", fontWeight: 600 }}>
            Median AI Evaluation: ~120ms
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              background: "rgba(148, 255, 0, 0.08)",
              border: "1px solid rgba(148, 255, 0, 0.28)",
              color: "var(--accent-lime, #94FF00)",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ↑ Back to Top
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border-glass, rgba(0, 245, 184, 0.1))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.82rem",
        }}
      >
        <div>© {new Date().getFullYear()} NEXA AI Inc. All rights reserved.</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security &amp; Encryption</span>
        </div>
      </div>
    </footer>
  );
}

