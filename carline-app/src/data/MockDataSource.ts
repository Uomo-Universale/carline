// CarLine — MockDataSource
// In-memory seed data used during development and Expo Go testing.
// Swap for VeracrossDataSource (or a real backend adapter) by updating provider.ts.

import type {
  Student, Guardian, Vehicle, PickupRequest, AuthorizedPickup,
  EarlyPickupApproval, QueueEntry, Notification, PickupStatus,
} from '../models';
import type { DataSource, CreatePickupRequestParams } from './DataSource';

// ── Seed data ────────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  { id: 's1', firstName: 'Naomi',   lastName: 'Levin',     grade: '3rd grade',    homeroom: '3-B', teacherName: 'Mrs. Cohen',   tintIndex: 0 },
  { id: 's2', firstName: 'Eli',     lastName: 'Levin',     grade: 'Kindergarten', homeroom: 'K-A', teacherName: 'Ms. Stein',    tintIndex: 1 },
  { id: 's3', firstName: 'Mira',    lastName: 'Abramson',  grade: '1st grade',    homeroom: '1-A', teacherName: 'Mrs. Kaplan',  tintIndex: 2 },
  { id: 's4', firstName: 'Asher',   lastName: 'Goldberg',  grade: '4th grade',    homeroom: '4-B', teacherName: 'Mr. Friedman', tintIndex: 3 },
  { id: 's5', firstName: 'Yael',    lastName: 'Roth',      grade: '2nd grade',    homeroom: '2-A', teacherName: 'Mrs. Adler',   tintIndex: 4 },
  { id: 's6', firstName: 'Daniel',  lastName: 'Weisman',   grade: '5th grade',    homeroom: '5-A', teacherName: 'Mr. Stern',    tintIndex: 0 },
  { id: 's7', firstName: 'Hannah',  lastName: 'Berkowitz', grade: '3rd grade',    homeroom: '3-A', teacherName: 'Mrs. Cohen',   tintIndex: 1 },
  { id: 's8', firstName: 'Sam',     lastName: 'Friedman',  grade: 'Kindergarten', homeroom: 'K-B', teacherName: 'Ms. Wexler',   tintIndex: 2 },
  { id: 's9', firstName: 'Ava',     lastName: 'Klein',     grade: '2nd grade',    homeroom: '2-B', teacherName: 'Mrs. Adler',   tintIndex: 3 },
  { id: 's10',firstName: 'Levi',    lastName: 'Cohen',     grade: '5th grade',    homeroom: '5-B', teacherName: 'Mr. Stern',    tintIndex: 4 },
  { id: 's11',firstName: 'Maya',    lastName: 'Shapiro',   grade: '4th grade',    homeroom: '4-A', teacherName: 'Mr. Friedman', tintIndex: 2 },
  { id: 's12',firstName: 'Noah',    lastName: 'Stern',     grade: '2nd grade',    homeroom: '2-B', teacherName: 'Mrs. Adler',   tintIndex: 3 },
  { id: 's13',firstName: 'Leah',    lastName: 'Weiss',     grade: 'Kindergarten', homeroom: 'K-B', teacherName: 'Ms. Wexler',   tintIndex: 0 },
];

const GUARDIANS: Guardian[] = [
  { id: 'g1', firstName: 'Sarah',  lastName: 'Levin',     phone: '+1 (917) 555-0142', email: 'sarah@levin.com',    studentIds: ['s1', 's2'], isPrimary: true },
  { id: 'g2', firstName: 'David',  lastName: 'Abramson',  phone: '+1 (917) 555-0199', email: 'david@abramson.com', studentIds: ['s3'],       isPrimary: true },
  { id: 'g3', firstName: 'Rachel', lastName: 'Goldberg',  phone: '+1 (917) 555-0211', email: 'rachel@rg.com',      studentIds: ['s4'],       isPrimary: true },
  { id: 'g4', firstName: 'Esther', lastName: 'Roth',      phone: '+1 (917) 555-0233', email: 'esther@roth.com',    studentIds: ['s5'],       isPrimary: false },
  { id: 'g5', firstName: 'Avi',    lastName: 'Weisman',   phone: '+1 (917) 555-0244', email: 'avi@weisman.com',    studentIds: ['s6'],       isPrimary: true },
  { id: 'g6', firstName: 'Miriam', lastName: 'Berkowitz', phone: '+1 (917) 555-0255', email: 'miriam@berk.com',    studentIds: ['s7'],       isPrimary: true },
  { id: 'g7', firstName: 'Joel',   lastName: 'Friedman',  phone: '+1 (917) 555-0266', email: 'joel@friedman.com',  studentIds: ['s8'],       isPrimary: true },
  { id: 'g8', firstName: 'Talia',  lastName: 'Klein',     phone: '+1 (917) 555-0277', email: 'talia@klein.com',    studentIds: ['s9'],       isPrimary: true },
];

const VEHICLES: Vehicle[] = [
  { id: 'v1', guardianId: 'g1', year: '2022', make: 'Subaru',   model: 'Outback',      color: 'Forest Green', colorHex: '#2F5A3A', plate: 'RDS 7821', state: 'NY', isActive: true },
  { id: 'v2', guardianId: 'g2', year: '2020', make: 'Honda',    model: 'Odyssey',      color: 'White',        colorHex: '#F2EEE5', plate: 'HQR 4421', state: 'NY', isActive: true },
  { id: 'v3', guardianId: 'g3', year: '2021', make: 'Toyota',   model: 'Highlander',   color: 'Charcoal',     colorHex: '#2B2B30', plate: '9LMK 02',  state: 'NY', isActive: true },
  { id: 'v4', guardianId: 'g4', year: '2023', make: 'Tesla',    model: 'Model Y',      color: 'Silver',       colorHex: '#B8BCC2', plate: 'JK 88123', state: 'NY', isActive: true },
  { id: 'v5', guardianId: 'g5', year: '2019', make: 'Volvo',    model: 'XC60',         color: 'Navy',         colorHex: '#1F3A5F', plate: 'HRT 0044', state: 'NY', isActive: true },
  { id: 'v6', guardianId: 'g6', year: '2020', make: 'Mazda',    model: 'CX-5',         color: 'Red',          colorHex: '#A8392E', plate: 'GHA 7710', state: 'NY', isActive: true },
  { id: 'v7', guardianId: 'g7', year: '2021', make: 'Lexus',    model: 'RX',           color: 'Beige',        colorHex: '#D8C39A', plate: 'BBQ 1019', state: 'NY', isActive: true },
  { id: 'v8', guardianId: 'g8', year: '2022', make: 'Honda',    model: 'Pilot',        color: 'White',        colorHex: '#F2EEE5', plate: 'AVA 0001', state: 'NY', isActive: true },
];

const AUTHORIZED_PICKUPS: AuthorizedPickup[] = [
  { id: 'ap1', name: 'Sarah Levin',  relation: 'Mother',      isPrimary: true,  studentIds: ['s1', 's2'] },
  { id: 'ap2', name: 'David Levin',  relation: 'Father',      isPrimary: true,  studentIds: ['s1', 's2'] },
  { id: 'ap3', name: 'Rachel Adler', relation: 'Aunt',        isPrimary: false, studentIds: ['s1', 's2'] },
  { id: 'ap4', name: 'Mike Levin',   relation: 'Grandfather', isPrimary: false, studentIds: ['s2'] },
];

const EARLY_PICKUP_APPROVALS: EarlyPickupApproval[] = [
  { id: 'ea1', requestId: 'req-ep1', studentId: 's1', guardianId: 'g1', pickupTime: '2:15', reason: 'doctor',   note: 'Orthodontist on Atlantic Ave',           submittedAt: '2026-05-28T08:12:00Z', status: 'pending' },
  { id: 'ea2', requestId: 'req-ep2', studentId: 's4', guardianId: 'g3', pickupTime: '1:30', reason: 'family',   note: "Cousin's bat mitzvah rehearsal",          submittedAt: '2026-05-27T16:40:00Z', status: 'approved' },
  { id: 'ea3', requestId: 'req-ep3', studentId: 's7', guardianId: 'g6', pickupTime: '11:00', reason: 'doctor',  note: 'Pediatrician — Dr. Schwartz',             submittedAt: '2026-05-28T07:45:00Z', status: 'pending' },
];

// ── Live queue simulation ─────────────────────────────────────────────────────

let _queueEntries: QueueEntry[] = [
  { requestId: 'q1',   studentId: 's1',  guardianId: 'g1', vehicleId: 'v1', pickupType: 'carline', status: 'called',   arrivedAt: '3:22 PM', queuePosition: 1, group: 1, position: 2 },
  { requestId: 'q2',   studentId: 's2',  guardianId: 'g1', vehicleId: 'v1', pickupType: 'carline', status: 'called',   arrivedAt: '3:22 PM', queuePosition: 1, group: 1, position: 2 },
  { requestId: 'q3',   studentId: 's3',  guardianId: 'g2', vehicleId: 'v2', pickupType: 'carline', status: 'arrived',  arrivedAt: '3:23 PM', queuePosition: 2 },
  { requestId: 'q4',   studentId: 's4',  guardianId: 'g3', vehicleId: 'v3', pickupType: 'carline', status: 'arrived',  arrivedAt: '3:24 PM', queuePosition: 3 },
  { requestId: 'q5',   studentId: 's5',  guardianId: 'g4', vehicleId: 'v4', pickupType: 'carline', status: 'arrived',  arrivedAt: '3:25 PM', queuePosition: 4, alert: 'Approved pickup: Aunt' },
  { requestId: 'q6',   studentId: 's7',  guardianId: 'g6', vehicleId: 'v6', pickupType: 'carline', status: 'arrived',  arrivedAt: '3:26 PM', queuePosition: 5 },
  { requestId: 'qw1',  studentId: 's6',  guardianId: 'g5', vehicleId: undefined, pickupType: 'walkin', status: 'arrived', arrivedAt: '3:24 PM', queuePosition: 0 },
  { requestId: 'qe1',  studentId: 's9',  guardianId: 'g8', vehicleId: undefined, pickupType: 'early',  status: 'arrived', arrivedAt: '2:45 PM', queuePosition: 0 },
  { requestId: 'q8',   studentId: 's8',  guardianId: 'g7', vehicleId: 'v7', pickupType: 'carline', status: 'released', arrivedAt: '3:27 PM', queuePosition: 0 },
  { requestId: 'bus1', studentId: 's10', guardianId: '',   vehicleId: undefined, pickupType: 'bus', status: 'arrived',  arrivedAt: '3:30 PM', queuePosition: 0 },
  { requestId: 'bus2', studentId: 's11', guardianId: '',   vehicleId: undefined, pickupType: 'bus', status: 'arrived',  arrivedAt: '3:30 PM', queuePosition: 0 },
  { requestId: 'bus3', studentId: 's12', guardianId: '',   vehicleId: undefined, pickupType: 'bus', status: 'arrived',  arrivedAt: '3:30 PM', queuePosition: 0 },
  { requestId: 'bus4', studentId: 's13', guardianId: '',   vehicleId: undefined, pickupType: 'bus', status: 'released', arrivedAt: '3:15 PM', queuePosition: 0 },
];

let _activeRequests: PickupRequest[] = [];
let _nextRequestId = 1000;

// Simple pub/sub for real-time queue updates
type Listener<T> = (data: T) => void;
const _queueListeners = new Set<Listener<QueueEntry[]>>();
const _statusListeners = new Map<string, Set<Listener<PickupStatus>>>();

function notifyQueueListeners() {
  _queueListeners.forEach(fn => fn([..._queueEntries]));
}

// ── MockDataSource ────────────────────────────────────────────────────────────

export class MockDataSource implements DataSource {
  private _currentGuardianId = 'g1';   // Change to simulate different guardians

  async getCurrentGuardian() {
    return GUARDIANS.find(g => g.id === this._currentGuardianId)!;
  }

  async getGuardianById(id: string) {
    return GUARDIANS.find(g => g.id === id) ?? null;
  }

  async getStudentsForGuardian(guardianId: string) {
    const guardian = GUARDIANS.find(g => g.id === guardianId);
    if (!guardian) return [];
    return STUDENTS.filter(s => guardian.studentIds.includes(s.id));
  }

  async getStudentById(id: string) {
    return STUDENTS.find(s => s.id === id) ?? null;
  }

  async getVehiclesForGuardian(guardianId: string) {
    return VEHICLES.filter(v => v.guardianId === guardianId);
  }

  async getVehicleById(id: string) {
    return VEHICLES.find(v => v.id === id) ?? null;
  }

  async saveVehicle(vehicle: Omit<Vehicle, 'id'>) {
    const newVehicle: Vehicle = { ...vehicle, id: `v${Date.now()}` };
    VEHICLES.push(newVehicle);
    return newVehicle;
  }

  async setActiveVehicle(vehicleId: string, guardianId: string) {
    VEHICLES.forEach(v => {
      if (v.guardianId === guardianId) v.isActive = v.id === vehicleId;
    });
  }

  async getAuthorizedPickups(_guardianId: string) {
    return [...AUTHORIZED_PICKUPS];
  }

  async createPickupRequest(params: CreatePickupRequestParams): Promise<PickupRequest> {
    const id = `req-${++_nextRequestId}`;
    const now = new Date().toISOString();
    const request: PickupRequest = {
      id,
      guardianId: params.guardianId,
      studentIds: params.studentIds,
      vehicleId: params.vehicleId,
      type: params.type,
      status: 'requested',
      requestedAt: now,
      earlyPickupTime: params.earlyPickupTime,
      earlyPickupReason: params.earlyPickupReason,
      earlyPickupNote: params.earlyPickupNote,
      approvalStatus: params.type === 'early' ? 'pending' : undefined,
    };
    _activeRequests.push(request);

    if (params.type === 'carline' || params.type === 'walkin' || params.type === 'early') {
      const newEntries: QueueEntry[] = params.studentIds.map(studentId => ({
        requestId: id,
        studentId,
        guardianId: params.guardianId,
        vehicleId: params.vehicleId,
        pickupType: params.type,
        status: 'arrived' as PickupStatus,
        arrivedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        queuePosition: _queueEntries.filter(q => q.status !== 'released').length + 1,
      }));
      newEntries.forEach(e => { _queueEntries.push(e); });
      notifyQueueListeners();
      const reqListeners = _statusListeners.get(id);
      if (reqListeners) reqListeners.forEach(fn => fn('arrived'));
    }

    return request;
  }

  async getActiveRequestsForGuardian(guardianId: string) {
    return _activeRequests.filter(r => r.guardianId === guardianId && r.status !== 'released');
  }

  async cancelPickupRequest(requestId: string) {
    _activeRequests = _activeRequests.filter(r => r.id !== requestId);
    _queueEntries = _queueEntries.filter(e => e.requestId !== requestId);
    notifyQueueListeners();
  }

  async createBusRequest(studentIds: string[], busPlate?: string): Promise<void> {
    const id = `bus-${++_nextRequestId}`;
    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const newEntries: QueueEntry[] = studentIds.map(studentId => ({
      requestId: id,
      studentId,
      guardianId: '',
      vehicleId: undefined,
      pickupType: 'bus' as PickupStatus,
      status: 'arrived' as PickupStatus,
      arrivedAt: now,
      queuePosition: 0,
      busPlate,
    }));
    _queueEntries.push(...newEntries);
    notifyQueueListeners();
  }

  async getDismissalQueue() {
    return [..._queueEntries];
  }

  async advanceRequestStatus(requestId: string): Promise<PickupRequest> {
    const NEXT: Record<string, PickupStatus> = {
      arrived: 'called',
      called: 'released',
    };
    _queueEntries = _queueEntries.map(e => {
      if (e.requestId !== requestId) return e;
      const next = NEXT[e.status];
      if (!next) return e;
      return { ...e, status: next, queuePosition: next === 'released' ? 0 : e.queuePosition };
    });
    notifyQueueListeners();

    // Notify per-request listeners
    const newEntry = _queueEntries.find(e => e.requestId === requestId);
    if (newEntry) {
      const listeners = _statusListeners.get(requestId);
      if (listeners) listeners.forEach(fn => fn(newEntry.status));
    }

    const req = _activeRequests.find(r => r.id === requestId);
    return req ?? { id: requestId, guardianId: '', studentIds: [], type: 'carline', status: newEntry?.status ?? 'released', requestedAt: '' };
  }

  async setGroupAndPosition(requestId: string, studentId: string, group: number, position: number): Promise<void> {
    _queueEntries = _queueEntries.map(e =>
      e.requestId === requestId && e.studentId === studentId ? { ...e, group, position } : e
    );
    notifyQueueListeners();
  }

  async setRequestStatus(requestId: string, status: PickupStatus): Promise<PickupRequest> {
    _queueEntries = _queueEntries.map(e =>
      e.requestId === requestId ? { ...e, status, queuePosition: status === 'released' ? 0 : e.queuePosition } : e
    );
    notifyQueueListeners();
    const newEntry = _queueEntries.find(e => e.requestId === requestId);
    if (newEntry) {
      const listeners = _statusListeners.get(requestId);
      if (listeners) listeners.forEach(fn => fn(newEntry.status));
    }
    const req = _activeRequests.find(r => r.id === requestId);
    return req ?? { id: requestId, guardianId: '', studentIds: [], type: 'carline', status, requestedAt: '' };
  }

  async getEarlyPickupApprovals() {
    return [...EARLY_PICKUP_APPROVALS];
  }

  async approveEarlyPickup(approvalId: string, reviewerId: string) {
    const a = EARLY_PICKUP_APPROVALS.find(x => x.id === approvalId);
    if (!a) throw new Error('Approval not found');
    a.status = 'approved';
    a.reviewedBy = reviewerId;
    return { ...a };
  }

  async denyEarlyPickup(approvalId: string, reviewerId: string, note: string) {
    const a = EARLY_PICKUP_APPROVALS.find(x => x.id === approvalId);
    if (!a) throw new Error('Approval not found');
    a.status = 'denied';
    a.reviewedBy = reviewerId;
    a.denialNote = note;
    return { ...a };
  }

  async getNotifications(_guardianId: string): Promise<Notification[]> {
    return [];
  }

  async markNotificationRead(_notificationId: string) {}

  subscribeToQueueChanges(callback: (queue: QueueEntry[]) => void) {
    _queueListeners.add(callback);
    callback([..._queueEntries]);
    return () => { _queueListeners.delete(callback); };
  }

  subscribeToRequestStatus(requestId: string, callback: (status: PickupStatus) => void) {
    if (!_statusListeners.has(requestId)) _statusListeners.set(requestId, new Set());
    const set = _statusListeners.get(requestId)!;
    set.add(callback);
    // Emit current status immediately
    const entry = _queueEntries.find(e => e.requestId === requestId);
    if (entry) callback(entry.status);
    return () => { set.delete(callback); };
  }

  // Helper for seed data lookups (used by screens)
  getStudentSync(id: string) { return STUDENTS.find(s => s.id === id); }
  getGuardianSync(id: string) { return GUARDIANS.find(g => g.id === id); }
  getVehicleSync(id: string) { return VEHICLES.find(v => v.id === id); }
}
