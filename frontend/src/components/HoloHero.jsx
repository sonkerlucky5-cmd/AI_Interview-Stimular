import { useRef } from "react";
import "./HoloHero.css";

const cards = [
  { label: "Frontend", value: "92%" },
  { label: "Mock Interview", value: "Live" },
  { label: "DSA Solved", value: "112" },
];

export default function HoloHero() {
  const stage = useRef(null);

  const onMove = (e) => {
    const r = stage.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.current.style.transform = `rotateY(${x * 24}deg) rotateX(${-y * 18}deg)`;
  };
  const onLeave = () => (stage.current.style.transform = "");

  return (
    <section className="holo">
      <header className="holo-nav">
        <b>InterviewAI</b>
        <button className="holo-login">Login</button>
      </header>

      <div className="holo-text">
        <span className="holo-badge">AI Interview Coach</span>
        <h1>Your skills, scored in real time</h1>
        <p>Mock interviews, DSA practice aur instant AI feedback – sab ek jagah.</p>
        <div className="holo-actions">
          <button className="holo-btn primary">Start Free</button>
          <button className="holo-btn ghost">Explore</button>
        </div>
      </div>

      <div className="holo-scene" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="holo-stage" ref={stage}>
          {cards.map((c, i) => (
            <div key={c.label} className={`holo-card c${i + 1}`}>
              <span>{c.label}</span>
              <strong>{c.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
