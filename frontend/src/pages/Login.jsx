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
          <span className="eyebrow">Welcome back</span>
          <h1>Access your simulator workspace.</h1>
          <p>
            Sign in to continue practising with your AI interviewer, reviewing
            your feedback, and tracking your growth.
          </p>
          <div className="info-list">
            <div className="info-list__item">Cookie-based JWT session handling</div>
            <div className="info-list__item">PostgreSQL-backed user accounts</div>
            <div className="info-list__item">Protected routes with persisted auth state</div>
          </div>

          {/* Decorative card */}
          <div className="auth-deco-card">
            <div className="auth-deco-card__row">
              <span className="auth-deco-score">92%</span>
              <div>
                <strong>Last session score</strong>
                <small>System Design · 45 min</small>
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
            <span className="eyebrow">Login</span>
            <h2>Sign in</h2>
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
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </label>

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
            New here? <Link to="/signup">Create a free account</Link>
          </p>
        </form>

      </section>
    </div>
  );
}

export default Login;
