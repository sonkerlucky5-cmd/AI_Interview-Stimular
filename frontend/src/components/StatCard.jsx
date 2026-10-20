import { useRef } from "react";

export default function StatCard({ label, value, icon, change, badge, color = "cyan" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  const colorStyles = {
    cyan: { accent: "var(--accent-mint)", border: "rgba(98, 245, 160, 0.25)", shadow: "rgba(98, 245, 160, 0.15)" },
    violet: { accent: "var(--accent-mint-soft)", border: "rgba(150, 255, 195, 0.22)", shadow: "rgba(150, 255, 195, 0.12)" },
    pink: { accent: "#FF6E8A", border: "rgba(255, 110, 138, 0.25)", shadow: "rgba(255, 110, 138, 0.12)" },
    blue: { accent: "#25E27B", border: "rgba(37, 226, 123, 0.25)", shadow: "rgba(37, 226, 123, 0.12)" },
  };

  const currentTheme = colorStyles[color] || colorStyles.cyan;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel tilt-card-3d"
      style={{
        padding: "1.5rem",
        borderRadius: "20px",
        border: `1px solid ${currentTheme.border}`,
        boxShadow: `0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px ${currentTheme.shadow}`,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.8rem" }}>{icon}</span>
        {badge && (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.25rem 0.65rem",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.08)",
              color: currentTheme.accent,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <strong style={{ fontSize: "2.1rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
          {value}
        </strong>
        <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", letterSpacing: "0.02em" }}>
          {label}
        </span>
      </div>

      {change && (
        <div style={{ marginTop: "0.85rem", fontSize: "0.8rem", color: currentTheme.accent, fontWeight: 600 }}>
          {change}
        </div>
      )}
    </div>
  );
}
