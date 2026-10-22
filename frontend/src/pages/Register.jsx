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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    // Confirm Password client-side match check (Decision 2)
    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (formData.password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
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
      // Backend payload preserves exact { name, email, password, targetRole }
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        targetRole: formData.targetRole,
      });
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

  const roles = [
    { id: "Frontend", label: "Frontend" },
    { id: "Backend", label: "Backend" },
    { id: "FullStack", label: "Full Stack" },
    { id: "SystemDesign", label: "System Design" },
  ];

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
          width: "min(520px, 92vw)",
          height: "min(520px, 92vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 245, 184, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ═════════════════════════════════════════════
          REFERENCE PANEL 03: CENTERED REGISTER CARD
          ═════════════════════════════════════════════ */}
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "480px",
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
        <div style={{ textAlign: "center", marginBottom: "1.35rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 2.5vw, 1.95rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Create Your Account
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              margin: "0.35rem 0 0",
              lineHeight: 1.5,
            }}
          >
            Start your interview preparation journey today
          </p>
        </div>

        {/* ── Social Registration Buttons (Disabled with Coming Soon) ── */}
        <div style={{ display: "flex", gap: "0.65rem", marginBottom: "1.15rem", flexWrap: "wrap" }}>
          {/* Google Button */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            style={{
              flex: 1,
              minWidth: "180px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.55rem",
              fontSize: "0.84rem",
              fontWeight: 600,
              cursor: "not-allowed",
              opacity: 0.72,
              userSelect: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
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
            <span>Google</span>
            <span
              style={{
                fontSize: "0.65rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--text-dim)",
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
              flex: 1,
              minWidth: "180px",
              minHeight: "44px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.55rem",
              fontSize: "0.84rem",
              fontWeight: 600,
              cursor: "not-allowed",
              opacity: 0.72,
              userSelect: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
            <span
              style={{
                fontSize: "0.65rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.08)",
                color: "var(--text-dim)",
              }}
            >
              Coming soon
            </span>
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.15rem 0" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0, 245, 184, 0.25))" }} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "lowercase", letterSpacing: "0.05em" }}>
            or
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(0, 245, 184, 0.25), transparent)" }} />
        </div>

        {/* ── Registration Form ── */}
        <form onSubmit={handleSubmit} id="register-form" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {/* Full Name */}
          <label className="field" htmlFor="register-name">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Full Name
            </span>
            <input
              id="register-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              required
              style={{
                minHeight: "44px",
                fontSize: "0.92rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(6, 18, 15, 0.8)",
                border: errors.name ? "1px solid var(--accent-coral)" : "1px solid rgba(0, 245, 184, 0.2)",
                color: "#FFFFFF",
              }}
            />
            {errors.name && (
              <small role="alert" style={{ color: "var(--accent-coral)", fontSize: "0.78rem" }}>
                {errors.name}
              </small>
            )}
          </label>

          {/* Email Address */}
          <label className="field" htmlFor="register-email">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Email address
            </span>
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              required
              style={{
                minHeight: "44px",
                fontSize: "0.92rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(6, 18, 15, 0.8)",
                border: errors.email ? "1px solid var(--accent-coral)" : "1px solid rgba(0, 245, 184, 0.2)",
                color: "#FFFFFF",
              }}
            />
            {errors.email && (
              <small role="alert" style={{ color: "var(--accent-coral)", fontSize: "0.78rem" }}>
                {errors.email}
              </small>
            )}
          </label>

          {/* Target Role Track Selection (Preserved Backend Logic) */}
          <div className="field">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Target Interview Track
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.45rem" }}>
              {roles.map((r) => {
                const isSelected = formData.targetRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetRole: r.id })}
                    style={{
                      minHeight: "40px",
                      padding: "0.45rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      border: isSelected ? "1px solid var(--accent-mint)" : "1px solid rgba(0, 245, 184, 0.15)",
                      background: isSelected ? "rgba(0, 245, 184, 0.15)" : "rgba(255, 255, 255, 0.02)",
                      color: isSelected ? "var(--accent-mint)" : "var(--text-muted)",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      textAlign: "center",
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Field */}
          <label className="field" htmlFor="register-password">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Password (min. 8 characters)
            </span>
            <div className="auth-password-wrap" style={{ position: "relative" }}>
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                required
                style={{
                  minHeight: "44px",
                  fontSize: "0.92rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(6, 18, 15, 0.8)",
                  border: errors.password ? "1px solid var(--accent-coral)" : "1px solid rgba(0, 245, 184, 0.2)",
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
            {errors.password && (
              <small role="alert" style={{ color: "var(--accent-coral)", fontSize: "0.78rem" }}>
                {errors.password}
              </small>
            )}
          </label>

          {/* Confirm Password Field (Decision 2 - Client Match Check) */}
          <label className="field" htmlFor="register-confirm-password">
            <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-main)" }}>
              Confirm Password
            </span>
            <div className="auth-password-wrap" style={{ position: "relative" }}>
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                required
                style={{
                  minHeight: "44px",
                  fontSize: "0.92rem",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(6, 18, 15, 0.8)",
                  border: errors.confirmPassword ? "1px solid var(--accent-coral)" : "1px solid rgba(0, 245, 184, 0.2)",
                  color: "#FFFFFF",
                  paddingRight: "2.75rem",
                  width: "100%",
                }}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
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
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <small role="alert" style={{ color: "var(--accent-coral)", fontSize: "0.78rem" }}>
                {errors.confirmPassword}
              </small>
            )}
          </label>

          {/* Plain Text Terms & Privacy Notice (Decision 3 - No dead links/checkbox) */}
          <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", margin: "0.2rem 0", lineHeight: 1.5 }}>
            By creating an account, you agree to our standard platform Terms of Service & Privacy Policy.
          </p>

          {/* Backend Error Alert */}
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
            id="register-submit"
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
              marginTop: "0.3rem",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              <>
                Create Account <span style={{ fontSize: "1.1rem" }}>→</span>
              </>
            )}
          </button>
        </form>

        {/* ── Footer Link to /login ── */}
        <p
          className="auth-card__footer"
          style={{
            textAlign: "center",
            marginTop: "1.35rem",
            marginBottom: 0,
            fontSize: "0.86rem",
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--accent-mint)",
              fontWeight: 700,
              textDecoration: "none",
              marginLeft: "0.25rem",
            }}
          >
            Sign In here →
          </Link>
        </p>
      </div>
    </div>
  );
}

