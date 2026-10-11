import { useState } from "react";
import { toast } from "react-hot-toast";
import StatCard from "../components/StatCard";
import { adminStats, adminUsers } from "../data/mockData";

export default function Admin() {
  // NOTE: Demo Route Guard - in production, verify user.role === 'admin' before rendering.
  const [users, setUsers] = useState(adminUsers);

  const handleManageUser = (userName) => {
    toast(`Managing user privileges for "${userName}" (Demo Action)`);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--accent-pink)",
              fontWeight: 800,
              padding: "0.2rem 0.65rem",
              borderRadius: "999px",
              background: "rgba(255, 110, 199, 0.15)",
              border: "1px solid rgba(255, 110, 199, 0.3)",
            }}
          >
            Admin Control Center (Demo Guard)
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0.4rem 0", color: "#fff" }}>
          Platform Analytics & User Oversight
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
          Monitor interview throughput, system capacity, and manage user roles.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <StatCard label="Total Registered Candidates" value={adminStats.totalUsers.toLocaleString()} icon="👥" color="cyan" change="+14% this week" />
        <StatCard label="Completed Mock Interviews" value={adminStats.interviewsCompleted.toLocaleString()} icon="🎙️" color="violet" change="+28% this month" />
        <StatCard label="Platform Average Score" value={adminStats.averagePlatformScore} icon="⭐" color="pink" badge="High Bar" />
        <StatCard label="Active Sessions Right Now" value={adminStats.activeSessionsNow} icon="⚡" color="blue" badge="Live AI" />
      </div>

      {/* Users Table */}
      <div
        className="glass-panel responsive-table-wrapper"
        style={{
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem 1.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", margin: 0 }}>
            Recent Candidates
          </h2>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {users.length} active users
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(14, 18, 38, 0.95)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>User Name</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Email</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Role</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Interviews</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "1.1rem 1.5rem", fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                  {u.name}
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {u.email}
                </td>
                <td style={{ padding: "1.1rem 1.5rem", fontSize: "0.88rem" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      background: u.role === "Admin" ? "rgba(255, 110, 199, 0.15)" : "rgba(0, 255, 208, 0.1)",
                      color: u.role === "Admin" ? "var(--accent-pink)" : "var(--accent-cyan)",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "#fff", fontWeight: 700 }}>
                  {u.interviews}
                </td>
                <td style={{ padding: "1.1rem 1.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: u.status === "Active" ? "var(--accent-cyan)" : "#fbbf24",
                      fontWeight: 600,
                    }}
                  >
                    ● {u.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.5rem", textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => handleManageUser(u.name)}
                    style={{
                      padding: "0.45rem 1rem",
                      borderRadius: "999px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#fff",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Manage ⚙
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
