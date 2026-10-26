import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import NexaLogo from "./NexaLogo";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close menu and dropdown on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Close menu and dropdown on click outside or Escape key
  useEffect(() => {
    if (!isMenuOpen && !isDropdownOpen) return;

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
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
  }, [isMenuOpen, isDropdownOpen]);

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
    setIsDropdownOpen(false);
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
        <Link className="brand" to="/" onClick={closeMenu} id="nav-brand" aria-label="NEXA AI Home">
          <NexaLogo variant="full" size={36} />
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
            {isAuthenticated ? (
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

                {/* Explore Dropdown */}
                <div className="navbar__dropdown" ref={dropdownRef}>
                  <button
                    type="button"
                    className={`navbar__dropdown-trigger ${isDropdownOpen ? "is-open" : ""}`}
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    id="nav-dropdown-trigger"
                  >
                    <span>Explore</span>
                    <span className="navbar__dropdown-chevron" aria-hidden="true">▾</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="navbar__dropdown-menu" role="menu">
                      <NavLink
                        to="/"
                        end
                        className="navbar__dropdown-item"
                        onClick={closeMenu}
                      >
                        <span className="navbar__dropdown-icon">🏠</span>
                        <span>Home</span>
                      </NavLink>

                      <a
                        href="#features"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#features")}
                      >
                        <span className="navbar__dropdown-icon">✨</span>
                        <span>Features</span>
                      </a>

                      <a
                        href="#how-it-works"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#how-it-works")}
                      >
                        <span className="navbar__dropdown-icon">⚡</span>
                        <span>How It Works</span>
                      </a>

                      <a
                        href="#pricing"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#pricing")}
                      >
                        <span className="navbar__dropdown-icon">💎</span>
                        <span>Pricing</span>
                      </a>

                      <a
                        href="#rubric-methodology"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#rubric-methodology")}
                      >
                        <span className="navbar__dropdown-icon">📋</span>
                        <span>Rubric</span>
                      </a>

                      <a
                        href="#faq"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#faq")}
                      >
                        <span className="navbar__dropdown-icon">❓</span>
                        <span>FAQ</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
                  href="#pricing"
                  className="navbar__link"
                  onClick={(e) => handleAnchorClick(e, "#pricing")}
                  id="nav-pricing"
                >
                  Pricing
                </a>

                {/* More Dropdown for Guests */}
                <div className="navbar__dropdown" ref={dropdownRef}>
                  <button
                    type="button"
                    className={`navbar__dropdown-trigger ${isDropdownOpen ? "is-open" : ""}`}
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    id="nav-dropdown-trigger"
                  >
                    <span>More</span>
                    <span className="navbar__dropdown-chevron" aria-hidden="true">▾</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="navbar__dropdown-menu" role="menu">
                      <a
                        href="#how-it-works"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#how-it-works")}
                      >
                        <span className="navbar__dropdown-icon">⚡</span>
                        <span>How It Works</span>
                      </a>

                      <a
                        href="#testimonials"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#testimonials")}
                      >
                        <span className="navbar__dropdown-icon">💬</span>
                        <span>Testimonials</span>
                      </a>

                      <a
                        href="#faq"
                        className="navbar__dropdown-item"
                        onClick={(e) => handleAnchorClick(e, "#faq")}
                      >
                        <span className="navbar__dropdown-icon">❓</span>
                        <span>FAQ</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          <div className="navbar__actions">
            <ThemeToggle id="nav-theme-toggle" />
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
