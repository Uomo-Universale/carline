# CarLine — Project Handoff Reference

Use this document to restore full context when starting a new Claude session.
Upload this file and say: "I'm continuing the CarLine project. Here is the handoff document."

---

## What CarLine Is

A school dismissal / car-line management app built in React Native (Expo SDK 56).
Two user roles:
- **Parent** — taps "I'm here", selects which children to pick up, watches live status
- **Staff** — sees the dismissal queue, advances student statuses, can correct mistakes

School: **Rambam Day School** (Jewish day school, Brooklyn/NY context)

---

## GitHub Repository

**URL:** https://github.com/Uomo-Universale/carline  
**Default branch:** `main`  
**GitHub Pages (web preview):** https://uomo-universale.github.io/carline/  
**EAS Project ID:** `ff16359a-68f7-44c6-a360-4fbfd77c8850`  
**Bundle ID (iOS):** `com.rambam.carline`  
**Bundle ID (Android):** `com.rambam.carline`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo SDK 56 |
| Navigation | React Navigation (NOT Expo Router) |
| State | Zustand |
| Data (dev) | MockDataSource (in-memory) |
| Data (prod) | SupabaseDataSource (Postgres + Realtime) |
| CI/CD | GitHub Actions → GitHub Pages |
| Native builds | EAS Build (not yet configured for TestFlight) |

---

## Design Tokens

| Name | Hex |
|---|---|
| Cream (background) | `#FBF5EA` |
| Deep Navy (headings) | `#15233A` |
| Amber (CTA/accent) | `#E8A33D` |
| Mid Navy | `#3B4A66` |
| Muted | `#7A8699` |
| Green (released) | `#2F6B5A` |
| Border | `#ECE0C8` |

---

## Repository Structure

```
carline/
├── .github/workflows/eas-update.yml   ← GitHub Actions (deploys to GitHub Pages)
└── carline-app/
    ├── App.tsx                         ← Root navigator (Tab + Stack setup)
    ├── app.json                        ← Expo config (EAS project ID, baseUrl, etc.)
    ├── eas.json                        ← EAS build profiles
    ├── package.json
    ├── src/
    │   ├── components/ui/
    │   │   ├── Avatar.tsx
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── KidPortrait.tsx
    │   │   ├── LicensePlate.tsx
    │   │   ├── ProgressTrack.tsx
    │   │   └── StatusChip.tsx
    │   ├── constants/tokens.ts
    │   ├── data/
    │   │   ├── DataSource.ts           ← Interface all data sources implement
    │   │   ├── MockDataSource.ts       ← In-memory dev data (currently active)
    │   │   ├── SupabaseDataSource.ts   ← Production backend (swap in provider.ts)
    │   │   ├── VeracrossDataSource.ts  ← SIS integration stub
    │   │   └── provider.ts             ← Export `dataSource` — swap here to go live
    │   ├── lib/supabase.ts
    │   ├── models/index.ts             ← All TypeScript types
    │   ├── notifications/index.ts
    │   ├── screens/
    │   │   ├── parent/
    │   │   │   ├── HomeScreen.tsx      ← "I'm here" + child picker modal
    │   │   │   ├── LiveStatusScreen.tsx ← Real-time status + cancel button
    │   │   │   ├── PickupPickerScreen.tsx
    │   │   │   ├── EarlyPickupScreen.tsx
    │   │   │   ├── VehicleScreen.tsx
    │   │   │   └── AuthorizedPersonsScreen.tsx
    │   │   └── staff/
    │   │       ├── StaffQueueScreen.tsx  ← Dismissal queue + long-press editor
    │   │       └── StaffApprovalsScreen.tsx
    │   └── store/index.ts              ← Zustand store (queue + requests)
    └── supabase/
        ├── migrations/
        │   ├── 001_schema.sql
        │   ├── 002_rls.sql
        │   └── 003_seed.sql
        └── functions/
            ├── import-csv/
            ├── notify-status-change/
            └── sync-from-veracross/
```

---

## Key Models (src/models/index.ts)

```typescript
type PickupStatus = 'requested' | 'arrived' | 'called' | 'released'
type PickupType = 'carline' | 'walkin' | 'early'

Student      { id, firstName, lastName, grade, homeroom, teacherName, tintIndex }
Guardian     { id, firstName, lastName, phone, email, studentIds, isPrimary }
Vehicle      { id, guardianId, year, make, model, color, colorHex, plate, state, isActive }
PickupRequest { id, guardianId, studentIds, vehicleId, type, status, requestedAt, ... }
QueueEntry   { requestId, studentId, guardianId, vehicleId, status, arrivedAt, queuePosition, alert? }
```

Status flow: `requested` → `arrived` → `called` → `released`

---

## Features Completed

### Parent
- [x] Home screen with "I'm here" hero button
- [x] **Child picker modal** — when tapping "I'm here" with 2+ kids, shows sheet to select which children are being picked up today (deselect absent/aftercare kids)
- [x] Live status screen with animated pulse, progress track
- [x] **Cancel pickup** — red "Cancel pickup" link visible on LiveStatusScreen when status is `requested` or `arrived`; disappears once staff calls the child out
- [x] Early pickup request flow
- [x] Vehicle management screen
- [x] Authorized persons screen

### Staff
- [x] Dismissal queue with search and grade filter chips
- [x] "Call out" button (arrived → called) and "Released ✓" button (called → released)
- [x] **Long-press status editor** — long-press any queue row to open a modal showing all 4 statuses; tap any to set it directly (allows reverting mistakes)
- [x] Released-today section at the bottom
- [x] Early pickup approvals screen

---

## GitHub Actions Workflow

File: `.github/workflows/eas-update.yml`

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install --legacy-peer-deps
      - run: npx expo install react-native-web react-dom
      - run: npx expo export --platform web
        env:
          CI: "1"
          EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK: "1"
      - run: |
          sed -i "s|/_expo/|/carline/_expo/|g" dist/index.html
          touch dist/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Important notes about this workflow:**
- `--legacy-peer-deps` is required due to peer dep conflicts in SDK 56
- `EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK` suppresses a false warning (we use React Navigation, not Expo Router)
- The `sed` command rewrites asset paths from `/_expo/` to `/carline/_expo/` because GitHub Pages serves from a subdirectory
- `.nojekyll` prevents GitHub Pages from blocking `_expo/` directories (Jekyll ignores underscore folders by default)

---

## app.json Key Fields

```json
{
  "expo": {
    "name": "CarLine",
    "slug": "carline-app",
    "scheme": "carline",
    "runtimeVersion": { "policy": "sdkVersion" },
    "ios": { "bundleIdentifier": "com.rambam.carline" },
    "android": { "package": "com.rambam.carline" },
    "web": { "baseUrl": "/carline" },
    "extra": {
      "eas": { "projectId": "ff16359a-68f7-44c6-a360-4fbfd77c8850" },
      "supabaseUrl": "https://YOUR_PROJECT_REF.supabase.co",
      "supabaseAnonKey": "YOUR_ANON_KEY_HERE"
    }
  }
}
```

---

## Switching to Supabase (Production Backend)

1. Create a Supabase project at supabase.com
2. Run migrations: `supabase/migrations/001_schema.sql`, `002_rls.sql`, `003_seed.sql`
3. Update `app.json` with real `supabaseUrl` and `supabaseAnonKey`
4. In `src/data/provider.ts`, change:
   ```typescript
   // From:
   export const dataSource = new MockDataSource();
   // To:
   export const dataSource = new SupabaseDataSource();
   ```

---

## iOS TestFlight Build (PENDING)

**Status:** Not yet configured. User is signing up for Apple Developer account ($99/year).

**Once Apple Developer account is ready, needed info:**
- Apple Team ID (found at developer.apple.com → Membership)

**Steps to complete:**
1. Add `EXPO_TOKEN` as GitHub secret (Settings → Secrets → Actions)
   - Get token from expo.dev → Account Settings → Access Tokens
2. Add Apple credentials to EAS:
   ```bash
   eas credentials
   ```
3. Add a TestFlight build workflow to `.github/workflows/`
4. Submit build → TestFlight → invite testers via email

---

## Mock Data (for demo)

The app currently runs on MockDataSource with this seed data:

**Guardian logged in:** Sarah Levin (g1) — has 2 children: Naomi (3rd grade) and Eli (Kindergarten)

**Queue seed state:**
- Naomi Levin — `called` (Subaru Outback, RDS 7821)
- Eli Levin — `called` (same vehicle)
- Mira Abramson — `arrived`
- Asher Goldberg — `arrived`
- Yael Roth — `arrived` (alert: Approved pickup: Aunt)
- Daniel Weisman — `arrived`
- Hannah Berkowitz — `arrived`
- Sam Friedman — `released`
- Ava Klein — `released`

**To simulate a different guardian**, change `_currentGuardianId` in `MockDataSource.ts` line 90.

---

## Known Limitations / Future Work

- [ ] **iOS TestFlight** — native build pipeline not yet set up (waiting on Apple Developer account)
- [ ] **Supabase backend** — SupabaseDataSource.ts is written but not wired in; needs real project credentials
- [ ] **Push notifications** — expo-notifications is installed and configured but not triggered
- [ ] **PickupPickerScreen** — "Walking up" and "Early pickup" buttons navigate here but it only routes to EarlyPickup; walk-in flow not fully wired
- [ ] **"I'm here" while active** — tapping the hero when a request is already active navigates to LiveStatus but only shows the first request/student
- [ ] **Veracross sync** — `VeracrossDataSource.ts` and the Edge Function stub exist but need real API credentials
- [ ] **Multi-guardian** — app currently simulates one logged-in guardian; auth not implemented

---

## How to Push Code (No Local Git)

This container cannot push to GitHub directly without credentials.
Each session you need to:
1. Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate token with `repo` scope, expiry 1 day
3. Paste token into chat — Claude will push then scrub the token from the remote URL
4. **Delete the token immediately** after Claude confirms the push

---

## Session History Summary

This project was built across multiple Claude Code sessions:

**Session 1:** Full app designed and built from scratch — all screens, models, MockDataSource, SupabaseDataSource, Supabase migrations, Edge Functions, navigation, UI components.

**Session 2:** 
- Got the app onto GitHub (user had no local git/npm — used GitHub web upload)
- Set up GitHub Actions + GitHub Pages web preview
- Fixed numerous CI errors (peer deps, expo-router check, asset path rewriting, .nojekyll)
- Avatar crash fix (undefined tint index)
- Added `setRequestStatus` to DataSource interface and MockDataSource
- Added long-press status editor to StaffQueueScreen (staff can correct any status)
- Added child picker modal to HomeScreen (parent selects which kids today)
- Added Cancel pickup button to LiveStatusScreen

---

*Generated: 2026-06-01*
