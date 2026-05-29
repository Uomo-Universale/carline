// CarLine — SupabaseDataSource
// Drop-in replacement for MockDataSource. Switch by updating provider.ts.
//
// To activate:
//   import { SupabaseDataSource } from './SupabaseDataSource';
//   export const dataSource: DataSource = new SupabaseDataSource();

import { supabase } from '../lib/supabase';
import type {
  Student,
  Guardian,
  Vehicle,
  PickupRequest,
  AuthorizedPickup,
  EarlyPickupApproval,
  QueueEntry,
  Notification,
  PickupStatus,
} from '../models';
import type { DataSource, CreatePickupRequestParams } from './DataSource';

// ── DB row types (snake_case from Supabase) ──────────────────────────────────

interface DbStudent {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  homeroom: string;
  teacher_name: string;
  tint_index: number;
  veracross_id: string | null;
  created_at: string;
  updated_at: string;
}

interface DbGuardian {
  id: string;
  auth_user_id: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  is_primary: boolean;
  role: 'guardian' | 'staff' | 'admin';
  expo_push_token: string | null;
  veracross_id: string | null;
  created_at: string;
  updated_at: string;
}

interface DbVehicle {
  id: string;
  guardian_id: string;
  year: string;
  make: string;
  model: string;
  color: string;
  color_hex: string;
  plate: string;
  state: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DbAuthorizedPickup {
  id: string;
  guardian_id: string;
  name: string;
  relation: string;
  is_primary: boolean;
  student_ids: string[];
  veracross_id: string | null;
  created_at: string;
  updated_at: string;
}

interface DbPickupRequest {
  id: string;
  guardian_id: string;
  vehicle_id: string | null;
  type: 'carline' | 'walkin' | 'early' | 'message';
  status: PickupStatus;
  student_ids: string[];
  queue_position: number | null;
  requested_at: string;
  arrived_at: string | null;
  called_at: string | null;
  released_at: string | null;
  early_pickup_time: string | null;
  early_pickup_reason: 'doctor' | 'family' | 'religious' | 'other' | null;
  early_pickup_note: string | null;
  approval_status: 'pending' | 'approved' | 'denied' | null;
  created_at: string;
  updated_at: string;
}

interface DbEarlyPickupApproval {
  id: string;
  request_id: string;
  student_id: string;
  guardian_id: string;
  pickup_time: string;
  reason: 'doctor' | 'family' | 'religious' | 'other' | null;
  note: string | null;
  submitted_at: string;
  status: 'pending' | 'approved' | 'denied';
  reviewed_by: string | null;
  denial_note: string | null;
  created_at: string;
  updated_at: string;
}

interface DbNotification {
  id: string;
  guardian_id: string;
  type: 'status_change' | 'early_pickup_approved' | 'early_pickup_denied';
  title: string;
  body: string;
  target_student_id: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

// ── Mappers: DB row → TypeScript model ──────────────────────────────────────

function mapStudent(row: DbStudent): Student {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    grade: row.grade,
    homeroom: row.homeroom,
    teacherName: row.teacher_name,
    tintIndex: row.tint_index,
  };
}

function mapGuardian(row: DbGuardian, studentIds: string[]): Guardian {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? '',
    email: row.email,
    studentIds,
    isPrimary: row.is_primary,
  };
}

function mapVehicle(row: DbVehicle): Vehicle {
  return {
    id: row.id,
    guardianId: row.guardian_id,
    year: row.year,
    make: row.make,
    model: row.model,
    color: row.color,
    colorHex: row.color_hex,
    plate: row.plate,
    state: row.state,
    isActive: row.is_active,
  };
}

function mapAuthorizedPickup(row: DbAuthorizedPickup): AuthorizedPickup {
  return {
    id: row.id,
    name: row.name,
    relation: row.relation,
    isPrimary: row.is_primary,
    studentIds: row.student_ids ?? [],
  };
}

function mapPickupRequest(row: DbPickupRequest): PickupRequest {
  return {
    id: row.id,
    guardianId: row.guardian_id,
    studentIds: row.student_ids ?? [],
    vehicleId: row.vehicle_id ?? undefined,
    type: row.type,
    status: row.status,
    requestedAt: row.requested_at,
    arrivedAt: row.arrived_at ?? undefined,
    calledAt: row.called_at ?? undefined,
    releasedAt: row.released_at ?? undefined,
    queuePosition: row.queue_position ?? undefined,
    earlyPickupTime: row.early_pickup_time ?? undefined,
    earlyPickupReason: row.early_pickup_reason ?? undefined,
    earlyPickupNote: row.early_pickup_note ?? undefined,
    approvalStatus: row.approval_status ?? undefined,
  };
}

function mapEarlyPickupApproval(row: DbEarlyPickupApproval): EarlyPickupApproval {
  return {
    id: row.id,
    requestId: row.request_id,
    studentId: row.student_id,
    guardianId: row.guardian_id,
    pickupTime: row.pickup_time,
    reason: row.reason ?? 'other',
    note: row.note ?? undefined,
    submittedAt: row.submitted_at,
    status: row.status,
    reviewedBy: row.reviewed_by ?? undefined,
    denialNote: row.denial_note ?? undefined,
  };
}

function mapNotification(row: DbNotification): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    targetStudentId: row.target_student_id ?? undefined,
    createdAt: row.created_at,
    read: row.read,
  };
}

/**
 * Formats a pickup_request row into one QueueEntry per student in student_ids.
 * arrivedAt is formatted as a locale time string when arrived_at is present.
 */
function mapPickupRequestToQueueEntries(row: DbPickupRequest): QueueEntry[] {
  const arrivedAt = row.arrived_at
    ? new Date(row.arrived_at).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (row.student_ids ?? []).map((studentId) => ({
    requestId: row.id,
    studentId,
    guardianId: row.guardian_id,
    vehicleId: row.vehicle_id ?? undefined,
    status: row.status,
    arrivedAt,
    queuePosition: row.queue_position ?? 0,
  }));
}

// ── SupabaseDataSource ────────────────────────────────────────────────────────

export class SupabaseDataSource implements DataSource {
  // ── Guardian / auth ────────────────────────────────────────────────────────

  async getCurrentGuardian(): Promise<Guardian> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { data: row, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (error || !row) throw new Error(`Guardian not found: ${error?.message}`);

    const studentIds = await this._getStudentIdsForGuardian(row.id);
    return mapGuardian(row as DbGuardian, studentIds);
  }

  async getGuardianById(id: string): Promise<Guardian | null> {
    const { data: row, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !row) return null;

    const studentIds = await this._getStudentIdsForGuardian(id);
    return mapGuardian(row as DbGuardian, studentIds);
  }

  // ── Students ───────────────────────────────────────────────────────────────

  async getStudentsForGuardian(guardianId: string): Promise<Student[]> {
    // PostgREST dot-notation filter on a joined table is not supported; instead
    // fetch the student IDs via the join table, then query students by those IDs.
    const studentIds = await this._getStudentIdsForGuardian(guardianId);
    if (studentIds.length === 0) return [];

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .in('id', studentIds);

    if (error) throw new Error(`getStudentsForGuardian: ${error.message}`);
    return (data ?? []).map((row) => mapStudent(row as DbStudent));
  }

  async getStudentById(id: string): Promise<Student | null> {
    const { data: row, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !row) return null;
    return mapStudent(row as DbStudent);
  }

  // ── Vehicles ───────────────────────────────────────────────────────────────

  async getVehiclesForGuardian(guardianId: string): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('guardian_id', guardianId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`getVehiclesForGuardian: ${error.message}`);
    return (data ?? []).map((row) => mapVehicle(row as DbVehicle));
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const { data: row, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !row) return null;
    return mapVehicle(row as DbVehicle);
  }

  async saveVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const { data: row, error } = await supabase
      .from('vehicles')
      .insert({
        guardian_id: vehicle.guardianId,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        color_hex: vehicle.colorHex,
        plate: vehicle.plate,
        state: vehicle.state,
        is_active: vehicle.isActive,
      })
      .select()
      .single();

    if (error || !row) throw new Error(`saveVehicle: ${error?.message}`);
    return mapVehicle(row as DbVehicle);
  }

  async setActiveVehicle(vehicleId: string, guardianId: string): Promise<void> {
    // Deactivate all vehicles for this guardian, then activate the chosen one
    const { error: deactivateError } = await supabase
      .from('vehicles')
      .update({ is_active: false })
      .eq('guardian_id', guardianId);

    if (deactivateError) throw new Error(`setActiveVehicle (deactivate): ${deactivateError.message}`);

    const { error: activateError } = await supabase
      .from('vehicles')
      .update({ is_active: true })
      .eq('id', vehicleId)
      .eq('guardian_id', guardianId);

    if (activateError) throw new Error(`setActiveVehicle (activate): ${activateError.message}`);
  }

  // ── Authorized pickups ─────────────────────────────────────────────────────

  async getAuthorizedPickups(guardianId: string): Promise<AuthorizedPickup[]> {
    const { data, error } = await supabase
      .from('authorized_pickups')
      .select('*')
      .eq('guardian_id', guardianId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`getAuthorizedPickups: ${error.message}`);
    return (data ?? []).map((row) => mapAuthorizedPickup(row as DbAuthorizedPickup));
  }

  // ── Pickup requests ────────────────────────────────────────────────────────

  async createPickupRequest(params: CreatePickupRequestParams): Promise<PickupRequest> {
    const { data: row, error } = await supabase
      .from('pickup_requests')
      .insert({
        guardian_id: params.guardianId,
        student_ids: params.studentIds,
        vehicle_id: params.vehicleId ?? null,
        type: params.type,
        status: 'requested',
        early_pickup_time: params.earlyPickupTime ?? null,
        early_pickup_reason: params.earlyPickupReason ?? null,
        early_pickup_note: params.earlyPickupNote ?? null,
        approval_status: params.type === 'early' ? 'pending' : null,
      })
      .select()
      .single();

    if (error || !row) throw new Error(`createPickupRequest: ${error?.message}`);

    // For early pickups, create one approval row per student so staff can review them.
    if (params.type === 'early' && params.earlyPickupReason) {
      const approvalRows = params.studentIds.map((studentId) => ({
        request_id:   row.id,
        student_id:   studentId,
        guardian_id:  params.guardianId,
        pickup_time:  params.earlyPickupTime!,
        reason:       params.earlyPickupReason!,
        note:         params.earlyPickupNote ?? null,
        submitted_at: new Date().toISOString(),
        status:       'pending',
      }));
      const { error: approvalError } = await supabase
        .from('early_pickup_approvals')
        .insert(approvalRows);
      if (approvalError) throw new Error(`createPickupRequest (approval): ${approvalError.message}`);
    }

    return mapPickupRequest(row as DbPickupRequest);
  }

  async getActiveRequestsForGuardian(guardianId: string): Promise<PickupRequest[]> {
    // "Active" means not yet released
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .eq('guardian_id', guardianId)
      .neq('status', 'released')
      .order('requested_at', { ascending: false });

    if (error) throw new Error(`getActiveRequestsForGuardian: ${error.message}`);
    return (data ?? []).map((row) => mapPickupRequest(row as DbPickupRequest));
  }

  async cancelPickupRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('pickup_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw new Error(`cancelPickupRequest: ${error.message}`);
  }

  // ── Staff: dismissal queue ─────────────────────────────────────────────────

  async getDismissalQueue(): Promise<QueueEntry[]> {
    // Return ALL pickup_requests (no status filter, no type filter).
    // Order by arrived_at asc nulls last so the carline queue is in arrival order.
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .order('arrived_at', { ascending: true, nullsFirst: false });

    if (error) throw new Error(`getDismissalQueue: ${error.message}`);

    // Expand each request into one QueueEntry per student
    const entries: QueueEntry[] = [];
    for (const row of data ?? []) {
      entries.push(...mapPickupRequestToQueueEntries(row as DbPickupRequest));
    }
    return entries;
  }

  async advanceRequestStatus(requestId: string): Promise<PickupRequest> {
    // Fetch current status first
    const { data: current, error: fetchError } = await supabase
      .from('pickup_requests')
      .select('status')
      .eq('id', requestId)
      .single();

    if (fetchError || !current) {
      throw new Error(`advanceRequestStatus: request not found — ${fetchError?.message}`);
    }

    const NEXT_STATUS: Record<string, PickupStatus> = {
      arrived: 'called',
      called: 'released',
    };

    const nextStatus = NEXT_STATUS[current.status];
    if (!nextStatus) {
      throw new Error(
        `advanceRequestStatus: cannot advance from status "${current.status}". ` +
        `Must be 'arrived' or 'called'.`,
      );
    }

    const updateFields: Record<string, any> = { status: nextStatus };
    if (nextStatus === 'called') updateFields.called_at = new Date().toISOString();
    if (nextStatus === 'released') updateFields.released_at = new Date().toISOString();

    const { data: updated, error: updateError } = await supabase
      .from('pickup_requests')
      .update(updateFields)
      .eq('id', requestId)
      .select()
      .single();

    if (updateError || !updated) {
      throw new Error(`advanceRequestStatus: update failed — ${updateError?.message}`);
    }

    return mapPickupRequest(updated as DbPickupRequest);
  }

  // ── Staff: early pickup approvals ──────────────────────────────────────────

  async getEarlyPickupApprovals(): Promise<EarlyPickupApproval[]> {
    const { data, error } = await supabase
      .from('early_pickup_approvals')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(`getEarlyPickupApprovals: ${error.message}`);
    return (data ?? []).map((row) => mapEarlyPickupApproval(row as DbEarlyPickupApproval));
  }

  async approveEarlyPickup(approvalId: string, reviewerId: string): Promise<EarlyPickupApproval> {
    const { data: row, error } = await supabase
      .from('early_pickup_approvals')
      .update({ status: 'approved', reviewed_by: reviewerId })
      .eq('id', approvalId)
      .select()
      .single();

    if (error || !row) throw new Error(`approveEarlyPickup: ${error?.message}`);
    return mapEarlyPickupApproval(row as DbEarlyPickupApproval);
  }

  async denyEarlyPickup(
    approvalId: string,
    reviewerId: string,
    note: string,
  ): Promise<EarlyPickupApproval> {
    const { data: row, error } = await supabase
      .from('early_pickup_approvals')
      .update({ status: 'denied', reviewed_by: reviewerId, denial_note: note })
      .eq('id', approvalId)
      .select()
      .single();

    if (error || !row) throw new Error(`denyEarlyPickup: ${error?.message}`);
    return mapEarlyPickupApproval(row as DbEarlyPickupApproval);
  }

  // ── Notifications ──────────────────────────────────────────────────────────

  async getNotifications(guardianId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('guardian_id', guardianId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`getNotifications: ${error.message}`);
    return (data ?? []).map((row) => mapNotification(row as DbNotification));
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw new Error(`markNotificationRead: ${error.message}`);
  }

  // ── Real-time subscriptions ────────────────────────────────────────────────

  subscribeToQueueChanges(callback: (queue: QueueEntry[]) => void): () => void {
    // Initial fetch
    this.getDismissalQueue().then(callback).catch(console.error);

    // Subscribe to any INSERT, UPDATE, or DELETE on pickup_requests.
    // We re-fetch the full queue on every change rather than mapping the
    // Realtime payload directly — this keeps the queue consistent with DB state
    // and handles edge cases like multi-row batch updates.
    const channel = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pickup_requests' },
        () => {
          this.getDismissalQueue().then(callback).catch(console.error);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  subscribeToRequestStatus(
    requestId: string,
    callback: (status: PickupStatus) => void,
  ): () => void {
    // Emit current status immediately
    void Promise.resolve(
      supabase
        .from('pickup_requests')
        .select('status')
        .eq('id', requestId)
        .single(),
    ).then(({ data }) => {
      if (data?.status) callback(data.status as PickupStatus);
    }).catch(console.error);

    // Subscribe to UPDATE events for this specific request
    const channel = supabase
      .channel(`request-status-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pickup_requests',
          filter: `id=eq.${requestId}`,
        },
        (payload) => {
          const newStatus = (payload.new as { status: PickupStatus }).status;
          if (newStatus) callback(newStatus);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async _getStudentIdsForGuardian(guardianId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('guardian_students')
      .select('student_id')
      .eq('guardian_id', guardianId);

    if (error) return [];
    return (data ?? []).map((row) => row.student_id);
  }
}
