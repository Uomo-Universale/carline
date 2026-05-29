/* CarLine — device frames (iPhone + iPad) and a tiny status bar.
   These are deliberately lightweight stylized frames, not photorealistic. */

const { useState: useStateF, useEffect: useEffectF } = React;

/* ---------- StatusBar (iOS-ish) ---------- */
const StatusBar = ({ time = "8:12", dark = false }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 28px 8px",
    color: dark ? "#FFFCF5" : "#15233A",
    font: "var(--cl-t-sm)", fontWeight: 600, height: 44, boxSizing: "border-box",
  }}>
    <span>{time}</span>
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <svg width="18" height="11" viewBox="0 0 18 11" fill={dark ? "#FFFCF5" : "#15233A"}>
        <rect x="1" y="7" width="2" height="3" rx="0.5"/>
        <rect x="5" y="5" width="2" height="5" rx="0.5"/>
        <rect x="9" y="3" width="2" height="7" rx="0.5"/>
        <rect x="13" y="1" width="2" height="9" rx="0.5"/>
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill={dark ? "#FFFCF5" : "#15233A"}>
        <path d="M8 2c2.2 0 4.2.9 5.7 2.3l-.9 1A6.4 6.4 0 0 0 8 3.6 6.4 6.4 0 0 0 3.2 5.4l-.9-1A8.5 8.5 0 0 1 8 2zm0 3.6c1.3 0 2.5.5 3.5 1.4l-.9 1A4.4 4.4 0 0 0 8 7c-.9 0-1.8.3-2.5.9l-1-1A5.5 5.5 0 0 1 8 5.6zM8 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={dark ? "#FFFCF5" : "#15233A"}/>
        <rect x="2" y="2" width="18" height="8" rx="1.5" fill={dark ? "#FFFCF5" : "#15233A"}/>
        <rect x="23" y="3.5" width="2" height="5" rx="1" fill={dark ? "#FFFCF5" : "#15233A"}/>
      </svg>
    </span>
  </div>
);

/* ---------- iPhone frame ----------
   Authored screen size: 390 × 844. The frame adds bezel + dynamic island. */
const IPhoneFrame = ({ children, label, width = 390, height = 844, dark = false, statusTime = "8:12", scale = 1, style }) => {
  const bezel = 11;
  const w = width + bezel * 2;
  const h = height + bezel * 2;
  return (
    <div style={{ display: "inline-block", transform: `scale(${scale})`, transformOrigin: "top left", ...style }}>
      <div style={{
        width: w, height: h, padding: bezel, boxSizing: "border-box",
        background: "linear-gradient(180deg, #15233A 0%, #0B1422 100%)",
        borderRadius: 56, position: "relative",
        boxShadow: "0 30px 80px -30px rgba(21,35,58,0.45), 0 12px 28px -16px rgba(21,35,58,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width: width, height: height,
          borderRadius: 44, overflow: "hidden",
          background: dark ? "#0E1A2D" : "var(--cl-bg)",
          position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}>
          {/* Dynamic island */}
          <div style={{
            position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)",
            width: 122, height: 34, borderRadius: 22, background: "#000", zIndex: 30,
          }}/>
          <StatusBar time={statusTime} dark={dark}/>
          <div style={{ height: height - 44, overflow: "hidden", position: "relative" }}>
            {children}
          </div>
          {/* Home indicator */}
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 134, height: 5, borderRadius: 5,
            background: dark ? "rgba(255,255,255,0.5)" : "rgba(21,35,58,0.35)",
          }}/>
        </div>
      </div>
      {label && <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 14, textAlign: "center" }}>{label}</div>}
    </div>
  );
};

/* ---------- iPad frame ----------
   Authored: landscape 1180 × 820 (iPad Air); portrait 820 × 1180. */
const IPadFrame = ({ children, label, orientation = "landscape", scale = 1, style, dark = false }) => {
  const [w, h] = orientation === "landscape" ? [1180, 820] : [820, 1180];
  const bezel = 18;
  return (
    <div style={{ display: "inline-block", transform: `scale(${scale})`, transformOrigin: "top left", ...style }}>
      <div style={{
        width: w + bezel * 2, height: h + bezel * 2, padding: bezel, boxSizing: "border-box",
        background: "linear-gradient(180deg, #1A2740 0%, #0B1422 100%)",
        borderRadius: 38, position: "relative",
        boxShadow: "0 40px 100px -40px rgba(21,35,58,0.5), 0 16px 32px -20px rgba(21,35,58,0.3), inset 0 0 0 1.5px rgba(255,255,255,0.05)",
      }}>
        {/* camera */}
        {orientation === "landscape" ? (
          <div style={{ position: "absolute", left: bezel/2 - 1, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#0A0E18" }}/>
        ) : (
          <div style={{ position: "absolute", top: bezel/2 - 1, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#0A0E18" }}/>
        )}
        <div style={{
          width: w, height: h, borderRadius: 22, overflow: "hidden",
          background: dark ? "#0E1A2D" : "var(--cl-bg)",
          position: "relative", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}>
          {children}
        </div>
      </div>
      {label && <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 14, textAlign: "center" }}>{label}</div>}
    </div>
  );
};

Object.assign(window, {
  CL_StatusBar: StatusBar,
  CL_IPhoneFrame: IPhoneFrame,
  CL_IPadFrame: IPadFrame,
});
