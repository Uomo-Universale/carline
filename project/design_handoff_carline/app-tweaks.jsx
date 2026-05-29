/* CarLine — Tweaks panel: palette, density, status state, view mode */

const { useState: useT, useEffect: useTE } = React;

const PALETTES = {
  warm: {
    label: "Warm school (default)",
    "--cl-bg": "#FBF5EA", "--cl-bg-deep": "#F5EBD7",
    "--cl-primary": "#1F3A5F", "--cl-primary-soft": "#E5EAF1",
    "--cl-accent": "#E8A33D", "--cl-accent-soft": "#FBE9C7",
    "--cl-success": "#2F6B5A", "--cl-warning": "#C97A1F",
  },
  twilight: {
    label: "Twilight (cool navy + plum)",
    "--cl-bg": "#F3F0EA", "--cl-bg-deep": "#E5E0D2",
    "--cl-primary": "#2C2A57", "--cl-primary-soft": "#E1DFEE",
    "--cl-accent": "#D86A56", "--cl-accent-soft": "#F6D7CF",
    "--cl-success": "#2F6B5A", "--cl-warning": "#C97A1F",
  },
  meadow: {
    label: "Meadow (green-forward)",
    "--cl-bg": "#F4F2E8", "--cl-bg-deep": "#E5E1CC",
    "--cl-primary": "#244A35", "--cl-primary-soft": "#D9E5DD",
    "--cl-accent": "#E8A33D", "--cl-accent-soft": "#FBE9C7",
    "--cl-success": "#2F6B5A", "--cl-warning": "#C97A1F",
  },
};

function applyPalette(name) {
  const p = PALETTES[name] || PALETTES.warm;
  const root = document.documentElement;
  Object.entries(p).forEach(([k, v]) => { if (k.startsWith("--")) root.style.setProperty(k, v); });
}

/* Global app store so screens can subscribe to tweaks */
window.CL_store = window.CL_store || {
  state: { palette: "warm", density: "comfort", liveStatus: "arrived" },
  listeners: new Set(),
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  set(patch) { this.state = { ...this.state, ...patch }; this.listeners.forEach(fn => fn(this.state)); },
};

function useCLStore() {
  const [s, ss] = useT(window.CL_store.state);
  useTE(() => window.CL_store.subscribe(ss), []);
  return s;
}
window.useCLStore = useCLStore;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  palette: "warm",
  density: "comfort",
  liveStatus: "arrived",
}/*EDITMODE-END*/;

function CarLineTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to global store + CSS vars
  useTE(() => {
    applyPalette(t.palette);
    document.documentElement.dataset.density = t.density;
    window.CL_store.set({ palette: t.palette, density: t.density, liveStatus: t.liveStatus });
  }, [t.palette, t.density, t.liveStatus]);

  return (
    <TweaksPanel title="CarLine tweaks">
      <TweakSection label="Visual" />
      <TweakRadio label="Palette" value={t.palette}
        options={[
          { value: "warm",     label: "Warm" },
          { value: "twilight", label: "Twilight" },
          { value: "meadow",   label: "Meadow" },
        ]}
        onChange={v => setTweak("palette", v)}/>
      <TweakSection label="Staff dashboard" />
      <TweakRadio label="Row density" value={t.density}
        options={[
          { value: "comfort", label: "Comfort" },
          { value: "compact", label: "Compact" },
        ]}
        onChange={v => setTweak("density", v)}/>
      <TweakSection label="Live status preview" />
      <TweakRadio label="Status" value={t.liveStatus}
        options={[
          { value: "requested", label: "Requested" },
          { value: "arrived",   label: "Arrived" },
          { value: "called",    label: "Called" },
          { value: "released",  label: "Released" },
        ]}
        onChange={v => setTweak("liveStatus", v)}/>
    </TweaksPanel>
  );
}

// Mount the tweaks panel into its own root
(function mountTweaks() {
  const el = document.createElement("div");
  el.id = "cl-tweaks-root";
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<CarLineTweaks/>);
})();
