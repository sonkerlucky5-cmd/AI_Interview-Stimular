import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "../services/api";
import { getDsaProblemsRequest, submitDsaCodeRequest } from "../services/dsaService";

const badgeColors = {
  Easy: { color: "var(--accent-mint)", bg: "rgba(98, 245, 160, 0.12)" },
  Medium: { color: "#F5D062", bg: "rgba(245, 208, 98, 0.12)" },
  Hard: { color: "#FF6E8A", bg: "rgba(255, 110, 138, 0.12)" },
};

export default function Dsa() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeLang, setActiveLang] = useState("javascript");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);

  const loadProblems = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setProblems(await getDsaProblemsRequest());
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Could not load problems from the server."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProblems(); }, [loadProblems]);

  const filtered = useMemo(() => problems.filter((problem) => {
    const topics = Array.isArray(problem.topics) ? problem.topics.join(" ") : String(problem.topics || "");
    const matchesSearch = `${problem.title} ${topics}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (difficultyFilter === "All" || problem.difficulty === difficultyFilter);
  }), [problems, search, difficultyFilter]);

  const openProblem = (problem) => {
    setSelectedProblem(problem);
    const starter = problem.starter_code?.javascript || problem.starter_code?.python || "";
    setActiveLang(problem.starter_code?.javascript ? "javascript" : "python");
    setCode(starter);
    setSubmission(null);
  };

  const submit = async () => {
    if (!selectedProblem) return;
    setSubmitting(true);
    setSubmission(null);
    try {
      const result = await submitDsaCodeRequest({ problemId: selectedProblem.id, language: activeLang, code });
      setSubmission(result);
    } catch (error) {
      const message = getApiErrorMessage(error, "Submission failed.");
      const data = error?.response?.data;
      setSubmission(data?.error?.details?.submissionId ? { submissionId: data.error.details.submissionId, error: message } : { error: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const buttonStyle = { minHeight: 44, padding: "0.65rem 1rem", borderRadius: 999, cursor: "pointer", fontWeight: 700 };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <span style={{ color: "var(--accent-mint)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Algorithm Arena</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: "0.4rem 0 0.8rem", color: "var(--title)" }}>DSA Problem Bank</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 680, margin: 0 }}>Problems and test cases load from the database. Submissions are saved; code execution remains gated until separately approved.</p>
      </header>

      <section className="glass-panel" style={{ padding: "1.1rem", borderRadius: 18, display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <input aria-label="Search problems" placeholder="Search by title or topic" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1 1 250px", minHeight: 44, padding: "0.7rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-primary)" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {["All", "Easy", "Medium", "Hard"].map((difficulty) => <button key={difficulty} type="button" onClick={() => setDifficultyFilter(difficulty)} style={{ ...buttonStyle, border: difficultyFilter === difficulty ? "1px solid var(--accent-mint)" : "1px solid rgba(255,255,255,0.1)", background: difficultyFilter === difficulty ? "rgba(0,255,208,0.12)" : "transparent", color: difficultyFilter === difficulty ? "var(--accent-mint)" : "var(--text-muted)" }}>{difficulty}</button>)}
        </div>
      </section>

      {loading ? <div role="status" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading database problems…</div> : loadError ? <div role="alert" className="glass-panel" style={{ padding: "1.5rem", borderRadius: 16, color: "#ff9eaa" }}>{loadError} <button type="button" onClick={loadProblems} style={{ ...buttonStyle, marginLeft: 12 }}>Retry</button></div> : filtered.length === 0 ? <div className="glass-panel" style={{ padding: "2rem", borderRadius: 16, color: "var(--text-muted)", textAlign: "center" }}>{problems.length ? "No problems match those filters." : "No problems are available in the database yet. Apply backend/migrations/001_dsa_runner.sql to add the starter catalogue."}</div> : (
        <div className="glass-panel" style={{ borderRadius: 18, overflowX: "auto", border: "1px solid var(--border-glass, rgba(255,255,255,0.08))" }}>
          <table style={{ width: "100%", minWidth: 650, borderCollapse: "collapse", textAlign: "left" }}>
            <thead><tr style={{ background: "var(--bg-surface)" }}>{["Title", "Topics", "Difficulty", "Limits", ""].map((label) => <th key={label} style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>{label}</th>)}</tr></thead>
            <tbody>{filtered.map((problem) => {
              const badge = badgeColors[problem.difficulty] || badgeColors.Easy;
              const topics = Array.isArray(problem.topics) ? problem.topics.join(", ") : problem.topics;
              return <tr key={problem.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "1rem", color: "var(--title)", fontWeight: 700 }}>{problem.title}</td>
                <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{topics}</td>
                <td style={{ padding: "1rem" }}><span style={{ color: badge.color, background: badge.bg, borderRadius: 99, padding: "0.25rem 0.65rem", fontWeight: 700 }}>{problem.difficulty}</span></td>
                <td style={{ padding: "1rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{problem.time_limit_ms} ms · {Math.round(problem.memory_limit_kb / 1024)} MB</td>
                <td style={{ padding: "1rem", textAlign: "right" }}><button type="button" className="btn btn--primary" onClick={() => openProblem(problem)} style={buttonStyle}>Solve</button></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}

      {selectedProblem && <div role="presentation" onClick={() => setSelectedProblem(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,7,18,0.88)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
        <section role="dialog" aria-modal="true" aria-labelledby="dsa-title" onClick={(event) => event.stopPropagation()} className="glass-card" style={{ width: "min(900px, 100%)", maxHeight: "92vh", overflowY: "auto", padding: "clamp(1rem, 3vw, 2rem)", borderRadius: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}><div><h2 id="dsa-title" style={{ color: "var(--title)", marginTop: 0 }}>{selectedProblem.title}</h2><span style={{ color: "var(--text-muted)" }}>{(selectedProblem.topics || []).join?.(", ") || selectedProblem.topics} · {selectedProblem.difficulty}</span></div><button type="button" aria-label="Close" onClick={() => setSelectedProblem(null)} style={buttonStyle}>Close</button></div>
          <p style={{ color: "var(--text-primary)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{selectedProblem.statement}</p>
          <h3 style={{ color: "var(--accent-mint)" }}>Examples</h3>
          {(selectedProblem.examples || []).map((example, index) => <pre key={index} style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "var(--text-muted)", background: "rgba(0,0,0,.25)", padding: 12, borderRadius: 10 }}>Input: {example.input}{"\n"}Output: {example.output}{example.explanation ? `\n${example.explanation}` : ""}</pre>)}
          <h3 style={{ color: "var(--accent-mint)" }}>Constraints</h3><ul style={{ color: "var(--text-muted)" }}>{(selectedProblem.constraints || []).map((item, index) => <li key={index}>{item}</li>)}</ul>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, margin: "1rem 0 0.5rem" }}><h3 style={{ color: "var(--accent-mint)", margin: 0 }}>Your code</h3><select aria-label="Language" value={activeLang} onChange={(event) => { const lang = event.target.value; setActiveLang(lang); setCode(selectedProblem.starter_code?.[lang] || ""); setSubmission(null); }} style={{ minHeight: 44, padding: "0.5rem 0.8rem", color: "var(--text-primary)", background: "var(--bg-surface)", borderRadius: 8 }}>{["javascript", "python"].map((language) => <option key={language} value={language}>{language}</option>)}</select></div>
          <textarea aria-label="Source code" spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} style={{ display: "block", width: "100%", minHeight: 260, boxSizing: "border-box", resize: "vertical", padding: 14, borderRadius: 12, color: "var(--accent-mint)", background: "#050714", border: "1px solid rgba(255,255,255,.12)", fontFamily: "monospace", fontSize: 14 }} />
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Limits: {selectedProblem.time_limit_ms} ms · {Math.round(selectedProblem.memory_limit_kb / 1024)} MB. Execution is disabled until separately approved; the submit endpoint records blocked attempts without fabricating a verdict.</p>
          <button type="button" disabled={submitting} onClick={submit} className="btn btn--primary" style={{ ...buttonStyle, opacity: submitting ? 0.65 : 1 }}>{submitting ? "Submitting…" : "Submit code"}</button>
          {submission && <section role="status" aria-live="polite" className="glass-panel" style={{ marginTop: 16, padding: 14, borderRadius: 12 }}><strong style={{ color: submission.error ? "#ff9eaa" : submission.verdict === "accepted" ? "var(--accent-mint)" : "#F5D062" }}>{submission.error || submission.verdict?.replaceAll("_", " ").toUpperCase()}</strong>{submission.submissionId && <div style={{ color: "var(--text-muted)", marginTop: 6 }}>Submission saved: {submission.submissionId}</div>}{submission.results?.map((result) => <div key={result.case} style={{ color: result.passed ? "var(--accent-mint)" : "#ff9eaa", marginTop: 6 }}>Test {result.case}: {result.passed ? "Passed" : result.status}{result.timeMs != null ? ` · ${result.timeMs} ms` : ""}</div>)}</section>}
        </section>
      </div>}
    </div>
  );
}
