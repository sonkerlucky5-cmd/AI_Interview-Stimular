import { Link } from "react-router-dom";
import "./HoloHero.css";

const FEATURE_TAGS = [
  { label: "AI Mock Interview", highlight: true },
  { label: "Resume Skill Matcher", highlight: false },
  { label: "Real-Time Dictation", highlight: true },
  { label: "Rubric Evaluation", highlight: false },
  { label: "System Design", highlight: false },
  { label: "DSA Arena", highlight: true },
  { label: "Competency Radar", highlight: false },
  { label: "Personalized Roadmap", highlight: true },
  { label: "Zero Audio Stored", highlight: false },
  { label: "Instant Scoring", highlight: false },
];

export default function HoloHero() {
  return (
    <section className="hero-saas">
      {/* Background ambient lighting */}
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="hero-saas__inner">
        {/* Left Column: Headline, CTAs, and 3D Emerald Visual */}
        <div className="hero-saas__left">
          <div className="hero-badge">
            <span className="hero-badge__dot" />
            <span>AI Interview Coach</span>
          </div>

          <h1 className="hero-headline">
            Welcome to <span className="hero-headline__accent">AI Interview</span>
            <br />
            — <span className="hero-headline__italic">Where AI Meets Preparation</span>
          </h1>

          <p className="hero-description">
            Prepare for high-stakes technical rounds with realistic mock interviews,
            real-time speech transcription, personalized rubric feedback, and an
            adaptive learning roadmap.
          </p>

          <div className="hero-actions">
            <Link to="/interview" className="hero-pill-btn hero-pill-btn--primary">
              <span>Start Free Practice</span>
              <span className="hero-pill-btn__arrow">↗</span>
            </Link>

            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                window.__lenis?.scrollTo("#features", { offset: -80 });
              }}
              className="hero-pill-btn hero-pill-btn--ghost"
            >
              Explore Features
            </a>
          </div>

          {/* 3D Emerald Torus / Orb Composition */}
          <div className="hero-orb-wrapper">
            <div className="hero-orb">
              <div className="hero-orb__inner-ring" />
              <div className="hero-orb__highlight" />
              <div className="hero-orb__core">
                <span className="hero-orb__metric">94%</span>
                <span className="hero-orb__sub">Readiness Score</span>
              </div>
            </div>
            <div className="hero-orb__shadow" />
          </div>
        </div>

        {/* Right Column: Floating Pill Tags & Feature System Card */}
        <div className="hero-saas__right">
          <div className="hero-system-card glass-panel">
            <div className="hero-system-card__header">
              <span className="hero-system-card__eyebrow">INTELLIGENT WORKSPACE</span>
              <h3 className="hero-system-card__title">
                Preparation isn&apos;t luck. <span className="italic-accent">It&apos;s the system.</span>
              </h3>
            </div>

            {/* Interactive Pill Tag Grid */}
            <div className="hero-pill-cloud">
              {FEATURE_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className={`hero-cloud-tag ${tag.highlight ? "hero-cloud-tag--highlight" : ""}`}
                >
                  {tag.highlight && <span className="tag-dot" />}
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Live Simulation Card Strip */}
            <div className="hero-simulation-strip">
              <div className="hero-sim-status">
                <span className="hero-pulse-dot" />
                <span className="hero-sim-text">Live Rubric Active</span>
              </div>
              <div className="hero-sim-chips">
                <span className="hero-chip">Frontend</span>
                <span className="hero-chip">Backend</span>
                <span className="hero-chip">System Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
