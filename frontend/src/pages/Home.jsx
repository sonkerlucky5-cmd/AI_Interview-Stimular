import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import robotMascot from "../assets/robot_mascot.png";
import "../css/home.css";

const stats = [
  { value: "50K+", label: "Interviews Conducted" },
  { value: "92%", label: "Success Rate" },
  { value: "200+", label: "Job Roles Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Questions",
    description:
      "Gemini-powered interview questions tailored precisely to your role, level, and domain. No generic questions.",
    tag: "Core",
  },
  {
    icon: "🎙️",
    title: "Real-time AI Interviewer",
    description:
      "Face a conversational AI that listens, responds, and challenges you just like a real technical interviewer would.",
    tag: "Live",
  },
  {
    icon: "📊",
    title: "Instant Detailed Feedback",
    description:
      "Get scored across communication, technical depth, and problem-solving immediately after every session.",
    tag: "Smart",
  },
  {
    icon: "📈",
    title: "Performance Analytics",
    description:
      "Track progress over time with rich charts. See your streaks, improvement trends, and weak spots clearly.",
    tag: "Insights",
  },
  {
    icon: "🎯",
    title: "Role-Specific Prep",
    description:
      "Choose from Full Stack, Backend, Frontend, DevOps, Data Science, and more — each with curated question banks.",
    tag: "Targeted",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description:
      "JWT-authenticated sessions, bcrypt-hashed passwords, and HttpOnly cookies keep your data safe at all times.",
    tag: "Secure",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds. Your profile is securely stored and accessible from any device.",
  },
  {
    number: "02",
    title: "Choose Your Interview",
    description:
      "Pick your role, tech stack, and difficulty. We'll generate a personalized session just for you.",
  },
  {
    number: "03",
    title: "Interview with AI",
    description:
      "Go through a full interview with our Gemini-powered AI. It adapts to your answers in real time.",
  },
  {
    number: "04",
    title: "Review & Improve",
    description:
      "Get deep feedback, scores, and tips. Track your growth session by session until you're ready.",
  },
];

const roles = [
  { label: "Full Stack Developer", icon: "⚡" },
  { label: "Frontend Developer", icon: "🎨" },
  { label: "Backend Developer", icon: "⚙️" },
  { label: "Data Scientist", icon: "🧬" },
  { label: "DevOps Engineer", icon: "🚀" },
  { label: "System Design", icon: "🏗️" },
  { label: "Machine Learning", icon: "🤖" },
  { label: "Mobile Developer", icon: "📱" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE @ Google",
    text: "This simulator helped me crack my Google L4 interview. The AI feedback was incredibly detailed and spot on.",
    avatar: "PS",
    color: "#4f8cff",
  },
  {
    name: "Arjun Mehta",
    role: "Full Stack @ Stripe",
    text: "I practiced 30+ sessions here before my Stripe interview. The real-time AI interviewer is indistinguishable from the real thing.",
    avatar: "AM",
    color: "#8a5cff",
  },
  {
    name: "Sara Lin",
    role: "ML Engineer @ OpenAI",
    text: "The performance analytics showed me exactly where I was weak. Went from 45% to 92% average in 3 weeks.",
    avatar: "SL",
    color: "#39d0c7",
  },
];

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero__orb home-hero__orb--blue" />
        <div className="home-hero__orb home-hero__orb--purple" />

        <div className="home-hero__content">
          <span className="home-badge">
            <span className="home-badge__dot" />
            Powered by Gemini AI · Phase 1 Live
          </span>

          <h1 className="home-hero__heading">
            Ace Every
            <span className="home-gradient-text"> Technical Interview</span>
            <br />
            with Real AI
          </h1>

          <p className="home-hero__sub">
            Practice with a live AI interviewer, get instant expert-level
            feedback, and track your growth — built on a production-grade
            secure foundation.
          </p>

          <div className="home-hero__actions">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="home-btn home-btn--primary"
              id="hero-cta-primary"
            >
              <span>▶</span>
              {isAuthenticated ? "Go to Dashboard" : "Start Free Interview"}
            </Link>
            <Link
              to="/login"
              className="home-btn home-btn--ghost"
              id="hero-cta-login"
            >
              Sign In
            </Link>
          </div>

          <div className="home-hero__trust">
            {["No credit card", "Instant setup", "JWT secured"].map((t) => (
              <span key={t} className="home-hero__trust-item">
                <span className="home-hero__trust-check">✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__robot-wrap">
            <div className="home-hero__robot-glow" />
            <img
              src={robotMascot}
              alt="AI Interview Robot"
              className="home-hero__robot"
            />
          </div>

          <div className="home-hero__float-card home-hero__float-card--tl">
            <span className="home-float-icon">🎯</span>
            <div>
              <strong>Score: 92%</strong>
              <small>System Design</small>
            </div>
          </div>

          <div className="home-hero__float-card home-hero__float-card--br">
            <span className="home-float-icon">⚡</span>
            <div>
              <strong>Live Interview</strong>
              <small>AI Session Active</small>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="home-stats">
        {stats.map((s) => (
          <div className="home-stats__item" key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="home-section">
        <div className="home-section__header">
          <span className="home-badge home-badge--muted">Features</span>
          <h2 className="home-section__title">
            Everything You Need to Land the Job
          </h2>
          <p className="home-section__sub">
            A complete AI-driven interview prep platform — built with the same
            stack as real production SaaS.
          </p>
        </div>

        <div className="home-features-grid">
          {features.map((f) => (
            <article className="home-feature-card" key={f.title}>
              <div className="home-feature-card__top">
                <span className="home-feature-card__icon">{f.icon}</span>
                <span className="home-feature-card__tag">{f.tag}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              <div className="home-feature-card__bar" />
            </article>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-section">
        <div className="home-section__header">
          <span className="home-badge home-badge--muted">Process</span>
          <h2 className="home-section__title">How It Works</h2>
          <p className="home-section__sub">
            Go from sign-up to your first AI interview session in under 2
            minutes.
          </p>
        </div>

        <div className="home-steps">
          {steps.map((step, i) => (
            <div className="home-step" key={step.number}>
              <div className="home-step__number">{step.number}</div>
              {i < steps.length - 1 && (
                <div className="home-step__connector" />
              )}
              <div className="home-step__body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="home-section">
        <div className="home-section__header">
          <span className="home-badge home-badge--muted">Roles</span>
          <h2 className="home-section__title">
            Practice for Any Engineering Role
          </h2>
        </div>

        <div className="home-roles">
          {roles.map((r) => (
            <div className="home-role-pill" key={r.label}>
              <span>{r.icon}</span>
              {r.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="home-section">
        <div className="home-section__header">
          <span className="home-badge home-badge--muted">Wall of Love</span>
          <h2 className="home-section__title">
            Engineers Who Made It
          </h2>
        </div>

        <div className="home-testimonials">
          {testimonials.map((t) => (
            <article className="home-testimonial" key={t.name}>
              <p className="home-testimonial__text">"{t.text}"</p>
              <div className="home-testimonial__author">
                <span
                  className="home-testimonial__avatar"
                  style={{ background: t.color + "33", color: t.color, border: `1px solid ${t.color}44` }}
                >
                  {t.avatar}
                </span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="home-cta__orb" />
        <span className="home-badge">Get Started Today</span>
        <h2>Ready to Crack Your Dream Interview?</h2>
        <p>
          Join thousands of engineers who built their confidence with Real AI
          Interview Simulator. Free to start.
        </p>
        <div className="home-cta__actions">
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="home-btn home-btn--primary home-btn--lg"
            id="cta-final"
          >
            <span>🚀</span>
            {isAuthenticated ? "Open Dashboard" : "Start Practicing Free"}
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
