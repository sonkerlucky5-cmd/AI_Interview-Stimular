import { useState } from "react";
import { Link } from "react-router-dom";
import useTypewriter from "../hooks/useTypewriter";
import ThreeSphereCanvas from "./ThreeSphereCanvas";
import HeroDemoModal from "./HeroDemoModal";
import "./HoloHero.css";

const HERO_STATS = [
  { value: "50K+", label: "Students Practicing", icon: "👥" },
  { value: "200K+", label: "Interviews Conducted", icon: "🎙️" },
  { value: "95%", label: "Positive Reviews", icon: "🛡️" },
  { value: "10+", label: "Interview Categories", icon: "📂" },
];

const PARTNER_LOGOS = [
  { name: "Google", svg: "Google" },
  { name: "Microsoft", svg: "Microsoft" },
  { name: "amazon", svg: "Amazon" },
  { name: "Meta", svg: "Meta" },
  { name: "NETFLIX", svg: "Netflix" },
  { name: "Spotify", svg: "Spotify" },
  { name: "Adobe", svg: "Adobe" },
];

export default function HoloHero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const typedText = useTypewriter({
    words: [
      "Practice Smarter.",
      "Interview Stronger.",
      "Build Career Confidence.",
      "Get Interview Ready.",
    ],
    typingSpeed: 85,
    deletingSpeed: 45,
    pauseDelay: 1700,
  });

  return (
    <section className="hero-saas" id="hero-landing">
      {/* Background ambient lighting */}
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="hero-saas__inner">
        {/* Left Column: Badge, Headline with typing animation, subtext, and CTAs */}
        <div className="hero-saas__left">
          <div className="hero-badge">
            <span className="hero-badge__sparkle">✨</span>
            <span>#1 AI Interview Preparation Platform</span>
          </div>

          <h1 className="hero-headline">
            Practice Smarter.
            <br />
            Interview <span className="hero-headline__accent">Stronger.</span>
          </h1>

          {/* Typing Text Bar */}
          <div className="hero-typing-bar" aria-live="polite">
            <span className="hero-typing-indicator" />
            <span className="hero-typing-label">AI Focus:</span>
            <span className="hero-typing-text">
              {typedText}
              <span className="hero-typing-cursor">|</span>
            </span>
          </div>

          <p className="hero-description">
            Get real-world interview experience with AI-powered mock interviews,
            personalized feedback, coding practice, and a learning roadmap to help
            you land your dream job.
          </p>

          <div className="hero-actions">
            <Link to="/interview" className="hero-pill-btn hero-pill-btn--primary" id="hero-cta-practice">
              <span>Start Free Practice</span>
              <span className="hero-pill-btn__arrow">→</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDemoModal(true)}
              className="hero-pill-btn hero-pill-btn--ghost"
              id="hero-cta-demo"
            >
              <span className="hero-pill-btn__play">▶</span>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Central Emerald Glass Sphere & Floating Cards */}
        <div className="hero-saas__right">
          <div className="hero-3d-stage">
            {/* Real Three.js Canvas for glowing emerald sphere & pedestal */}
            <ThreeSphereCanvas />

            {/* Floating Glass Card 1: Top-Left (AI Mock Interview) */}
            <div className="hero-floating-card hero-floating-card--tl">
              <div className="hero-card-icon-badge hero-card-icon-badge--mic">
                <span>🎙️</span>
              </div>
              <div className="hero-card-text">
                <strong>AI Mock Interview</strong>
                <small>Realistic questions</small>
              </div>
            </div>

            {/* Floating Glass Card 2: Top-Right (AI Feedback) */}
            <div className="hero-floating-card hero-floating-card--tr">
              <div className="hero-card-icon-badge hero-card-icon-badge--chart">
                <span>📊</span>
              </div>
              <div className="hero-card-text">
                <strong>AI Feedback</strong>
                <small>Detailed analysis</small>
              </div>
            </div>

            {/* Floating Glass Card 3: Bottom-Left (DSA Practice) */}
            <div className="hero-floating-card hero-floating-card--bl">
              <div className="hero-card-icon-badge hero-card-icon-badge--code">
                <span>&lt;/&gt;</span>
              </div>
              <div className="hero-card-text">
                <strong>DSA Practice</strong>
                <small>Improve coding skills</small>
              </div>
            </div>

            {/* Floating Glass Card 4: Bottom-Right (Learning Roadmap) */}
            <div className="hero-floating-card hero-floating-card--br">
              <div className="hero-card-icon-badge hero-card-icon-badge--target">
                <span>🎯</span>
              </div>
              <div className="hero-card-text">
                <strong>Learning Roadmap</strong>
                <small>Personalized plan</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Glass Statistics Cards Row (Matching Reference Image Section 4) ── */}
      <div className="hero-stats-wrapper">
        <div className="hero-stats-grid">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="hero-stat-card glass-panel">
              <div className="hero-stat-card__icon">{stat.icon}</div>
              <div className="hero-stat-card__content">
                <span className="hero-stat-card__value">{stat.value}</span>
                <span className="hero-stat-card__label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Monochrome Partner Strip (Panel 01 Reference) ── */}
      <div className="hero-partners-strip" aria-label="Partner and target hiring companies">
        <div className="hero-partners-list">
          {PARTNER_LOGOS.map((p) => (
            <span key={p.name} className="hero-partner-item">
              {p.name}
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
