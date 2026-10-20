import { useState } from "react";
import { toast } from "react-hot-toast";
import { dsaProblems } from "../data/mockData";

const PROBLEM_DETAILS = {
  "two-sum": {
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []`,
    },
  },
  "reverse-linked-list": {
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "All pointers reversed." },
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
    starterCode: {
      javascript: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) { this.val = val; this.next = next; }\n */\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}`,
      python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev = None\n        curr = head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev`,
    },
  },
  "lru-cache": {
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache with get(key) and put(key, value) in O(1) average time complexity.",
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2]]', output: "[null, null, null, 1, null, -1]" },
    ],
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5", "At most 2 * 10^5 calls to get and put."],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldest = this.map.keys().next().value;\n      this.map.delete(oldest);\n    }\n  }\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)`,
    },
  },
};

export default function Dsa() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeLang, setActiveLang] = useState("javascript");

  const filtered = dsaProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const handleSolve = (problem) => {
    setSelectedProblem(problem);
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

  const details = selectedProblem ? PROBLEM_DETAILS[selectedProblem.id] || {
    description: `Solve the ${selectedProblem.title} challenge optimizing for minimum time and space complexity.`,
    examples: [{ input: "Standard test input", output: "Expected output" }],
    constraints: ["1 <= input.length <= 10^5", "Optimal Time: O(n)", "Optimal Space: O(1) or O(n)"],
    starterCode: {
      javascript: `// Problem: ${selectedProblem.title}\nfunction solve(input) {\n  // Implement optimal solution here\n  return null;\n}`,
      python: `# Problem: ${selectedProblem.title}\ndef solve(input):\n    # Implement optimal solution here\n    return None`,
    },
  } : null;

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
                    onClick={() => handleSolve(prob)}
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

      {/* Problem Details & Gated Execution Modal */}
      {selectedProblem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(5, 7, 18, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1.5rem",
          }}
          onClick={() => setSelectedProblem(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              borderRadius: "24px",
              border: "1px solid rgba(0, 255, 208, 0.25)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.4rem" }}>
                  {getDifficultyBadge(selectedProblem.difficulty)}
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{selectedProblem.topic}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>• Acceptance: {selectedProblem.acceptance}</span>
                </div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, color: "#fff" }}>
                  {selectedProblem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProblem(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.2rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Mandatory Security Gate Notice */}
            <div
              style={{
                padding: "0.85rem 1.15rem",
                borderRadius: "12px",
                background: "rgba(255, 110, 199, 0.1)",
                border: "1px solid rgba(255, 110, 199, 0.3)",
                color: "#ff8cd4",
                fontSize: "0.86rem",
                lineHeight: 1.5,
                marginBottom: "1.5rem",
              }}
            >
              🛡️ <strong>Execution Sandbox Gated:</strong> In accordance with security protocol (<code>RULES.md</code> Section 5), candidate code execution is safely disabled inside the web application pending an independent containerized runner review. You can inspect statements, constraints, and starter templates.
            </div>

            {/* Statement */}
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                Problem Statement
              </h4>
              <p style={{ color: "#d1d5db", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                {details?.description}
              </p>
            </div>

            {/* Examples */}
            {details?.examples && details.examples.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                  Example
                </h4>
                {details.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      fontSize: "0.88rem",
                      fontFamily: "monospace",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div><strong style={{ color: "var(--accent-cyan)" }}>Input:</strong> {ex.input}</div>
                    <div><strong style={{ color: "var(--accent-violet)" }}>Output:</strong> {ex.output}</div>
                    {ex.explanation && <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.2rem" }}>Explanation: {ex.explanation}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {details?.constraints && details.constraints.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                  Constraints
                </h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {details.constraints.map((c, i) => (
                    <li key={i}><code>{c}</code></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Starter Code Viewer */}
            {details?.starterCode && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <h4 style={{ color: "var(--accent-cyan)", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                    Starter Code Template
                  </h4>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {["javascript", "python"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          border: activeLang === lang ? "1px solid var(--accent-cyan)" : "1px solid rgba(255,255,255,0.1)",
                          background: activeLang === lang ? "rgba(0, 255, 208, 0.15)" : "transparent",
                          color: activeLang === lang ? "var(--accent-cyan)" : "var(--text-muted)",
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <pre
                  style={{
                    background: "rgba(5, 7, 20, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "1rem",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                    color: "#00ffd0",
                    overflowX: "auto",
                    margin: 0,
                  }}
                >
                  <code>{details.starterCode[activeLang] || "// Code template"}</code>
                </pre>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(details?.starterCode?.[activeLang] || "");
                  toast.success("Starter code copied to clipboard!");
                }}
              >
                Copy Code 📋
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setSelectedProblem(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
