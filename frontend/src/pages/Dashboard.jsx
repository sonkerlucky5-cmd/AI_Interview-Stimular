import Sidebar from "../components/Sidebar";
import useAuth from "../hooks/useAuth";

const checklistItems = [
  "MongoDB connection and environment config are wired.",
  "JWT session auth and protected routes are active.",
  "Gemini integration is intentionally deferred to Phase 2.",
];

const metrics = [
  {
    label: "Auth status",
    value: "Live",
    copy: "Signup, login, logout, and profile retrieval are connected.",
  },
  {
    label: "Frontend shell",
    value: "Ready",
    copy: "Routing, context, responsive layout, and reusable UI blocks are in place.",
  },
  {
    label: "AI module",
    value: "Pending",
    copy: "Interview generation and analysis will plug into the existing services layer later.",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const formattedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unavailable";

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Protected dashboard</span>
              <h1>{user?.name}, your simulator foundation is ready.</h1>
              <p>
                This workspace confirms the authentication layer is working and gives you a clean place to extend the
                interview engine in the next phase.
              </p>
            </div>

            <div className="dashboard-hero__status">
              <span className="status-pill">Role: {user?.role}</span>
              <span className="status-pill">Created: {formattedDate}</span>
            </div>
          </div>

          <div className="metrics-grid">
            {metrics.map((item) => (
              <article className="glass-card" key={item.label}>
                <span className="metric-card__label">{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="dashboard-columns">
            <article className="glass-card">
              <span className="eyebrow">Launch checklist</span>
              <h2>Phase 1 completed pieces</h2>
              <div className="checklist">
                {checklistItems.map((item) => (
                  <div className="checklist__item" key={item}>
                    <span className="checklist__marker"></span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card glass-card--accent">
              <span className="eyebrow">User profile</span>
              <h2>Authenticated session details</h2>
              <dl className="detail-list">
                <div>
                  <dt>Name</dt>
                  <dd>{user?.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user?.email}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{user?.role}</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
