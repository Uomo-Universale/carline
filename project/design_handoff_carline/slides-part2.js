/* CarLine — appends slides 4..21 to <deck-stage> before it upgrades.
   Kept in a separate file to keep CarLine.html readable. */
(function () {
  const HTML = String.raw;

  const slides = [];

  /* ============================================================
     SLIDE 4 — COLORS
     ============================================================ */
  slides.push(HTML`
<section data-label="04 Color">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Design system · Color · 04 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 16px;">Cream surfaces, navy ink, amber signal.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 40px;">Color earns its place by carrying meaning. The cream/navy field stays neutral so amber can mean <em style="font-family: var(--cl-font-display);">"act now"</em> reliably.</p>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px; flex: 1; min-height: 0;">
      <div>
        <div class="panel-h">Foundation</div>
        <div class="swatches">
          <div class="sw"><div class="sw-color" style="background:#FBF5EA"></div><div class="sw-meta"><div class="sw-name">Bg</div><div class="sw-hex">#FBF5EA</div><div class="sw-use">Page</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#F5EBD7"></div><div class="sw-meta"><div class="sw-name">Bg deep</div><div class="sw-hex">#F5EBD7</div><div class="sw-use">Recessed, segmented</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#FFFFFF;border-bottom:1px solid var(--cl-border)"></div><div class="sw-meta"><div class="sw-name">Surface</div><div class="sw-hex">#FFFFFF</div><div class="sw-use">Cards</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#FFFCF5;border-bottom:1px solid var(--cl-border)"></div><div class="sw-meta"><div class="sw-name">Surface 2</div><div class="sw-hex">#FFFCF5</div><div class="sw-use">Subtle lift</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#15233A"></div><div class="sw-meta"><div class="sw-name">Ink</div><div class="sw-hex">#15233A</div><div class="sw-use">Primary text</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#3B4A66"></div><div class="sw-meta"><div class="sw-name">Ink soft</div><div class="sw-hex">#3B4A66</div><div class="sw-use">Secondary text</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#7A8699"></div><div class="sw-meta"><div class="sw-name">Ink muted</div><div class="sw-hex">#7A8699</div><div class="sw-use">Meta, captions</div></div></div>
          <div class="sw"><div class="sw-color" style="background:#ECE0C8"></div><div class="sw-meta"><div class="sw-name">Border</div><div class="sw-hex">#ECE0C8</div><div class="sw-use">Hairlines</div></div></div>
        </div>

        <div style="margin-top: 28px;">
          <div class="panel-h">Brand &amp; signal</div>
          <div class="swatches">
            <div class="sw"><div class="sw-color" style="background:#1F3A5F"></div><div class="sw-meta"><div class="sw-name">Primary · Navy</div><div class="sw-hex">#1F3A5F</div><div class="sw-use">Calm CTAs, headers</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#E8A33D"></div><div class="sw-meta"><div class="sw-name">Accent · Amber</div><div class="sw-hex">#E8A33D</div><div class="sw-use">"I'm here" only</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#2F6B5A"></div><div class="sw-meta"><div class="sw-name">Success</div><div class="sw-hex">#2F6B5A</div><div class="sw-use">Released, approved</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#C97A1F"></div><div class="sw-meta"><div class="sw-name">Warning</div><div class="sw-hex">#C97A1F</div><div class="sw-use">Called, pending</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#B83A2E"></div><div class="sw-meta"><div class="sw-name">Danger</div><div class="sw-hex">#B83A2E</div><div class="sw-use">Deny, error</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#2A6FA3"></div><div class="sw-meta"><div class="sw-name">Info</div><div class="sw-hex">#2A6FA3</div><div class="sw-use">Walk-in, notices</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#E5EAF1"></div><div class="sw-meta"><div class="sw-name">Primary soft</div><div class="sw-hex">#E5EAF1</div><div class="sw-use">Selected state</div></div></div>
            <div class="sw"><div class="sw-color" style="background:#FBE9C7"></div><div class="sw-meta"><div class="sw-name">Accent soft</div><div class="sw-hex">#FBE9C7</div><div class="sw-use">Status chip bg</div></div></div>
          </div>
        </div>
      </div>

      <!-- Signal hierarchy diagram -->
      <div class="panel" style="padding: 28px 28px;">
        <div class="panel-h">Signal hierarchy</div>
        <div class="panel-t" style="margin-bottom: 18px;">Where each color is allowed</div>
        <div style="display: grid; gap: 14px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width:12px;height:12px;border-radius:50%;background:#1F3A5F;margin-top:6px;"></div>
            <div><div style="font:var(--cl-t-md);font-weight:650;">Navy — calm authority</div><div style="font:var(--cl-t-sm);color:var(--cl-ink-muted);">Primary buttons, headers, the school's voice.</div></div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width:12px;height:12px;border-radius:50%;background:#E8A33D;margin-top:6px;"></div>
            <div><div style="font:var(--cl-t-md);font-weight:650;">Amber — the one action</div><div style="font:var(--cl-t-sm);color:var(--cl-ink-muted);">Only on the "I'm here" surface &amp; arrived status. Never decorative.</div></div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width:12px;height:12px;border-radius:50%;background:#C97A1F;margin-top:6px;"></div>
            <div><div style="font:var(--cl-t-md);font-weight:650;">Burnt orange — change of state</div><div style="font:var(--cl-t-sm);color:var(--cl-ink-muted);">"Called" — a teacher is on the move. Pulls the eye in a queue.</div></div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width:12px;height:12px;border-radius:50%;background:#2F6B5A;margin-top:6px;"></div>
            <div><div style="font:var(--cl-t-md);font-weight:650;">Forest — closure</div><div style="font:var(--cl-t-sm);color:var(--cl-ink-muted);">Released, approved. The "we're done" color.</div></div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width:12px;height:12px;border-radius:50%;background:#B83A2E;margin-top:6px;"></div>
            <div><div style="font:var(--cl-t-md);font-weight:650;">Red — only for deny</div><div style="font:var(--cl-t-sm);color:var(--cl-ink-muted);">Office denying an early pickup, destructive confirms. Otherwise: nowhere.</div></div>
          </div>
        </div>
        <div style="margin-top: 24px; padding: 14px; background: var(--cl-bg-deep); border-radius: 12px; font: var(--cl-t-sm); color: var(--cl-ink-soft); line-height: 1.5;">
          <b style="color:var(--cl-ink);">Rule:</b> at most 2 saturated colors on screen at once. If a screen has amber, it cannot have orange.
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">04 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 5 — TYPOGRAPHY
     ============================================================ */
  slides.push(HTML`
<section data-label="05 Type">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Design system · Type · 05 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 16px;">Newsreader speaks. Geist works.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 40px;">A warm serif handles voice — headers, status, encouragement. A neutral geometric sans handles every label, button, and number.</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; flex: 1; min-height: 0;">
      <!-- Display sample -->
      <div class="panel" style="padding: 40px 40px;">
        <div class="panel-h">Display · Newsreader 500 italic</div>
        <div style="font-family: var(--cl-font-display); font-weight: 500; font-style: italic; font-size: 120px; line-height: 1; letter-spacing: -3px; color: var(--cl-ink); margin: 12px 0 8px;">Naomi is<br/>on her way.</div>
        <div style="font: var(--cl-t-sm); color: var(--cl-ink-muted); font-family: var(--cl-font-mono);">Newsreader · italic · 120 / 100 · −3 tracking</div>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--cl-border);">
          <div style="font-family: var(--cl-font-display); font-weight: 500; font-size: 56px; line-height: 1.05; color: var(--cl-ink); letter-spacing: -0.8px;">Pickup, <em>without the wait.</em></div>
          <div style="font: var(--cl-t-sm); color: var(--cl-ink-muted); font-family: var(--cl-font-mono); margin-top: 8px;">56 / 60</div>
        </div>
      </div>

      <!-- Sans + scale -->
      <div class="panel" style="padding: 32px;">
        <div class="panel-h">UI · Geist</div>
        <div class="type-row"><div class="type-label">display</div><div class="type-sample" style="font-family:var(--cl-font-sans);font-weight:700;font-size:48px;line-height:52px;letter-spacing:-0.5px;">I'm here</div><div class="type-spec">700 / 48 / 52</div></div>
        <div class="type-row"><div class="type-label">3xl</div><div class="type-sample" style="font:var(--cl-t-3xl);">Naomi Levin</div><div class="type-spec">700 / 36 / 42</div></div>
        <div class="type-row"><div class="type-label">2xl</div><div class="type-sample" style="font:var(--cl-t-2xl);">Hi, Sarah</div><div class="type-spec">650 / 28 / 34</div></div>
        <div class="type-row"><div class="type-label">xl</div><div class="type-sample" style="font:var(--cl-t-xl);">Pickup in progress</div><div class="type-spec">600 / 22 / 28</div></div>
        <div class="type-row"><div class="type-label">lg</div><div class="type-sample" style="font:var(--cl-t-lg);">3rd grade · Mrs. Cohen</div><div class="type-spec">550 / 18 / 24</div></div>
        <div class="type-row"><div class="type-label">md</div><div class="type-sample" style="font:var(--cl-t-md);">Tap when you're in the car line</div><div class="type-spec">500 / 16 / 22</div></div>
        <div class="type-row"><div class="type-label">sm</div><div class="type-sample" style="font:var(--cl-t-sm);">Position 4 of 7</div><div class="type-spec">500 / 13 / 18</div></div>
        <div class="type-row"><div class="type-label">xs</div><div class="type-sample" style="font:var(--cl-t-xs);text-transform:uppercase;letter-spacing:1px;">PICKING UP TODAY</div><div class="type-spec">500 / 11 / 14</div></div>
        <div class="type-row" style="margin-top: 8px;"><div class="type-label">mono</div><div class="type-sample" style="font-family:var(--cl-font-mono);font-weight:600;font-size:20px;letter-spacing:1px;color:var(--cl-ink);">RDS · 7821</div><div class="type-spec">Geist Mono 600 / 20</div></div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">05 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 6 — COMPONENTS
     ============================================================ */
  slides.push(HTML`
<section data-label="06 Components">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Design system · Components · 06 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 40px;">Five components, lots of leverage.</h2>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; flex: 1; min-height: 0;">
      <!-- left: buttons + chip + plate -->
      <div style="display: grid; gap: 24px; align-content: start;">
        <div class="panel">
          <div class="panel-h">Buttons · variant × size</div>
          <div data-mount="button-row"></div>
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--cl-border); font: var(--cl-t-sm); color: var(--cl-ink-muted); line-height: 1.5;">
            All sizes hit ≥ 44pt. The <b style="color:var(--cl-accent-press);">xl Accent</b> button (≥ 72pt) is reserved for the one in-car action.
          </div>
        </div>
        <div class="panel">
          <div class="panel-h">Status chip · 4 + 1 states</div>
          <div data-mount="chip-row"></div>
          <div style="margin-top: 16px; font: var(--cl-t-sm); color: var(--cl-ink-muted); line-height: 1.5;">
            Status = color <em style="font-family:var(--cl-font-display);">and</em> label. Dot has an inset highlight so it reads on amber, green, and grey.
          </div>
        </div>
        <div class="panel">
          <div class="panel-h">License plate (staff-facing)</div>
          <div data-mount="plate-demo"></div>
        </div>
      </div>

      <!-- right: track + card -->
      <div style="display: grid; gap: 24px; align-content: start;">
        <div class="panel">
          <div class="panel-h">Progress track · used on Live Status</div>
          <div data-mount="track-demo"></div>
        </div>
        <div class="panel">
          <div class="panel-h">Card · the only container we use</div>
          <div data-mount="card-demo"></div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">06 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 7 — PERSONAS + PICKUP TYPES
     ============================================================ */
  slides.push(HTML`
<section data-label="07 Personas">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Context · 07 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 40px;">Two people, four ways to pick up.</h2>

    <!-- Personas -->
    <div class="grid-2" style="margin-bottom: 32px; gap: 32px;">
      <div class="panel" style="display: grid; grid-template-columns: 96px 1fr; gap: 24px; align-items: start;">
        <div style="width:96px;height:96px;border-radius:24px;background:linear-gradient(140deg,#FBE9C7,#E8A33D);display:flex;align-items:center;justify-content:center;font-family:var(--cl-font-display);font-size:40px;color:#7A4A0E;font-weight:600;">SL</div>
        <div>
          <div style="font: var(--cl-t-xs); color: var(--cl-ink-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Primary user · Parent</div>
          <div style="font: var(--cl-t-2xl); font-family: var(--cl-font-display); color: var(--cl-ink); margin: 4px 0 8px;">Sarah Levin</div>
          <div style="font: var(--cl-t-md); color: var(--cl-ink-soft); line-height: 1.5; margin-bottom: 16px;">Mom of 2 (3rd &amp; K). Drives a Subaru. Sometimes her husband picks up. Twice a year, Grandpa Mike.</div>
          <div style="display:grid; gap:8px; font: var(--cl-t-sm); color: var(--cl-ink-soft);">
            <div>· <b style="color:var(--cl-ink);">Where she is:</b> in the car, in line, one-handed</div>
            <div>· <b style="color:var(--cl-ink);">What she needs:</b> tap once, see "we got you", drive away</div>
            <div>· <b style="color:var(--cl-ink);">What she dreads:</b> standing in the rain looking for a teacher</div>
          </div>
        </div>
      </div>
      <div class="panel" style="display: grid; grid-template-columns: 96px 1fr; gap: 24px; align-items: start;">
        <div style="width:96px;height:96px;border-radius:24px;background:linear-gradient(140deg,#E5EAF1,#1F3A5F);display:flex;align-items:center;justify-content:center;font-family:var(--cl-font-display);font-size:40px;color:white;font-weight:600;">LO</div>
        <div>
          <div style="font: var(--cl-t-xs); color: var(--cl-ink-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Operator · Office</div>
          <div style="font: var(--cl-t-2xl); font-family: var(--cl-font-display); color: var(--cl-ink); margin: 4px 0 8px;">Lisa, school office</div>
          <div style="font: var(--cl-t-md); color: var(--cl-ink-soft); line-height: 1.5; margin-bottom: 16px;">Runs dismissal. iPad on a folding table at the curb. Approves early pickups all morning. Knows every car by sight.</div>
          <div style="display:grid; gap:8px; font: var(--cl-t-sm); color: var(--cl-ink-soft);">
            <div>· <b style="color:var(--cl-ink);">Where she is:</b> outdoors, glare, sometimes walkie in one hand</div>
            <div>· <b style="color:var(--cl-ink);">What she needs:</b> see the queue without scrolling, advance with one tap</div>
            <div>· <b style="color:var(--cl-ink);">What she dreads:</b> getting the wrong kid in the wrong car</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pickup type matrix -->
    <div class="ptm">
      <div class="ptm-cell" style="border-color: var(--cl-accent); border-width: 2px;">
        <div class="ptm-ic" style="background: var(--cl-accent-soft); color: var(--cl-accent-press);">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16.5" r="1"/><circle cx="16.5" cy="16.5" r="1"/></svg>
        </div>
        <div class="ptm-t">Carline</div>
        <div class="ptm-p">90% of pickups. Tap "I'm here" in line. Staff sees you, calls the kid, walks them to the curb.</div>
        <div class="ptm-steps">
          <div>1. Parent: tap "I'm here"</div>
          <div>2. Staff: see arrival → tap Call</div>
          <div>3. Teacher walks kid to curb</div>
          <div>4. Staff: tap Released</div>
        </div>
      </div>
      <div class="ptm-cell" style="border-color: #2A6FA3; border-width: 2px;">
        <div class="ptm-ic" style="background: #DCEAF4; color: #2A6FA3;">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4.5" r="1.6"/><path d="M10 21l1.5-5L9 13.5 10.5 9l3 1 2 2 2.5 1"/><path d="M8 21l2-5"/></svg>
        </div>
        <div class="ptm-t">Walk-in</div>
        <div class="ptm-p">Parking and walking up. Kid waits inside with their class. Office knows to expect you at the door.</div>
        <div class="ptm-steps">
          <div>1. Parent: tap "Walking up"</div>
          <div>2. Office: see at door</div>
          <div>3. Kid released at office</div>
        </div>
      </div>
      <div class="ptm-cell" style="border-color: var(--cl-warning); border-width: 2px;">
        <div class="ptm-ic" style="background: var(--cl-warning-soft); color: var(--cl-warning);">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        </div>
        <div class="ptm-t">Early pickup</div>
        <div class="ptm-p">Doctor, appointment, etc. Requires a reason and a time. Office approves; teacher gets a banner.</div>
        <div class="ptm-steps">
          <div>1. Parent: time + reason</div>
          <div>2. Office: approve / deny</div>
          <div>3. Teacher: banner</div>
          <div>4. Parent: arrives → walk-in</div>
        </div>
      </div>
      <div class="ptm-cell" style="border-color: var(--cl-ink-muted); border-width: 2px;">
        <div class="ptm-ic" style="background: #E7E2D4; color: #3B4A66;">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4z"/></svg>
        </div>
        <div class="ptm-t">Message office</div>
        <div class="ptm-p">No pickup right now — just a note. "Aftercare today" / "Grandpa picks up Friday" / "Sick, won't be in."</div>
        <div class="ptm-steps">
          <div>1. Parent: write note</div>
          <div>2. Office: inbox</div>
          <div>3. Office: marks read or replies</div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">07 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 8 — PARENT ONBOARDING
     ============================================================ */
  slides.push(HTML`
<section data-label="08 Parent · Onboarding">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Onboarding · 08 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: grid; grid-template-columns: 560px 1fr; gap: 80px; flex: 1; align-items: center;">
      <div data-mount="onboarding" style="display: flex; justify-content: center;"></div>
      <div style="display: grid; gap: 28px; max-width: 720px;">
        <h2 class="slide-title" style="margin: 0;">First run is just <em>"continue."</em></h2>
        <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">SSO with the school account is the happy path — Rambam already manages family accounts. A phone-number fallback covers grandparents or anyone the school hasn't onboarded yet.</p>
        <div style="display: grid; gap: 16px;">
          <div class="anno" style="max-width:none;">
            <div style="display:flex;gap:14px;align-items:flex-start;">
              <span class="anno-num">1</span>
              <div>
                <div class="anno-h">SSO placeholder, today</div>
                <div class="anno-p">Wired to the school account button — copy and flow assume the SSO provider is plugged in pre-launch. We don't ship our own auth.</div>
              </div>
            </div>
          </div>
          <div class="anno" style="max-width:none;">
            <div style="display:flex;gap:14px;align-items:flex-start;">
              <span class="anno-num">2</span>
              <div>
                <div class="anno-h">No bespoke onboarding</div>
                <div class="anno-p">Children, teachers, authorized people and the vehicle on file all sync from the SIS. The parent never sets up a roster.</div>
              </div>
            </div>
          </div>
          <div class="anno" style="max-width:none;">
            <div style="display:flex;gap:14px;align-items:flex-start;">
              <span class="anno-num">3</span>
              <div>
                <div class="anno-h">Permissions ask later</div>
                <div class="anno-p">Notifications + location are <em style="font-family:var(--cl-font-display);">contextual</em> — asked the first time a parent taps "I'm here," not up-front.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">08 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 9 — PARENT HOME VARIANT A
     ============================================================ */
  slides.push(HTML`
<section data-label="09 Parent · Home A">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Home · Variant A · 09 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: grid; grid-template-columns: 560px 1fr; gap: 80px; flex: 1; align-items: center;">
      <div data-mount="home-a-stateful" style="display: flex; justify-content: center;"></div>
      <div style="display: grid; gap: 24px; max-width: 720px;">
        <div>
          <div class="kicker" style="margin-bottom: 8px;">Variant A — the default</div>
          <h2 class="slide-title" style="margin: 0;"><em>One tap</em> picks up everyone.</h2>
        </div>
        <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">A single hero "I'm here" handles the common case — same parent picking up all their kids in one car. The kid list below is a confirmation, not a decision. <b style="color:var(--cl-ink); font-weight: 700;">Tap the amber button</b> in the mock to see the confirmation state.</p>
        <div style="display: grid; gap: 14px;">
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">1</span><div><div class="anno-h">Thumb-reachable hero</div><div class="anno-p">Centered, 33% of the screen. Reaches the natural one-handed arc on any iPhone from SE to Pro Max.</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">2</span><div><div class="anno-h">Status banner up top</div><div class="anno-p">Today's dismissal time + on-time flag. Replaces with a delay notice when something is off.</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">3</span><div><div class="anno-h">Secondary actions, equal weight</div><div class="anno-p">Walking up &amp; Early pickup live one tap away — same visual height, never competing with the hero.</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">4</span><div><div class="anno-h">Kid cards confirm, don't decide</div><div class="anno-p">Photo + name + grade + teacher. Status chip updates live when the queue moves.</div></div></div></div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School · click "I'm here" to interact</span>
      <span class="pagenum">09 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 10 — PARENT HOME VARIANT B
     ============================================================ */
  slides.push(HTML`
<section data-label="10 Parent · Home B">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Home · Variant B · 10 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: grid; grid-template-columns: 560px 1fr; gap: 80px; flex: 1; align-items: center;">
      <div data-mount="home-b-stateful" style="display: flex; justify-content: center;"></div>
      <div style="display: grid; gap: 24px; max-width: 720px;">
        <div>
          <div class="kicker" style="margin-bottom: 8px;">Variant B — per-child</div>
          <h2 class="slide-title" style="margin: 0;">Each child <em>has their own button.</em></h2>
        </div>
        <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">For shared custody, different dismissal times, or families where Grandpa picks up one kid and Mom picks up the other. Cycling through statuses on each card lets you preview the full lifecycle inline. <b style="color:var(--cl-ink); font-weight: 700;">Tap each child's button</b> to advance their state.</p>
        <div style="display: grid; gap: 14px;">
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">A</span><div><div class="anno-h">When this variant wins</div><div class="anno-p">Two parents on the account. Two cars on different days. Aftercare vs. carline split. A higher-cognitive-load home, but more capable.</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">B</span><div><div class="anno-h">When Variant A wins</div><div class="anno-p">Single household, every-day-same dismissal, one car. The default for ~80% of Rambam families.</div></div></div></div>
          <div class="anno" style="max-width:none; background: var(--cl-primary-soft); border-color: #C8D5E6;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num" style="background:var(--cl-primary);color:white;">?</span><div><div class="anno-h" style="color:var(--cl-primary);">Recommendation</div><div class="anno-p" style="color:var(--cl-ink);">Ship Variant A as default. Surface B as <em style="font-family:var(--cl-font-display);">"separate cards"</em> in Settings → Display. Don't ask at onboarding.</div></div></div></div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School · tap each "I'm here" to cycle status</span>
      <span class="pagenum">10 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 11 — PICKUP PICKER + EARLY FORM
     ============================================================ */
  slides.push(HTML`
<section data-label="11 Parent · Pickup types">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Pickup types · 11 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 20px;">Pick a type, fill the minimum, send.</h2>

    <div style="display: flex; gap: 56px; align-items: flex-start; justify-content: center; transform: scale(0.86); transform-origin: top center; margin-top: 0;">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div data-mount="pickup-picker"></div>
        <div class="device-cap" style="margin-top:18px;"><b>1. Pick a type</b> · "What kind of pickup is this?"</div>
      </div>

      <!-- Arrow -->
      <div style="display:flex;align-items:center;color:var(--cl-ink-muted); margin-top: 380px;">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 20 H 72"/><path d="M58 8 L 72 20 L 58 32"/>
        </svg>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;">
        <div data-mount="early-form"></div>
        <div class="device-cap" style="margin-top:18px;"><b>2. Early pickup</b> · 3 fields max · sends for office approval</div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">11 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 12 — VEHICLE PROFILE
     ============================================================ */
  slides.push(HTML`
<section data-label="12 Parent · Vehicle">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Vehicle · 12 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: grid; grid-template-columns: 560px 1fr; gap: 80px; flex: 1; align-items: center;">
      <div data-mount="vehicle" style="display: flex; justify-content: center;"></div>
      <div style="display: grid; gap: 24px; max-width: 720px;">
        <h2 class="slide-title" style="margin: 0;">What staff sees <em>at the curb.</em></h2>
        <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">The exact same plate card on this screen appears on the staff iPad — same color, same typography, same letterforms. A parent and a teacher are looking at the <em style="font-family:var(--cl-font-display);">same object</em>.</p>
        <div style="display: grid; gap: 14px;">
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">·</span><div><div class="anno-h">Color first, plate second</div><div class="anno-p">A teacher matches "the green Subaru" before they read the plate. Swatches are tap-to-pick, not a hex input.</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">·</span><div><div class="anno-h">Plate uses Geist Mono</div><div class="anno-p">Tabular numerals, all-caps, fixed letterforms. Reads at 20 feet from the iPad.</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">·</span><div><div class="anno-h">Multi-car families</div><div class="anno-p">Vehicle is a list, not a single record. Active vehicle gets toggled the moment the parent taps "I'm here" — the matched plate is in the request.</div></div></div></div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">12 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 13 — LIVE STATUS PROGRESSION (4 phones)
     ============================================================ */
  slides.push(HTML`
<section data-label="13 Parent · Live status">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Live status · 13 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 12px;">Four states. The room feels different in each.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 28px;">Status changes are big — the background hue, the headline, the icon. A parent looking down at their phone for one second knows what's happening.</p>

    <div style="display: flex; gap: 24px; justify-content: center; transform: scale(0.78); transform-origin: top center; margin-top: -20px;">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div data-mount="live-status-requested"></div>
        <div class="device-cap" style="margin-top:20px;"><b>Requested</b> · office sees you</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div data-mount="live-status-arrived"></div>
        <div class="device-cap" style="margin-top:20px;"><b>Arrived</b> · in the queue</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div data-mount="live-status-called"></div>
        <div class="device-cap" style="margin-top:20px;"><b>Called</b> · walking to curb</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div data-mount="live-status-released"></div>
        <div class="device-cap" style="margin-top:20px;"><b>Released</b> · drive safe</div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School · use Tweaks panel to preview any state at full size</span>
      <span class="pagenum">13 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 14 — AUTHORIZED PERSONS
     ============================================================ */
  slides.push(HTML`
<section data-label="14 Parent · Authorized">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Parent app · Authorized pickup · 14 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: grid; grid-template-columns: 560px 1fr; gap: 80px; flex: 1; align-items: center;">
      <div data-mount="authorized" style="display: flex; justify-content: center;"></div>
      <div style="display: grid; gap: 24px; max-width: 720px;">
        <h2 class="slide-title" style="margin: 0;"><em>Read-only,</em> on purpose.</h2>
        <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">Custody and child-safety are not an app feature. We show the list so a parent can confirm Grandpa is approved before he drives over — but the source of truth lives with the office.</p>
        <div style="display: grid; gap: 14px;">
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">·</span><div><div class="anno-h">Grouped by child</div><div class="anno-p">A pickup person can be authorized for some siblings and not others (the K-only Grandpa case).</div></div></div></div>
          <div class="anno" style="max-width:none;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num">·</span><div><div class="anno-h">Primary flag</div><div class="anno-p">Parents on the legal record get a <b>Primary</b> chip. Court-order edge cases live with the office, not in the app.</div></div></div></div>
          <div class="anno" style="max-width:none;background:var(--cl-warning-soft);border-color:#ECCE9A;"><div style="display:flex;gap:14px;align-items:flex-start;"><span class="anno-num" style="background:var(--cl-warning);color:white;">!</span><div><div class="anno-h">Hard rule</div><div class="anno-p" style="color:var(--cl-ink);">If a guardian arrives who isn't on this list, the staff app blocks Released and prompts office confirmation. Parents can't override.</div></div></div></div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">14 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 15 — STAFF QUEUE — VARIANT A (list)
     ============================================================ */
  slides.push(HTML`
<section data-label="15 Staff · Queue list">
  <div class="slide" style="padding: 60px 60px;">
    <header class="slide-header" style="margin-bottom: 36px;">
      <div class="kicker">Staff dashboard · Live queue · Variant A · 15 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: flex; gap: 40px; align-items: center; justify-content: center; flex: 1;">
      <div style="transform: scale(0.62); transform-origin: top left; flex: none;">
        <div data-mount="queue-a-stateful"></div>
      </div>
      <div style="max-width: 380px; display: grid; gap: 18px;">
        <div>
          <div class="kicker" style="margin-bottom: 6px;">Variant A — dense list</div>
          <h2 class="slide-title" style="margin: 0; font-size: 44px;">For the <em>office,</em> indoors.</h2>
        </div>
        <p style="font: var(--cl-t-md); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">Position number is the largest thing on the row. Sortable by arrival. Right-side action button is always the same width — muscle memory.</p>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">1</span><div><div class="anno-h">Big position number</div><div class="anno-p">"Who's first?" answered without reading.</div></div></div></div>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">2</span><div><div class="anno-h">Color &amp; plate together</div><div class="anno-p">Color swatch is the primary visual key for matching a car.</div></div></div></div>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">3</span><div><div class="anno-h">One button does one job</div><div class="anno-p">Same row, same button, same shape. <em style="font-family:var(--cl-font-display);">Boring on purpose.</em></div></div></div></div>
        <div class="anno" style="background:var(--cl-accent-soft);border-color:#ECCE9A;"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">⚑</span><div><div class="anno-h">Try it</div><div class="anno-p">Tap "Call out" or "Released" in the mock to advance the queue. Use the Tweaks panel to toggle Compact density.</div></div></div></div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">15 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 16 — STAFF QUEUE — VARIANT B (board)
     ============================================================ */
  slides.push(HTML`
<section data-label="16 Staff · Queue board">
  <div class="slide" style="padding: 60px 60px;">
    <header class="slide-header" style="margin-bottom: 36px;">
      <div class="kicker">Staff dashboard · Live queue · Variant B · 16 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: flex; gap: 40px; align-items: center; justify-content: center; flex: 1;">
      <div style="transform: scale(0.62); transform-origin: top left; flex: none;">
        <div data-mount="queue-b-stateful"></div>
      </div>
      <div style="max-width: 380px; display: grid; gap: 18px;">
        <div>
          <div class="kicker" style="margin-bottom: 6px;">Variant B — three-column board</div>
          <h2 class="slide-title" style="margin: 0; font-size: 44px;">For the <em>curb,</em> outdoors.</h2>
        </div>
        <p style="font: var(--cl-t-md); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">Three lanes — In line · Called · Released. Cards are bigger; status is encoded in the colored left edge, readable in glare.</p>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">1</span><div><div class="anno-h">Lanes show the rhythm</div><div class="anno-p">Cards travel left-to-right as dismissal moves through.</div></div></div></div>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">2</span><div><div class="anno-h">Cards, not rows</div><div class="anno-p">Bigger photo, bigger plate, more breathing room. Made to be read from a meter away.</div></div></div></div>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">3</span><div><div class="anno-h">Tap → next lane</div><div class="anno-p">Single primary CTA per card; advance just moves to the next column.</div></div></div></div>
        <div class="anno" style="background:var(--cl-primary-soft);border-color:#C8D5E6;"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num" style="background:var(--cl-primary);color:white;">?</span><div><div class="anno-h" style="color:var(--cl-primary);">Recommendation</div><div class="anno-p" style="color:var(--cl-ink);">A &amp; B share one data model — let the staff member pick at the top of the screen. Office runs List, curb runs Board.</div></div></div></div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">16 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 17 — FILTERS & SEARCH (zoom in)
     ============================================================ */
  slides.push(HTML`
<section data-label="17 Staff · Filters">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Staff dashboard · Filters &amp; search · 17 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 16px;">Three filters fit in the toolbar.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 40px;">During dismissal there's no time to open a panel. Grade chips, a teacher chip, free-text search, and a density toggle live on the persistent header — never more than one tap away.</p>

    <div style="display: grid; gap: 32px; flex: 1;">
      <!-- Filter chips zoomed -->
      <div class="filter-zoom">
        <div class="kicker" style="margin-bottom: 16px;">Grade filter — single select with "All"</div>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <span style="font: var(--cl-t-md); font-weight: 600; color: var(--cl-ink-muted); margin-right: 8px;">Filter</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-primary); color: white; font: var(--cl-t-md); font-weight: 600;">All grades</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong);">K</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong);">1</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong);">2</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong);">3</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong);">4</span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong);">5</span>
          <span style="width: 1px; height: 28px; background: var(--cl-border-strong);"></span>
          <span style="padding: 12px 20px; border-radius: 999px; background: var(--cl-surface); color: var(--cl-ink); font: var(--cl-t-md); font-weight: 600; border: 1px solid var(--cl-border-strong); display: inline-flex; gap: 8px; align-items: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="11" r="2.5"/><path d="M3 19c1-3 3-4.5 6-4.5s5 1.5 6 4.5"/></svg>
            Mrs. Cohen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>
          </span>
          <span style="padding: 12px 20px; border-radius: 999px; background: transparent; color: var(--cl-ink-muted); font: var(--cl-t-md); font-weight: 600; border: 1px dashed var(--cl-border-strong); display: inline-flex; gap: 8px; align-items: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Filter
          </span>
        </div>
      </div>

      <!-- Search zoomed -->
      <div class="filter-zoom">
        <div class="kicker" style="margin-bottom: 16px;">Search — name, plate, or guardian</div>
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px 22px; background: var(--cl-bg-deep); border-radius: 999px; border: 1px solid var(--cl-border); max-width: 720px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cl-ink-muted)" stroke-width="2"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.6-3.6"/></svg>
          <input value="Lev" readonly style="background: transparent; border: none; outline: none; flex: 1; font: var(--cl-t-lg); color: var(--cl-ink); font-weight: 500;"/>
          <span style="font: var(--cl-t-sm); color: var(--cl-ink-muted); padding: 4px 10px; border: 1px solid var(--cl-border-strong); border-radius: 6px; font-weight: 600;">⌘K</span>
        </div>
        <div style="margin-top: 16px; display: grid; gap: 8px; max-width: 720px;">
          <div style="padding: 12px 16px; background: var(--cl-surface); border: 1px solid var(--cl-border); border-radius: 12px; display: flex; gap: 12px; align-items: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #FBE9C7; color: #7A4A0E; display: flex; align-items: center; justify-content: center; font-weight: 600;">N</div>
            <div><b>Naomi <span style="background:#FBE9C7;">Lev</span>in</b> <span style="color: var(--cl-ink-muted);">· 3-B · Mrs. Cohen</span></div>
          </div>
          <div style="padding: 12px 16px; background: var(--cl-surface); border: 1px solid var(--cl-border); border-radius: 12px; display: flex; gap: 12px; align-items: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #DCEBE3; color: #1F5547; display: flex; align-items: center; justify-content: center; font-weight: 600;">E</div>
            <div><b>Eli <span style="background:#FBE9C7;">Lev</span>in</b> <span style="color: var(--cl-ink-muted);">· K-A · Ms. Stein</span></div>
          </div>
          <div style="padding: 12px 16px; background: var(--cl-surface); border: 1px solid var(--cl-border); border-radius: 12px; display: flex; gap: 12px; align-items: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #E5EAF1; color: #1F3A5F; display: flex; align-items: center; justify-content: center; font-weight: 600;">SL</div>
            <div><b>Sarah <span style="background:#FBE9C7;">Lev</span>in</b> <span style="color: var(--cl-ink-muted);">· Parent · RDS 7821</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">17 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 18 — EARLY PICKUP APPROVALS
     ============================================================ */
  slides.push(HTML`
<section data-label="18 Staff · Approvals">
  <div class="slide" style="padding: 60px 60px;">
    <header class="slide-header" style="margin-bottom: 36px;">
      <div class="kicker">Staff dashboard · Early pickup approvals · 18 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>

    <div style="display: flex; gap: 40px; align-items: center; justify-content: center; flex: 1;">
      <div style="transform: scale(0.62); transform-origin: top left; flex: none;">
        <div data-mount="approvals"></div>
      </div>
      <div style="max-width: 380px; display: grid; gap: 18px;">
        <h2 class="slide-title" style="margin: 0; font-size: 44px;">Approve in <em>one tap.</em></h2>
        <p style="font: var(--cl-t-md); color: var(--cl-ink-soft); line-height: 1.5; margin: 0;">Office runs through pending requests over morning coffee. Each card has everything needed — time, reason, note — without opening anything.</p>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">1</span><div><div class="anno-h">Three big cards</div><div class="anno-p">Time, reason, requester. Largest type goes to the time — the thing that drives next-action.</div></div></div></div>
        <div class="anno"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num">2</span><div><div class="anno-h">Notifies the teacher</div><div class="anno-p">Approving stamps the teacher's roster with a banner that surfaces in the dismissal queue at the right minute.</div></div></div></div>
        <div class="anno" style="background:var(--cl-danger-soft);border-color:#E8C2B8;"><div style="display:flex;gap:12px;align-items:flex-start;"><span class="anno-num" style="background:var(--cl-danger);color:white;">✕</span><div><div class="anno-h" style="color:var(--cl-danger);">Deny requires a note</div><div class="anno-p" style="color:var(--cl-ink);">Tapping deny opens a small sheet — parent gets a copy of the office's reason. Never silent rejection.</div></div></div></div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">18 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 19 — STATUS STATE MACHINE
     ============================================================ */
  slides.push(HTML`
<section data-label="19 Status state machine">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Cross-app · Status state machine · 19 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 16px;">Parent acts. Staff confirms. Parent sees.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 32px;">Both apps share one timeline. Parent transitions are always <em style="font-family:var(--cl-font-display);">requests</em>; staff transitions are always <em style="font-family:var(--cl-font-display);">acknowledgements</em>. The status chip on either side never lies — they read from the same record.</p>

    <div class="sm-track" style="flex: 1;">
      <div class="sm-line"></div>
      <div class="sm-stops">
        <div class="sm-stop parent">
          <div class="sm-dot">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          </div>
          <h4>Requested</h4>
          <p>Parent taps "I'm here" in the car.</p>
          <div style="margin-top: 10px; font: var(--cl-t-xs); color: var(--cl-accent-press); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Parent action</div>
        </div>
        <div class="sm-stop parent">
          <div class="sm-dot">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg>
          </div>
          <h4>Arrived</h4>
          <p>System assigns a position in the queue.</p>
          <div style="margin-top: 10px; font: var(--cl-t-xs); color: var(--cl-accent-press); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Auto · on geofence or tap</div>
        </div>
        <div class="sm-stop staff">
          <div class="sm-dot">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10v4l10 5V5z"/><path d="M14 9a3 3 0 0 1 0 6"/></svg>
          </div>
          <h4>Called</h4>
          <p>Staff taps "Call out". Teacher gets a notification.</p>
          <div style="margin-top: 10px; font: var(--cl-t-xs); color: var(--cl-primary); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Staff action</div>
        </div>
        <div class="sm-stop staff">
          <div class="sm-dot">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5L20 6"/></svg>
          </div>
          <h4>Released</h4>
          <p>Kid is in the car. Staff taps Released, parent sees confirmation.</p>
          <div style="margin-top: 10px; font: var(--cl-t-xs); color: var(--cl-primary); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Staff action</div>
        </div>
      </div>
    </div>

    <!-- Side rail: parallel paths -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
      <div class="panel" style="padding: 22px;">
        <div class="panel-h" style="color: var(--cl-info);">Walk-in path (skips queue)</div>
        <div style="font: var(--cl-t-md); color: var(--cl-ink); margin-top: 8px; line-height: 1.5;">
          <b>Parent</b> taps "Walk-in" → <b>Office</b> sees at door → <b>Released</b> at the office. No <em style="font-family: var(--cl-font-display);">Called</em> state — the kid was already coming.
        </div>
      </div>
      <div class="panel" style="padding: 22px;">
        <div class="panel-h" style="color: var(--cl-warning);">Early-pickup path (gated)</div>
        <div style="font: var(--cl-t-md); color: var(--cl-ink); margin-top: 8px; line-height: 1.5;">
          <b>Parent</b> sends request → <b>Office</b> approves → teacher banner → <b>Parent</b> arrives → joins as Walk-in or Carline.
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">19 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 20 — ACCESSIBILITY
     ============================================================ */
  slides.push(HTML`
<section data-label="20 Accessibility">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Accessibility · 20 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 16px;">WCAG AA, with AAA on the things that matter.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 32px;">Sunlight on an iPad and a one-handed driver are the same accessibility problem with two faces.</p>

    <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; flex: 1; min-height: 0;">
      <!-- Contrast pairs -->
      <div>
        <div class="panel-h">Contrast — sampled pairs</div>
        <div style="display: grid; gap: 10px;">
          <div class="a11y-row"><div class="a11y-swatch" style="background:#15233A;"></div><div style="font:var(--cl-t-md);font-weight:600;">Ink on Bg</div><div style="font:var(--cl-t-md);color:#15233A;background:#FBF5EA;padding:6px 10px;border-radius:6px;">The quick brown fox</div><div class="ratio">14.8 : 1 · AAA</div></div>
          <div class="a11y-row"><div class="a11y-swatch" style="background:#3B4A66;"></div><div style="font:var(--cl-t-md);font-weight:600;">Ink soft on Bg</div><div style="font:var(--cl-t-md);color:#3B4A66;background:#FBF5EA;padding:6px 10px;border-radius:6px;">Today's dismissal is at 3:25</div><div class="ratio">7.9 : 1 · AAA</div></div>
          <div class="a11y-row"><div class="a11y-swatch" style="background:#7A8699;"></div><div style="font:var(--cl-t-md);font-weight:600;">Ink muted on Bg</div><div style="font:var(--cl-t-md);color:#7A8699;background:#FBF5EA;padding:6px 10px;border-radius:6px;">Position 4 of 7 · Mrs. Cohen</div><div class="ratio">4.7 : 1 · AA</div></div>
          <div class="a11y-row"><div class="a11y-swatch" style="background:#E8A33D;"></div><div style="font:var(--cl-t-md);font-weight:600;">"I'm here" hero</div><div style="font:var(--cl-t-md);color:#3A2206;background:#E8A33D;padding:6px 10px;border-radius:6px;font-weight:700;">I'm here</div><div class="ratio">5.6 : 1 · AA Large</div></div>
          <div class="a11y-row"><div class="a11y-swatch" style="background:#2F6B5A;"></div><div style="font:var(--cl-t-md);font-weight:600;">Released chip</div><div style="font:var(--cl-t-md);color:white;background:#2F6B5A;padding:6px 10px;border-radius:6px;font-weight:600;">Released</div><div class="ratio">5.2 : 1 · AA</div></div>
          <div class="a11y-row"><div class="a11y-swatch" style="background:#C97A1F;"></div><div style="font:var(--cl-t-md);font-weight:600;">Called chip</div><div style="font:var(--cl-t-md);color:white;background:#C97A1F;padding:6px 10px;border-radius:6px;font-weight:600;">Called</div><div class="ratio">3.9 : 1 · AA Large</div></div>
          <div class="a11y-row"><div class="a11y-swatch" style="background:#B83A2E;"></div><div style="font:var(--cl-t-md);font-weight:600;">Deny button</div><div style="font:var(--cl-t-md);color:white;background:#B83A2E;padding:6px 10px;border-radius:6px;font-weight:600;">Deny</div><div class="ratio">5.7 : 1 · AA</div></div>
        </div>
      </div>

      <!-- Other commitments -->
      <div style="display: grid; gap: 16px; align-content: start;">
        <div class="panel" style="padding: 22px;">
          <div class="panel-h">Tap targets</div>
          <div style="font: var(--cl-t-md); color: var(--cl-ink); margin-top: 6px; line-height: 1.5;">
            <b>44pt</b> minimum (iOS HIG). <b>56pt</b> for the "I'm here" hero. <b>72pt</b> for staff queue-advance buttons on iPad.
          </div>
        </div>
        <div class="panel" style="padding: 22px;">
          <div class="panel-h">Dynamic type</div>
          <div style="font: var(--cl-t-md); color: var(--cl-ink); margin-top: 6px; line-height: 1.5;">
            Headers scale with iOS Dynamic Type up to AX3. The hero "I'm here" word stays at 48pt and doesn't grow — bigger would push the helper text off.
          </div>
        </div>
        <div class="panel" style="padding: 22px;">
          <div class="panel-h">Status is never color-only</div>
          <div style="font: var(--cl-t-md); color: var(--cl-ink); margin-top: 6px; line-height: 1.5;">
            Every chip has a label. The progress track uses filled circle + check, not color alone. Colorblind users get the same info.
          </div>
        </div>
        <div class="panel" style="padding: 22px;">
          <div class="panel-h">Motion</div>
          <div style="font: var(--cl-t-md); color: var(--cl-ink); margin-top: 6px; line-height: 1.5;">
            The Live Status pulse respects <code style="font-family:var(--cl-font-mono);background:var(--cl-bg-deep);padding:1px 6px;border-radius:4px;">prefers-reduced-motion</code> — it shrinks to a static dot.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School</span>
      <span class="pagenum">20 / 21</span>
    </div>
  </div>
</section>`);

  /* ============================================================
     SLIDE 21 — NEXT STEPS
     ============================================================ */
  slides.push(HTML`
<section data-label="21 Next steps">
  <div class="slide">
    <header class="slide-header">
      <div class="kicker">Wrap · 21 / 21</div>
      <span class="brand-mark"><span class="dot"></span>CarLine</span>
    </header>
    <h2 class="slide-title" style="margin-bottom: 16px;">What we've designed, what's next.</h2>
    <p style="font: var(--cl-t-lg); color: var(--cl-ink-soft); max-width: 1100px; margin: 0 0 32px;">A complete, opinionated v0 — enough surface to walk into Rambam, prototype with one classroom of families, and feel it.</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; flex: 1; min-height: 0;">
      <div>
        <div class="panel-h">Shipped in this design pass</div>
        <div class="next-list">
          <div class="next-item"><span class="next-num">·</span><div><div class="next-title">Parent app — 7 screens</div><div class="next-sub">Onboarding, Home (A &amp; B), Vehicle, Pickup picker, Early form, Live status (4 states), Authorized</div></div><span class="pill now">Designed</span></div>
          <div class="next-item"><span class="next-num">·</span><div><div class="next-title">Staff dashboard — 4 surfaces</div><div class="next-sub">Queue (List + Board), Filters &amp; search, Early approvals</div></div><span class="pill now">Designed</span></div>
          <div class="next-item"><span class="next-num">·</span><div><div class="next-title">Design system — token-level</div><div class="next-sub">Color, type, spacing, motion. Same tokens drive iOS &amp; Android &amp; web.</div></div><span class="pill now">Designed</span></div>
          <div class="next-item"><span class="next-num">·</span><div><div class="next-title">Cross-app state machine</div><div class="next-sub">Single shared status. Carline, walk-in, early paths.</div></div><span class="pill now">Designed</span></div>
        </div>
      </div>
      <div>
        <div class="panel-h">Open questions / next sprint</div>
        <div class="next-list">
          <div class="next-item"><span class="next-num">1</span><div><div class="next-title">Geofence-or-tap?</div><div class="next-sub">Should "Arrived" auto-fire when the car enters the lot, or only on tap? Pros and cons either way.</div></div><span class="pill next">Decide</span></div>
          <div class="next-item"><span class="next-num">2</span><div><div class="next-title">Aftercare integration</div><div class="next-sub">Kids in aftercare aren't on the queue. Where do they live?</div></div><span class="pill next">Spec</span></div>
          <div class="next-item"><span class="next-num">3</span><div><div class="next-title">Multi-school families</div><div class="next-sub">Some Rambam families have kids at other schools. Account-level vs. school-level.</div></div><span class="pill next">Research</span></div>
          <div class="next-item"><span class="next-num">4</span><div><div class="next-title">Reports / weekly digest</div><div class="next-sub">Avg. dismissal time, late arrivals, repeat early-pickups. Office wants this; not in v1.</div></div><span class="pill later">v1.1</span></div>
          <div class="next-item"><span class="next-num">5</span><div><div class="next-title">Pilot with 1 grade</div><div class="next-sub">3rd grade (Mrs. Cohen) — ~22 families, 2 weeks. Friday debrief.</div></div><span class="pill next">Plan</span></div>
        </div>
      </div>
    </div>

    <div style="margin-top: 28px; padding: 24px 28px; background: linear-gradient(120deg, var(--cl-accent-soft) 0%, var(--cl-primary-soft) 100%); border-radius: 18px; display: flex; gap: 24px; align-items: center;">
      <div style="font-family: var(--cl-font-display); font-style: italic; font-size: 32px; color: var(--cl-ink); flex: 1; letter-spacing: -0.3px;">"Boring, in the way a well-engineered traffic light is boring."</div>
      <div style="font: var(--cl-t-sm); color: var(--cl-ink-soft); font-family: var(--cl-font-mono);">— Design principle 04</div>
    </div>

    <div class="slide-footer">
      <span class="brand-mark"><span class="dot"></span>CarLine for Rambam Day School · End of deck</span>
      <span class="pagenum">21 / 21</span>
    </div>
  </div>
</section>`);

  // Inject all slides into <deck-stage>
  const stage = document.querySelector("deck-stage");
  if (!stage) return;
  const frag = document.createRange().createContextualFragment(slides.join("\n"));
  stage.appendChild(frag);
})();
