import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/api";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    targetRole: "",
    experienceYears: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || "",
      email: user.email || "",
      targetRole: user.targetRole || "",
      experienceYears: user.experienceYears ?? "",
      bio: user.bio || "",
    });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: profile.name,
        targetRole: profile.targetRole,
        experienceYears: profile.experienceYears === "" ? null : profile.experienceYears,
        bio: profile.bio,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save profile."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <span
          style={{
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--accent-mint)",
            fontWeight: 700,
          }}
        >
          Candidate Workspace
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0.4rem 0", color: "#fff" }}>
          Candidate Profile & Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
          Manage your personal information and target role. Answers and interview records stay private to your account.
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
              background: "linear-gradient(135deg, #62F5A0, #25E27B)",
              display: "grid",
              placeItems: "center",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#050907",
              boxShadow: "0 0 25px rgba(98, 245, 160, 0.4)",
            }}
          >
            {profile.name[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              {profile.name || "Candidate"}
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--accent-mint)", fontWeight: 600 }}>
              {profile.targetRole || "No target role set"}
            </span>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              {profile.email}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem" }}>
            <div>
              <label htmlFor="profile-name" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Full Name
              </label>
              <input
                id="profile-name"
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
              <label htmlFor="profile-email" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                readOnly
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "var(--text-muted)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem" }}>
            <div>
              <label htmlFor="profile-role" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Target Role Track
              </label>
              <input
                id="profile-role"
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                placeholder="e.g. Frontend Engineer"
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
              <label htmlFor="profile-experience" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
                Years of Experience
              </label>
              <input
                id="profile-experience"
                type="number"
                min="0"
                max="50"
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
            <label htmlFor="profile-bio" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.4rem" }}>
              Short Bio / Goals
            </label>
            <textarea
              id="profile-bio"
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
            disabled={isSaving}
            style={{
              padding: "0.95rem 2.2rem",
              borderRadius: "9999px",
              background: "var(--accent-mint)",
              border: "none",
              color: "#050907",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: isSaving ? "wait" : "pointer",
              justifySelf: "start",
              opacity: isSaving ? 0.75 : 1,
              boxShadow: "0 0 25px rgba(98, 245, 160, 0.3)",
              transition: "all 0.25s ease",
            }}
          >
            {isSaving ? "Saving…" : "Save Profile Changes ↗"}
          </button>
        </form>
      </div>
    </div>
  );
}
