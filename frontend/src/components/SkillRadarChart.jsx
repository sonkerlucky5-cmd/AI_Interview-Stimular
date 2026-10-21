import { useMemo } from "react";

const DIMENSION_CONFIG = [
  { key: "technical_correctness", label: "Technical Correctness", short: "Technical" },
  { key: "reasoning_structure", label: "Reasoning & Structure", short: "Reasoning" },
  { key: "practical_tradeoffs", label: "Practical Tradeoffs", short: "Tradeoffs" },
  { key: "completeness", label: "Completeness", short: "Completeness" },
  { key: "relevance", label: "Relevance", short: "Relevance" },
];

export default function SkillRadarChart({ dimensions = {}, size = 320 }) {
  const center = size / 2;
  const radius = (size / 2) - 48;
  const numAxes = DIMENSION_CONFIG.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Determine if user has any real evaluated dimension data
  const hasData = useMemo(() => {
    return Object.values(dimensions || {}).some((v) => Number(v) > 0);
  }, [dimensions]);

  // Calculate polygon points for grid rings (25%, 50%, 75%, 100%)
  const gridRings = [0.25, 0.5, 0.75, 1.0].map((level) => {
    const points = DIMENSION_CONFIG.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * level;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return { level, points };
  });

  // Calculate user data polygon
  const dataPoints = useMemo(() => {
    return DIMENSION_CONFIG.map((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const rawVal = Number(dimensions?.[dim.key]) || 0;
      // Default to 45% preview guide if no real data yet
      const score = hasData ? Math.min(100, Math.max(10, rawVal)) : 45;
      const r = (score / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, score: rawVal, angle, label: dim.label, short: dim.short };
    });
  }, [dimensions, hasData, radius, center, angleStep]);

  const polygonPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: "100%", maxWidth: `${size}px`, height: "auto", overflow: "visible" }}
        role="img"
        aria-label="Skill Performance Radar Chart"
      >
        <defs>
          {/* Emerald radial glow filter */}
          <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="radar-poly-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5B8" stopOpacity={hasData ? 0.35 : 0.12} />
            <stop offset="100%" stopColor="#00DDA5" stopOpacity={hasData ? 0.15 : 0.05} />
          </linearGradient>
        </defs>

        {/* Concentric grid rings */}
        {gridRings.map((ring, idx) => (
          <polygon
            key={idx}
            points={ring.points}
            fill="none"
            stroke="rgba(0, 245, 184, 0.12)"
            strokeWidth="1"
            strokeDasharray={idx < 3 ? "2 3" : "none"}
          />
        ))}

        {/* Axis radial spokes */}
        {DIMENSION_CONFIG.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(0, 245, 184, 0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={polygonPath}
          fill="url(#radar-poly-grad)"
          stroke="#00F5B8"
          strokeWidth="2.2"
          filter="url(#radar-glow)"
          style={{ transition: "all 0.5s ease" }}
        />

        {/* Vertex markers & dimension labels */}
        {dataPoints.map((pt, i) => {
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(pt.angle);
          const ly = center + labelDist * Math.sin(pt.angle);

          // Horizontal alignment based on position
          const textAnchor =
            Math.abs(Math.cos(pt.angle)) < 0.25
              ? "middle"
              : Math.cos(pt.angle) > 0
              ? "start"
              : "end";

          return (
            <g key={i}>
              {/* Vertex circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#030907"
                stroke="#00F5B8"
                strokeWidth="2"
                filter="url(#radar-glow)"
              />
              <circle cx={pt.x} cy={pt.y} r="2" fill="#00F5B8" />

              {/* Text label */}
              <text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fill="var(--text-muted)"
                fontSize="11"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {pt.short}
                {hasData && (
                  <tspan fill="#00F5B8" fontWeight="700" dx="4">
                    {pt.score}%
                  </tspan>
                )}
              </text>
            </g>
          );
        })}
      </svg>

      {!hasData && (
        <span
          style={{
            marginTop: "0.5rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            background: "rgba(0, 245, 184, 0.08)",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            border: "1px solid rgba(0, 245, 184, 0.2)",
          }}
        >
          Baseline Guide · Complete your first interview to map dimensions
        </span>
      )}
    </div>
  );
}
