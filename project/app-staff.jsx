/* CarLine — Staff dashboard screens (iPad). */

const {
  CL_Icon: SI, CL_StatusChip: SChip, CL_STATUS: SST, CL_STATUS_ORDER: SORDER2,
  CL_Button: SBtn, CL_Card: SCard, CL_Avatar: SAv, CL_Plate: SPlate,
  CL_Field: SField, CL_inputStyle: sInput, CL_Segmented: SSeg,
  CL_KidPortrait: SKid, CL_buttonBase: sBase,
} = window;

const { useState: useStateS, useMemo: useMemoS } = React;

/* ---------- Queue mock data ---------- */
const QUEUE = [
  { id: "q1", arrived: "3:22", child: "Naomi Levin",     grade: "3-B", teacher: "Mrs. Cohen",   guardian: "Sarah Levin",       plate: "RDS 7821",  car: "Forest Green Subaru Outback",   color: "#2F5A3A", status: "called",   pos: 1 },
  { id: "q2", arrived: "3:22", child: "Eli Levin",       grade: "K-A", teacher: "Ms. Stein",    guardian: "Sarah Levin",       plate: "RDS 7821",  car: "Forest Green Subaru Outback",   color: "#2F5A3A", status: "called",   pos: 1 },
  { id: "q3", arrived: "3:23", child: "Mira Abramson",   grade: "1-A", teacher: "Mrs. Kaplan",  guardian: "David Abramson",    plate: "HQR 4421",  car: "White Honda Odyssey",           color: "#F2EEE5", status: "arrived",  pos: 2 },
  { id: "q4", arrived: "3:24", child: "Asher Goldberg",  grade: "4-B", teacher: "Mr. Friedman", guardian: "Rachel Goldberg",   plate: "9LMK 02",   car: "Charcoal Toyota Highlander",    color: "#2B2B30", status: "arrived",  pos: 3 },
  { id: "q5", arrived: "3:25", child: "Yael Roth",       grade: "2-A", teacher: "Mrs. Adler",   guardian: "Aunt Esther Roth",  plate: "JK 88123",  car: "Silver Tesla Model Y",          color: "#B8BCC2", status: "arrived",  pos: 4, alert: "Approved pickup: Aunt" },
  { id: "q6", arrived: "3:25", child: "Daniel Weisman",  grade: "5-A", teacher: "Mr. Stern",    guardian: "Avi Weisman",       plate: "HRT 0044",  car: "Navy Volvo XC60",               color: "#1F3A5F", status: "arrived",  pos: 5 },
  { id: "q7", arrived: "3:26", child: "Hannah Berkowitz",grade: "3-A", teacher: "Mrs. Cohen",   guardian: "Miriam Berkowitz",  plate: "GHA 7710",  car: "Red Mazda CX-5",                color: "#A8392E", status: "arrived",  pos: 6 },
  { id: "q8", arrived: "3:27", child: "Sam Friedman",    grade: "K-B", teacher: "Ms. Wexler",   guardian: "Joel Friedman",     plate: "BBQ 1019",  car: "Beige Lexus RX",                color: "#D8C39A", status: "released", pos: 0 },
  { id: "q9", arrived: "3:21", child: "Ava Klein",       grade: "2-B", teacher: "Mrs. Adler",   guardian: "Talia Klein",       plate: "AVA 0001",  car: "White Honda Pilot",             color: "#F2EEE5", status: "released", pos: 0 },
];

/* ---------- Staff topbar ---------- */
const StaffTopbar = ({ title = "Dismissal — Today, May 28", count, onSearch }) => (
  <div style={{
    padding: "16px 28px",
    background: "var(--cl-surface)",
    borderBottom: "1px solid var(--cl-border)",
    display: "flex", alignItems: "center", gap: 20,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--cl-primary)", color: "var(--cl-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SI name="car" size={22} color="var(--cl-accent)" strokeWidth={2}/>
      </div>
      <div>
        <div style={{ font: "var(--cl-t-lg)", fontWeight: 700, color: "var(--cl-ink)" }}>{title}</div>
        <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>Rambam Day School · Dismissal 3:25</div>
      </div>
    </div>
    <div style={{ flex: 1 }}/>
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 14px",
      background: "var(--cl-bg-deep)", borderRadius: 999,
      border: "1px solid var(--cl-border)", minWidth: 300,
    }}>
      <SI name="search" size={20} color="var(--cl-ink-muted)"/>
      <input placeholder="Search child, guardian, plate…" style={{
        background: "transparent", border: "none", outline: "none", flex: 1,
        font: "var(--cl-t-md)", color: "var(--cl-ink)",
      }}/>
      <span style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", padding: "2px 6px", border: "1px solid var(--cl-border-strong)", borderRadius: 4 }}>⌘K</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "var(--cl-accent-soft)", borderRadius: 999, border: "1px solid #ECCE9A" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cl-accent)" }}/>
        <span style={{ font: "var(--cl-t-sm)", fontWeight: 700, color: "var(--cl-ink)" }}>{count ?? 6} in queue</span>
      </div>
      <SAv name="Lisa Office" size={40}/>
    </div>
  </div>
);

/* ---------- Filter bar ---------- */
const FilterBar = ({ density = "comfort", onDensity }) => (
  <div style={{ padding: "14px 28px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--cl-border)", background: "var(--cl-surface-2)" }}>
    <span style={{ font: "var(--cl-t-sm)", fontWeight: 600, color: "var(--cl-ink-muted)" }}>Filter</span>
    {[
      { label: "All grades", active: true },
      { label: "K", active: false },
      { label: "1", active: false },
      { label: "2", active: false },
      { label: "3", active: false },
      { label: "4", active: false },
      { label: "5", active: false },
    ].map(f => (
      <button key={f.label} style={{
        ...sBase, padding: "8px 14px", borderRadius: 999,
        background: f.active ? "var(--cl-primary)" : "var(--cl-surface)",
        color: f.active ? "white" : "var(--cl-ink)",
        border: "1px solid " + (f.active ? "var(--cl-primary)" : "var(--cl-border-strong)"),
        font: "var(--cl-t-sm)", fontWeight: 600,
      }}>{f.label}</button>
    ))}
    <div style={{ width: 1, height: 24, background: "var(--cl-border-strong)" }}/>
    <button style={{ ...sBase, padding: "8px 14px", borderRadius: 999, background: "var(--cl-surface)", color: "var(--cl-ink)", border: "1px solid var(--cl-border-strong)", font: "var(--cl-t-sm)", fontWeight: 600, gap: 6 }}>
      <SI name="users" size={16}/> Mrs. Cohen
    </button>
    <button style={{ ...sBase, padding: "8px 12px", borderRadius: 999, background: "transparent", color: "var(--cl-ink-soft)", border: "1px dashed var(--cl-border-strong)", font: "var(--cl-t-sm)", fontWeight: 600 }}>
      <SI name="plus" size={16}/> Filter
    </button>
    <div style={{ flex: 1 }}/>
    {onDensity && (
      <SSeg value={density} onChange={onDensity} options={[
        { value: "comfort", label: "Comfort" },
        { value: "compact", label: "Compact" },
      ]}/>
    )}
  </div>
);

/* ============================================================
   STAFF QUEUE — Variant A: dense list, ordered by arrival
   ============================================================ */
const StaffQueueA = ({ density = "comfort", onAdvance, queue }) => {
  const q = (queue || QUEUE).filter(r => r.status !== "released");
  const released = (queue || QUEUE).filter(r => r.status === "released");
  const rowH = density === "compact" ? 76 : 96;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)" }}>
      <StaffTopbar count={q.length}/>
      <FilterBar density={density}/>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "60px 80px 1.4fr 1fr 1fr 1.1fr 1.2fr 220px", gap: 18, padding: "12px 28px", font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, borderBottom: "1px solid var(--cl-border)" }}>
        <span>Pos.</span><span>Time</span><span>Child</span><span>Grade</span><span>Teacher</span><span>Guardian</span><span>Vehicle</span><span>Status</span>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {q.map((r, idx) => (
          <div key={r.id} style={{
            display: "grid", gridTemplateColumns: "60px 80px 1.4fr 1fr 1fr 1.1fr 1.2fr 220px",
            gap: 18, padding: density === "compact" ? "10px 28px" : "16px 28px",
            alignItems: "center", borderBottom: "1px solid var(--cl-border)",
            background: idx % 2 ? "transparent" : "var(--cl-surface-2)",
            minHeight: rowH,
          }}>
            <div style={{ font: "var(--cl-t-2xl)", fontWeight: 700, color: r.status === "called" ? "var(--cl-warning)" : "var(--cl-ink)" }}>{r.pos || "—"}</div>
            <div style={{ font: "var(--cl-t-md)", fontFamily: "var(--cl-font-mono)", color: "var(--cl-ink-soft)" }}>{r.arrived}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <SKid tint={idx % 5} name={r.child[0]} size={density === "compact" ? 36 : 44}/>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "var(--cl-t-lg)", fontWeight: 650, color: "var(--cl-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.child}</div>
                {r.alert && <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-warning)", fontWeight: 600 }}>⚑ {r.alert}</div>}
              </div>
            </div>
            <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink)" }}>{r.grade}</div>
            <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink-soft)" }}>{r.teacher}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <SAv name={r.guardian} size={28}/>
              <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.guardian}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, background: r.color, border: "1px solid rgba(0,0,0,0.2)", flex: "none" }}/>
              <SPlate plate={r.plate} state="NY" size="sm"/>
            </div>
            <div>
              {r.status === "arrived" ? (
                <button onClick={() => onAdvance?.(r.id)} style={{
                  ...sBase, width: "100%", padding: density === "compact" ? "10px 14px" : "14px 16px",
                  background: "var(--cl-warning)", color: "white", borderRadius: 12,
                  font: "var(--cl-t-md)", fontWeight: 700,
                  boxShadow: "0 6px 16px -6px rgba(201,122,31,0.5)",
                  gap: 8,
                }}><SI name="megaphone" size={20} color="white" strokeWidth={2.2}/> Call out</button>
              ) : r.status === "called" ? (
                <button onClick={() => onAdvance?.(r.id)} style={{
                  ...sBase, width: "100%", padding: density === "compact" ? "10px 14px" : "14px 16px",
                  background: "var(--cl-success)", color: "white", borderRadius: 12,
                  font: "var(--cl-t-md)", fontWeight: 700,
                  boxShadow: "0 6px 16px -6px rgba(47,107,90,0.5)", gap: 8,
                }}><SI name="check" size={20} color="white" strokeWidth={2.4}/> Released</button>
              ) : (
                <SChip status={r.status} size="lg"/>
              )}
            </div>
          </div>
        ))}
        {released.length > 0 && (
          <div style={{ padding: "20px 28px 8px", font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>
            Released — {released.length}
          </div>
        )}
        {released.map(r => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "60px 80px 1.4fr 1fr 1fr 1.1fr 1.2fr 220px", gap: 18, padding: "12px 28px", alignItems: "center", opacity: 0.55, borderBottom: "1px solid var(--cl-border)" }}>
            <div/><div style={{ font: "var(--cl-t-md)", fontFamily: "var(--cl-font-mono)", color: "var(--cl-ink-soft)" }}>{r.arrived}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SAv name={r.child} size={32}/>
              <div style={{ font: "var(--cl-t-md)", fontWeight: 600 }}>{r.child}</div>
            </div>
            <div style={{ font: "var(--cl-t-sm)" }}>{r.grade}</div>
            <div style={{ font: "var(--cl-t-sm)" }}>{r.teacher}</div>
            <div style={{ font: "var(--cl-t-sm)" }}>{r.guardian}</div>
            <div><SPlate plate={r.plate} state="NY" size="sm"/></div>
            <div><SChip status="released" size="md"/></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   STAFF QUEUE — Variant B: 3-column board (Arrived | Called | Released)
   ============================================================ */
const StaffQueueB = ({ onAdvance, queue }) => {
  const data = queue || QUEUE;
  const cols = [
    { id: "arrived",  title: "In line",   helper: "Tap to call out", accent: "var(--cl-accent)" },
    { id: "called",   title: "Called",    helper: "Walking to curb", accent: "var(--cl-warning)" },
    { id: "released", title: "Released",  helper: "All set",          accent: "var(--cl-success)" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)" }}>
      <StaffTopbar count={data.filter(d => d.status !== "released").length}/>
      <FilterBar/>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: 20, overflow: "hidden" }}>
        {cols.map(col => {
          const items = data.filter(d => d.status === col.id);
          return (
            <div key={col.id} style={{
              background: "var(--cl-surface-2)",
              border: "1px solid var(--cl-border)",
              borderRadius: 18, display: "flex", flexDirection: "column",
              minHeight: 0,
            }}>
              <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--cl-border)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: col.accent }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ font: "var(--cl-t-lg)", fontWeight: 700, color: "var(--cl-ink)" }}>{col.title}</div>
                  <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{col.helper}</div>
                </div>
                <span style={{ font: "var(--cl-t-md)", fontWeight: 700, color: "var(--cl-ink)", background: "var(--cl-bg-deep)", padding: "2px 10px", borderRadius: 999 }}>{items.length}</span>
              </div>
              <div style={{ flex: 1, overflow: "auto", padding: 12, display: "grid", gap: 10, alignContent: "start" }}>
                {items.map((r, idx) => (
                  <div key={r.id} style={{
                    background: "var(--cl-surface)",
                    border: "1px solid var(--cl-border)",
                    borderLeft: `4px solid ${col.accent}`,
                    borderRadius: 14, padding: 14, display: "grid", gap: 10,
                    boxShadow: "var(--cl-shadow-1)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <SKid tint={idx % 5} name={r.child[0]} size={44}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: "var(--cl-t-lg)", fontWeight: 700, color: "var(--cl-ink)" }}>{r.child}</div>
                        <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>{r.grade} · {r.teacher}</div>
                      </div>
                      {col.id === "arrived" && <div style={{ font: "var(--cl-t-3xl)", fontWeight: 700, color: "var(--cl-ink-muted)", lineHeight: 1 }}>#{r.pos}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, font: "var(--cl-t-sm)", color: "var(--cl-ink-soft)" }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, background: r.color, border: "1px solid rgba(0,0,0,0.2)" }}/>
                      <SPlate plate={r.plate} state="NY" size="sm"/>
                      <span style={{ marginLeft: "auto", fontFamily: "var(--cl-font-mono)" }}>{r.arrived}</span>
                    </div>
                    <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>w/ {r.guardian}</div>
                    {r.alert && (
                      <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-warning)", fontWeight: 700, padding: "4px 8px", background: "var(--cl-warning-soft)", borderRadius: 6 }}>⚑ {r.alert}</div>
                    )}
                    {col.id === "arrived" && (
                      <button onClick={() => onAdvance?.(r.id)} style={{
                        ...sBase, width: "100%", padding: "14px", background: "var(--cl-warning)", color: "white",
                        borderRadius: 12, font: "var(--cl-t-md)", fontWeight: 700, gap: 8,
                      }}><SI name="megaphone" size={20} color="white" strokeWidth={2.2}/> Call out</button>
                    )}
                    {col.id === "called" && (
                      <button onClick={() => onAdvance?.(r.id)} style={{
                        ...sBase, width: "100%", padding: "14px", background: "var(--cl-success)", color: "white",
                        borderRadius: 12, font: "var(--cl-t-md)", fontWeight: 700, gap: 8,
                      }}><SI name="check" size={20} color="white" strokeWidth={2.4}/> Released</button>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)" }}>None right now.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   EARLY PICKUP APPROVALS
   ============================================================ */
const REQUESTS = [
  { id: "r1", child: "Naomi Levin",    grade: "3-B", teacher: "Mrs. Cohen",  time: "2:15", reason: "Orthodontist", parent: "Sarah Levin",   sent: "8:12 AM", note: "Cleared 2:15, will be back by 3:10" },
  { id: "r2", child: "Asher Goldberg", grade: "4-B", teacher: "Mr. Friedman", time: "1:30", reason: "Family obligation", parent: "Rachel Goldberg", sent: "Yesterday 4:40 PM", note: "Cousin's bat mitzvah rehearsal" },
  { id: "r3", child: "Hannah Berkowitz", grade: "3-A", teacher: "Mrs. Cohen", time: "11:00", reason: "Doctor", parent: "Miriam Berkowitz", sent: "7:45 AM", note: "Pediatrician — Dr. Schwartz" },
];

const EarlyApprovals = () => {
  const [selected, setSelected] = useStateS("r1");
  const [statuses, setStatuses] = useStateS({ r1: "pending", r2: "approved", r3: "pending" });
  const r = REQUESTS.find(x => x.id === selected);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--cl-bg)" }}>
      <StaffTopbar title="Early pickup requests" count={REQUESTS.filter(r => statuses[r.id] === "pending").length}/>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "420px 1fr", gap: 0, overflow: "hidden" }}>
        {/* List */}
        <div style={{ borderRight: "1px solid var(--cl-border)", background: "var(--cl-surface-2)", overflow: "auto" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--cl-border)", display: "flex", gap: 10, alignItems: "center" }}>
            <SSeg value="pending" onChange={() => {}} options={[
              { value: "pending",  label: "Pending 2" },
              { value: "approved", label: "Approved 1" },
              { value: "denied",   label: "Denied" },
            ]}/>
          </div>
          {REQUESTS.map(req => (
            <button key={req.id} onClick={() => setSelected(req.id)} style={{
              ...sBase, width: "100%", padding: "16px 20px", background: selected === req.id ? "var(--cl-surface)" : "transparent",
              borderLeft: selected === req.id ? "3px solid var(--cl-primary)" : "3px solid transparent",
              borderBottom: "1px solid var(--cl-border)", display: "block", color: "var(--cl-ink)", textAlign: "left",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <SKid tint={REQUESTS.indexOf(req)} name={req.child[0]} size={42}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <div style={{ font: "var(--cl-t-md)", fontWeight: 700 }}>{req.child}</div>
                    <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>{req.sent}</div>
                  </div>
                  <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-soft)", marginTop: 2 }}>
                    {req.grade} · Pickup at <strong>{req.time}</strong> · {req.reason}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    {statuses[req.id] === "pending" && <span style={{ font: "var(--cl-t-xs)", padding: "3px 8px", borderRadius: 999, background: "var(--cl-warning-soft)", color: "var(--cl-warning)", fontWeight: 700 }}>Pending review</span>}
                    {statuses[req.id] === "approved" && <span style={{ font: "var(--cl-t-xs)", padding: "3px 8px", borderRadius: 999, background: "var(--cl-success-soft)", color: "var(--cl-success)", fontWeight: 700 }}>Approved</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Detail */}
        <div style={{ overflow: "auto", padding: "28px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
            <SKid tint={REQUESTS.indexOf(r)} name={r.child[0]} size={64}/>
            <div>
              <div style={{ font: "var(--cl-t-3xl)", fontFamily: "var(--cl-font-display)", color: "var(--cl-ink)", letterSpacing: -0.4 }}>{r.child}</div>
              <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink-soft)", marginTop: 2 }}>{r.grade} · {r.teacher}</div>
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ display: "flex", gap: 10 }}>
              <SBtn variant="danger" size="lg" leading={<SI name="x" size={20} color="white"/>}>Deny</SBtn>
              <SBtn variant="success" size="lg" leading={<SI name="check" size={20} color="white" strokeWidth={2.4}/>}>Approve & notify {r.teacher}</SBtn>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <SCard padding={18}>
              <div style={{ font: "var(--cl-t-xs)", textTransform: "uppercase", letterSpacing: 0.6, color: "var(--cl-ink-muted)", fontWeight: 700 }}>Pickup time</div>
              <div style={{ font: "var(--cl-t-3xl)", fontFamily: "var(--cl-font-display)", color: "var(--cl-ink)", marginTop: 6 }}>{r.time} PM</div>
              <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 4 }}>{(parseInt(r.time) >= 3) ? "≈10 min before dismissal" : "Before dismissal"}</div>
            </SCard>
            <SCard padding={18}>
              <div style={{ font: "var(--cl-t-xs)", textTransform: "uppercase", letterSpacing: 0.6, color: "var(--cl-ink-muted)", fontWeight: 700 }}>Reason</div>
              <div style={{ font: "var(--cl-t-xl)", color: "var(--cl-ink)", marginTop: 6 }}>{r.reason}</div>
            </SCard>
            <SCard padding={18}>
              <div style={{ font: "var(--cl-t-xs)", textTransform: "uppercase", letterSpacing: 0.6, color: "var(--cl-ink-muted)", fontWeight: 700 }}>Requested by</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <SAv name={r.parent} size={36}/>
                <div>
                  <div style={{ font: "var(--cl-t-md)", color: "var(--cl-ink)", fontWeight: 600 }}>{r.parent}</div>
                  <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)" }}>Primary guardian</div>
                </div>
              </div>
            </SCard>
          </div>

          <SCard style={{ marginTop: 16 }} padding={20}>
            <div style={{ font: "var(--cl-t-xs)", textTransform: "uppercase", letterSpacing: 0.6, color: "var(--cl-ink-muted)", fontWeight: 700 }}>Note from parent</div>
            <div style={{ font: "var(--cl-t-lg)", color: "var(--cl-ink)", marginTop: 8, lineHeight: 1.5 }}>"{r.note}"</div>
          </SCard>

          <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--cl-primary-soft)", border: "1px solid #C8D5E6", borderRadius: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <SI name="info" size={20} color="var(--cl-primary)"/>
            <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink)" }}>
              Approving will notify <strong>{r.teacher}</strong> and put a banner on the dismissal queue at <strong>{r.time}</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  CL_StaffQueueA: StaffQueueA,
  CL_StaffQueueB: StaffQueueB,
  CL_EarlyApprovals: EarlyApprovals,
  CL_QUEUE: QUEUE,
  CL_StaffTopbar: StaffTopbar,
  CL_FilterBar: FilterBar,
});
