import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [profile, setProfile] = useState({
    name: storedUser.name || "Alex Chen",
    email: storedUser.email || "alex@example.com",
    targetRole: storedUser.targetRole || "Senior Frontend Engineer",
    experienceYears: "4",
    bio: "Passionate about building scalable UI components, design systems, and optimizing web performance.",
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ ...storedUser, ...profile }));
    toast.success("Profile updated successfully!");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <span
          style={{
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--accent-cyan)",
            fontWeight: 700,
          }}
        >
          Candidate Workspace
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0.4rem 0", color: "#fff" }}>
          Candidate Profile & Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
          Manage your personal information, target role rubrics, and portfolio details.
        </p>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: "2.5rem 2rem",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Avatar Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00ffd0, #7b61ff)",
              display: "grid",
              placeItems: "center",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#05060f",
              boxShadow: "0 0 25px rgba(0, 255, 208, 0.4)",
            }}
          >
            {profile.name[0]?.toUpperCase() || "A"}
          </div>

          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              {profile.name}
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--accent-cyan)" }}>
              {profile.targetRole}
            </span>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Status: Active Practice Tier • 14 Interviews Completed
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSave} style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Target Role Track
              </label>
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Years of Experience
              </label>
              <input
                type="number"
                value={profile.experienceYears}
                onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
              Short Bio / Goals
            </label>
            <textarea
              rows="3"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "0.95rem 2rem",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #00ffd0, #7b61ff)",
              border: "none",
              color: "#05060f",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              justifySelf: "start",
            }}
          >
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
