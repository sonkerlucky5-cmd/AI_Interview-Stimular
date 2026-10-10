import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Successfully logged out.");
      closeMenu();
    } catch {
      toast.error("Logout failed.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">

        {/* Brand */}
        <Link className="brand" to="/" onClick={closeMenu} id="nav-brand">
          <span className="brand__mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="url(#ng)" />
              <rect x="8" y="14" width="8" height="2" rx="1" fill="url(#ng)" opacity="0.7"/>
              <rect x="6" y="18" width="12" height="2" rx="1" fill="url(#ng)" opacity="0.5"/>
              <defs>
                <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4f8cff" />
                  <stop offset="100%" stopColor="#8a5cff" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand__text">
            <strong className="brand__name">
              AI <span className="brand__accent">Interview</span>
            </strong>
            <small className="brand__sub">Simulator</small>
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`navbar__toggle ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
          id="nav-toggle"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav panel */}
        <div className={`navbar__panel ${isMenuOpen ? "is-open" : ""}`}>
          <nav className="navbar__links" aria-label="Primary navigation">
            <NavLink
              className={({ isActive }) => `navbar__link${isActive ? " active" : ""}`}
              to="/"
              end
              onClick={closeMenu}
              id="nav-home"
            >
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink
                className={({ isActive }) => `navbar__link${isActive ? " active" : ""}`}
                to="/dashboard"
                onClick={closeMenu}
                id="nav-dashboard"
              >
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                <div className="navbar__user" aria-label="User info">
                  <span className="navbar__user-avatar">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <div className="navbar__user-info">
                    <span>{user?.name}</span>
                    <small>{user?.role}</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="navbar__btn navbar__btn--ghost"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  id="nav-logout"
                >
                  {isLoggingOut ? "…" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <NavLink
                  className={({ isActive }) =>
                    `navbar__btn navbar__btn--ghost${isActive ? " active" : ""}`
                  }
                  to="/login"
                  onClick={closeMenu}
                  id="nav-login"
                >
                  Sign In
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `navbar__btn navbar__btn--primary${isActive ? " active" : ""}`
                  }
                  to="/signup"
                  onClick={closeMenu}
                  id="nav-signup"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
