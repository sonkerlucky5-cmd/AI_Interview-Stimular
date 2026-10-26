import { useRef } from "react";

export default function StatCard({ label, value, icon, change, badge, color = "cyan" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-3px)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  const colorStyles = {
    cyan: { accent: "var(--accent-mint)", border: "rgba(0, 245, 184, 0.28)", shadow: "rgba(0, 245, 184, 0.12)" },
    violet: { accent: "var(--accent-mint-soft)", border: "rgba(0, 221, 165, 0.25)", shadow: "rgba(0, 221, 165, 0.1)" },
    pink: { accent: "#00F5B8", border: "rgba(0, 245, 184, 0.25)", shadow: "rgba(0, 245, 184, 0.1)" },
    blue: { accent: "#00DDA5", border: "rgba(0, 221, 165, 0.25)", shadow: "rgba(0, 221, 165, 0.1)" },
  };

  const currentTheme = colorStyles[color] || colorStyles.cyan;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel tilt-card-3d"
      style={{
        padding: "1.4rem 1.5rem",
        borderRadius: "20px",
        border: `1px solid ${currentTheme.border}`,
        background: "var(--bg-card, rgba(10, 30, 26, 0.72))",
        boxShadow: `0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px ${currentTheme.shadow}`,
        backdropFilter: "blur(18px)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "transform 0.15s ease-out, border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
        <span style={{ fontSize: "1.8rem" }}>{icon}</span>
        {badge && (
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.22rem 0.6rem",
              borderRadius: "999px",
              background: "rgba(0, 245, 184, 0.12)",
              color: currentTheme.accent,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <strong style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--title)", lineHeight: 1.1 }}>
          {value}
        </strong>
        <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", letterSpacing: "0.01em" }}>
          {label}
        </span>
      </div>

      {change && (
        <div
          style={{
            marginTop: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "0.76rem",
            color: currentTheme.accent,
            fontWeight: 600,
            background: "rgba(0, 245, 184, 0.08)",
            padding: "0.22rem 0.65rem",
            borderRadius: "999px",
            border: `1px solid ${currentTheme.border}`,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "999px",
              background: currentTheme.accent,
              boxShadow: `0 0 6px ${currentTheme.accent}`,
              flexShrink: 0,
            }}
          />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{change}</span>
        </div>
      )}
    </div>
  );
}
