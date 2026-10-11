import { useRef } from "react";
import { Link } from "react-router-dom";
import "./HoloHero.css";

const cards = [
  {
    label: "Frontend",
    value: "92%",
    icon: "⚡",
    badge: "Top 5%",
    sub: "Performance Score",
    center: (
      <div className="holo-card-mid">
        <div className="holo-meter-wrapper">
          <div className="holo-meter-track">
            <div className="holo-meter-bar" style={{ width: "92%" }} />
          </div>
          <span className="holo-meter-text">React & Architecture</span>
        </div>
        <div className="holo-skill-tags">
          <span className="holo-tag">React 19</span>
          <span className="holo-tag">TypeScript</span>
          <span className="holo-tag">CSS3</span>
        </div>
      </div>
    ),
  },
  {
    label: "Mock Interview",
    value: "Live",
    icon: "🎙️",
    badge: "Active",
    sub: "AI Video & Speech",
    isLive: true,
    center: (
      <div className="holo-card-mid">
        <div className="holo-soundwave">
          <span className="sw-bar b1" />
          <span className="sw-bar b2" />
          <span className="sw-bar b3" />
          <span className="sw-bar b4" />
          <span className="sw-bar b5" />
          <span className="sw-bar b6" />
          <span className="sw-bar b7" />
        </div>
        <div className="holo-live-sub">
          <span className="live-dot-mini" />
          <span>Speech Analysis 96%</span>
        </div>
      </div>
    ),
  },
  {
    label: "DSA Solved",
    value: "112",
    icon: "💻",
    badge: "Ranked",
    sub: "Problems Cleared",
    center: (
      <div className="holo-card-mid">
        <div className="holo-dsa-chips">
          <span className="dsa-chip dsa-easy">Easy 48</span>
          <span className="dsa-chip dsa-med">Med 52</span>
          <span className="dsa-chip dsa-hard">Hard 12</span>
        </div>
        <div className="holo-dsa-sub">Optimal O(log n) Avg</div>
      </div>
    ),
  },
];

export default function HoloHero() {
  const sceneRef = useRef(null);
  const stageRef = useRef(null);

  const onMove = (e) => {
    if (!sceneRef.current || !stageRef.current) return;
    const r = sceneRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stageRef.current.style.setProperty("--rx", `${-y * 18}deg`);
    stageRef.current.style.setProperty("--ry", `${x * 22}deg`);
  };

  const onLeave = () => {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty("--rx", "0deg");
    stageRef.current.style.setProperty("--ry", "0deg");
  };

  return (
    <section className="holo">
      <div className="holo-text">
        <span className="holo-badge">AI Interview Coach</span>
        <h1>Your skills, scored in real time</h1>
        <p>Mock interviews, DSA practice aur instant AI feedback – sab ek jagah.</p>
        <div className="holo-actions">
          <Link to="/interview" className="holo-btn primary">Start Free</Link>
          <a href="#features" className="holo-btn ghost">Explore</a>
        </div>
      </div>

      <div
        className="holo-scene"
        ref={sceneRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="holo-stage" ref={stageRef}>
          {cards.map((c, i) => (
            <div key={c.label} className={`holo-card c${i + 1}`}>
              <div className="holo-card-header">
                <span className="holo-card-icon">{c.icon}</span>
                <span className="holo-card-label">{c.label}</span>
                {c.isLive ? (
                  <span className="holo-live-tag">
                    <span className="holo-live-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="holo-card-badge">{c.badge}</span>
                )}
              </div>

              {c.center}

              <div className="holo-card-body">
                <strong className="holo-card-value">{c.value}</strong>
                <span className="holo-card-sub">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


