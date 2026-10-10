import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__card">
        <span className="eyebrow">Workspace</span>
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>

      <nav className="sidebar__nav">
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/dashboard">
          📊 Overview
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/resumes">
          📄 Resume Library
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/jobs">
          💼 Target Jobs
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/matches">
          🎯 Match Analysis
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/interviews/new">
          🎙️ Mock Interview
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/interviews">
          📋 Session History
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/analytics">
          📈 Skill Analytics
        </NavLink>
      </nav>

      <div className="sidebar__card sidebar__card--accent">
        <span className="eyebrow">Analytics & Reports Live</span>
        <p>Review evaluations, competency trends & export PDF reports anytime.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
