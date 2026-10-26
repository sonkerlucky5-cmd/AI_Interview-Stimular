import { useTheme } from "../context/ThemeContext";

/**
 * NEXA AI Brand Logo System
 * Accurately engineered from the brand reference image:
 * - 3D faceted 'N' neural monogram with sweeping orbital swoosh
 * - Glossy obsidian diagonal cross-beam and vibrant neon-lime (#94FF00) ribbons
 * - Automatic adaptation: In Light Mode, 'NEXA' is deep obsidian/black (#030806);
 *   in Dark Mode, 'NEXA' is crisp white (#FFFFFF) with luminous glow.
 * - Iconic metallic green pill/capsule on the first upright of 'N'.
 *
 * @param {('full'|'compact'|'icon')} variant - Layout variant ('full' includes subtitle)
 * @param {string} className - Optional container CSS class
 * @param {number} size - Base icon dimension in pixels (default: 38)
 */
export default function NexaLogo({ variant = "full", className = "", size = 38 }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Unique gradient identifiers based on theme to prevent browser caching conflicts
  const prefix = `nexa-brand-${isLight ? "light" : "dark"}`;

  return (
    <div className={`nexa-logo nexa-logo--${variant} ${className}`}>
      {/* ── 3D Faceted 'N' Monogram Emblem (Reference Match) ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="nexa-logo__mark"
        aria-hidden="true"
      >
        <defs>
          {/* Front Emerald/Lime Ribbon Gradient */}
          <linearGradient id={`${prefix}-ribbon`} x1="10" y1="6" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#84CC16" : "#CCFF00"} />
            <stop offset="45%" stopColor={isLight ? "#16A34A" : "#94FF00"} />
            <stop offset="100%" stopColor={isLight ? "#059669" : "#00F5B8"} />
          </linearGradient>

          {/* Top Beveled Highlight (Catchlight) */}
          <linearGradient id={`${prefix}-top-cap`} x1="14" y1="6" x2="28" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isLight ? "0.6" : "0.9"} />
            <stop offset="100%" stopColor={isLight ? "#84CC16" : "#CCFF00"} />
          </linearGradient>

          {/* 3D Obsidian Diagonal Slicing Bar */}
          <linearGradient id={`${prefix}-obsidian`} x1="14" y1="18" x2="38" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#1E2E25" : "#1B2A22"} />
            <stop offset="50%" stopColor={isLight ? "#09120D" : "#0A1610"} />
            <stop offset="100%" stopColor={isLight ? "#030805" : "#040A07"} />
          </linearGradient>

          {/* Sweeping Orbital Swoosh Gradient */}
          <linearGradient id={`${prefix}-swoosh`} x1="4" y1="46" x2="32" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#16A34A" : "#00F5B8"} stopOpacity="0.85" />
            <stop offset="60%" stopColor={isLight ? "#84CC16" : "#94FF00"} />
            <stop offset="100%" stopColor={isLight ? "#A3E635" : "#CCFF00"} stopOpacity="0.95" />
          </linearGradient>

          {/* Soft ambient inner glow */}
          <filter id={`${prefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Dynamic Orbital Sweeping Loop (wrapping from bottom-left around N) */}
        <path
          d="M 6 36 C 4 24, 11 15, 23 11 C 28 9, 32 11, 30 14 C 27 18, 17 21, 13 32 C 10 39, 13 45, 21 44 C 27 43, 31 38, 34 32"
          stroke={`url(#${prefix}-swoosh)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 2. Left Upright Pillar (Front green facet) */}
        <polygon
          points="14,14 22,7 22,43 14,47"
          fill={`url(#${prefix}-ribbon)`}
          filter={`url(#${prefix}-glow)`}
        />

        {/* 3. Left Upright Top Beveled Cap (Glossy highlight) */}
        <polygon
          points="14,14 22,7 28,12 20,19"
          fill={`url(#${prefix}-top-cap)`}
        />

        {/* 4. Left Pillar Right Shadow Bevel */}
        <polygon
          points="22,7 28,12 28,37 22,43"
          fill={isLight ? "#0D1E15" : "#08160F"}
          opacity="0.95"
        />

        {/* 5. Central Diagonal 3D Obsidian Bar (Cutting across N) */}
        <polygon
          points="18,17 38,40 33,47 13,24"
          fill={`url(#${prefix}-obsidian)`}
        />

        {/* Specular edge highlight along obsidian bar */}
        <line
          x1="18"
          y1="17"
          x2="38"
          y2="40"
          stroke={isLight ? "#385444" : "#457059"}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 6. Right Upright Pillar (Front green facet) */}
        <polygon
          points="31,14 39,7 39,40 31,44"
          fill={`url(#${prefix}-ribbon)`}
        />

        {/* 7. Right Upright Top Beveled Cap */}
        <polygon
          points="31,14 39,7 45,12 37,19"
          fill={`url(#${prefix}-top-cap)`}
        />

        {/* 8. Right Upright Side Bevel */}
        <polygon
          points="39,7 45,12 45,35 39,40"
          fill={isLight ? "#0B1911" : "#06120C"}
          opacity="0.95"
        />

        {/* 9. Dynamic Outer Orbital Swoosh Loop (Forefront accent) */}
        <path
          d="M 5 31 C 3 41, 15 48, 29 42 C 37 38, 43 30, 46 22"
          stroke={`url(#${prefix}-ribbon)`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Satellite Neural Sparkle Nodes */}
        <circle cx="46" cy="22" r="2.4" fill={isLight ? "#16A34A" : "#CCFF00"} />
        <circle cx="6" cy="31" r="1.8" fill={isLight ? "#059669" : "#00F5B8"} />
      </svg>

      {/* ── Wordmark: NEXA AI (Auto Dark/Light Theme Typography) ── */}
      {variant !== "icon" && (
        <div className="nexa-logo__wordmark">
          <div
            className="nexa-logo__title"
            style={{ fontSize: size >= 40 ? "1.45rem" : "1.22rem" }}
          >
            {/* Metallic Green Capsule on first upright of N (Reference detail) */}
            <span className="nexa-logo__n-capsule" aria-hidden="true" />
            <span className="nexa-logo__nexa">NEXA</span>
            <span className="nexa-logo__ai">AI</span>
          </div>

          {variant === "full" && (
            <span className="nexa-logo__subtitle">
              AI Interview Simulator
            </span>
          )}
        </div>
      )}
    </div>
  );
}

