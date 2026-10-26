import { useTheme } from "../context/ThemeContext";

/**
 * NEXA AI Brand Logo System
 * Accurately engineered from the brand reference 3D image:
 * - 3D faceted 'N' monogram emblem with sweeping orbital loop and beveled obsidian slash
 * - In Dark Mode: Crisp white typography (#FFFFFF), neon-lime AI (#94FF00), cyber glow
 * - In Light Mode: Deep obsidian typography (#050C08), emerald AI (#16A34A), clean contrast
 * - The letter 'N' in NEXA has its left vertical stem seamlessly integrated as the
 *   iconic 3D metallic green rounded capsule with top specular catchlight.
 * - Automatic real-time adaptation across theme toggles and system preferences.
 *
 * @param {('full'|'compact'|'icon')} variant - Layout variant
 * @param {string} className - Optional container CSS class
 * @param {number} size - Base height in pixels (default: 38)
 */
export default function NexaLogo({ variant = "full", className = "", size = 38 }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const prefix = `nexa-brand-${isLight ? "light" : "dark"}`;

  // Dimensions based on variant
  const isIcon = variant === "icon";
  const isCompact = variant === "compact";

  const viewBox = isIcon
    ? "0 0 54 54"
    : isCompact
    ? "0 0 195 54"
    : "0 0 236 54";

  const aspectRatio = isIcon ? 1 : isCompact ? 195 / 54 : 236 / 54;
  const width = Math.round(size * aspectRatio);

  return (
    <div className={`nexa-logo nexa-logo--${variant} ${className}`}>
      <svg
        width={width}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="nexa-logo__svg"
        aria-label="NEXA AI - AI Interview Simulator"
        role="img"
      >
        <defs>
          {/* 1. Front Emerald/Lime Ribbon Gradient */}
          <linearGradient id={`${prefix}-ribbon`} x1="10" y1="6" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#84CC16" : "#CCFF00"} />
            <stop offset="45%" stopColor={isLight ? "#16A34A" : "#94FF00"} />
            <stop offset="100%" stopColor={isLight ? "#059669" : "#00F5B8"} />
          </linearGradient>

          {/* 2. Top Catchlight Highlight */}
          <linearGradient id={`${prefix}-top-cap`} x1="14" y1="6" x2="28" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isLight ? "0.6" : "0.9"} />
            <stop offset="100%" stopColor={isLight ? "#84CC16" : "#CCFF00"} />
          </linearGradient>

          {/* 3. 3D Obsidian Diagonal Slicing Bar (Polished carbon/obsidian) */}
          <linearGradient id={`${prefix}-obsidian`} x1="14" y1="18" x2="38" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#1E2C24" : "#253A2F"} />
            <stop offset="40%" stopColor={isLight ? "#0B140F" : "#121F17"} />
            <stop offset="100%" stopColor={isLight ? "#030705" : "#070E0A"} />
          </linearGradient>

          {/* 4. Top Bevel Specular Sheen on Obsidian Bar */}
          <linearGradient id={`${prefix}-obsidian-bevel`} x1="18" y1="17" x2="38" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isLight ? "0.4" : "0.75"} />
            <stop offset="40%" stopColor={isLight ? "#426653" : "#68F0AE"} stopOpacity={isLight ? "0.3" : "0.5"} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>

          {/* 5. Sweeping Orbital Swoosh Gradient */}
          <linearGradient id={`${prefix}-swoosh`} x1="4" y1="46" x2="32" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#16A34A" : "#00F5B8"} stopOpacity="0.85" />
            <stop offset="60%" stopColor={isLight ? "#84CC16" : "#94FF00"} />
            <stop offset="100%" stopColor={isLight ? "#A3E635" : "#CCFF00"} stopOpacity="0.95" />
          </linearGradient>

          {/* 6. Metallic Green Capsule Gradient for Letter 'N' */}
          <linearGradient id={`${prefix}-capsule`} x1="60" y1="12" x2="60" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? "#84CC16" : "#CCFF00"} />
            <stop offset="50%" stopColor={isLight ? "#16A34A" : "#94FF00"} />
            <stop offset="100%" stopColor={isLight ? "#047857" : "#059669"} />
          </linearGradient>

          {/* 7. Ambient Neon Glow Filter */}
          <filter id={`${prefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════
            1. 3D FACETED 'N' EMBLEM (0 0 54 54)
           ══════════════════════════════════════════════════ */}
        <g className="nexa-logo__emblem">
          {/* Orbital Sweeping Loop in Background */}
          <path
            d="M 6 36 C 4 24, 11 15, 23 11 C 28 9, 32 11, 30 14 C 27 18, 17 21, 13 32 C 10 39, 13 45, 21 44 C 27 43, 31 38, 34 32"
            stroke={`url(#${prefix}-swoosh)`}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Left Upright Pillar (Front green facet) */}
          <polygon
            points="14,14 22,7 22,43 14,47"
            fill={`url(#${prefix}-ribbon)`}
          />

          {/* Left Upright Top Beveled Cap (Catchlight) */}
          <polygon
            points="14,14 22,7 28,12 20,19"
            fill={`url(#${prefix}-top-cap)`}
          />

          {/* Left Pillar Shadow Bevel */}
          <polygon
            points="22,7 28,12 28,37 22,43"
            fill={isLight ? "#0D1E15" : "#08160F"}
            opacity="0.95"
          />

          {/* Central 3D Obsidian Diagonal Bar (Cutting across N) */}
          <polygon
            points="18,17 38,40 33,47 13,24"
            fill={`url(#${prefix}-obsidian)`}
          />

          {/* Top Bevel Highlight on Obsidian Bar */}
          <polygon
            points="18,17 38,40 37,42 17,19"
            fill={`url(#${prefix}-obsidian-bevel)`}
          />

          {/* Specular Edge Highlight along Obsidian Bar */}
          <line
            x1="18"
            y1="17"
            x2="38"
            y2="40"
            stroke={isLight ? "#426653" : "#68F0AE"}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity={isLight ? "0.6" : "0.85"}
          />

          {/* Dark Mode Ambient Rim Glow */}
          {!isLight && (
            <polygon
              points="18,17 38,40 33,47 13,24"
              fill="none"
              stroke="#68F0AE"
              strokeWidth="0.75"
              opacity="0.3"
            />
          )}

          {/* Right Upright Pillar (Front green facet) */}
          <polygon
            points="31,14 39,7 39,40 31,44"
            fill={`url(#${prefix}-ribbon)`}
          />

          {/* Right Upright Top Beveled Cap */}
          <polygon
            points="31,14 39,7 45,12 37,19"
            fill={`url(#${prefix}-top-cap)`}
          />

          {/* Right Upright Shadow Bevel */}
          <polygon
            points="39,7 45,12 45,35 39,40"
            fill={isLight ? "#0B1911" : "#06120C"}
            opacity="0.95"
          />

          {/* Outer Orbital Sweeping Loop in Foreground */}
          <path
            d="M 5 31 C 3 41, 15 48, 29 42 C 37 38, 43 30, 46 22"
            stroke={`url(#${prefix}-ribbon)`}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Satellite Neural Sparkle Nodes */}
          <circle cx="46" cy="22" r="2.4" fill={isLight ? "#16A34A" : "#CCFF00"} />
          <circle cx="6" cy="31" r="1.8" fill={isLight ? "#059669" : "#00F5B8"} />
        </g>

        {/* ══════════════════════════════════════════════════
            2. WORDMARK: NEXA AI (Auto Theme Typography)
           ══════════════════════════════════════════════════ */}
        {!isIcon && (
          <g className="nexa-logo__wordmark-group">
            {/* ── Letter 'N' with integrated Metallic Green Capsule Stem ── */}
            <g className="nexa-logo__letter-n">
              {/* Left Upright: Rounded Metallic Green Capsule (Reference Image match) */}
              <rect
                x="58"
                y="12"
                width="5.5"
                height="22.5"
                rx="2.75"
                fill={`url(#${prefix}-capsule)`}
              />

              {/* Glossy Top Catchlight on Capsule */}
              <ellipse
                cx="60.75"
                cy="14.8"
                rx="1.6"
                ry="2.1"
                fill="#FFFFFF"
                opacity={isLight ? "0.6" : "0.9"}
              />

              {/* Diagonal and Right Upright of 'N' in Theme Typography Color */}
              <path
                d="M 62.5 12 L 68 12 L 74.5 21 L 74.5 12 L 80 12 L 80 34.5 L 74.5 34.5 L 62.5 17 Z"
                fill="var(--logo-text-primary)"
              />
            </g>

            {/* ── Letters 'EXA' and 'AI' ── */}
            <text
              x="84"
              y="34.5"
              fontFamily="'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="24.5"
              letterSpacing="-0.025em"
            >
              <tspan fill="var(--logo-text-primary)">EXA</tspan>
              <tspan
                fill="var(--logo-accent)"
                dx="6"
                filter={isLight ? undefined : `url(#${prefix}-glow)`}
              >
                AI
              </tspan>
            </text>

            {/* ── Subtitle: AI INTERVIEW SIMULATOR ── */}
            {!isCompact && (
              <text
                x="58"
                y="47.5"
                fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                fontSize="7.4"
                fontWeight="700"
                letterSpacing="0.18em"
                fill="var(--logo-text-secondary)"
              >
                AI INTERVIEW SIMULATOR
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
