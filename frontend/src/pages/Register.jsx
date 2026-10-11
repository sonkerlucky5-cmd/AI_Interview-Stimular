import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", targetRole: "Frontend" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email format";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Fake user registration demo
    const fakeUser = {
      name: formData.name,
      email: formData.email,
      targetRole: formData.targetRole,
      token: "demo_jwt_token_" + Date.now(),
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    toast.success("Account created successfully!");
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2.5rem 2rem",
          borderRadius: "24px",
          border: "1px solid rgba(0, 255, 208, 0.25)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 208, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--accent-cyan)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Create Your Account
          </span>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#fff", margin: "0.4rem 0" }}>
            Join Interview<span style={{ color: "var(--accent-cyan)" }}>AI</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Start practicing AI mock interviews and track your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Chen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: errors.name ? "1px solid #ff6ec7" : "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
            {errors.name && <small style={{ color: "#ff6ec7", fontSize: "0.78rem" }}>{errors.name}</small>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: errors.email ? "1px solid #ff6ec7" : "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
            {errors.email && <small style={{ color: "#ff6ec7", fontSize: "0.78rem" }}>{errors.email}</small>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
              Target Role
            </label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "#0c0f22",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            >
              <option value="Frontend">Frontend Engineer (React / Next)</option>
              <option value="Backend">Backend Engineer (Node / Go)</option>
              <option value="FullStack">Full Stack Engineer</option>
              <option value="SystemDesign">System Architect</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: errors.password ? "1px solid #ff6ec7" : "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
            {errors.password && <small style={{ color: "#ff6ec7", fontSize: "0.78rem" }}>{errors.password}</small>}
          </div>

          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.95rem",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
              border: "none",
              color: "#05060f",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Create Account & Launch Dashboard →
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
