function Loader({ fullscreen = false, label = "Loading..." }) {
  return (
    <div className={`loader ${fullscreen ? "loader--fullscreen" : ""}`} role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true"></span>
      <span className="loader__label">{label}</span>
    </div>
  );
}

export default Loader;
