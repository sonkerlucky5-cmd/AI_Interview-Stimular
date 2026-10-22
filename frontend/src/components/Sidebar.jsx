import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      <div className="sidebar__card" style={{ padding: "1.2rem 1.3rem", borderRadius: "18px" }}>
        <span className="eyebrow" style={{ color: "var(--accent-mint)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
          Workspace
        </span>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", margin: "0.2rem 0 0.15rem" }}>
          {user?.name || "Candidate"}
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {user?.targetRole || user?.email || "Full Stack Engineer"}
        </p>
      </div>

      <nav className="sidebar__nav" style={{ display: "grid", gap: "0.4rem" }}>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/dashboard"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/interviews/new"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>🎙️</span>
          <span>Mock Interview</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/dsa"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>💻</span>
          <span>DSA Practice</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/roadmap"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>🗺️</span>
          <span>Learning Roadmap</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/analytics"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>📈</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/resumes"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>📄</span>
          <span>Resume Manager</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/jobs"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>💼</span>
          <span>Target Jobs</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/matches"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>🎯</span>
          <span>Job Matching</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`}
          to="/profile"
        >
          <span aria-hidden="true" style={{ fontSize: "1.05rem" }}>👤</span>
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar__card sidebar__card--accent" style={{ padding: "1.1rem 1.25rem", borderRadius: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.3rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "var(--accent-mint)", boxShadow: "0 0 8px var(--accent-mint)" }} />
          <span className="eyebrow" style={{ color: "var(--accent-mint)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
            AI Copilot Active
          </span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
          Continuous interview evaluation & skill trend tracking.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
