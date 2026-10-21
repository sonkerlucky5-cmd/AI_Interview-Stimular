import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await login(formData);
      toast.success("Welcome back! 👋");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const msg = getApiErrorMessage(error, "Unable to log in right now.");
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
            <span>AI Interview Platform</span>
          </div>

          <h1>
            Access your <span className="text-highlight">simulator workspace</span>.
          </h1>

          <p>
            Sign in to continue practicing with your AI interviewer, reviewing
            granular rubric feedback, and tracking your interview readiness.
          </p>

          <div className="info-list">
            <div className="info-list__item">
              Adaptive real-time AI mock interview questions
            </div>
            <div className="info-list__item">
              Instant score breakdown & actionable rubric feedback
            </div>
            <div className="info-list__item">
              Protected JWT session with secure PostgreSQL persistence
            </div>
          </div>

          {/* Decorative AI Readiness card */}
          <div className="auth-deco-card">
            <div className="auth-deco-card__row">
              <span className="auth-deco-score">92%</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>Interview Readiness</strong>
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
                    Advanced
                  </span>
                </div>
                <small>System Design & DSA · 45 min evaluation</small>
              </div>
            </div>
            <div className="auth-deco-bar">
              <div className="auth-deco-bar__fill" style={{ width: "92%" }} />
            </div>
          </div>
        </div>

        {/* Right form card */}
        <form className="auth-card" onSubmit={handleSubmit} id="login-form">
          <div className="auth-card__header">
            <span className="eyebrow" style={{ color: "var(--accent-mint)", letterSpacing: "0.08em" }}>
              Secure Login
            </span>
            <h2>Sign in to Account</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.2rem" }}>
              Enter your credentials to access your interview dashboard.
            </p>
          </div>

          <label className="field" htmlFor="login-email">
            <span>Email address</span>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="field" htmlFor="login-password">
            <span>Password</span>
            <div className="auth-password-wrap">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
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
          </label>

          <div className="auth-options-row">
            <label className="auth-checkbox-label" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <span className="auth-forgot-link" style={{ fontSize: "0.82rem", opacity: 0.8 }}>
              Forgot password? Contact admin
            </span>
          </div>

          {errorMessage && (
            <p className="form-message form-message--error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={isSubmitting}
            id="login-submit"
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
                Signing in…
              </>
            ) : (
              "Sign In →"
            )}
          </button>

          <p className="auth-card__footer">
            New to AI Interview Simulator?{" "}
            <Link to="/signup" style={{ color: "var(--accent-mint)", fontWeight: 700 }}>
              Create a free account →
            </Link>
          </p>
        </form>

      </section>
    </div>
  );
}

export default Login;
