/* CarLine — mounts React screens into [data-mount] divs across the deck. */

const { useState: useM, useEffect: useME } = React;

function Mounted({ kind }) {
  const t = useCLStore();
  switch (kind) {
    case "onboarding":
      return <CL_IPhoneFrame label=""><CL_ParentOnboarding/></CL_IPhoneFrame>;
    case "home-a-stateful": {
      const [requested, setReq] = useM(false);
      useME(() => { if (requested) { const id = setTimeout(() => {}, 600); return () => clearTimeout(id); } }, [requested]);
      return (
        <CL_IPhoneFrame>
          <CL_ParentHomeA requested={requested} onTap={() => setReq(r => !r)} />
        </CL_IPhoneFrame>
      );
    }
    case "home-b-stateful": {
      const [kidStatuses, setKS] = useM({});
      const cycle = id => {
        setKS(prev => {
          const cur = prev[id] || "none";
          const order = ["none", "requested", "arrived", "called", "released"];
          const next = order[(order.indexOf(cur) + 1) % order.length];
          return { ...prev, [id]: next };
        });
      };
      return (
        <CL_IPhoneFrame>
          <CL_ParentHomeB kidStatuses={kidStatuses} onTap={cycle} />
        </CL_IPhoneFrame>
      );
    }
    case "pickup-picker":
      return <CL_IPhoneFrame><CL_PickupTypePicker/></CL_IPhoneFrame>;
    case "early-form":
      return <CL_IPhoneFrame><CL_EarlyPickupForm/></CL_IPhoneFrame>;
    case "vehicle":
      return <CL_IPhoneFrame><CL_ParentVehicle/></CL_IPhoneFrame>;
    case "live-status-requested":
      return <CL_IPhoneFrame><CL_LiveStatus status="requested"/></CL_IPhoneFrame>;
    case "live-status-arrived":
      return <CL_IPhoneFrame><CL_LiveStatus status="arrived"/></CL_IPhoneFrame>;
    case "live-status-called":
      return <CL_IPhoneFrame><CL_LiveStatus status="called"/></CL_IPhoneFrame>;
    case "live-status-released":
      return <CL_IPhoneFrame><CL_LiveStatus status="released"/></CL_IPhoneFrame>;
    case "live-status-tweak":
      return <CL_IPhoneFrame><CL_LiveStatus status={t.liveStatus}/></CL_IPhoneFrame>;
    case "authorized":
      return <CL_IPhoneFrame><CL_AuthorizedPersons/></CL_IPhoneFrame>;
    case "queue-a-stateful": {
      const [queue, setQ] = useM(window.CL_QUEUE);
      const advance = id => setQ(prev => prev.map(r => {
        if (r.id !== id) return r;
        if (r.status === "arrived")  return { ...r, status: "called" };
        if (r.status === "called")   return { ...r, status: "released", pos: 0 };
        return r;
      }));
      return <CL_IPadFrame orientation="landscape"><CL_StaffQueueA density={t.density} onAdvance={advance} queue={queue}/></CL_IPadFrame>;
    }
    case "queue-b-stateful": {
      const [queue, setQ] = useM(window.CL_QUEUE);
      const advance = id => setQ(prev => prev.map(r => {
        if (r.id !== id) return r;
        if (r.status === "arrived")  return { ...r, status: "called" };
        if (r.status === "called")   return { ...r, status: "released", pos: 0 };
        return r;
      }));
      return <CL_IPadFrame orientation="landscape"><CL_StaffQueueB onAdvance={advance} queue={queue}/></CL_IPadFrame>;
    }
    case "approvals":
      return <CL_IPadFrame orientation="landscape"><CL_EarlyApprovals/></CL_IPadFrame>;
    case "queue-a-portrait":
      return <CL_IPadFrame orientation="portrait"><CL_StaffQueueA density="comfort" queue={window.CL_QUEUE}/></CL_IPadFrame>;
    case "chip-row":
      return (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          {["requested", "arrived", "called", "released", "none"].map(s => <CL_StatusChip key={s} status={s} size="lg"/>)}
        </div>
      );
    case "button-row":
      return (
        <div style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <CL_Button variant="primary" size="lg">Primary</CL_Button>
            <CL_Button variant="accent"  size="lg">Accent</CL_Button>
            <CL_Button variant="secondary" size="lg">Secondary</CL_Button>
            <CL_Button variant="ghost"   size="lg">Ghost</CL_Button>
            <CL_Button variant="success" size="lg">Success</CL_Button>
            <CL_Button variant="danger"  size="lg">Danger</CL_Button>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <CL_Button variant="primary" size="sm">Small</CL_Button>
            <CL_Button variant="primary" size="md">Medium</CL_Button>
            <CL_Button variant="primary" size="lg">Large</CL_Button>
            <CL_Button variant="accent"  size="xl">Extra large — "I'm here"</CL_Button>
          </div>
        </div>
      );
    case "track-demo":
      return (
        <div style={{ display: "grid", gap: 36, maxWidth: 520 }}>
          {["requested", "arrived", "called", "released"].map(s =>
            <div key={s}>
              <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 }}>Stage · {s}</div>
              <CL_ProgressTrack status={s} layout="horizontal"/>
            </div>
          )}
        </div>
      );
    case "plate-demo":
      return (
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <CL_Plate plate="RDS 7821" state="NY" size="sm"/>
          <CL_Plate plate="RDS 7821" state="NY" size="md"/>
          <CL_Plate plate="RDS 7821" state="NY" size="lg"/>
        </div>
      );
    case "card-demo":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720 }}>
          <CL_Card padding={20}>
            <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>Card · elev 1</div>
            <div style={{ font: "var(--cl-t-lg)", color: "var(--cl-ink)", marginTop: 8 }}>Default container surface</div>
            <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 4 }}>1px border + hairline shadow</div>
          </CL_Card>
          <CL_Card padding={20} elev={2}>
            <div style={{ font: "var(--cl-t-xs)", color: "var(--cl-ink-muted)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>Card · elev 2</div>
            <div style={{ font: "var(--cl-t-lg)", color: "var(--cl-ink)", marginTop: 8 }}>Lifted (modal, hero)</div>
            <div style={{ font: "var(--cl-t-sm)", color: "var(--cl-ink-muted)", marginTop: 4 }}>Med shadow, used sparingly</div>
          </CL_Card>
        </div>
      );
    default:
      return <div style={{ padding: 40, color: "var(--cl-ink-muted)" }}>Unknown mount: {kind}</div>;
  }
}

function mountAll() {
  document.querySelectorAll("[data-mount]:not([data-mounted])").forEach(el => {
    el.dataset.mounted = "1";
    const kind = el.dataset.mount;
    ReactDOM.createRoot(el).render(<Mounted kind={kind}/>);
  });
}

document.addEventListener("DOMContentLoaded", mountAll);
window.CL_mountAll = mountAll;
mountAll();
