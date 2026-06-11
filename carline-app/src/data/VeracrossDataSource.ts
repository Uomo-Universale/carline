// CarLine — VeracrossDataSource stub
// ════════════════════════════════════════════════════════════════════════════
//
// HOW TO WIRE IN THE REAL VERACROSS API
// ══════════════════════════════════════
// 1. Obtain OAuth 2.0 client credentials from Rambam's Veracross admin
//    (School Settings → API → OAuth Credentials).
// 2. Set the following environment variables:
//    VERACROSS_CLIENT_ID, VERACROSS_CLIENT_SECRET, VERACROSS_SCHOOL_ROUTE
//    (e.g. "rambam") in a .env file — use expo-constants or react-native-config
//    to read them at runtime.
// 3. Replace every TODO below with the real fetch/axios call.
// 4. Map the Veracross response shapes to the CarLine model types defined
//    in src/models/index.ts.
// 5. Update src/data/provider.ts to export VeracrossDataSource instead of
//    MockDataSource.
//
// Key Veracross API v3 endpoints (OAuth2 bearer token required):
//   GET /api/v3/{school}/students           — roster
//   GET /api/v3/{school}/households          — guardian relationships
//   GET /api/v3/{school}/authorized_pickups  — authorized pickup persons
//   POST /api/v3/{school}/dismissal_requests — submit a dismissal event
//
// FERPA / Data Handling:
//   Production use requires a signed Data Processing Agreement with the school
//   and compliance with FERPA (20 U.S.C. § 1232g). Do NOT log or cache
//   student PII outside encrypted storage.
// ════════════════════════════════════════════════════════════════════════════

import type { DataSource, CreatePickupRequestParams } from './DataSource';
import type {
  Student, Guardian, Vehicle, PickupRequest, AuthorizedPickup,
  EarlyPickupApproval, QueueEntry, Notification, PickupStatus,
} from '../models';

const BASE_URL = 'https://api.veracross.com/api/v3';
// TODO: load from environment / expo-constants
const SCHOOL_ROUTE = 'rambam';

async function fetchVx(path: string, options?: RequestInit) {
  // TODO: Implement OAuth2 client credentials token fetch + cache + refresh
  const token = await getAccessToken();
  const response = await fetch(`${BASE_URL}/${SCHOOL_ROUTE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) throw new Error(`Veracross API error: ${response.status}`);
  return response.json();
}

async function getAccessToken(): Promise<string> {
  // TODO: POST to https://api.veracross.com/oauth/token with
  //   grant_type=client_credentials, client_id, client_secret, scope
  // Cache the token; refresh when expires_in threshold is reached.
  throw new Error('VeracrossDataSource: getAccessToken not implemented');
}

export class VeracrossDataSource implements DataSource {
  async getCurrentGuardian(): Promise<Guardian> {
    // TODO: GET /api/v3/{school}/households/{householdId} using the
    //   authenticated user's session / JWT sub claim.
    throw new Error('Not implemented');
  }

  async getGuardianById(_id: string): Promise<Guardian | null> {
    // TODO: GET /api/v3/{school}/households/{id}
    throw new Error('Not implemented');
  }

  async getAllStudents(): Promise<Student[]> {
    // TODO: GET /api/v3/{school}/students — full roster
    throw new Error('Not implemented');
  }

  async getStudentsForGuardian(guardianId: string): Promise<Student[]> {
    // TODO: GET /api/v3/{school}/students?household_fk={guardianId}
    //   Map response.data[] → Student objects
    throw new Error('Not implemented');
  }

  async getStudentById(_id: string): Promise<Student | null> {
    // TODO: GET /api/v3/{school}/students/{id}
    throw new Error('Not implemented');
  }

  async getVehicleById(_id: string): Promise<Vehicle | null> {
    // TODO: GET from CarLine backend by vehicle ID
    throw new Error('Not implemented');
  }

  async getVehiclesForGuardian(_guardianId: string): Promise<Vehicle[]> {
    // TODO: Vehicle data is not a standard Veracross field — either:
    //   (a) Store in CarLine's own backend DB (preferred)
    //   (b) Use a custom Veracross field if the school has configured one
    throw new Error('Not implemented');
  }

  async saveVehicle(_vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    // TODO: POST to CarLine backend (not Veracross — Veracross is read-only
    //   for roster data; vehicle preferences are app-managed).
    throw new Error('Not implemented');
  }

  async setActiveVehicle(_vehicleId: string, _guardianId: string): Promise<void> {
    // TODO: PATCH to CarLine backend
    throw new Error('Not implemented');
  }

  async getAuthorizedPickups(_guardianId: string): Promise<AuthorizedPickup[]> {
    // TODO: GET /api/v3/{school}/authorized_pickups?household_fk={guardianId}
    throw new Error('Not implemented');
  }

  async createPickupRequest(_params: CreatePickupRequestParams): Promise<PickupRequest> {
    // TODO: POST to CarLine backend (real-time queue is CarLine-managed)
    throw new Error('Not implemented');
  }

  async getActiveRequestsForGuardian(_guardianId: string): Promise<PickupRequest[]> {
    // TODO: GET CarLine backend /requests?guardian={guardianId}&status=active
    throw new Error('Not implemented');
  }

  async cancelPickupRequest(_requestId: string): Promise<void> {
    // TODO: DELETE CarLine backend /requests/{requestId}
    throw new Error('Not implemented');
  }

  async createBusRequest(_studentIds: string[], _busPlate?: string): Promise<void> {
    // TODO: POST to CarLine backend /queue/bus
    throw new Error('Not implemented');
  }

  async getDismissalQueue(): Promise<QueueEntry[]> {
    // TODO: GET CarLine backend /queue/today (WebSocket stream preferred for
    //   real-time — see subscribeToQueueChanges)
    throw new Error('Not implemented');
  }

  async advanceRequestStatus(_requestId: string): Promise<PickupRequest> {
    // TODO: POST CarLine backend /requests/{requestId}/advance
    throw new Error('Not implemented');
  }

  async setRequestStatus(_requestId: string, _status: PickupStatus): Promise<PickupRequest> {
    // TODO: PATCH CarLine backend /requests/{requestId} { status }
    throw new Error('Not implemented');
  }

  async setGroupAndPosition(_requestId: string, _studentId: string, _group: number, _position: number): Promise<void> {
    // TODO: PATCH CarLine backend /queue/{requestId}/position { group, position }
    throw new Error('Not implemented');
  }

  async getEarlyPickupApprovals(): Promise<EarlyPickupApproval[]> {
    // TODO: GET CarLine backend /early-pickups?status=pending
    throw new Error('Not implemented');
  }

  async approveEarlyPickup(_approvalId: string, _reviewerId: string): Promise<EarlyPickupApproval> {
    // TODO: POST CarLine backend /early-pickups/{approvalId}/approve
    // Should also trigger a push notification to the guardian.
    throw new Error('Not implemented');
  }

  async denyEarlyPickup(_approvalId: string, _reviewerId: string, _note: string): Promise<EarlyPickupApproval> {
    // TODO: POST CarLine backend /early-pickups/{approvalId}/deny {note}
    throw new Error('Not implemented');
  }

  async getNotifications(_guardianId: string): Promise<Notification[]> {
    // TODO: GET CarLine backend /notifications?guardian={guardianId}
    throw new Error('Not implemented');
  }

  async markNotificationRead(_notificationId: string): Promise<void> {
    // TODO: PATCH CarLine backend /notifications/{notificationId}/read
    throw new Error('Not implemented');
  }

  subscribeToQueueChanges(callback: (queue: QueueEntry[]) => void): () => void {
    // TODO: Open a WebSocket connection to CarLine backend ws://host/queue/live
    //   and call callback on each message. Return a cleanup function that closes
    //   the socket.
    // Example:
    //   const ws = new WebSocket(`${WS_URL}/queue/live`);
    //   ws.onmessage = (e) => callback(JSON.parse(e.data));
    //   return () => ws.close();
    void callback;
    throw new Error('Not implemented');
  }

  subscribeToRequestStatus(_requestId: string, _callback: (status: PickupStatus) => void): () => void {
    // TODO: WebSocket subscription for a specific request's status changes
    throw new Error('Not implemented');
  }
}
