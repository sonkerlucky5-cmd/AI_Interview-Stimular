import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          background: "linear-gradient(135deg, #00ffd0, #7b61ff, #ff6ec7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
        Lost in Holographic Space
      </h1>

      <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "450px", marginBottom: "2rem" }}>
        The page you are looking for does not exist or has been relocated to another dimension.
      </p>

      <Link
        to="/"
        style={{
          padding: "0.95rem 2rem",
          borderRadius: "999px",
          background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
          color: "#05060f",
          fontWeight: 800,
          textDecoration: "none",
          fontSize: "1rem",
        }}
      >
        Return to Home →
      </Link>
    </div>
  );
}
