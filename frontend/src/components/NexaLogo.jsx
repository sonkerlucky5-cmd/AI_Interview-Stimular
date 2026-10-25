import { useTheme } from "../context/ThemeContext";

/**
 * NEXA AI Brand Logo System
 * Inspired directly by the visual identity reference:
 * - Geometric 3D 'N' neural monogram with orbiting dynamic ring
 * - Vibrant neon-lime (#94FF00) and emerald (#00F5B8) accents
 * - Fully vector SVG, Retina-ready, light & dark mode aware
 *
 * @param {('full'|'compact'|'icon')} variant - Layout variant
 * @param {string} className - Optional container CSS class
 * @param {number} size - Base icon dimension in pixels (default: 36)
 */
export default function NexaLogo({ variant = "full", className = "", size = 36 }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const primaryText = isLight ? "#0B1713" : "#FFFFFF";
  const accentGradientId = `nexa-grad-${variant}-${isLight ? "light" : "dark"}`;
  const ringGradientId = `nexa-ring-${variant}-${isLight ? "light" : "dark"}`;

  return (
    <div
      className={`nexa-logo nexa-logo--${variant} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: variant === "icon" ? 0 : "0.75rem",
        textDecoration: "none",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {/* Geometric 'N' Neural Monogram with Orbiting Ring */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: isLight ? "none" : "drop-shadow(0 2px 10px rgba(148, 255, 0, 0.35))" }}
        aria-hidden="true"
      >
        <defs>
          {/* Main 'N' facet gradient */}
          <linearGradient id={accentGradientId} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94FF00" />
            <stop offset="50%" stopColor="#00F5B8" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Orbiting ring gradient */}
          <linearGradient id={ringGradientId} x1="4" y1="36" x2="44" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94FF00" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00F5B8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>

          {/* Soft inner glow filter */}
          <filter id={`glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Ring (Back segment) */}
        <path
          d="M 8 32 C 4 24, 12 12, 28 8 C 36 6, 42 10, 44 16"
          stroke={`url(#${ringGradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 2"
          opacity="0.45"
        />

        {/* Left vertical pillar of 'N' */}
        <path
          d="M 12 10 L 18 6 L 18 38 L 12 42 Z"
          fill={`url(#${accentGradientId})`}
          opacity="0.95"
        />

        {/* Diagonal bridge of 'N' (faceted 3D geometry) */}
        <path
          d="M 18 6 L 30 34 L 30 42 L 18 14 Z"
          fill="#94FF00"
          filter={`url(#glow-${variant})`}
        />
        <path
          d="M 18 14 L 30 42 L 36 38 L 24 10 Z"
          fill={`url(#${accentGradientId})`}
          opacity="0.88"
        />

        {/* Right vertical pillar of 'N' */}
        <path
          d="M 30 10 L 36 6 L 36 38 L 30 42 Z"
          fill={`url(#${accentGradientId})`}
          opacity="0.95"
        />

        {/* Orbit Ring (Front dynamic sweeping loop) */}
        <path
          d="M 4 28 C 4 38, 20 44, 38 34 C 44 30, 46 22, 42 16"
          stroke={`url(#${ringGradientId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Tiny neural satellite node */}
        <circle cx="42" cy="16" r="2.5" fill="#94FF00" />
        <circle cx="6" cy="30" r="2" fill="#00F5B8" />
      </svg>

      {/* Wordmark (rendered when variant is 'full' or 'compact') */}
      {variant !== "icon" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", "Inter", sans-serif)',
              fontSize: size >= 40 ? "1.45rem" : "1.2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: primaryText,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <span>NEXA</span>
            <span
              style={{
                color: isLight ? "#16A34A" : "#94FF00",
                textShadow: isLight ? "none" : "0 0 12px rgba(148, 255, 0, 0.45)",
              }}
            >
              AI
            </span>
          </div>

          {variant === "full" && (
            <span
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isLight ? "#4B6358" : "rgba(157, 187, 176, 0.85)",
              }}
            >
              AI Interview Simulator
            </span>
          )}
        </div>
      )}
    </div>
  );
}
