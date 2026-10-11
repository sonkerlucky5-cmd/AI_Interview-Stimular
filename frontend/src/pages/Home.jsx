import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAuth from "../hooks/useAuth";
import HeroDemoModal from "../components/HeroDemoModal";
import robotMascot from "../assets/robot_mascot.png";
import aiInterviewerAvatar from "../assets/ai_interviewer_avatar.jpg";
import cyberWorkstationBg from "../assets/cyber_workstation_bg.jpg";
import "../css/home.css";

gsap.registerPlugin(ScrollTrigger);

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
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Refs for GSAP 3D parallax & floating effects
  const heroRef = useRef(null);
  const visualWrapRef = useRef(null);
  const cardProgressRef = useRef(null);
  const cardScreenRef = useRef(null);
  const cardFeedbackRef = useRef(null);
  const cardScoreRef = useRef(null);
  const mascotRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    const ctx = gsap.context(() => {
      gsap.from(".hero-animate-fade", {
        opacity: 0,
        y: 35,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".hero-card-animate", {
        opacity: 0,
        scale: 0.9,
        y: 40,
        duration: 1.2,
        stagger: 0.18,
        ease: "back.out(1.4)",
        delay: 0.2,
      });

      // Ambient floating physics on cards
      gsap.to(cardProgressRef.current, {
        y: -10,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cardFeedbackRef.current, {
        y: 12,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.4,
      });

      gsap.to(cardScoreRef.current, {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      });

      gsap.to(mascotRef.current, {
        y: -14,
        rotate: 3,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── SCROLL-TRIGGERED SECTION ANIMATIONS ──

      // Stats strip – counter slide up
      gsap.from(".home-stats__item", {
        scrollTrigger: {
          trigger: ".home-stats",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 45,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Section headers – fade up
      gsap.utils.toArray(".home-section__header").forEach((header) => {
        gsap.from(header.children, {
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        });
      });

      // Feature cards – staggered slide up with slight rotation
      gsap.from(".home-feature-card", {
        scrollTrigger: {
          trigger: ".home-features-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 60,
        rotateX: 8,
        scale: 0.92,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      });

      // How it works steps – sequential reveal
      gsap.from(".home-step", {
        scrollTrigger: {
          trigger: ".home-steps",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
      });

      // Role pills – pop in
      gsap.from(".home-role-pill", {
        scrollTrigger: {
          trigger: ".home-roles",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.7,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        ease: "back.out(2)",
      });

      // Testimonials – slide from sides
      gsap.utils.toArray(".home-testimonial").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: i % 2 === 0 ? -40 : 40,
          y: 25,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      // Final CTA – scale in from center
      gsap.from(".home-cta", {
        scrollTrigger: {
          trigger: ".home-cta",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.92,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse Parallax 3D tilt effect on Desktop
  const handleMouseMove = (e) => {
    if (!visualWrapRef.current || window.innerWidth < 1024) return;
    const rect = visualWrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    gsap.to(cardScreenRef.current, {
      rotateY: normX * 8,
      rotateX: -normY * 6,
      duration: 0.5,
      ease: "power1.out",
    });

    gsap.to(cardProgressRef.current, {
      x: normX * -18,
      y: normY * -14,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(cardFeedbackRef.current, {
      x: normX * 18,
      y: normY * -12,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(cardScoreRef.current, {
      x: normX * 14,
      y: normY * 16,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(mascotRef.current, {
      x: normX * -12,
      y: normY * 10,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return;
    gsap.to(
      [
        cardScreenRef.current,
        cardProgressRef.current,
        cardFeedbackRef.current,
        cardScoreRef.current,
        mascotRef.current,
      ],
      {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  };

  return (
    <div className="home-page" ref={heroRef}>
      {/* ── CREATIVE CYBER HERO SECTION ── */}
      <section
        className="cyber-hero"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Atmospheric Backlight Orbs */}
        <div className="cyber-hero__glow cyber-hero__glow--cyan" />
        <div className="cyber-hero__glow cyber-hero__glow--purple" />
        <div className="cyber-hero__grid-bg" />

        <div className="cyber-hero__container">
          {/* Left Column: Copy & Actions */}
          <div className="cyber-hero__left">
            <div className="cyber-hero__badge hero-animate-fade">
              <span className="cyber-hero__badge-pulse" />
              <span>🚀 Practice Today, Get Hired Tomorrow</span>
            </div>

            <h1 className="cyber-hero__title hero-animate-fade">
              Your{" "}
              <span className="cyber-hero__gradient-text">
                AI Interview Coach
              </span>{" "}
              <br />
              for a Brighter <br />
              Career Tomorrow
            </h1>

            <p className="cyber-hero__desc hero-animate-fade">
              Realistic mock interviews, instant AI feedback, and personalized
              learning paths to help you master interviews and land your dream
              job.
            </p>

            {/* CTAs */}
            <div className="cyber-hero__actions hero-animate-fade">
              <Link
                to={isAuthenticated ? "/dashboard" : "/interviews/new"}
                className="cyber-btn cyber-btn--primary"
                id="hero-cta-start"
              >
                <span>Start Mock Interview</span>
                <span className="cyber-btn__arrow">→</span>
              </Link>

              <button
                type="button"
                className="cyber-btn cyber-btn--glass"
                onClick={() => setShowDemoModal(true)}
                id="hero-cta-demo"
              >
                <span className="cyber-btn__play-icon">▶</span>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 4 Feature Badges Row (from reference image) */}
            <div className="cyber-hero__features hero-animate-fade">
              <div className="cyber-feature-pill">
                <span className="cyber-feature-pill__icon">⚡</span>
                <span className="cyber-feature-pill__text">
                  AI-Powered Questions
                </span>
              </div>
              <div className="cyber-feature-pill">
                <span className="cyber-feature-pill__icon">📊</span>
                <span className="cyber-feature-pill__text">
                  Real-time Feedback
                </span>
              </div>
              <div className="cyber-feature-pill">
                <span className="cyber-feature-pill__icon">🎙️</span>
                <span className="cyber-feature-pill__text">
                  Voice & Coding Interviews
                </span>
              </div>
              <div className="cyber-feature-pill">
                <span className="cyber-feature-pill__icon">📖</span>
                <span className="cyber-feature-pill__text">
                  Personalized Learning Plan
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic Studio Showcase */}
          <div className="cyber-hero__right" ref={visualWrapRef}>
            <div className="cyber-stage">
              {/* Studio Desk Vignette Backdrop */}
              <div
                className="cyber-stage__backdrop"
                style={{ backgroundImage: `url(${cyberWorkstationBg})` }}
              >
                <div className="cyber-stage__overlay" />
              </div>

              {/* Holographic Card 1: Interview Progress (Top Left) */}
              <div
                className="cyber-float-card cyber-float-card--progress hero-card-animate"
                ref={cardProgressRef}
              >
                <div className="cyber-float-card__head">
                  <span className="cyber-pulse-dot" />
                  <strong>Interview Progress</strong>
                </div>

                <div className="cyber-progress-row">
                  {/* SVG Circular Donut Ring */}
                  <div className="cyber-donut">
                    <svg viewBox="0 0 44 44" className="cyber-donut__svg">
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        className="cyber-donut__track"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        className="cyber-donut__bar"
                      />
                    </svg>
                    <div className="cyber-donut__label">
                      <span>3</span>
                      <small>/10</small>
                    </div>
                  </div>

                  {/* Checklist */}
                  <ul className="cyber-checklist">
                    <li className="completed">
                      <span className="icon">✔</span> Introduction
                    </li>
                    <li className="active">
                      <span className="icon">◉</span> Technical Round
                    </li>
                    <li>
                      <span className="icon">○</span> Problem Solving
                    </li>
                    <li>
                      <span className="icon">○</span> System Design
                    </li>
                    <li>
                      <span className="icon">○</span> HR Round
                    </li>
                  </ul>
                </div>
              </div>

              {/* Centerpiece Screen: Live AI Interview Hologram */}
              <div
                className="cyber-screen hero-card-animate"
                ref={cardScreenRef}
              >
                <div className="cyber-screen__topbar">
                  <div className="cyber-screen__status">
                    <span className="cyber-rec-dot" />
                    <span>LIVE AI INTERVIEW</span>
                  </div>
                  <span className="cyber-ai-tag">AI</span>
                </div>

                {/* Avatar Hologram */}
                <div className="cyber-screen__avatar-wrap">
                  <img
                    src={aiInterviewerAvatar}
                    alt="AI Interviewer"
                    className="cyber-screen__avatar"
                  />
                  <div className="cyber-screen__avatar-glow" />

                  {/* Speech Bubble */}
                  <div className="cyber-speech-bubble">
                    <p>
                      "Great! Can you explain the difference between SQL and
                      NoSQL?"
                    </p>
                  </div>
                </div>

                {/* Audio Waveform Equalizer */}
                <div className="cyber-waveform">
                  <span className="cyber-mic-icon">🎙️</span>
                  <div className="cyber-wave-bars">
                    {[16, 28, 42, 60, 36, 75, 48, 85, 52, 90, 64, 40, 24].map(
                      (h, i) => (
                        <span
                          key={i}
                          className="wave-bar"
                          style={{
                            "--bar-height": `${h}px`,
                            animationDelay: `${i * 0.08}s`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Holographic Card 2: Live Feedback (Top Right) */}
              <div
                className="cyber-float-card cyber-float-card--feedback hero-card-animate"
                ref={cardFeedbackRef}
              >
                <div className="cyber-float-card__head">
                  <span className="cyber-neon-bolt">⚡</span>
                  <strong>Live Feedback</strong>
                  <span className="cyber-ai-badge">AI</span>
                </div>

                <div className="cyber-metric-bars">
                  <div className="cyber-metric">
                    <div className="cyber-metric__label">
                      <span>💬 Communication</span>
                      <strong>88%</strong>
                    </div>
                    <div className="cyber-metric__track">
                      <div
                        className="cyber-metric__fill"
                        style={{ width: "88%", background: "#00f0ff" }}
                      />
                    </div>
                  </div>

                  <div className="cyber-metric">
                    <div className="cyber-metric__label">
                      <span>💻 Technical (DSA)</span>
                      <strong>92%</strong>
                    </div>
                    <div className="cyber-metric__track">
                      <div
                        className="cyber-metric__fill"
                        style={{ width: "92%", background: "#a855f7" }}
                      />
                    </div>
                  </div>

                  <div className="cyber-metric">
                    <div className="cyber-metric__label">
                      <span>💡 Problem Solving</span>
                      <strong>87%</strong>
                    </div>
                    <div className="cyber-metric__track">
                      <div
                        className="cyber-metric__fill"
                        style={{ width: "87%", background: "#39d0c7" }}
                      />
                    </div>
                  </div>

                  <div className="cyber-metric">
                    <div className="cyber-metric__label">
                      <span>📈 Confidence</span>
                      <strong>90%</strong>
                    </div>
                    <div className="cyber-metric__track">
                      <div
                        className="cyber-metric__fill"
                        style={{ width: "90%", background: "#38bdf8" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Holographic Card 3: Overall Score (Bottom Right) */}
              <div
                className="cyber-float-card cyber-float-card--score hero-card-animate"
                ref={cardScoreRef}
              >
                <span className="cyber-score-title">Overall Score</span>
                <div className="cyber-score-val">
                  <strong>92</strong>
                  <small>/100</small>
                </div>
                <div className="cyber-score-badge">
                  <span>📊 Excellent Performance!</span>
                </div>
                <div className="cyber-score-cheer">
                  Keep going! You're doing great! 🚀
                </div>
              </div>

              {/* Floating Robot Mascot Companion */}
              <div className="cyber-mascot-wrap" ref={mascotRef}>
                <img
                  src={robotMascot}
                  alt="AI Mascot"
                  className="cyber-mascot-img"
                />
                <div className="cyber-mascot-glow" />
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SOCIAL PROOF DOCK (FROM REFERENCE IMAGE) ── */}
        <div className="cyber-social-dock hero-animate-fade">
          <div className="cyber-social-item">
            <div className="cyber-avatar-group">
              <span className="cyber-avatar" style={{ background: "#4f8cff" }}>
                👨‍💻
              </span>
              <span className="cyber-avatar" style={{ background: "#8a5cff" }}>
                👩‍💼
              </span>
              <span className="cyber-avatar" style={{ background: "#39d0c7" }}>
                🧑‍💻
              </span>
            </div>
            <div>
              <strong>50K+</strong>
              <span>Students & Professionals</span>
            </div>
          </div>

          <div className="cyber-social-sep" />

          <div className="cyber-social-item">
            <span className="cyber-social-icon">💼</span>
            <div>
              <strong>90%</strong>
              <span>Report Higher Confidence</span>
            </div>
          </div>

          <div className="cyber-social-sep" />

          <div className="cyber-social-item">
            <span className="cyber-social-icon">⭐</span>
            <div>
              <strong>4.8 / 5</strong>
              <span>User Satisfaction</span>
            </div>
          </div>

          <div className="cyber-social-sep" />

          <div className="cyber-social-item">
            <span className="cyber-social-icon">🏢</span>
            <div>
              <strong>Get Hired</strong>
              <span>At Top Tech Companies</span>
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
      <section className="home-section" id="features">
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
      <section className="home-section" id="process">
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
      <section className="home-section" id="roles">
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
          <h2 className="home-section__title">Engineers Who Made It</h2>
        </div>

        <div className="home-testimonials">
          {testimonials.map((t) => (
            <article className="home-testimonial" key={t.name}>
              <p className="home-testimonial__text">"{t.text}"</p>
              <div className="home-testimonial__author">
                <span
                  className="home-testimonial__avatar"
                  style={{
                    background: t.color + "33",
                    color: t.color,
                    border: `1px solid ${t.color}44`,
                  }}
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

      {/* Interactive Watch Demo Walkthrough Modal */}
      <HeroDemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </div>
  );
}

export default Home;
