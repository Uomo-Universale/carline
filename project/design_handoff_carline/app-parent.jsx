/* CarLine — Parent app screens.
   Uses window.CL_* primitives. Each screen is a component receiving an
   optional `state` object to drive interactivity from the parent. */

const {
  CL_Icon: I, CL_StatusChip: Chip, CL_STATUS: ST, CL_STATUS_ORDER: SORDER,
  CL_Button: Btn, CL_Card: Card, CL_Avatar: Av, CL_Plate: Plate,
  CL_ProgressTrack: Track, CL_Field: Field, CL_inputStyle: inputStyle,
  CL_Segmented: Seg, CL_KidPortrait: Kid, CL_buttonBase: bbase,
} = window;

const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;

/* ---------- Mock data ---------- */
const SCHOOL = "Rambam Day School";
const PARENT = { name: "Sarah Levin", phone: "+1 (917) 555-0142" };
const CHILDREN = [
  { id: "naomi", name: "Naomi Levin", grade: "3rd grade", teacher: "Mrs. Cohen",  homeroom: "3-B", tint: 0 },
  { id: "eli",   name: "Eli Levin",   grade: "Kindergarten", teacher: "Ms. Stein", homeroom: "K-A", tint: 1 },
];
const VEHICLE = { year: "2022", make: "Subaru", model: "Outback", color: "Forest Green", plate: "RDS 7821", state: "NY" };
const AUTHORIZED = [
  { name: "Sarah Levin",  role: "Parent",       relation: "Mother",  primary: true,  forKids: ["naomi", "eli"] },
  { name: "David Levin",  role: "Parent",       relation: "Father",  primary: true,  forKids: ["naomi", "eli"] },
  { name: "Rachel Adler", role: "Approved",     relation: "Aunt",    primary: false, forKids: ["naomi", "eli"] },
  { name: "Mike Levin",   role: "Approved",     relation: "Grandfather", primary: false, forKids: ["eli"] },
];

/* ============================================================
   1. ONBOARDING / LOGIN — SSO placeholder
   ============================================================ */
const ParentOnboarding = () => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 28px 32px", background: "linear-gradient(180deg, var(--cl-bg) 0%, var(--cl-bg-deep) 100%)" }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
      {/* Logo lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--cl-primary)", color: "var(--cl-accent)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--cl-shadow-2)" }}>
          <I name="car" size={30} color="var(--cl-accent)" strokeWidth={2}/>
        </div>
        <div>
          <div style={{ font: "var(--cl-t-2xl)", fontFamily: "var(--cl-font-display)", color: "var(--cl-ink)", lineHeight: 1 }}>CarLine</div>
          <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 4 }}>{SCHOOL}</div>
        </div>
      </div>
      <div>
        <div style={{ font: "var(--cl-t-3xl)", fontFamily: "var(--cl-font-display)", color: "var(--cl-ink)", letterSpacing: -0.5, textWrap: "balance" }}>
          Pickup, without the wait.
        </div>
        <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink-soft)", marginTop: 12, lineHeight: 1.5 }}>
          One tap when you're in line, and we'll walk your child out. No honks, no flagging down a teacher.
        </div>
      </div>
    </div>
    <div style={{ display: "grid", gap: 12 }}>
      <Btn variant="primary" size="lg" block leading={<I name="school" size={20} color="currentColor"/>}>
        Continue with school account
      </Btn>
      <Btn variant="secondary" size="lg" block>Use phone number instead</Btn>
      <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textAlign: "center", marginTop: 6, lineHeight: 1.5 }}>
        By continuing you agree to the school's family handbook and pickup policy.
      </div>
    </div>
  </div>
);

/* ---------- Bottom nav shared by parent screens ---------- */
const ParentTabBar = ({ active = "home" }) => {
  const items = [
    { id: "home",    label: "Home",    icon: "home" },
    { id: "vehicle", label: "Vehicle", icon: "car" },
    { id: "people",  label: "People",  icon: "users" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(255,252,245,0.92)", backdropFilter: "blur(20px)",
      borderTop: "1px solid var(--cl-border)",
      padding: "10px 12px 26px",
      display: "flex", justifyContent: "space-around",
    }}>
      {items.map(it => (
        <button key={it.id} style={{
          ...bbase, background: "transparent", color: active === it.id ? "var(--cl-primary)" : "var(--cl-ink-muted)",
          flexDirection: "column", gap: 4, padding: "6px 10px", minWidth: 56,
          font: "var(--cl-t-xs)", fontWeight: 600,
        }}>
          <I name={it.icon} size={22} color="currentColor" strokeWidth={active === it.id ? 2.2 : 1.8}/>
          {it.label}
        </button>
      ))}
    </div>
  );
};

const ParentHeader = ({ title, subtitle, leading, trailing }) => (
  <div style={{ padding: "8px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
    {leading}
    <div style={{ flex: 1, minWidth: 0 }}>
      {subtitle && <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>{subtitle}</div>}
      <div style={{ font: "var(--cl-t-xl)", fontFamily: "var(--cl-font-display)", color: "var(--cl-ink)", letterSpacing: -0.3 }}>{title}</div>
    </div>
    {trailing}
  </div>
);

/* ============================================================
   2A. PARENT HOME — Variant A: One big button picks up ALL kids
   ============================================================ */
const ParentHomeA = ({ onTap, requested = false, kids = CHILDREN, dismissalStatus = "Dismissal at 3:25 — on time" }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", background: "var(--cl-bg)" }}>
    <ParentHeader
      subtitle={SCHOOL}
      title={`Hi, ${PARENT.name.split(" ")[0]}`}
      leading={<Av name={PARENT.name} size={40}/>}
      trailing={<button style={{ ...bbase, background: "transparent", padding: 8, color: "var(--cl-ink-soft)" }}><I name="bell" size={22}/></button>}
    />

    {/* Today banner */}
    <div style={{ margin: "0 20px 16px", padding: "10px 14px", background: "var(--cl-primary-soft)", border: "1px solid #C8D5E6", borderRadius: 12, display: "flex", gap: 10, alignItems: "center" }}>
      <I name="clock" size={18} color="var(--cl-primary)" strokeWidth={2}/>
      <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink)" }}>{dismissalStatus}</div>
    </div>

    {/* Hero action */}
    <div style={{ padding: "0 20px 12px" }}>
      <button onClick={onTap} disabled={requested} style={{
        ...bbase,
        width: "100%",
        background: requested ? "var(--cl-success)" : "var(--cl-accent)",
        color: requested ? "white" : "#3A2206",
        borderRadius: 24, padding: "30px 24px",
        boxShadow: requested ? "0 12px 28px -8px rgba(47,107,90,0.4)" : "0 14px 32px -8px rgba(232,163,61,0.55), inset 0 -3px 0 rgba(0,0,0,0.08)",
        display: "block", textAlign: "left", position: "relative",
        transition: "all var(--cl-med) var(--cl-ease)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ font: "var(--cl-t-4xl)", fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
              {requested ? "We've got you" : "I'm here"}
            </div>
            <div style={{ font: "var(--cl-t-md)", marginTop: 8, opacity: 0.85 }}>
              {requested ? "Hold tight — pulling Naomi & Eli now" : "Tap when you're in the car line"}
            </div>
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <I name={requested ? "check" : "car"} size={32} color={requested ? "white" : "#3A2206"} strokeWidth={2.4}/>
          </div>
        </div>
      </button>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Btn variant="secondary" size="md" leading={<I name="walk" size={18}/>} style={{ flex: 1 }}>Walking up</Btn>
        <Btn variant="secondary" size="md" leading={<I name="clock" size={18}/>} style={{ flex: 1 }}>Early pickup</Btn>
      </div>
    </div>

    {/* Kid list */}
    <div style={{ padding: "16px 20px", flex: 1, overflow: "hidden" }}>
      <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, margin: "0 4px 10px" }}>
        Picking up today
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {kids.map(k => (
          <Card key={k.id} padding={14} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Kid tint={k.tint} name={k.name[0]} size={48}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "var(--cl-t-md)", fontWeight: 650, color: "var(--cl-ink)" }}>{k.name}</div>
              <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>{k.grade} · {k.teacher}</div>
            </div>
            <Chip status={requested ? "requested" : "none"} size="sm"/>
          </Card>
        ))}
      </div>
    </div>

    <ParentTabBar active="home"/>
  </div>
);

/* ============================================================
   2B. PARENT HOME — Variant B: per-child cards with own buttons
   ============================================================ */
const ParentHomeB = ({ onTap, kidStatuses = {} }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", background: "var(--cl-bg)" }}>
    <ParentHeader
      subtitle={SCHOOL}
      title={`Pickup`}
      leading={<button style={{ ...bbase, background: "transparent", padding: 8 }}><Av name={PARENT.name} size={36}/></button>}
      trailing={
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "var(--cl-surface)", border: "1px solid var(--cl-border)", borderRadius: 999 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cl-success)" }}/>
          <span style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-soft)", fontWeight: 600 }}>On time</span>
        </div>
      }
    />

    <div style={{ padding: "0 20px 12px", display: "grid", gap: 14, flex: 1 }}>
      {CHILDREN.map((k, idx) => {
        const status = kidStatuses[k.id] || "none";
        const isLive = status !== "none";
        return (
          <div key={k.id} style={{
            background: "var(--cl-surface)",
            border: "1px solid var(--cl-border)",
            borderRadius: 24,
            padding: 18,
            boxShadow: "var(--cl-shadow-1)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Kid tint={k.tint} name={k.name[0]} size={52}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "var(--cl-t-lg)", fontWeight: 700, color: "var(--cl-ink)" }}>{k.name}</div>
                <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>{k.grade} · {k.teacher}</div>
              </div>
              {isLive && <Chip status={status} size="sm"/>}
            </div>
            {/* Big action */}
            <button onClick={() => onTap?.(k.id)} disabled={isLive} style={{
              ...bbase, width: "100%",
              background: isLive ? "var(--cl-bg-deep)" : "var(--cl-accent)",
              color: isLive ? "var(--cl-ink-soft)" : "#3A2206",
              padding: "18px 18px", borderRadius: 16,
              boxShadow: isLive ? "none" : "0 8px 20px -6px rgba(232,163,61,0.5), inset 0 -3px 0 rgba(0,0,0,0.08)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ font: "var(--cl-t-2xl)", fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
                  {isLive ? ST[status].label : "I'm here"}
                </div>
                <div style={{ font: "var(--cl-t-sm)", marginTop: 4, opacity: 0.8, fontWeight: 500 }}>
                  {isLive ? "Live status — tap to view" : `Carline pickup for ${k.name.split(" ")[0]}`}
                </div>
              </div>
              <I name={isLive ? "chevronR" : "arrowRight"} size={28} color="currentColor" strokeWidth={2.2}/>
            </button>
            {/* Secondary row */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { icon: "walk",  label: "Walk-in" },
                { icon: "clock", label: "Early" },
                { icon: "chat",  label: "Message" },
              ].map(o => (
                <button key={o.label} style={{
                  ...bbase, flex: 1, background: "transparent", color: "var(--cl-ink-soft)",
                  padding: "8px 6px", borderRadius: 10, border: "1px solid var(--cl-border)",
                  font: "var(--cl-t-xs)", fontWeight: 600, gap: 4,
                }}>
                  <I name={o.icon} size={16}/> {o.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>

    <ParentTabBar active="home"/>
  </div>
);

/* ============================================================
   3. VEHICLE PROFILE
   ============================================================ */
// helper for color-name → hex
const VEHICLE_COLOR_HEX = (name) => ({
  "Forest Green": "#2F5A3A", "Charcoal": "#2B2B30", "White": "#F2EEE5",
  "Silver": "#B8BCC2", "Navy": "#1F3A5F", "Red": "#A8392E", "Beige": "#D8C39A",
}[name] || "#999");

const ParentVehicle = () => {
  const [color, setColor] = useS(VEHICLE.color);
  const [plate, setPlate] = useS(VEHICLE.plate);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)", position: "relative" }}>
      <ParentHeader
        subtitle="Vehicle profile"
        title="What we look for"
        leading={<button style={{ ...bbase, background: "transparent", padding: 8, color: "var(--cl-ink-soft)" }}><I name="arrowLeft" size={22}/></button>}
      />
      {/* Compact plate card */}
      <div style={{ margin: "0 20px 16px", padding: 18, background: "linear-gradient(160deg, var(--cl-surface) 0%, var(--cl-surface-2) 100%)", border: "1px solid var(--cl-border)", borderRadius: 18, display: "grid", gap: 10 }}>
        <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>Staff sees this card</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: VEHICLE_COLOR_HEX(color), border: "1px solid rgba(0,0,0,0.15)", flex: "none" }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "var(--cl-t-md)", fontWeight: 650, color: "var(--cl-ink)" }}>{color} {VEHICLE.make} {VEHICLE.model}</div>
            <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{VEHICLE.year}</div>
          </div>
          <Plate plate={plate} state={VEHICLE.state} size="md"/>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "grid", gap: 12, flex: 1, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1.4fr", gap: 10 }}>
          <Field label="Year"><input style={inputStyle} defaultValue={VEHICLE.year}/></Field>
          <Field label="Make"><input style={inputStyle} defaultValue={VEHICLE.make}/></Field>
          <Field label="Model"><input style={inputStyle} defaultValue={VEHICLE.model}/></Field>
        </div>
        <Field label="Color" hint="Staff matches the color first">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              ["Forest Green", "#2F5A3A"],
              ["Charcoal", "#2B2B30"],
              ["White", "#F2EEE5"],
              ["Silver", "#B8BCC2"],
              ["Navy", "#1F3A5F"],
              ["Red", "#A8392E"],
              ["Beige", "#D8C39A"],
            ].map(([n, h]) => {
              const sel = n === color;
              return (
                <button key={n} onClick={() => setColor(n)} style={{
                  ...bbase, gap: 6, padding: "5px 9px 5px 5px",
                  background: sel ? "var(--cl-primary-soft)" : "var(--cl-surface)",
                  border: sel ? "1.5px solid var(--cl-primary)" : "1px solid var(--cl-border-strong)",
                  borderRadius: 999, color: "var(--cl-ink)",
                  font: "var(--cl-t-sm)", fontWeight: 600,
                }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: h, border: "1px solid rgba(0,0,0,0.15)" }}/>
                  {n}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="License plate"><input style={{ ...inputStyle, fontFamily: "var(--cl-font-mono)", letterSpacing: 1, textTransform: "uppercase" }} value={plate} onChange={e => setPlate(e.target.value)}/></Field>
      </div>

      <div style={{ padding: "12px 20px 96px" }}>
        <Btn variant="primary" size="lg" block>Save vehicle</Btn>
      </div>

      <ParentTabBar active="vehicle"/>
    </div>
  );
};

/* ============================================================

/* ============================================================
   4. PICKUP REQUEST PICKER + EARLY PICKUP FORM + MESSAGE
   ============================================================ */
const PickupTypePicker = ({ onChoose }) => {
  const items = [
    { id: "carline", icon: "car",       title: "Carline",        sub: "Tap when you're in line — staff walks them out", accent: "var(--cl-accent)" },
    { id: "walkin",  icon: "walk",      title: "Walk-in",        sub: "I'm parking and walking up to the door",          accent: "#2A6FA3" },
    { id: "early",   icon: "clock",     title: "Early pickup",   sub: "Before dismissal — needs a reason and time",      accent: "#C97A1F" },
    { id: "message", icon: "chat",      title: "Message office", sub: "Send a note — no pickup right now",               accent: "#7A8699" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)", position: "relative" }}>
      <ParentHeader subtitle="New request" title="How are you picking up?" leading={<button style={{ ...bbase, background: "transparent", padding: 8 }}><I name="x" size={22}/></button>}/>
      <div style={{ padding: "0 20px", display: "grid", gap: 12 }}>
        {items.map(it => (
          <button key={it.id} onClick={() => onChoose?.(it.id)} style={{
            ...bbase, width: "100%", padding: 18, gap: 16,
            background: "var(--cl-surface)", color: "var(--cl-ink)",
            border: "1px solid var(--cl-border)", borderRadius: 18,
            boxShadow: "var(--cl-shadow-1)", justifyContent: "flex-start", textAlign: "left",
          }}>
            <span style={{ width: 52, height: 52, borderRadius: 14, background: `${it.accent}22`, color: it.accent, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <I name={it.icon} size={26} color={it.accent} strokeWidth={2}/>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "var(--cl-t-lg)", fontWeight: 700 }}>{it.title}</div>
              <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 2 }}>{it.sub}</div>
            </span>
            <I name="chevronR" size={20} color="var(--cl-ink-muted)"/>
          </button>
        ))}
      </div>
      <ParentTabBar active="home"/>
    </div>
  );
};

const EarlyPickupForm = () => {
  const [reason, setReason] = useS("doctor");
  const [time, setTime] = useS("2:15");
  const [kidSel, setKidSel] = useS("naomi");
  const reasons = [
    { id: "doctor",    label: "Doctor / dentist" },
    { id: "family",    label: "Family obligation" },
    { id: "religious", label: "Religious appt." },
    { id: "other",     label: "Other" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)", position: "relative" }}>
      <ParentHeader
        subtitle="Early pickup" title="Today at school"
        leading={<button style={{ ...bbase, background: "transparent", padding: 8 }}><I name="arrowLeft" size={22}/></button>}
      />
      <div style={{ padding: "0 20px", display: "grid", gap: 18, flex: 1, overflow: "hidden" }}>
        <Field label="Who's leaving early?">
          <div style={{ display: "grid", gap: 8 }}>
            {CHILDREN.map(k => (
              <button key={k.id} onClick={() => setKidSel(k.id)} style={{
                ...bbase, gap: 12, padding: 12, justifyContent: "flex-start",
                background: kidSel === k.id ? "var(--cl-primary-soft)" : "var(--cl-surface)",
                border: kidSel === k.id ? "1.5px solid var(--cl-primary)" : "1px solid var(--cl-border)",
                borderRadius: 14, color: "var(--cl-ink)",
              }}>
                <Kid tint={k.tint} name={k.name[0]} size={36}/>
                <div style={{ textAlign: "left" }}>
                  <div style={{ font: "var(--cl-t-md)", fontWeight: 650 }}>{k.name}</div>
                  <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{k.grade}</div>
                </div>
                <div style={{ flex: 1 }}/>
                {kidSel === k.id && <I name="check" size={20} color="var(--cl-primary)" strokeWidth={2.4}/>}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Pickup time">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["1:00", "1:30", "2:00", "2:15", "2:30", "3:00"].map(t => (
              <button key={t} onClick={() => setTime(t)} style={{
                ...bbase, padding: "10px 14px", borderRadius: 999,
                background: time === t ? "var(--cl-primary)" : "var(--cl-surface)",
                color: time === t ? "white" : "var(--cl-ink)",
                border: "1px solid " + (time === t ? "var(--cl-primary)" : "var(--cl-border-strong)"),
                font: "var(--cl-t-sm)", fontWeight: 600,
              }}>{t} PM</button>
            ))}
            <button style={{ ...bbase, padding: "10px 14px", borderRadius: 999, background: "transparent", color: "var(--cl-ink-soft)", border: "1px dashed var(--cl-border-strong)", font: "var(--cl-t-sm)", fontWeight: 600 }}>Other…</button>
          </div>
        </Field>
        <Field label="Reason" hint="Needed for office approval">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {reasons.map(r => (
              <button key={r.id} onClick={() => setReason(r.id)} style={{
                ...bbase, padding: "12px 14px", borderRadius: 12, justifyContent: "flex-start",
                background: reason === r.id ? "var(--cl-primary-soft)" : "var(--cl-surface)",
                border: reason === r.id ? "1.5px solid var(--cl-primary)" : "1px solid var(--cl-border)",
                color: "var(--cl-ink)", font: "var(--cl-t-sm)", fontWeight: 600,
              }}>{r.label}</button>
            ))}
          </div>
        </Field>
        <Field label="Note for the office (optional)">
          <textarea style={{ ...inputStyle, minHeight: 64, resize: "none", fontFamily: "var(--cl-font-sans)" }} placeholder="e.g., Orthodontist on Atlantic Ave"/>
        </Field>
      </div>
      <div style={{ padding: "16px 20px 92px" }}>
        <Btn variant="primary" size="lg" block trailing={<I name="arrowRight" size={20}/>}>Send for approval</Btn>
        <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textAlign: "center", marginTop: 10 }}>
          Office reviews early pickups before dismissal. You'll get a notification.
        </div>
      </div>
      <ParentTabBar active="home"/>
    </div>
  );
};

/* ============================================================
   5. LIVE STATUS — Requested → Arrived → Called → Released
   ============================================================ */
const LiveStatus = ({ status = "arrived", kid = CHILDREN[0] }) => {
  const isReleased = status === "released";
  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column", position: "relative",
      background: isReleased
        ? "linear-gradient(180deg, #DCEBE3 0%, var(--cl-bg) 70%)"
        : status === "called"
        ? "linear-gradient(180deg, #F8E0BF 0%, var(--cl-bg) 70%)"
        : "var(--cl-bg)",
      transition: "background var(--cl-slow) var(--cl-ease)",
    }}>
      <ParentHeader
        subtitle="Live"
        title="Pickup in progress"
        leading={<button style={{ ...bbase, background: "transparent", padding: 8 }}><I name="x" size={22}/></button>}
      />
      {/* Big status hero */}
      <div style={{ padding: "8px 20px 16px", textAlign: "center" }}>
        <div style={{
          width: 132, height: 132, margin: "12px auto 20px", borderRadius: "50%",
          background: ST[status].dot + "22", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {/* pulsing ring for active states */}
          {!isReleased && (
            <span style={{
              position: "absolute", inset: -8, borderRadius: "50%",
              border: `3px solid ${ST[status].dot}66`,
              animation: "cl-pulse 1.8s ease-out infinite",
            }}/>
          )}
          <span style={{
            width: 92, height: 92, borderRadius: "50%",
            background: ST[status].dot, color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 12px 28px -8px rgba(21,35,58,0.25)",
          }}>
            <I name={isReleased ? "check" : status === "called" ? "megaphone" : status === "arrived" ? "car" : "clock"} size={44} color="white" strokeWidth={2.2}/>
          </span>
        </div>
        <div style={{ font: "var(--cl-t-3xl)", fontFamily: "var(--cl-font-display)", color: "var(--cl-ink)", letterSpacing: -0.5 }}>
          {{
            requested: "We told the school",
            arrived: "You're in the queue",
            called: `${kid.name.split(" ")[0]} is coming out`,
            released: `${kid.name.split(" ")[0]} is in your car`,
          }[status]}
        </div>
        <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink-soft)", marginTop: 8, padding: "0 20px" }}>
          {{
            requested: "Office sees your request. Pull into the carline when you arrive.",
            arrived:   "Position 4 of 7. Mrs. Cohen has been notified.",
            called:    "Mrs. Cohen is walking Naomi to the curb now.",
            released:  "Drive safe! Have a great evening.",
          }[status]}
        </div>
      </div>
      {/* Track */}
      <div style={{ padding: "0 24px" }}>
        <Track status={status} layout="vertical"/>
      </div>

      {/* Action */}
      <div style={{ padding: "16px 20px 92px" }}>
        {isReleased ? (
          <Btn variant="primary" size="lg" block>Done</Btn>
        ) : (
          <Btn variant="secondary" size="lg" block leading={<I name="chat" size={20}/>}>Message the office</Btn>
        )}
      </div>

      <ParentTabBar active="home"/>
      <style>{`@keyframes cl-pulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.35); opacity: 0; }
      }`}</style>
    </div>
  );
};

/* ============================================================
   6. AUTHORIZED PICKUP PERSONS
   ============================================================ */
const AuthorizedPersons = () => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)", position: "relative" }}>
    <ParentHeader
      subtitle="Authorized pickup"
      title="Who can collect"
      leading={<button style={{ ...bbase, background: "transparent", padding: 8 }}><I name="arrowLeft" size={22}/></button>}
      trailing={<button style={{ ...bbase, padding: 8, background: "transparent", color: "var(--cl-ink-muted)" }}><I name="info" size={22}/></button>}
    />
    <div style={{ margin: "0 20px 12px", padding: "12px 14px", background: "var(--cl-warning-soft)", border: "1px solid #ECCE9A", borderRadius: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
      <I name="shield" size={18} color="var(--cl-warning)" strokeWidth={2}/>
      <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink)" }}>
        This list is read-only. To add or remove a person, contact the school office.
      </div>
    </div>

    <div style={{ padding: "0 20px", display: "grid", gap: 16, flex: 1, overflow: "hidden" }}>
      {CHILDREN.map(k => (
        <div key={k.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 4px 8px" }}>
            <Kid tint={k.tint} name={k.name[0]} size={28}/>
            <div style={{ font: "var(--cl-t-md)", fontWeight: 700, color: "var(--cl-ink)" }}>{k.name}</div>
            <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{k.grade}</div>
          </div>
          <Card padding={0}>
            {AUTHORIZED.filter(a => a.forKids.includes(k.id)).map((a, i, arr) => (
              <div key={a.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--cl-border)" : "none",
              }}>
                <Av name={a.name} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "var(--cl-t-md)", fontWeight: 600, color: "var(--cl-ink)" }}>{a.name}</div>
                  <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{a.relation}</div>
                </div>
                {a.primary && <span style={{ font: "var(--cl-t-xs)", padding: "3px 8px", borderRadius: 999, background: "var(--cl-primary-soft)", color: "var(--cl-primary)", fontWeight: 700 }}>Primary</span>}
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>

    <ParentTabBar active="people"/>
  </div>
);

Object.assign(window, {
  CL_ParentOnboarding: ParentOnboarding,
  CL_ParentHomeA: ParentHomeA,
  CL_ParentHomeB: ParentHomeB,
  CL_ParentVehicle: ParentVehicle,
  CL_PickupTypePicker: PickupTypePicker,
  CL_EarlyPickupForm: EarlyPickupForm,
  CL_LiveStatus: LiveStatus,
  CL_AuthorizedPersons: AuthorizedPersons,
  CL_CHILDREN: CHILDREN, CL_PARENT: PARENT, CL_SCHOOL: SCHOOL, CL_VEHICLE: VEHICLE, CL_AUTHORIZED: AUTHORIZED,
  CL_ParentTabBar: ParentTabBar,
});
