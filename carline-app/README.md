# CarLine — School Dismissal App

A React Native (Expo) app for managing school pickup at Rambam Day School. A single codebase ships to iOS and Android via Expo Go.

## Running locally

```bash
cd carline-app
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS or Android). The app runs entirely on mock data — no backend required.

> **Network note:** If `npx expo install` fails (network restrictions), use `npm install --legacy-peer-deps` instead.

## Architecture overview

```
src/
├── models/         TypeScript interfaces (Student, Guardian, Vehicle, PickupRequest, …)
├── data/
│   ├── DataSource.ts        Interface all backends must implement
│   ├── MockDataSource.ts    In-memory mock with 10 students + pub/sub real-time
│   ├── VeracrossDataSource.ts  Stub — see "Connecting a real backend" below
│   └── provider.ts          Single import point — swap backend here
├── store/          Zustand store (queue state shared between parent + staff views)
├── screens/
│   ├── parent/     HomeScreen, LiveStatusScreen, VehicleScreen,
│   │               PickupPickerScreen, EarlyPickupScreen, AuthorizedPersonsScreen
│   └── staff/      StaffQueueScreen, StaffApprovalsScreen
├── components/ui/  Design system components (Button, Card, Avatar, LicensePlate, …)
├── constants/      Design tokens (colors, spacing, radii)
└── notifications/  Expo push notification helpers (mocked triggers)
```

## Switching between mock and real data

Open `src/data/provider.ts` and change one line:

```ts
// Current (mock):
import { MockDataSource } from './MockDataSource';
export const dataSource: DataSource = new MockDataSource();

// Real backend:
import { VeracrossDataSource } from './VeracrossDataSource';
export const dataSource: DataSource = new VeracrossDataSource();
```

## Connecting a real backend

### Veracross integration

See `src/data/VeracrossDataSource.ts` for detailed TODOs. Key steps:

1. **OAuth2**: Implement client credentials flow against `https://api.veracross.com/oauth/token`.
2. **Endpoints**:
   - Students: `GET /api/v3/{school}/students`
   - Households: `GET /api/v3/{school}/households`
   - Authorized pickups: `GET /api/v3/{school}/authorized_pickups`
3. Map API responses to the `Student`, `Guardian`, `AuthorizedPickup` interfaces.

### Real-time queue updates (WebSocket)

The `DataSource` interface uses a callback-based subscription pattern that matches React's `useEffect` cleanup convention:

```ts
subscribeToQueueChanges(callback: (queue: QueueEntry[]) => void): () => void
subscribeToRequestStatus(requestId: string, callback: (status: PickupStatus) => void): () => void
```

To replace the mock pub/sub with a real WebSocket:
1. Open a socket connection in each `subscribe*` method.
2. Call `callback` whenever the server pushes a message.
3. Return a cleanup function that closes the socket / removes the listener.

The rest of the app (store, screens) doesn't change.

### Push notifications

`src/notifications/index.ts` handles token registration and local notification scheduling. For production:

1. Replace `trigger: null` (fires immediately) with a server call that sends the push via Expo's push API:
   ```
   POST https://exp.host/--/api/v2/push/send
   { to: "<ExpoToken>", title: "…", body: "…" }
   ```
2. Store the token returned by `registerForPushNotifications()` in your backend, keyed to the guardian's account.

## Demo / role switcher

The top bar lets you toggle between **Parent** and **Staff** views without logging in. Remove this in production and route users based on their authenticated role.

### Mock guardian

The default mock is `g1 = Sarah Levin` (two children: Naomi 3rd grade, Eli Kindergarten). Change `_currentGuardianId` in `MockDataSource.ts` to simulate other families.

## Design tokens

All colors, spacing, and typography are in `src/constants/tokens.ts`, ported from the Claude Design export. Primary palette:

| Token      | Value     | Use                      |
|------------|-----------|--------------------------|
| `bg`       | `#FBF5EA` | App background (cream)   |
| `ink`      | `#15233A` | Primary text (deep navy) |
| `accent`   | `#E8A33D` | Hero button (amber)      |
| `success`  | `#2F6B5A` | Released state (green)   |
| `primary`  | `#1F3A5F` | Selected states, links   |

## FERPA notice

This app displays student records. In production:
- All data must be sourced through school-issued credentials with signed data-handling agreements.
- Do not store student data on device beyond a single session.
- Consult your school's privacy officer before connecting a real backend.

## EAS Build (app stores)

```bash
npm install -g eas-cli
eas build --platform all
```

Set `extra.eas.projectId` in `app.json` to your EAS project ID before building.
