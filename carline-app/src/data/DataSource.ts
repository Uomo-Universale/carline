// CarLine — DataSource interface
// Swap implementations by changing the export in provider.ts.
// All methods return Promises so real network calls are a drop-in replacement.

import type {
  Student, Guardian, Vehicle, PickupRequest, AuthorizedPickup,
  EarlyPickupApproval, QueueEntry, Notification,
  PickupStatus, PickupType, EarlyPickupReason,
} from '../models';

export interface CreatePickupRequestParams {
  guardianId: string;
  studentIds: string[];
  vehicleId?: string;
  type: PickupType;
  earlyPickupTime?: string;
  earlyPickupReason?: EarlyPickupReason;
  earlyPickupNote?: string;
}

export interface DataSource {
  // ── Guardian / auth ──────────────────────────────────────
  getCurrentGuardian(): Promise<Guardian>;
  getGuardianById(id: string): Promise<Guardian | null>;

  // ── Students ─────────────────────────────────────────────
  getStudentsForGuardian(guardianId: string): Promise<Student[]>;
  getStudentById(id: string): Promise<Student | null>;

  // ── Vehicles ─────────────────────────────────────────────
  getVehiclesForGuardian(guardianId: string): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  saveVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle>;
  setActiveVehicle(vehicleId: string, guardianId: string): Promise<void>;

  // ── Authorized pickups ────────────────────────────────────
  getAuthorizedPickups(guardianId: string): Promise<AuthorizedPickup[]>;

  // ── Pickup requests ───────────────────────────────────────
  createPickupRequest(params: CreatePickupRequestParams): Promise<PickupRequest>;
  getActiveRequestsForGuardian(guardianId: string): Promise<PickupRequest[]>;
  cancelPickupRequest(requestId: string): Promise<void>;

  // ── Staff: dismissal queue ────────────────────────────────
  getDismissalQueue(): Promise<QueueEntry[]>;
  advanceRequestStatus(requestId: string): Promise<PickupRequest>;

  // ── Staff: early pickup approvals ─────────────────────────
  getEarlyPickupApprovals(): Promise<EarlyPickupApproval[]>;
  approveEarlyPickup(approvalId: string, reviewerId: string): Promise<EarlyPickupApproval>;
  denyEarlyPickup(approvalId: string, reviewerId: string, note: string): Promise<EarlyPickupApproval>;

  // ── Notifications ─────────────────────────────────────────
  getNotifications(guardianId: string): Promise<Notification[]>;
  markNotificationRead(notificationId: string): Promise<void>;

  // ── Real-time subscription ────────────────────────────────
  subscribeToQueueChanges(callback: (queue: QueueEntry[]) => void): () => void;
  subscribeToRequestStatus(requestId: string, callback: (status: PickupStatus) => void): () => void;
}
