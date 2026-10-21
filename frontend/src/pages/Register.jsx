import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    targetRole: "Frontend",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email format";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup(formData);
      toast.success("Account created successfully! Welcome aboard 🚀");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const msg = getApiErrorMessage(error, "Unable to create your account right now.");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--auth">
      <section className="auth-shell">

        {/* Left info panel */}
        <div className="auth-shell__info">
          <div className="auth-brand-badge">
            <span className="auth-brand-badge__dot" aria-hidden="true" />
            <span>Join 50,000+ Engineers</span>
          </div>

          <h1>
            Launch your career with <span className="text-highlight">AI mock interviews</span>.
          </h1>

          <p>
            Create your free account today and start mastering technical, architectural,
            and behavioral interviews with real-time AI feedback.
          </p>

          <div className="info-list">
            <div className="info-list__item">
              Role-tailored interview tracks & real-world scenario questions
            </div>
            <div className="info-list__item">
              Comprehensive evaluation rubric: Code, Communication & Architecture
            </div>
            <div className="info-list__item">
              Personalized learning roadmaps with targeted drill exercises
            </div>
          </div>

          {/* Decorative role tracks card */}
          <div className="auth-deco-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Available Tracks</strong>
              <span
                style={{
                  fontSize: "0.72rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                  background: "rgba(0, 245, 184, 0.12)",
                  color: "var(--accent-mint)",
                  fontWeight: 700,
                  border: "1px solid rgba(0, 245, 184, 0.3)",
                }}
              >
                Instant Setup
              </span>
            </div>
            <div className="auth-deco-pills">
              {["Frontend", "Backend", "Full Stack", "System Design"].map((role) => (
                <span
                  key={role}
                  className="auth-deco-pill"
                  style={{
                    borderColor: formData.targetRole.toLowerCase().includes(role.toLowerCase().replace(" ", ""))
                      ? "var(--accent-mint)"
                      : undefined,
                    background: formData.targetRole.toLowerCase().includes(role.toLowerCase().replace(" ", ""))
                      ? "rgba(0, 245, 184, 0.18)"
                      : undefined,
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right form card */}
        <form className="auth-card" onSubmit={handleSubmit} id="register-form">
          <div className="auth-card__header">
            <span className="eyebrow" style={{ color: "var(--accent-mint)", letterSpacing: "0.08em" }}>
              Get Started Free
            </span>
            <h2>Create Your Account</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
              Start practicing AI mock interviews in seconds.
            </p>
          </div>

          <label className="field" htmlFor="register-name">
            <span>Full Name</span>
            <input
              id="register-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="e.g. Alex Chen"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              required
            />
            {errors.name && (
              <small style={{ color: "#ff6ec7", fontSize: "0.8rem", marginTop: "-0.2rem" }}>
                {errors.name}
              </small>
            )}
          </label>

          <label className="field" htmlFor="register-email">
            <span>Email Address</span>
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              required
            />
            {errors.email && (
              <small style={{ color: "#ff6ec7", fontSize: "0.8rem", marginTop: "-0.2rem" }}>
                {errors.email}
              </small>
            )}
          </label>

          <label className="field" htmlFor="register-role">
            <span>Target Role</span>
            <select
              id="register-role"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            >
              <option value="Frontend">Frontend Engineer (React / Next.js)</option>
              <option value="Backend">Backend Engineer (Node / Go / Python)</option>
              <option value="FullStack">Full Stack Engineer</option>
              <option value="SystemDesign">System Architect / Tech Lead</option>
            </select>
          </label>

          <label className="field" htmlFor="register-password">
            <span>Password (min. 8 characters)</span>
            <div className="auth-password-wrap">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <small style={{ color: "#ff6ec7", fontSize: "0.8rem", marginTop: "-0.2rem" }}>
                {errors.password}
              </small>
            )}
          </label>

          {errorMessage && (
            <p className="form-message form-message--error" role="alert">
              {errorMessage}
            </p>
          )}

          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.1rem 0" }}>
            By creating an account, you agree to our Terms of Service & Privacy Policy.
          </p>

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={isSubmitting}
            id="register-submit"
            style={{
              padding: "0.95rem",
              fontSize: "1rem",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #00F5B8 0%, #00DDA5 100%)",
              color: "#030907",
              fontWeight: 700,
              boxShadow: "0 4px 20px rgba(0, 245, 184, 0.35)",
              border: "none",
              cursor: isSubmitting ? "wait" : "pointer",
            }}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create Account & Launch Dashboard →"
            )}
          </button>

          <p className="auth-card__footer">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-mint)", fontWeight: 700 }}>
              Sign In here →
            </Link>
          </p>
        </form>

      </section>
    </div>
  );
}
