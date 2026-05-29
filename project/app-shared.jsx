/* CarLine — shared UI primitives.
   Exports a global `CL` namespace so other Babel scripts can use these. */

const { useState, useEffect, useRef, useMemo, Fragment } = React;

/* ---------- Icons (line, 24x24) ---------- */
const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.8, style }) => {
  const s = strokeWidth;
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: s, strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  const P = {
    car:        <><path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16.5" r="1"/><circle cx="16.5" cy="16.5" r="1"/></>,
    walk:       <><circle cx="13" cy="4.5" r="1.6"/><path d="M10 21l1.5-5L9 13.5 10.5 9l3 1 2 2 2.5 1"/><path d="M8 21l2-5"/></>,
    clock:      <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chat:       <><path d="M4 5h16v11H8l-4 4z"/></>,
    check:      <><path d="M4 12l5 5L20 6"/></>,
    arrowRight: <><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>,
    arrowLeft:  <><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></>,
    chevronR:   <><path d="M9 6l6 6-6 6"/></>,
    chevronD:   <><path d="M6 9l6 6 6-6"/></>,
    plus:       <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    search:     <><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.6-3.6"/></>,
    filter:     <><path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/></>,
    bell:       <><path d="M6 16V10a6 6 0 1 1 12 0v6"/><path d="M4 16h16"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    user:       <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></>,
    users:      <><circle cx="9" cy="9" r="3"/><circle cx="17" cy="11" r="2.5"/><path d="M3 19c1-3 3-4.5 6-4.5s5 1.5 6 4.5"/><path d="M15 19c.7-2 2-3 4-3"/></>,
    home:       <><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19 12.7v-1.4l1.7-1.3-1.5-2.6L17.2 8a6.7 6.7 0 0 0-1.2-.7L15.5 5h-3l-.5 2.3c-.4.2-.8.4-1.2.7L8.8 7.4 7.3 10l1.7 1.3v1.4L7.3 14l1.5 2.6 2-.7c.4.3.8.5 1.2.7L12.5 19h3l.5-2.3c.4-.2.8-.4 1.2-.7l2 .7 1.5-2.6z"/></>,
    pin:        <><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    shield:     <><path d="M12 3l8 3v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z"/></>,
    sparkle:    <><path d="M12 4v4"/><path d="M12 16v4"/><path d="M4 12h4"/><path d="M16 12h4"/><path d="M6 6l2.5 2.5"/><path d="M15.5 15.5L18 18"/><path d="M6 18l2.5-2.5"/><path d="M15.5 8.5L18 6"/></>,
    info:       <><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".6" fill={color} stroke="none"/></>,
    x:          <><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>,
    edit:       <><path d="M4 20h4l10-10-4-4L4 16z"/><path d="M14 6l4 4"/></>,
    wifi:       <><path d="M4 9a14 14 0 0 1 16 0"/><path d="M7 13a9 9 0 0 1 10 0"/><path d="M10 17a4 4 0 0 1 4 0"/></>,
    moon:       <><path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/></>,
    school:     <><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/></>,
    grid:       <><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></>,
    list:       <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    megaphone:  <><path d="M4 10v4l10 5V5z"/><path d="M14 9a3 3 0 0 1 0 6"/></>,
    flag:       <><path d="M5 4v17"/><path d="M5 5h11l-2 3 2 4H5"/></>,
  };
  return <svg {...common} aria-hidden="true">{P[name] || null}</svg>;
};

/* ---------- StatusChip ---------- */
const STATUS = {
  requested: { label: "Requested",  fg: "var(--cl-st-requested-fg)", bg: "var(--cl-st-requested-bg)", dot: "#7A8699" },
  arrived:   { label: "Arrived",    fg: "var(--cl-st-arrived-fg)",   bg: "var(--cl-st-arrived-bg)",   dot: "#E8A33D" },
  called:    { label: "Called",     fg: "var(--cl-st-called-fg)",    bg: "var(--cl-st-called-bg)",    dot: "#C97A1F" },
  released:  { label: "Released",   fg: "var(--cl-st-released-fg)",  bg: "var(--cl-st-released-bg)",  dot: "#2F6B5A" },
  none:      { label: "Not yet",    fg: "#7A8699",                   bg: "#F1EADA",                   dot: "#BFB39A" },
};

const StatusChip = ({ status = "requested", size = "md", style }) => {
  const s = STATUS[status] || STATUS.requested;
  const sizes = {
    sm: { pad: "3px 8px",  font: "var(--cl-t-xs)",   dot: 6 },
    md: { pad: "5px 10px", font: "var(--cl-t-sm)",   dot: 8 },
    lg: { pad: "8px 14px", font: "var(--cl-t-md)",   dot: 10 },
  }[size];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sizes.pad, borderRadius: "var(--cl-r-pill)",
      background: s.bg, color: s.fg, font: sizes.font, letterSpacing: 0.1,
      whiteSpace: "nowrap", ...style,
    }}>
      <span style={{ width: sizes.dot, height: sizes.dot, borderRadius: "50%", background: s.dot, boxShadow: "0 0 0 2px rgba(255,255,255,0.7) inset" }} />
      {s.label}
    </span>
  );
};

/* ---------- Buttons ---------- */
const buttonBase = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  border: "none", cursor: "pointer", borderRadius: "var(--cl-r-lg)",
  fontFamily: "var(--cl-font-sans)", fontWeight: 600, letterSpacing: 0.1,
  transition: "transform var(--cl-fast) var(--cl-ease), background var(--cl-fast) var(--cl-ease), box-shadow var(--cl-fast) var(--cl-ease)",
  WebkitTapHighlightColor: "transparent",
};

const Button = ({
  variant = "primary", size = "md", block = false, leading, trailing,
  children, style, ...rest
}) => {
  const sizes = {
    sm: { padding: "8px 14px",  fontSize: 14, minHeight: 36, radius: "var(--cl-r-md)" },
    md: { padding: "12px 18px", fontSize: 15, minHeight: 44, radius: "var(--cl-r-lg)" },
    lg: { padding: "16px 22px", fontSize: 17, minHeight: 56, radius: "var(--cl-r-lg)" },
    xl: { padding: "22px 28px", fontSize: 20, minHeight: 72, radius: "var(--cl-r-xl)" },
  }[size];
  const variants = {
    primary:   { background: "var(--cl-primary)",  color: "var(--cl-ink-inverse)", boxShadow: "var(--cl-shadow-2)" },
    accent:    { background: "var(--cl-accent)",   color: "#3A2206", boxShadow: "var(--cl-shadow-2)" },
    secondary: { background: "var(--cl-surface)",  color: "var(--cl-ink)", boxShadow: "inset 0 0 0 1px var(--cl-border-strong)" },
    ghost:     { background: "transparent",        color: "var(--cl-ink)" },
    danger:    { background: "var(--cl-danger)",   color: "var(--cl-ink-inverse)" },
    success:   { background: "var(--cl-success)",  color: "var(--cl-ink-inverse)" },
  }[variant];
  return (
    <button {...rest} style={{
      ...buttonBase, ...sizes, ...variants,
      borderRadius: sizes.radius, fontSize: sizes.fontSize,
      width: block ? "100%" : undefined,
      ...style,
    }}>
      {leading}
      <span>{children}</span>
      {trailing}
    </button>
  );
};

/* ---------- Card ---------- */
const Card = ({ children, padding = 20, style, elev = 1, ...rest }) => (
  <div {...rest} style={{
    background: "var(--cl-surface)",
    border: "1px solid var(--cl-border)",
    borderRadius: "var(--cl-r-xl)",
    boxShadow: elev === 0 ? "none" : elev === 2 ? "var(--cl-shadow-2)" : "var(--cl-shadow-1)",
    padding,
    ...style,
  }}>{children}</div>
);

/* ---------- Avatar (initials with warm tint) ---------- */
const AVATAR_TINTS = [
  { bg: "#FBE9C7", fg: "#7A4A0E" },
  { bg: "#DCEBE3", fg: "#1F5547" },
  { bg: "#E5EAF1", fg: "#1F3A5F" },
  { bg: "#F5D9D2", fg: "#7C2418" },
  { bg: "#E7E2D4", fg: "#3B4A66" },
];
const Avatar = ({ name = "", size = 40, tint, style }) => {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  const i = tint != null ? tint : (name.charCodeAt(0) + name.length) % AVATAR_TINTS.length;
  const t = AVATAR_TINTS[i];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: t.bg, color: t.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--cl-font-sans)", fontWeight: 600, fontSize: size * 0.4,
      flex: "none", ...style,
    }}>{initials || "•"}</div>
  );
};

/* ---------- License plate ---------- */
const Plate = ({ plate = "RDS 7821", state = "NY", size = "md" }) => {
  const sizes = {
    sm: { fontSize: 12, padding: "3px 8px", radius: 4 },
    md: { fontSize: 16, padding: "5px 10px", radius: 6 },
    lg: { fontSize: 24, padding: "10px 16px", radius: 8 },
  }[size];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "#FFFCF5", color: "#15233A",
      border: "1.5px solid #15233A",
      borderRadius: sizes.radius,
      padding: sizes.padding,
      fontFamily: "var(--cl-font-mono)", fontWeight: 600, fontSize: sizes.fontSize,
      letterSpacing: 1,
    }}>
      <span style={{ fontSize: sizes.fontSize * 0.55, opacity: 0.7, lineHeight: 1, letterSpacing: 0.5 }}>{state}</span>
      <span style={{ borderLeft: "1px solid #15233A33", paddingLeft: 8 }}>{plate}</span>
    </span>
  );
};

/* ---------- Progress track (Requested → Arrived → Called → Released) ---------- */
const STATUS_ORDER = ["requested", "arrived", "called", "released"];
const ProgressTrack = ({ status = "requested", layout = "horizontal", showLabels = true }) => {
  const idx = STATUS_ORDER.indexOf(status);
  if (layout === "vertical") {
    return (
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 18 }}>
        {STATUS_ORDER.map((s, i) => {
          const reached = i <= idx;
          const active = i === idx;
          return (
            <li key={s} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 14, alignItems: "center", position: "relative" }}>
              {i < STATUS_ORDER.length - 1 && (
                <span style={{ position: "absolute", left: 15, top: 30, width: 2, height: 36, background: reached ? STATUS[s].dot : "var(--cl-border-strong)" }} />
              )}
              <span style={{
                width: 32, height: 32, borderRadius: "50%",
                background: reached ? STATUS[s].dot : "var(--cl-surface)",
                border: reached ? "none" : "2px dashed var(--cl-border-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", boxShadow: active ? "0 0 0 6px rgba(232,163,61,0.25)" : "none",
                transition: "all var(--cl-med) var(--cl-ease)",
              }}>
                {reached && <Icon name="check" size={16} color="white" strokeWidth={2.4}/>}
              </span>
              <div>
                <div style={{ font: "var(--cl-t-md)", color: reached ? "var(--cl-ink)" : "var(--cl-ink-muted)", fontWeight: active ? 700 : 600 }}>
                  {STATUS[s].label}
                </div>
                {showLabels && <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>
                  {{ requested: "We told the school you're on your way",
                     arrived:   "Your car is in line",
                     called:    "Mrs. Levin is walking Naomi out",
                     released:  "Naomi is in your car. Drive safe!" }[s]}
                </div>}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {STATUS_ORDER.map((s, i) => (
        <div key={s} style={{
          flex: 1, height: 6, borderRadius: 999,
          background: i <= idx ? STATUS[s].dot : "var(--cl-bg-deep)",
        }}/>
      ))}
    </div>
  );
};

/* ---------- Field (label + input) ---------- */
const Field = ({ label, hint, children, style }) => (
  <label style={{ display: "grid", gap: 6, ...style }}>
    <span style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-soft)", fontWeight: 600 }}>{label}</span>
    {children}
    {hint && <span style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{hint}</span>}
  </label>
);
const inputStyle = {
  width: "100%", boxSizing: "border-box",
  padding: "12px 14px",
  background: "var(--cl-surface)", color: "var(--cl-ink)",
  border: "1px solid var(--cl-border-strong)", borderRadius: "var(--cl-r-md)",
  font: "var(--cl-t-md)", outline: "none",
};

/* ---------- Pill segmented ---------- */
const Segmented = ({ value, onChange, options }) => (
  <div style={{
    display: "inline-flex", padding: 4,
    background: "var(--cl-bg-deep)", borderRadius: "var(--cl-r-pill)",
    border: "1px solid var(--cl-border)",
  }}>
    {options.map(o => (
      <button key={o.value} onClick={() => onChange(o.value)} style={{
        ...buttonBase,
        padding: "8px 14px", borderRadius: "var(--cl-r-pill)",
        background: value === o.value ? "var(--cl-surface)" : "transparent",
        color: "var(--cl-ink)",
        boxShadow: value === o.value ? "var(--cl-shadow-1)" : "none",
        font: "var(--cl-t-sm)", fontWeight: 600,
      }}>{o.label}</button>
    ))}
  </div>
);

/* ---------- Mock photo (kid placeholder) ---------- */
const KidPortrait = ({ name = "N", tint = 0, size = 64, accent }) => {
  const t = AVATAR_TINTS[tint % AVATAR_TINTS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(140deg, ${t.bg} 0%, ${t.bg}DD 100%)`,
      position: "relative", overflow: "hidden", flex: "none",
      boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.06)",
    }}>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        {/* head */}
        <circle cx="32" cy="26" r="11" fill={t.fg} opacity="0.85"/>
        {/* body */}
        <path d={`M14 64 C 16 46, 20 42, 32 42 C 44 42, 48 46, 50 64 Z`} fill={t.fg} opacity="0.85"/>
        {/* accent dot — e.g. school colors */}
        {accent && <circle cx="38" cy="55" r="3" fill={accent}/>}
      </svg>
    </div>
  );
};

/* ---------- Export to window ---------- */
Object.assign(window, {
  CL_Icon: Icon,
  CL_StatusChip: StatusChip,
  CL_STATUS: STATUS,
  CL_STATUS_ORDER: STATUS_ORDER,
  CL_Button: Button,
  CL_Card: Card,
  CL_Avatar: Avatar,
  CL_Plate: Plate,
  CL_ProgressTrack: ProgressTrack,
  CL_Field: Field,
  CL_inputStyle: inputStyle,
  CL_Segmented: Segmented,
  CL_KidPortrait: KidPortrait,
  CL_buttonBase: buttonBase,
});
