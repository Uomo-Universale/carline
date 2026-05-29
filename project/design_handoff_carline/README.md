# Handoff: CarLine — Pickup System for Rambam Day School

## What this is

A native iOS + Android **parent app** and an iPad **staff dashboard** for elementary‑school dismissal & pickup. Parents tap one button when they're in the car line; staff sees a live queue, walks the kid out, marks them released.

This bundle is a **design reference** — a set of HTML prototypes showing the intended look, behavior, and component system. Your job is to **recreate these designs in the target codebase's environment** (React Native, SwiftUI + Jetpack Compose, Flutter, etc.) using its established patterns. Do not ship the HTML.

If no codebase exists yet, the recommended stack is **React Native + Expo** for both apps (shared design tokens, fastest path to dual-platform), with the staff iPad surface as the same RN app in landscape, or a **React + Vite** web app if the iPad will stay browser-based.

## Fidelity

**High-fidelity.** Exact colors, type, spacing, and component states are specified. Recreate pixel-perfectly using the target environment's primitives.

## Files in this bundle

| File | Purpose |
|---|---|
| `CarLine.html` | The 21-slide design walkthrough — open this first |
| `tokens.css` | All design tokens as CSS variables (canonical source) |
| `app-shared.jsx` | Shared primitives: Icon, Button, StatusChip, Card, Avatar, Plate, ProgressTrack, Field, Segmented, KidPortrait |
| `app-frames.jsx` | iPhone + iPad device frames |
| `app-parent.jsx` | Parent app screen implementations |
| `app-staff.jsx` | Staff dashboard screen implementations + mock queue data |
| `slides-part2.js` | Slides 4–21 of the deck |
| `app-tweaks.jsx`, `app-mount.jsx`, `tweaks-panel.jsx` | Deck-only — ignore for the real build |

Open `CarLine.html` in a browser to walk the whole spec.

---

## Apps & screens

### Parent app (iOS primary, Android secondary)
- **Target device:** iPhone (390 × 844 design size). Android port uses identical tokens.
- **Bottom tab bar:** Home · Vehicle · People · Settings

| Screen | Purpose | Reference component |
|---|---|---|
| Onboarding | SSO with school account (placeholder) + phone fallback | `ParentOnboarding` |
| Home — Variant A | Single big "I'm here" → picks up all kids | `ParentHomeA` |
| Home — Variant B | Per-child cards with their own buttons | `ParentHomeB` |
| Vehicle profile | Year/make/model/color/plate; staff-facing card preview | `ParentVehicle` |
| Pickup type picker | Choose Carline / Walk-in / Early / Message | `PickupTypePicker` |
| Early pickup form | Kid + time + reason + optional note | `EarlyPickupForm` |
| Live status | Requested → Arrived → Called → Released | `LiveStatus` (4 status props) |
| Authorized people | Read-only list, grouped by child | `AuthorizedPersons` |

**Recommendation:** ship Home Variant A as default. Expose B as `Settings → Display → Separate cards per child`. Don't ask at onboarding.

### Staff dashboard (iPad)
- **Target device:** iPad landscape (1180 × 820) primary, portrait (820 × 1180) supported.
- **Top bar:** logo + title + search (cmd-K) + queue count + admin avatar.

| Screen | Purpose | Reference component |
|---|---|---|
| Live queue — List | Dense row-per-family, ordered by arrival. For office indoors. | `StaffQueueA` |
| Live queue — Board | 3 columns (In line / Called / Released). For curb outdoors. | `StaffQueueB` |
| Filters & search | Grade chips + teacher chip + free-text. Persistent toolbar. | (in `FilterBar` + `StaffTopbar`) |
| Early-pickup approvals | List + detail layout, one-tap approve/deny | `EarlyApprovals` |

**Recommendation:** A & B share one data model; staff toggles at the top of the screen. Office runs List, curb runs Board.

---

## Status state machine (shared by both apps)

```
PARENT       PARENT       STAFF        STAFF
Requested → Arrived  →  Called   →   Released
(tap)      (auto or    (one tap     (one tap on
            tap)        on iPad)     iPad — kid is
                                      in the car)
```

**Side paths:**
- **Walk-in:** Parent → Office sees at door → Released (skips Called)
- **Early pickup:** Parent submits → Office approves → teacher banner → parent arrives → joins as walk-in or carline

**Hard rule:** if the released-to person isn't on the authorized list, staff app blocks Released and prompts office override. Parents can't unblock.

---

## Design tokens (full set in `tokens.css`)

### Color
```
Foundation
  --cl-bg              #FBF5EA  Page
  --cl-bg-deep         #F5EBD7  Recessed
  --cl-surface         #FFFFFF  Cards
  --cl-surface-2       #FFFCF5  Subtle elevated
  --cl-ink             #15233A  Primary text
  --cl-ink-soft        #3B4A66  Secondary text
  --cl-ink-muted       #7A8699  Meta
  --cl-border          #ECE0C8  Hairlines
  --cl-border-strong   #D8C9A8  Heavier dividers

Brand & signal
  --cl-primary         #1F3A5F  Navy — calm CTAs, headers
  --cl-primary-soft    #E5EAF1  Selected state bg
  --cl-accent          #E8A33D  Amber — "I'm here" ONLY
  --cl-accent-soft     #FBE9C7  Arrived chip bg
  --cl-success         #2F6B5A  Released, approved
  --cl-warning         #C97A1F  Called, pending
  --cl-danger          #B83A2E  Deny, error
  --cl-info            #2A6FA3  Walk-in, notices
```

**Rule:** at most 2 saturated colors on screen at once. If a screen has amber, it cannot have orange.

### Typography
```
Display:  Newsreader (Google Fonts) — 400/500/600/700, italic supported
UI:       Geist (Google Fonts) — 400/500/550/600/650/700/800
Mono:     Geist Mono — plate, time, contrast ratios

Scale (weight / size / line-height):
  xs    500 / 11 / 14    UPPERCASE labels, footer chrome
  sm    500 / 13 / 18    Captions, meta
  base  450 / 15 / 22    Body in compact contexts
  md    500 / 16 / 22    Body default
  lg    550 / 18 / 24    Card titles, helpers
  xl    600 / 22 / 28    Screen headers
  2xl   650 / 28 / 34    Greeting
  3xl   700 / 36 / 42    Big status moments
  4xl   700 / 48 / 52    The "I'm here" word
```

Display (Newsreader) is reserved for headers, status headlines (e.g. "Naomi is on her way"), and the cover. Body, labels, buttons, and numbers are always Geist.

### Spacing (4-based)
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`

### Radii
`sm 6 · md 10 · lg 14 · xl 20 · 2xl 28 · pill 999`

### Shadows
```
--cl-shadow-1   0 1px 2px rgba(21,35,58,0.06), 0 1px 0 rgba(21,35,58,0.04)
--cl-shadow-2   0 4px 14px -4px rgba(21,35,58,0.12), 0 2px 4px rgba(21,35,58,0.05)
--cl-shadow-3   0 20px 40px -16px rgba(21,35,58,0.18), 0 4px 12px -4px rgba(21,35,58,0.08)
--cl-ring       0 0 0 3px rgba(232,163,61,0.35)   /* focus ring */
```

### Motion
```
--cl-fast  140ms
--cl-med   220ms
--cl-slow  360ms
--cl-ease  cubic-bezier(0.2, 0.7, 0.2, 1)
```
Respect `prefers-reduced-motion` — the Live Status pulse becomes a static dot.

### Tap targets
- **Default minimum:** 44pt (iOS HIG)
- **Parent "I'm here" hero:** 56pt+ (one-handed in-car)
- **Staff queue advance buttons:** 72pt (outdoor iPad)

---

## Component spec (high-level — see `app-shared.jsx` for exact styles)

### Button
Variants: `primary` (navy bg, white text) · `accent` (amber bg, dark text — reserved for "I'm here") · `secondary` (white bg, 1px border) · `ghost` · `success` · `danger`
Sizes: `sm 36pt · md 44pt · lg 56pt · xl 72pt`

### StatusChip
5 states: `requested · arrived · called · released · none`. Each has a label, background color, foreground color, and a dot (with inset highlight for readability on every bg). Three sizes (`sm/md/lg`).

### Plate (vehicle license)
Geist Mono, all-caps, navy border, cream fill, state abbreviation on the left separated by a hairline. Three sizes.

### ProgressTrack
Horizontal (4 colored bars) for compact contexts. Vertical (icon + label + helper text per step) for the Live Status screen. Active step has an 8px amber ring.

### Card
1px border + hairline shadow (elev 1). Lifted variant for hero/modal (elev 2). 20px default padding, `--cl-r-xl` (20px) radius.

### KidPortrait
Stylized circle avatar with warm gradient background. 5-tint rotation by name hash.

---

## Accessibility commitments

- **WCAG AA minimum** everywhere; **AAA on body text** (ink #15233A on bg #FBF5EA = 14.8:1)
- **Status is never color-only** — every chip has a text label, every progress dot has a check icon
- **Dynamic Type** scales headers up to AX3; "I'm here" word stays fixed at 48pt (bigger would push helpers off)
- **Reduced motion** kills the Live Status pulse animation
- Measured contrast pairs are on slide 20 of the deck — use those as a regression baseline

---

## Mock data used in the design

- **School:** Rambam Day School (dismissal 3:25)
- **Parent:** Sarah Levin · `+1 (917) 555-0142`
- **Children:** Naomi Levin (3-B, Mrs. Cohen) · Eli Levin (K-A, Ms. Stein)
- **Vehicle:** 2022 Subaru Outback, Forest Green, NY plate `RDS 7821`
- **Authorized:** Sarah & David Levin (primary), Rachel Adler (aunt, both kids), Mike Levin (grandfather, K-only)
- **Queue:** 9 mock families with realistic plate strings, car colors, teacher assignments

Replace with real data; the structure mirrors a typical SIS export.

---

## Open product questions for the build team

1. **Arrived = geofence or tap?** Should "Arrived" fire automatically when the car enters the school's lot, or only when the parent taps? Decide before pilot.
2. **Aftercare integration** — kids in aftercare aren't on the dismissal queue. Where do they live in the UI? Out of scope for v1?
3. **Multi-school families** — some families have kids at other schools. Account-level vs. school-level scoping for the parent app.
4. **Pilot plan** — recommend starting with one grade (3rd, Mrs. Cohen, ~22 families) for 2 weeks before school-wide rollout.

---

## Implementation notes

- **Token sync:** the same tokens drive iOS, Android, and the iPad surface. Export `tokens.css` to a JSON tokens file (Style Dictionary, Token Studio) and consume from there in every target environment. Don't duplicate values.
- **Fonts:** Newsreader and Geist are both free Google Fonts. Bundle them into the apps' assets — do not rely on a CDN at runtime in the native apps.
- **Live updates:** the staff queue needs real-time push (parent taps "I'm here" → row appears within ~1s). WebSockets or a service like Pusher/Ably. The parent's status screen is also live-driven.
- **Notifications:**
  - Office on early-pickup submitted
  - Teacher on early-pickup approved
  - Parent on "Called" and "Released" status transitions
- **Sound on staff side:** a soft chime when a new family enters the queue (outdoors, glanceable + audible).

---

## License plate rendering

The plate component is used in **both** apps and must render identically. A parent and a teacher are looking at the same object — the plate they see on their phone is the plate the teacher sees on the iPad, character-for-character.

```
Geist Mono · 600 weight · all-caps · letter-spacing 1
Border: 1.5px solid #15233A
Background: #FFFCF5
State abbreviation: smaller (0.55× of plate size), opacity 0.7, hairline divider
```
