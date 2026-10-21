export default function ProgressRing({ percent = 0, size = 110, strokeWidth = 8, label = "Readiness" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, Number(percent) || 0));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} role="progressbar" aria-valuenow={clampedPercent} aria-valuemin="0" aria-valuemax="100">
        <defs>
          <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5B8" />
            <stop offset="100%" stopColor="#00DDA5" />
          </linearGradient>
        </defs>

        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Foreground animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ring-grad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          filter="url(#ring-glow)"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>

      {/* Centered label */}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          {clampedPercent > 0 ? `${clampedPercent}%` : "—"}
        </span>
        <span style={{ fontSize: "0.68rem", color: "var(--accent-mint)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginTop: "0.15rem" }}>
          {label}
        </span>
      </div>
    </div>
  );
}
