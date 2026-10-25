import { useState } from "react";
import { Link } from "react-router-dom";
import useTypewriter from "../hooks/useTypewriter";
import ThreeSphereCanvas from "./ThreeSphereCanvas";
import HeroDemoModal from "./HeroDemoModal";
import "./HoloHero.css";

// Honest, verified platform capability pillars (No fake student counts)
const VERIFIED_CAPABILITIES = [
  {
    icon: "⚡",
    title: "Adaptive Question Engine",
    desc: "Dynamic difficulty and follow-ups calibrated to your real-time responses.",
  },
  {
    icon: "🎙️",
    title: "Multi-Modal AI Evaluation",
    desc: "Instant breakdown of vocal pacing, filler words, and technical depth.",
  },
  {
    icon: "📊",
    title: "Granular Skill Rubrics",
    desc: "Objective scoring across Architecture, DSA complexity, and Communication.",
  },
  {
    icon: "🗺️",
    title: "Targeted Roadmaps",
    desc: "Custom practice paths automatically generated from detected weak spots.",
  },
];

const TARGET_COMPANIES = [
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Meta", domain: "meta.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Netflix", domain: "netflix.com" },
  { name: "Uber", domain: "uber.com" },
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
            <span className="hero-badge__sparkle">✨</span>
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
            >
              <span className="hero-pill-btn__play">▶</span>
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
                <span>⚡</span>
              </div>
              <div className="hero-card-text">
                <strong>Adaptive Questions</strong>
                <small>Dynamic difficulty scaling</small>
              </div>
            </div>

            {/* Floating Telemetry Badge 2: Top-Right (Live AI Evaluation) */}
            <div className="hero-floating-card hero-floating-card--tr">
              <div className="hero-card-icon-badge hero-card-icon-badge--chart">
                <span>📊</span>
              </div>
              <div className="hero-card-text">
                <strong>Live AI Evaluation</strong>
                <small>Sub-second rubric assessment</small>
              </div>
            </div>

            {/* Floating Telemetry Badge 3: Bottom-Left (DSA & System Design) */}
            <div className="hero-floating-card hero-floating-card--bl">
              <div className="hero-card-icon-badge hero-card-icon-badge--code">
                <span>&lt;/&gt;</span>
              </div>
              <div className="hero-card-text">
                <strong>DSA &amp; System Design</strong>
                <small>Real-time complexity analysis</small>
              </div>
            </div>

            {/* Floating Telemetry Badge 4: Bottom-Right (92% Readiness Score & Badge) */}
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
                  <strong>Readiness Score</strong>
                  <span className="hero-card-pill-tag">Interview Ready</span>
                </div>
                <small>Calibrated across 5 competencies</small>
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

      {/* ── Calibrated Hiring Bar (Target Companies Strip) ── */}
      <div className="hero-partners-strip" aria-label="Target hiring benchmark companies">
        <div className="hero-partners-label">
          <span>CALIBRATED FOR INTERVIEWS AT</span>
        </div>
        <div className="hero-partners-list">
          {TARGET_COMPANIES.map((company) => (
            <span key={company.name} className="hero-partner-item">
              {company.name}
            </span>
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

