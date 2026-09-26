"use client"

export default function Page() {
  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: "var(--font-display, \'Audiowide\'), cursive", fontSize: ".5rem", letterSpacing: ".2em", color: "var(--red)", textTransform: "uppercase", marginBottom: ".5rem" }}>COVERSMART</div>
        <h1 style={{ fontFamily: "var(--font-display, \'Audiowide\'), cursive", fontSize: "clamp(1.2rem,2vw,1.6rem)", color: "var(--text)", textTransform: "uppercase", marginBottom: ".5rem" }}>Alerts</h1>
        <p style={{ color: "var(--text2)", fontSize: ".95rem", fontWeight: 500 }}>Issues and actions requiring your attention.</p>
      </div>
      <div style={{ padding: "2.5rem", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "14px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚧</div>
        <div style={{ fontFamily: "var(--font-display, \'Audiowide\'), cursive", fontSize: ".65rem", letterSpacing: ".12em", color: "var(--text)", textTransform: "uppercase", marginBottom: ".5rem" }}>Coming Soon</div>
        <p style={{ color: "var(--text2)", fontSize: ".9rem", maxWidth: "380px", margin: "0 auto", lineHeight: 1.6, fontWeight: 500 }}>
          This feature is being built. Head to {" "}<a href="/dashboard/overview" style={{ color: "var(--red)" }}>Overview</a>{" "}to see your full insurance picture.
        </p>
      </div>
    </div>
  )
}
