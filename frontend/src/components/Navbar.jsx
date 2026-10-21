import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu on click outside or Escape key
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

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

  const handleAnchorClick = (e, selector) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (window.__lenis) {
          window.__lenis.scrollTo(selector, { offset: -80 });
        } else {
          document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      if (window.__lenis) {
        window.__lenis.scrollTo(selector, { offset: -80 });
      } else {
        document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar__inner">
        {/* Brand */}
        <Link className="brand" to="/" onClick={closeMenu} id="nav-brand">
          <span className="brand__mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="url(#emerald-logo-grad)" strokeWidth="2" fill="rgba(0, 245, 184, 0.12)" />
              <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16" stroke="#00F5B8" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" fill="#00F5B8" />
              <defs>
                <linearGradient id="emerald-logo-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00F5B8" />
                  <stop offset="100%" stopColor="#00DDA5" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand__text">
            <strong className="brand__name">
              AI Interview
            </strong>
            <small className="brand__sub" style={{ color: "var(--accent-mint)", letterSpacing: "0.08em" }}>Simulator</small>
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

            <a
              href="#features"
              className="navbar__link"
              onClick={(e) => handleAnchorClick(e, "#features")}
              id="nav-features"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="navbar__link"
              onClick={(e) => handleAnchorClick(e, "#how-it-works")}
              id="nav-process"
            >
              How It Works
            </a>

            <a
              href="#pricing"
              className="navbar__link"
              onClick={(e) => handleAnchorClick(e, "#pricing")}
              id="nav-pricing"
            >
              Pricing
            </a>

            <a
              href="#testimonials"
              className="navbar__link"
              onClick={(e) => handleAnchorClick(e, "#testimonials")}
              id="nav-testimonials"
            >
              Testimonials
            </a>

            <a
              href="#faq"
              className="navbar__link"
              onClick={(e) => handleAnchorClick(e, "#faq")}
              id="nav-faq"
            >
              FAQ
            </a>

            {isAuthenticated && (
              <>
                <NavLink
                  className={({ isActive }) => `navbar__link${isActive ? " active" : ""}`}
                  to="/dashboard"
                  onClick={closeMenu}
                  id="nav-dashboard"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  className={({ isActive }) => `navbar__link${isActive ? " active" : ""}`}
                  to="/interview"
                  onClick={closeMenu}
                  id="nav-mock-interview"
                >
                  Practice Room
                </NavLink>
              </>
            )}
          </nav>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar__user" aria-label="User info" onClick={closeMenu}>
                  <span className="navbar__user-avatar">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <div className="navbar__user-info">
                    <span>{user?.name}</span>
                    <small>{user?.role}</small>
                  </div>
                </Link>
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
                  to="/register"
                  onClick={closeMenu}
                  id="nav-signup"
                >
                  Get Started →
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
