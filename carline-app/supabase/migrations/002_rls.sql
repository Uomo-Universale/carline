-- ============================================================
-- CarLine — Row Level Security (RLS) Policies
-- Migration 002: FERPA-compliant access control
--
-- FERPA baseline:
--   - A guardian may only see data for students they are
--     linked to via guardian_students.
--   - Staff (role IN ('staff','admin')) may see all student
--     data for operational purposes under the school's
--     FERPA annual notice.
--   - Service-role key (backend / edge functions) bypasses
--     RLS entirely — never expose this key client-side.
-- ============================================================

-- ── Helper functions ──────────────────────────────────────────────────────────

-- Returns the guardians.id that belongs to the currently authenticated user.
-- SECURITY DEFINER so RLS policies can call it without recursing into guardians.
create or replace function public.current_guardian_id()
returns uuid
language sql
security definer
stable
as $$
  select id
  from public.guardians
  where auth_user_id = auth.uid()
  limit 1;
$$;

-- Returns true when the current user has role 'staff' or 'admin'.
-- Staff can see all student/guardian data for carline operations.
create or replace function public.current_user_is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.guardians
    where auth_user_id = auth.uid()
      and role in ('staff', 'admin')
  );
$$;

-- ── Enable RLS ────────────────────────────────────────────────────────────────

alter table public.students              enable row level security;
alter table public.guardian_students     enable row level security;
alter table public.guardians             enable row level security;
alter table public.vehicles              enable row level security;
alter table public.authorized_pickups    enable row level security;
alter table public.pickup_requests       enable row level security;
alter table public.early_pickup_approvals enable row level security;
alter table public.notifications         enable row level security;

-- ── students ─────────────────────────────────────────────────────────────────
--
-- FERPA: A guardian may only read records for students they are
-- linked to via guardian_students. Staff may read all students for
-- queue operations. No guardian may insert, update, or delete students —
-- that is a staff-only operation (Veracross sync / CSV import).

create policy "students: guardian sees own linked students"
  on public.students for select
  using (
    -- guardian has a row in guardian_students linking them to this student
    exists (
      select 1 from public.guardian_students gs
      where gs.student_id = students.id
        and gs.guardian_id = public.current_guardian_id()
    )
    or public.current_user_is_staff()
  );

create policy "students: staff insert"
  on public.students for insert
  with check (public.current_user_is_staff());

create policy "students: staff update"
  on public.students for update
  using  (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "students: staff delete"
  on public.students for delete
  using (public.current_user_is_staff());

-- ── guardian_students ─────────────────────────────────────────────────────────
--
-- FERPA: The junction table itself reveals which students a guardian
-- is linked to — a guardian may only see their own rows.

create policy "guardian_students: own rows or staff"
  on public.guardian_students for select
  using (
    guardian_id = public.current_guardian_id()
    or public.current_user_is_staff()
  );

create policy "guardian_students: staff insert"
  on public.guardian_students for insert
  with check (public.current_user_is_staff());

create policy "guardian_students: staff update"
  on public.guardian_students for update
  using  (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "guardian_students: staff delete"
  on public.guardian_students for delete
  using (public.current_user_is_staff());

-- ── guardians ─────────────────────────────────────────────────────────────────
--
-- FERPA: A guardian may only read and update their own record.
-- The WITH CHECK on UPDATE prevents a guardian from self-promoting
-- their role to 'staff' or 'admin'.

create policy "guardians: own record or staff"
  on public.guardians for select
  using (
    id = public.current_guardian_id()
    or public.current_user_is_staff()
  );

-- Guardians may update their own profile but NOT change their role.
create policy "guardians: own update, cannot self-promote"
  on public.guardians for update
  using (id = public.current_guardian_id())
  with check (
    id = public.current_guardian_id()
    and role = 'guardian'  -- role must remain 'guardian' after update
  );

-- Staff may insert, update, and delete any guardian record.
-- This is separate from the guardian self-update policy so staff can set
-- role = 'staff', link veracross_id, and manage expo_push_token.
create policy "guardians: staff insert"
  on public.guardians for insert
  with check (public.current_user_is_staff());

create policy "guardians: staff update"
  on public.guardians for update
  using  (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "guardians: staff delete"
  on public.guardians for delete
  using (public.current_user_is_staff());

-- ── vehicles ──────────────────────────────────────────────────────────────────
--
-- Vehicles are personal property — guardians manage their own fleet.
-- Staff can see all vehicles for queue display.

create policy "vehicles: own or staff select"
  on public.vehicles for select
  using (
    guardian_id = public.current_guardian_id()
    or public.current_user_is_staff()
  );

create policy "vehicles: own insert"
  on public.vehicles for insert
  with check (guardian_id = public.current_guardian_id());

create policy "vehicles: own update"
  on public.vehicles for update
  using  (guardian_id = public.current_guardian_id())
  with check (guardian_id = public.current_guardian_id());

create policy "vehicles: own delete"
  on public.vehicles for delete
  using (guardian_id = public.current_guardian_id());

-- ── authorized_pickups ────────────────────────────────────────────────────────
--
-- FERPA: Authorized-pickup lists are per-guardian and reference student IDs.
-- Guardians manage their own lists. Staff can see and manage all lists
-- for verification during pickup.
--
-- NOTE: We need SEPARATE policies for guardian CUD vs staff CUD. If a single
-- policy uses "guardian_id = X OR is_staff()", the WITH CHECK on INSERT would
-- inadvertently block staff (staff guardian_id ≠ the record's guardian_id).

create policy "authorized_pickups: own or staff select"
  on public.authorized_pickups for select
  using (
    guardian_id = public.current_guardian_id()
    or public.current_user_is_staff()
  );

-- Guardian manages their own authorized pickups
create policy "authorized_pickups: guardian insert"
  on public.authorized_pickups for insert
  with check (guardian_id = public.current_guardian_id());

create policy "authorized_pickups: guardian update"
  on public.authorized_pickups for update
  using  (guardian_id = public.current_guardian_id())
  with check (guardian_id = public.current_guardian_id());

create policy "authorized_pickups: guardian delete"
  on public.authorized_pickups for delete
  using (guardian_id = public.current_guardian_id());

-- Staff manages all authorized pickups (separate policies to avoid WITH CHECK conflict)
create policy "authorized_pickups: staff insert"
  on public.authorized_pickups for insert
  with check (public.current_user_is_staff());

create policy "authorized_pickups: staff update"
  on public.authorized_pickups for update
  using  (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "authorized_pickups: staff delete"
  on public.authorized_pickups for delete
  using (public.current_user_is_staff());

-- ── pickup_requests ───────────────────────────────────────────────────────────
--
-- FERPA: A guardian may only see and create requests for themselves.
-- Status transitions (arrived → called → released) are staff-only operations
-- to prevent guardians from manipulating queue state.

create policy "pickup_requests: own or staff select"
  on public.pickup_requests for select
  using (
    guardian_id = public.current_guardian_id()
    or public.current_user_is_staff()
  );

create policy "pickup_requests: own insert"
  on public.pickup_requests for insert
  with check (guardian_id = public.current_guardian_id());

-- Guardians may cancel (delete) their own requests only if not yet released.
create policy "pickup_requests: own delete if not released"
  on public.pickup_requests for delete
  using (
    guardian_id = public.current_guardian_id()
    and status != 'released'
  );

-- Only staff may UPDATE pickup_requests (to advance status).
-- Guardians cannot change their own request status.
create policy "pickup_requests: staff update only"
  on public.pickup_requests for update
  using  (public.current_user_is_staff())
  with check (public.current_user_is_staff());

-- ── early_pickup_approvals ────────────────────────────────────────────────────
--
-- FERPA: Approval records contain student health/personal information
-- (doctor appointments, religious observances). Guardians see only their own.
-- Staff see all pending approvals for review.

create policy "early_pickup_approvals: own or staff select"
  on public.early_pickup_approvals for select
  using (
    guardian_id = public.current_guardian_id()
    or public.current_user_is_staff()
  );

create policy "early_pickup_approvals: own insert"
  on public.early_pickup_approvals for insert
  with check (guardian_id = public.current_guardian_id());

-- Only staff may approve/deny (UPDATE) early pickup approvals.
create policy "early_pickup_approvals: staff update only"
  on public.early_pickup_approvals for update
  using  (public.current_user_is_staff())
  with check (public.current_user_is_staff());

-- ── notifications ─────────────────────────────────────────────────────────────
--
-- Notifications are strictly per-guardian. No INSERT policy exists on purpose:
-- notifications are created only by edge functions running under the
-- service_role key, which bypasses RLS entirely. A guardian may only
-- read their own notifications and mark them as read.

create policy "notifications: own select"
  on public.notifications for select
  using (guardian_id = public.current_guardian_id());

-- Guardians may only mark their own notifications as read (UPDATE read=true).
-- They cannot create, delete, or change any other field.
create policy "notifications: own mark read"
  on public.notifications for update
  using (guardian_id = public.current_guardian_id())
  with check (guardian_id = public.current_guardian_id());

-- NOTE: No INSERT policy is intentional.
-- Edge functions (notify-status-change, etc.) use the service_role key,
-- which bypasses RLS. This prevents guardians from injecting fake
-- notifications into the system.
