import { useState } from "react";
import { Link } from "react-router-dom";
import useTypewriter from "../hooks/useTypewriter";
import ThreeSphereCanvas from "./ThreeSphereCanvas";
import HeroDemoModal from "./HeroDemoModal";
import "./HoloHero.css";

// Honest, verified platform capability pillars (No fake student counts or partnerships)
const VERIFIED_CAPABILITIES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Adaptive Question Engine",
    desc: "Dynamic difficulty and follow-ups calibrated to your real-time responses.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    title: "Multi-Modal AI Evaluation",
    desc: "Instant breakdown of vocal pacing, filler words, and technical depth.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Granular Skill Rubrics",
    desc: "Objective scoring across Architecture, DSA correctness, and Communication.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    title: "Targeted Roadmaps",
    desc: "Custom practice paths automatically generated from detected weak spots.",
  },
];

export default function HoloHero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const typedText = useTypewriter({
    words: [
      "Adaptive Interview Calibration.",
      "Real-Time Speech & Code Analysis.",
      "Granular Rubric Scoring.",
      "Turn Anxiety Into Offers.",
    ],
    typingSpeed: 75,
    deletingSpeed: 40,
    pauseDelay: 1800,
  });

  return (
    <section className="hero-saas" id="hero-landing">
      {/* Background ambient lighting */}
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="hero-saas__inner">
        {/* Left Column: Badge, Headline, Subtext, and Action Buttons */}
        <div className="hero-saas__left">
          <div className="hero-badge">
            <span className="hero-badge__sparkle" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
              </svg>
            </span>
            <span>NEXA AI SIMULATION ENGINE</span>
          </div>

          <h1 className="hero-headline">
            Your Next Interview,
            <br />
            <span className="hero-headline__accent">Reimagined by AI.</span>
          </h1>

          {/* Typing Text Bar */}
          <div className="hero-typing-bar" aria-live="polite">
            <span className="hero-typing-indicator" />
            <span className="hero-typing-label">AI ENGINE:</span>
            <span className="hero-typing-text">
              {typedText}
              <span className="hero-typing-cursor">|</span>
            </span>
          </div>

          <p className="hero-description">
            Adaptive, realistic and personalized interview practice to help you
            crack your dream job with confidence. Experience interactive mock rounds,
            deep rubric assessments, and real-time coding intelligence.
          </p>

          <div className="hero-actions">
            <Link to="/interview" className="hero-pill-btn hero-pill-btn--primary" id="hero-cta-practice">
              <span>Start Interview</span>
              <span className="hero-pill-btn__arrow">→</span>
            </Link>

            <Link to="/dsa" className="hero-pill-btn hero-pill-btn--ghost" id="hero-cta-dsa">
              <span>Explore DSA Practice</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDemoModal(true)}
              className="hero-pill-btn hero-pill-btn--demo"
              id="hero-cta-demo"
              aria-label="Watch interactive demo"
            >
              <span className="hero-pill-btn__play" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Faceted Neural Core & Reference-Inspired Telemetry Badges */}
        <div className="hero-saas__right">
          <div className="hero-3d-stage">
            {/* Real Three.js Canvas: 3D faceted crystalline neural orb */}
            <ThreeSphereCanvas />

            {/* Floating Telemetry Badge 1: Top-Left (Adaptive Questions) */}
            <div className="hero-floating-card hero-floating-card--tl">
              <div className="hero-card-icon-badge hero-card-icon-badge--bolt">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="hero-card-text">
                <strong>Adaptive Questions</strong>
                <small>Dynamic difficulty scaling</small>
              </div>
            </div>

            {/* Floating Telemetry Badge 2: Top-Right (Live AI Evaluation) */}
            <div className="hero-floating-card hero-floating-card--tr">
              <div className="hero-card-icon-badge hero-card-icon-badge--chart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="hero-card-text">
                <strong>Live AI Evaluation</strong>
                <small>Real-time rubric assessment</small>
              </div>
            </div>

            {/* Floating Telemetry Badge 3: Bottom-Left (DSA & System Design) */}
            <div className="hero-floating-card hero-floating-card--bl">
              <div className="hero-card-icon-badge hero-card-icon-badge--code">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="hero-card-text">
                <strong>DSA &amp; System Design</strong>
                <small>Complexity analysis (Coming soon)</small>
              </div>
            </div>

            {/* Floating Telemetry Badge 4: Bottom-Right (Sample Readiness Score) */}
            <div className="hero-floating-card hero-floating-card--br hero-floating-card--readiness">
              <div className="hero-card-readiness-circle">
                <svg width="42" height="42" viewBox="0 0 42 42" className="readiness-svg">
                  <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(148, 255, 0, 0.15)" strokeWidth="3.5" />
                  <circle
                    cx="21"
                    cy="21"
                    r="17"
                    fill="none"
                    stroke="#94FF00"
                    strokeWidth="3.5"
                    strokeDasharray="106.8"
                    strokeDashoffset="8.5"
                    strokeLinecap="round"
                    transform="rotate(-90 21 21)"
                  />
                  <text x="21" y="25" textAnchor="middle" fill="#94FF00" fontSize="11" fontWeight="800">
                    92%
                  </text>
                </svg>
              </div>
              <div className="hero-card-text">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <strong>Sample Readiness</strong>
                  <span className="hero-card-pill-tag">Sample</span>
                </div>
                <small>Calibrated benchmark preview</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Verified Capabilities Strip (Honest Platform Pillars) ── */}
      <div className="hero-stats-wrapper">
        <div className="hero-stats-grid">
          {VERIFIED_CAPABILITIES.map((cap) => (
            <div key={cap.title} className="hero-stat-card glass-panel">
              <div className="hero-stat-card__icon">{cap.icon}</div>
              <div className="hero-stat-card__content">
                <span className="hero-stat-card__value">{cap.title}</span>
                <span className="hero-stat-card__label">{cap.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Hero Demo Modal */}
      {showDemoModal && (
        <HeroDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      )}
    </section>
  );
}


