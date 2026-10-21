export default function AudioWaveform({ isRecording = false, barCount = 14 }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  // Height variations for an organic waveform profile
  const baseHeights = [30, 55, 80, 45, 95, 70, 100, 85, 60, 90, 75, 50, 65, 35];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        height: "36px",
        padding: "0 0.5rem",
      }}
      aria-hidden="true"
    >
      {bars.map((idx) => {
        const heightPercent = baseHeights[idx % baseHeights.length];
        const animDelay = (idx * 0.08).toFixed(2);
        const animDuration = (0.5 + (idx % 4) * 0.15).toFixed(2);

        return (
          <span
            key={idx}
            style={{
              width: "3.5px",
              height: isRecording ? `${heightPercent}%` : "15%",
              borderRadius: "999px",
              background: isRecording
                ? "linear-gradient(180deg, #00F5B8 0%, #00DDA5 100%)"
                : "rgba(0, 245, 184, 0.25)",
              boxShadow: isRecording ? "0 0 8px rgba(0, 245, 184, 0.6)" : "none",
              animation: isRecording ? `waveform-pulse ${animDuration}s ease-in-out infinite alternate` : "none",
              animationDelay: `${animDelay}s`,
              transition: "height 0.25s ease, background 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}
