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
    <div
      className="page page--auth"
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1rem",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(500px, 90vw)",
          height: "min(500px, 90vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 245, 184, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ═════════════════════════════════════════════
          REFERENCE PANEL 02: CENTERED LOGIN CARD
          ═════════════════════════════════════════════ */}
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          margin: "0 auto",
          padding: "clamp(1.75rem, 4vw, 2.5rem) clamp(1.25rem, 3.5vw, 2.25rem)",
          background: "rgba(10, 30, 26, 0.82)",
          border: "1px solid rgba(0, 245, 184, 0.25)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-glass), 0 0 50px rgba(0, 245, 184, 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand Mark Centered */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.85rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(0, 245, 184, 0.12)",
              border: "1px solid rgba(0, 245, 184, 0.35)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 0 20px rgba(0, 245, 184, 0.25)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
              <circle cx="12" cy="12" r="4" fill="var(--accent-mint)" fillOpacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 2.5vw, 1.95rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              margin: "0.35rem 0 0",
              lineHeight: 1.5,
            }}
          >
            Sign in to continue your interview preparation
          </p>
        </div>

        {/* ── Social Login Buttons (Disabled with Coming Soon) ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.25rem" }}>
          {/* Google Button */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            style={{
              width: "100%",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              fontSize: "0.86rem",
              fontWeight: 600,
              cursor: "not-allowed",
              opacity: 0.72,
              userSelect: "none",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>Continue with Google</span>
            <span
              style={{
                fontSize: "0.68rem",
                padding: "0.15rem 0.45rem",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--text-dim)",
                fontWeight: 500,
              }}
            >
              Coming soon
            </span>
          </button>

          {/* GitHub Button */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            style={{
              width: "100%",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              fontSize: "0.86rem",
              fontWeight: 600,
              cursor: "not-allowed",
              opacity: 0.72,
              userSelect: "none",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
            <span
              style={{
                fontSize: "0.68rem",
                padding: "0.15rem 0.45rem",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--text-dim)",
                fontWeight: 500,
              }}
            >
              Coming soon
            </span>
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0, 245, 184, 0.25))" }} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "lowercase", letterSpacing: "0.05em" }}>
            or
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(0, 245, 184, 0.25), transparent)" }} />
        </div>

        {/* ── Email & Password Form ── */}
        <form onSubmit={handleSubmit} id="login-form" style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
          {/* Email Field with Label/Id */}
          <label className="field" htmlFor="login-email">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Email address
            </span>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={{
                minHeight: "44px",
                fontSize: "0.92rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(6, 18, 15, 0.8)",
                border: "1px solid rgba(0, 245, 184, 0.2)",
                color: "#FFFFFF",
              }}
            />
          </label>

          {/* Password Field with Label/Id and Accessible Eye Toggle */}
          <label className="field" htmlFor="login-password">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Password
            </span>
            <div className="auth-password-wrap" style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                style={{
                  minHeight: "44px",
                  fontSize: "0.92rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(6, 18, 15, 0.8)",
                  border: "1px solid rgba(0, 245, 184, 0.2)",
                  color: "#FFFFFF",
                  paddingRight: "2.75rem",
                  width: "100%",
                }}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  minWidth: "36px",
                  minHeight: "36px",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
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

          {/* Options Row: Remember Me & Exact Contact Admin Text */}
          <div className="auth-options-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <label className="auth-checkbox-label" htmlFor="remember-me" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.84rem", color: "var(--text-muted)" }}>
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--accent-mint)", width: "16px", height: "16px", cursor: "pointer" }}
              />
              <span>Remember me</span>
            </label>

            {/* Exactly "Forgot password? Contact admin" (Decision 2) */}
            <span className="auth-forgot-link" style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
              Forgot password? Contact admin
            </span>
          </div>

          {/* Error Message with role="alert" */}
          {errorMessage && (
            <div
              className="form-message form-message--error"
              role="alert"
              style={{
                background: "rgba(255, 77, 109, 0.1)",
                border: "1px solid rgba(255, 77, 109, 0.3)",
                borderRadius: "var(--radius-sm)",
                padding: "0.65rem 0.95rem",
                color: "var(--accent-coral)",
                fontSize: "0.85rem",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Primary Submit Pill Button */}
          <button
            type="submit"
            className="button button--primary button--block"
            disabled={isSubmitting}
            id="login-submit"
            style={{
              minHeight: "46px",
              padding: "0.85rem 1.5rem",
              fontSize: "0.95rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #00F5B8 0%, #00DDA5 100%)",
              color: "#030907",
              fontWeight: 700,
              boxShadow: "0 4px 20px rgba(0, 245, 184, 0.35)",
              border: "none",
              cursor: isSubmitting ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.4rem",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                Sign In <span style={{ fontSize: "1.1rem" }}>→</span>
              </>
            )}
          </button>
        </form>

        {/* ── Footer Link to /register (Decision 3) ── */}
        <p
          className="auth-card__footer"
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            marginBottom: 0,
            fontSize: "0.86rem",
            color: "var(--text-muted)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--accent-mint)",
              fontWeight: 700,
              textDecoration: "none",
              marginLeft: "0.25rem",
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

