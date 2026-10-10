import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, signup } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password.trim().length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(formData);
      toast.success("Account created! Welcome aboard 🚀");
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
          <span className="eyebrow">Get started free</span>
          <h1>Create the first secure account for your simulator.</h1>
          <p>
            This signup flow is wired to the backend API, hashes passwords with
            bcryptjs, and establishes a JWT-backed session for protected
            features.
          </p>
          <div className="info-list">
            <div className="info-list__item">Role-ready user model for future admin flows</div>
            <div className="info-list__item">Structured services & context for scaling auth</div>
            <div className="info-list__item">Responsive dark SaaS UI built for production</div>
          </div>

          {/* Decorative feature pills */}
          <div className="auth-deco-pills">
            {["AI Interviewer", "Instant Feedback", "Progress Tracking", "Secure Auth"].map((f) => (
              <span key={f} className="auth-deco-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* Right form card */}
        <form className="auth-card" onSubmit={handleSubmit} id="signup-form">
          <div className="auth-card__header">
            <span className="eyebrow">Create account</span>
            <h2>Get started</h2>
          </div>

          <label className="field" htmlFor="signup-name">
            <span>Full name</span>
            <input
              id="signup-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              autoComplete="name"
            />
          </label>

          <label className="field" htmlFor="signup-email">
            <span>Email address</span>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="field" htmlFor="signup-password">
            <span>Password</span>
            <input
              id="signup-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
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
            id="signup-submit"
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              "Create Account →"
            )}
          </button>

          <p className="auth-card__footer">
            Already registered? <Link to="/login">Sign in here</Link>
          </p>
        </form>

      </section>
    </div>
  );
}

export default Signup;
