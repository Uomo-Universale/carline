import { supabase } from '../lib/supabase';
import type {
  Student, Guardian, Vehicle, PickupRequest, AuthorizedPickup,
  EarlyPickupApproval, QueueEntry, Notification, PickupStatus, PickupType,
} from '../models';
import type { DataSource, CreatePickupRequestParams } from './DataSource';

// ── Row → Model mappers ──────────────────────────────────────────────────────

function mapStudent(r: any): Student {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    grade: r.grade,
    homeroom: r.homeroom,
    teacherName: r.teacher_name,
    tintIndex: r.tint_index,
  };
}

function mapGuardian(r: any, studentIds: string[]): Guardian {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    phone: r.phone ?? '',
    email: r.email ?? '',
    studentIds,
    isPrimary: r.is_primary,
  };
}

function mapVehicle(r: any): Vehicle {
  return {
    id: r.id,
    guardianId: r.guardian_id,
    year: r.year,
    make: r.make,
    model: r.model,
    color: r.color,
    colorHex: r.color_hex,
    plate: r.plate,
    state: r.state,
    isActive: r.is_active,
  };
}

function mapQueueEntry(r: any): QueueEntry {
  return {
    requestId:     r.request_id,
    studentId:     r.student_id,
    guardianId:    r.guardian_id,
    vehicleId:     r.vehicle_id ?? undefined,
    pickupType:    r.pickup_type as PickupType,
    status:        r.status as PickupStatus,
    arrivedAt:     r.arrived_at,
    releasedAt:    r.released_at  ?? undefined,
    queuePosition: r.queue_position,
    group:         r.group_num    ?? undefined,
    position:      r.position_num ?? undefined,
    busPlate:      r.bus_plate    ?? undefined,
    alert:         r.alert        ?? undefined,
    pickupPerson:  r.pickup_person ?? undefined,
    manualPlate:   r.manual_plate  ?? undefined,
  };
}

function mapApproval(r: any): EarlyPickupApproval {
  return {
    id:          r.id,
    requestId:   r.request_id,
    studentId:   r.student_id,
    guardianId:  r.guardian_id,
    pickupTime:  r.pickup_time,
    reason:      r.reason ?? 'other',
    note:        r.note ?? undefined,
    submittedAt: r.submitted_at,
    status:      r.status,
    reviewedBy:  r.reviewed_by ?? undefined,
    denialNote:  r.denial_note ?? undefined,
  };
}

function now12h() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ── SupabaseDataSource ───────────────────────────────────────────────────────

export class SupabaseDataSource implements DataSource {

  // Fallback used only when no auth session exists (demo / dev mode)
  private _currentGuardianId = 'g1';

  // ── Guardian / auth ──────────────────────────────────────────────────────

  async getCurrentGuardian(): Promise<Guardian> {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles').select('guardian_id').eq('id', user.id).single();
      if (profile?.guardian_id) this._currentGuardianId = profile.guardian_id;
    }
    const g = await this.getGuardianById(this._currentGuardianId);
    if (!g) throw new Error('Current guardian not found');
    return g;
  }

  async getGuardianById(id: string): Promise<Guardian | null> {
    const { data, error } = await supabase.from('guardians').select('*').eq('id', id).single();
    if (error || !data) return null;
    const studentIds = await this._studentIdsFor(id);
    return mapGuardian(data, studentIds);
  }

  // ── Students ─────────────────────────────────────────────────────────────

  async getStudentsForGuardian(guardianId: string): Promise<Student[]> {
    const ids = await this._studentIdsFor(guardianId);
    if (!ids.length) return [];
    const { data } = await supabase.from('students').select('*').in('id', ids);
    return (data ?? []).map(mapStudent);
  }

  async getAllStudents(): Promise<Student[]> {
    const { data } = await supabase.from('students').select('*').order('last_name');
    return (data ?? []).map(mapStudent);
  }

  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapStudent(data);
  }

  // ── Vehicles ─────────────────────────────────────────────────────────────

  async getVehiclesForGuardian(guardianId: string): Promise<Vehicle[]> {
    const { data } = await supabase
      .from('vehicles').select('*').eq('guardian_id', guardianId).order('created_at');
    return (data ?? []).map(mapVehicle);
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapVehicle(data);
  }

  async saveVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        guardian_id: vehicle.guardianId,
        year: vehicle.year, make: vehicle.make, model: vehicle.model,
        color: vehicle.color, color_hex: vehicle.colorHex,
        plate: vehicle.plate, state: vehicle.state, is_active: vehicle.isActive,
      })
      .select().single();
    if (error || !data) throw new Error(`saveVehicle: ${error?.message}`);
    return mapVehicle(data);
  }

  async setActiveVehicle(vehicleId: string, guardianId: string): Promise<void> {
    await supabase.from('vehicles').update({ is_active: false }).eq('guardian_id', guardianId);
    await supabase.from('vehicles').update({ is_active: true }).eq('id', vehicleId);
  }

  // ── Authorized pickups ────────────────────────────────────────────────────

  async getAuthorizedPickups(guardianId: string): Promise<AuthorizedPickup[]> {
    const { data } = await supabase
      .from('authorized_pickups').select('*').eq('guardian_id', guardianId);
    return (data ?? []).map((r: any) => ({
      id: r.id, name: r.name, relation: r.relation,
      isPrimary: r.is_primary, studentIds: r.student_ids ?? [],
    }));
  }

  // ── Pickup requests ───────────────────────────────────────────────────────

  async createPickupRequest(params: CreatePickupRequestParams): Promise<PickupRequest> {
    const requestId = `req-${Date.now()}`;
    const arrivedAt = now12h();
    const rows = params.studentIds.map(studentId => ({
      request_id:    requestId,
      student_id:    studentId,
      guardian_id:   params.guardianId,
      vehicle_id:    params.vehicleId ?? null,
      pickup_type:   params.type,
      status:        'arrived',
      arrived_at:    arrivedAt,
      queue_position: 0,
      pickup_person: params.pickupPersonName ?? null,
      manual_plate:  params.manualPlate ?? null,
    }));

    const { error } = await supabase.from('queue_entries').insert(rows);
    if (error) throw new Error(`createPickupRequest: ${error.message}`);

    if (params.type === 'early' && params.earlyPickupReason) {
      const approvals = params.studentIds.map(studentId => ({
        request_id:  requestId,
        student_id:  studentId,
        guardian_id: params.guardianId,
        pickup_time: params.earlyPickupTime ?? '',
        reason:      params.earlyPickupReason!,
        note:        params.earlyPickupNote ?? null,
        status:      'pending',
      }));
      await supabase.from('early_pickup_approvals').insert(approvals);
    }

    return {
      id: requestId,
      guardianId: params.guardianId,
      studentIds: params.studentIds,
      vehicleId: params.vehicleId,
      type: params.type,
      status: 'arrived' as PickupStatus,
      requestedAt: new Date().toISOString(),
    };
  }

  async createBusRequest(studentIds: string[], busPlate?: string): Promise<void> {
    const requestId = `bus-${Date.now()}`;
    const arrivedAt = now12h();
    const rows = studentIds.map(studentId => ({
      request_id:    requestId,
      student_id:    studentId,
      guardian_id:   '',
      vehicle_id:    null,
      pickup_type:   'bus',
      status:        'arrived',
      arrived_at:    arrivedAt,
      queue_position: 0,
      bus_plate:     busPlate ?? null,
    }));
    const { error } = await supabase.from('queue_entries').insert(rows);
    if (error) throw new Error(`createBusRequest: ${error.message}`);
  }

  async getActiveRequestsForGuardian(guardianId: string): Promise<PickupRequest[]> {
    const { data } = await supabase
      .from('queue_entries')
      .select('*')
      .eq('guardian_id', guardianId)
      .neq('status', 'released');

    const grouped = new Map<string, any[]>();
    for (const row of data ?? []) {
      if (!grouped.has(row.request_id)) grouped.set(row.request_id, []);
      grouped.get(row.request_id)!.push(row);
    }

    return Array.from(grouped.entries()).map(([requestId, rows]) => ({
      id:          requestId,
      guardianId,
      studentIds:  rows.map(r => r.student_id),
      vehicleId:   rows[0].vehicle_id ?? undefined,
      type:        rows[0].pickup_type as PickupType,
      status:      rows[0].status as PickupStatus,
      requestedAt: rows[0].created_at,
    }));
  }

  async cancelPickupRequest(requestId: string): Promise<void> {
    await supabase.from('queue_entries').delete().eq('request_id', requestId);
  }

  // ── Staff: dismissal queue ────────────────────────────────────────────────

  async getDismissalQueue(): Promise<QueueEntry[]> {
    const { data, error } = await supabase
      .from('queue_entries')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw new Error(`getDismissalQueue: ${error.message}`);
    return (data ?? []).map(mapQueueEntry);
  }

  async advanceRequestStatus(requestId: string): Promise<PickupRequest> {
    const { data } = await supabase
      .from('queue_entries').select('status').eq('request_id', requestId).limit(1);
    const current = data?.[0]?.status as PickupStatus;
    const NEXT: Record<string, PickupStatus> = { arrived: 'called', called: 'released' };
    const next = NEXT[current];
    if (!next) throw new Error(`Cannot advance from "${current}"`);
    const update: any = { status: next };
    if (next === 'released') update.released_at = now12h();
    await supabase.from('queue_entries').update(update).eq('request_id', requestId);
    return { id: requestId, guardianId: '', studentIds: [], type: 'carline', status: next, requestedAt: '' };
  }

  async setRequestStatus(requestId: string, status: PickupStatus): Promise<PickupRequest> {
    const update: any = { status };
    if (status === 'released') update.released_at = now12h();
    await supabase.from('queue_entries').update(update).eq('request_id', requestId);
    return { id: requestId, guardianId: '', studentIds: [], type: 'carline', status, requestedAt: '' };
  }

  async setGroupAndPosition(requestId: string, studentId: string, group: number, position: number): Promise<void> {
    await supabase
      .from('queue_entries')
      .update({ group_num: group, position_num: position })
      .eq('request_id', requestId)
      .eq('student_id', studentId);
  }

  // ── Staff: early pickup approvals ─────────────────────────────────────────

  async getEarlyPickupApprovals(): Promise<EarlyPickupApproval[]> {
    const { data, error } = await supabase
      .from('early_pickup_approvals').select('*').order('submitted_at', { ascending: false });
    if (error) throw new Error(`getEarlyPickupApprovals: ${error.message}`);
    return (data ?? []).map(mapApproval);
  }

  async approveEarlyPickup(approvalId: string, reviewerId: string): Promise<EarlyPickupApproval> {
    const { data, error } = await supabase
      .from('early_pickup_approvals')
      .update({ status: 'approved', reviewed_by: reviewerId })
      .eq('id', approvalId).select().single();
    if (error || !data) throw new Error(`approveEarlyPickup: ${error?.message}`);
    return mapApproval(data);
  }

  async denyEarlyPickup(approvalId: string, reviewerId: string, note: string): Promise<EarlyPickupApproval> {
    const { data, error } = await supabase
      .from('early_pickup_approvals')
      .update({ status: 'denied', reviewed_by: reviewerId, denial_note: note })
      .eq('id', approvalId).select().single();
    if (error || !data) throw new Error(`denyEarlyPickup: ${error?.message}`);
    return mapApproval(data);
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  async getNotifications(guardianId: string): Promise<Notification[]> {
    const { data } = await supabase
      .from('notifications').select('*').eq('guardian_id', guardianId)
      .order('created_at', { ascending: false });
    return (data ?? []).map((r: any) => ({
      id: r.id, type: r.type, title: r.title, body: r.body,
      targetStudentId: r.target_student_id ?? undefined,
      createdAt: r.created_at, read: r.read,
    }));
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
  }

  // ── Real-time subscriptions ───────────────────────────────────────────────

  subscribeToQueueChanges(callback: (queue: QueueEntry[]) => void): () => void {
    this.getDismissalQueue().then(callback).catch(console.error);

    const channel = supabase
      .channel('queue_entries_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_entries' }, () => {
        this.getDismissalQueue().then(callback).catch(console.error);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }

  subscribeToRequestStatus(requestId: string, callback: (status: PickupStatus) => void): () => void {
    supabase
      .from('queue_entries').select('status').eq('request_id', requestId).limit(1)
      .then(({ data }) => { if (data?.[0]) callback(data[0].status as PickupStatus); });

    const channel = supabase
      .channel(`req_status_${requestId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'queue_entries' },
        (payload) => {
          if (payload.new?.request_id === requestId && payload.new?.status) {
            callback(payload.new.status as PickupStatus);
          }
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async _studentIdsFor(guardianId: string): Promise<string[]> {
    const { data } = await supabase
      .from('guardian_students').select('student_id').eq('guardian_id', guardianId);
    return (data ?? []).map((r: any) => r.student_id);
  }
}
