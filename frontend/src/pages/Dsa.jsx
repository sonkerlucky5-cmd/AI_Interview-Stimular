import { useState } from "react";
import { toast } from "react-hot-toast";
import { dsaProblems } from "../data/mockData";

export default function Dsa() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const filtered = dsaProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const handleSolve = (problemTitle) => {
    toast("Code execution is disabled until an isolated runner is approved.");
    void problemTitle;
  };

  const getDifficultyBadge = (diff) => {
    const styles = {
      Easy: { color: "var(--accent-cyan)", bg: "rgba(0, 255, 208, 0.12)", border: "rgba(0, 255, 208, 0.3)" },
      Medium: { color: "var(--accent-violet)", bg: "rgba(123, 97, 255, 0.12)", border: "rgba(123, 97, 255, 0.3)" },
      Hard: { color: "var(--accent-pink)", bg: "rgba(255, 110, 199, 0.12)", border: "rgba(255, 110, 199, 0.3)" },
    };
    const s = styles[diff] || styles.Easy;
    return (
      <span
        style={{
          padding: "0.25rem 0.65rem",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: s.color,
          background: s.bg,
          border: `1px solid ${s.border}`,
        }}
      >
        {diff}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* Header */}
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
          Algorithm Arena
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0.4rem 0 0.8rem", color: "#fff" }}>
          DSA Problem Bank
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "640px", margin: 0 }}>
          Browse curated algorithm prompts. Code execution is disabled until a separate isolated runner is approved (P2).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 280px" }}>
          <input
            type="text"
            placeholder="Search problems by name or tag (e.g. Tree, Graph)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1.15rem",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setDifficultyFilter(diff)}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "999px",
                border: difficultyFilter === diff ? "1px solid var(--accent-cyan)" : "1px solid rgba(255, 255, 255, 0.1)",
                background: difficultyFilter === diff ? "rgba(0, 255, 208, 0.15)" : "transparent",
                color: difficultyFilter === diff ? "var(--accent-cyan)" : "var(--text-muted)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Problems Table */}
      <div
        className="glass-panel responsive-table-wrapper"
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(14, 18, 38, 0.95)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Title</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Category</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Difficulty</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Acceptance</th>
              <th style={{ padding: "1.1rem 1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prob) => (
              <tr
                key={prob.id}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                  transition: "background 0.2s",
                }}
              >
                <td style={{ padding: "1.1rem 1.5rem", fontSize: "1.1rem" }}>
                  {prob.solved ? <span style={{ color: "var(--accent-cyan)" }}>✔</span> : <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>○</span>}
                </td>
                <td style={{ padding: "1.1rem 1.5rem", fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                  {prob.title}
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {prob.topic}
                </td>
                <td style={{ padding: "1.1rem 1.5rem" }}>
                  {getDifficultyBadge(prob.difficulty)}
                </td>
                <td style={{ padding: "1.1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {prob.acceptance}
                </td>
                <td style={{ padding: "1.1rem 1.5rem", textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => handleSolve(prob.title)}
                    style={{
                      padding: "0.45rem 1.1rem",
                      borderRadius: "999px",
                      background: "rgba(0, 255, 208, 0.1)",
                      border: "1px solid rgba(0, 255, 208, 0.3)",
                      color: "var(--accent-cyan)",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Solve ⚡
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No problems found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
