// CarLine — TypeScript data models
// FERPA notice: In production, all student data must be sourced through
// school-issued credentials with explicit data-handling agreements in place.

export type PickupStatus = 'arrived' | 'called' | 'released';
export type PickupType = 'carline' | 'walkin' | 'early' | 'bus' | 'message';
export type EarlyPickupReason = 'doctor' | 'family' | 'religious' | 'other';
export type RequestStatus = 'pending' | 'approved' | 'denied';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;          // e.g. "3rd grade"
  homeroom: string;       // e.g. "3-B"
  teacherName: string;    // e.g. "Mrs. Cohen"
  tintIndex: number;      // 0-4 for avatar color selection
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  studentIds: string[];   // which students this guardian can pick up
  isPrimary: boolean;
}

export interface AuthorizedPickup {
  id: string;
  name: string;
  relation: string;       // "Mother", "Father", "Aunt", etc.
  isPrimary: boolean;
  studentIds: string[];   // subset of students this person is approved for
}

export interface Vehicle {
  id: string;
  guardianId: string;
  year: string;
  make: string;
  model: string;
  color: string;
  colorHex: string;
  plate: string;
  state: string;
  isActive: boolean;
}

export interface PickupRequest {
  id: string;
  guardianId: string;
  studentIds: string[];
  vehicleId?: string;
  type: PickupType;
  status: PickupStatus;
  requestedAt: string;    // ISO timestamp
  arrivedAt?: string;
  calledAt?: string;
  releasedAt?: string;
  queuePosition?: number;
  // Early pickup fields
  earlyPickupTime?: string;   // e.g. "2:15"
  earlyPickupReason?: EarlyPickupReason;
  earlyPickupNote?: string;
  approvalStatus?: RequestStatus;
}

export interface EarlyPickupApproval {
  id: string;
  requestId: string;
  studentId: string;
  guardianId: string;
  pickupTime: string;
  reason: EarlyPickupReason;
  note?: string;
  submittedAt: string;
  status: RequestStatus;
  reviewedBy?: string;
  denialNote?: string;
}

export interface QueueEntry {
  requestId: string;
  studentId: string;
  guardianId: string;
  vehicleId?: string;
  pickupType?: PickupType;
  status: PickupStatus;
  arrivedAt: string;
  queuePosition: number;
  group?: number;          // 1–5: holding-area group assigned by staff
  position?: number;       // 1–20: physical spot within the group
  busPlate?: string;       // Bus license plate identifier
  alert?: string;          // e.g. "Approved pickup: Aunt"
  pickupPerson?: string;   // Name of person picking up (staff-initiated entries)
  manualPlate?: string;    // Plate entered by staff for manual pickups
}

export interface Notification {
  id: string;
  type: 'status_change' | 'early_pickup_approved' | 'early_pickup_denied';
  title: string;
  body: string;
  targetStudentId?: string;
  createdAt: string;
  read: boolean;
}
