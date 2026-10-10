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
          Overview
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link${isActive ? " active" : ""}`} to="/" end>
          Public landing
        </NavLink>
        <span className="sidebar__link sidebar__link--muted">Interview room soon</span>
        <span className="sidebar__link sidebar__link--muted">AI feedback soon</span>
      </nav>

      <div className="sidebar__card sidebar__card--accent">
        <span className="eyebrow">Phase 1</span>
        <p>Authentication, routing, API structure, and a clean dashboard shell are ready.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
