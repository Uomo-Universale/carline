-- ============================================================
-- CarLine — PostgreSQL Schema
-- Migration 001: Initial schema
-- ============================================================

-- ── updated_at trigger function ───────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── ENUM types ────────────────────────────────────────────────────────────────

create type public.pickup_status as enum (
  'requested',
  'arrived',
  'called',
  'released'
);

create type public.pickup_type as enum (
  'carline',
  'walkin',
  'early',
  'message'
);

create type public.request_status as enum (
  'pending',
  'approved',
  'denied'
);

-- NOTE: named early_pickup_reason — PostgreSQL has no collision when a column
-- has the same name as an enum type; the column type annotation disambiguates.
create type public.early_pickup_reason as enum (
  'doctor',
  'family',
  'religious',
  'other'
);

create type public.guardian_role as enum (
  'guardian',
  'staff',
  'admin'
);

create type public.notification_type as enum (
  'status_change',
  'early_pickup_approved',
  'early_pickup_denied'
);

-- ── Tables ────────────────────────────────────────────────────────────────────

-- students
create table public.students (
  id             uuid        primary key default gen_random_uuid(),
  first_name     text        not null,
  last_name      text        not null,
  grade          text        not null,
  homeroom       text        not null,
  teacher_name   text        not null,
  tint_index     smallint    not null default 0 check (tint_index between 0 and 4),
  veracross_id   text        unique,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- guardians
create table public.guardians (
  id             uuid         primary key default gen_random_uuid(),
  auth_user_id   uuid         unique references auth.users(id) on delete set null,
  first_name     text         not null,
  last_name      text         not null,
  phone          text,
  email          text         not null unique,
  is_primary     boolean      not null default false,
  role           guardian_role not null default 'guardian',
  expo_push_token text,
  veracross_id   text         unique,
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

-- guardian_students (junction)
create table public.guardian_students (
  guardian_id  uuid not null references public.guardians(id) on delete cascade,
  student_id   uuid not null references public.students(id)  on delete cascade,
  primary key (guardian_id, student_id)
);

-- vehicles
create table public.vehicles (
  id           uuid        primary key default gen_random_uuid(),
  guardian_id  uuid        not null references public.guardians(id) on delete cascade,
  year         text        not null,
  make         text        not null,
  model        text        not null,
  color        text        not null,
  color_hex    text        not null,
  plate        text        not null,
  state        text        not null default 'NY',
  is_active    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- authorized_pickups
create table public.authorized_pickups (
  id           uuid        primary key default gen_random_uuid(),
  guardian_id  uuid        not null references public.guardians(id) on delete cascade,
  name         text        not null,
  relation     text        not null,
  is_primary   boolean     not null default false,
  student_ids  uuid[]      not null default '{}',
  veracross_id text        unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- pickup_requests
create table public.pickup_requests (
  id                   uuid           primary key default gen_random_uuid(),
  guardian_id          uuid           not null references public.guardians(id),
  vehicle_id           uuid           references public.vehicles(id) on delete set null,
  type                 pickup_type    not null,
  status               pickup_status  not null default 'requested',
  student_ids          uuid[]         not null default '{}',
  queue_position       smallint,
  requested_at         timestamptz    not null default now(),
  arrived_at           timestamptz,
  called_at            timestamptz,
  released_at          timestamptz,
  early_pickup_time    text,
  -- Column name matches enum type name — PostgreSQL handles this correctly
  early_pickup_reason  public.early_pickup_reason,
  early_pickup_note    text,
  approval_status      public.request_status,
  created_at           timestamptz    not null default now(),
  updated_at           timestamptz    not null default now()
);

-- early_pickup_approvals
create table public.early_pickup_approvals (
  id             uuid                       primary key default gen_random_uuid(),
  request_id     uuid                       not null references public.pickup_requests(id) on delete cascade,
  student_id     uuid                       not null references public.students(id),
  guardian_id    uuid                       not null references public.guardians(id),
  pickup_time    text                       not null,
  -- Column name matches enum type name — PostgreSQL handles this correctly
  reason         public.early_pickup_reason,
  note           text,
  submitted_at   timestamptz                not null default now(),
  status         public.request_status      not null default 'pending',
  reviewed_by    uuid                       references public.guardians(id),
  denial_note    text,
  created_at     timestamptz                not null default now(),
  updated_at     timestamptz                not null default now()
);

-- notifications
create table public.notifications (
  id                uuid               primary key default gen_random_uuid(),
  guardian_id       uuid               not null references public.guardians(id) on delete cascade,
  type              notification_type  not null,
  title             text               not null,
  body              text               not null,
  target_student_id uuid               references public.students(id) on delete set null,
  read              boolean            not null default false,
  created_at        timestamptz        not null default now(),
  updated_at        timestamptz        not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index idx_students_veracross_id        on public.students(veracross_id)            where veracross_id is not null;
create index idx_guardians_auth_user_id       on public.guardians(auth_user_id)           where auth_user_id is not null;
create index idx_guardians_email              on public.guardians(email);
create index idx_vehicles_guardian_id         on public.vehicles(guardian_id);
create index idx_authorized_pickups_guardian_id on public.authorized_pickups(guardian_id);
create index idx_pickup_requests_guardian_id  on public.pickup_requests(guardian_id);
create index idx_pickup_requests_status       on public.pickup_requests(status)           where status != 'released';
create index idx_pickup_requests_requested_at on public.pickup_requests(requested_at desc);
create index idx_early_approvals_guardian_id  on public.early_pickup_approvals(guardian_id);
create index idx_early_approvals_status       on public.early_pickup_approvals(status)    where status = 'pending';
create index idx_notifications_guardian_id    on public.notifications(guardian_id);
create index idx_notifications_unread         on public.notifications(guardian_id, read)  where read = false;
create index idx_guardian_students_student_id on public.guardian_students(student_id);

-- ── updated_at triggers ───────────────────────────────────────────────────────

create trigger trg_students_updated_at
  before update on public.students
  for each row execute procedure public.handle_updated_at();

create trigger trg_guardians_updated_at
  before update on public.guardians
  for each row execute procedure public.handle_updated_at();

create trigger trg_vehicles_updated_at
  before update on public.vehicles
  for each row execute procedure public.handle_updated_at();

create trigger trg_authorized_pickups_updated_at
  before update on public.authorized_pickups
  for each row execute procedure public.handle_updated_at();

create trigger trg_pickup_requests_updated_at
  before update on public.pickup_requests
  for each row execute procedure public.handle_updated_at();

create trigger trg_early_pickup_approvals_updated_at
  before update on public.early_pickup_approvals
  for each row execute procedure public.handle_updated_at();

create trigger trg_notifications_updated_at
  before update on public.notifications
  for each row execute procedure public.handle_updated_at();

-- ── Auth link trigger ─────────────────────────────────────────────────────────
-- When a guardian signs up via Supabase Auth, automatically link their
-- auth.users row to the pre-provisioned guardians row by email.
--
-- IMPORTANT — Supabase permission note:
--   Creating triggers on auth.users via SQL migrations requires the postgres
--   role to have TRIGGER privilege on auth.users. On hosted Supabase this is
--   granted via: GRANT TRIGGER ON auth.users TO postgres;
--   If the migration fails with "permission denied", create this trigger
--   through the Supabase Dashboard (Database → Functions → New Function, then
--   Database → Webhooks or direct trigger setup) instead of running it here.
--   Alternatively, fire the link from the auth.on_auth_user_created() hook
--   configured in the Dashboard under Authentication → Hooks.

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.guardians
  set auth_user_id = new.id
  where email = new.email
    and auth_user_id is null;
  return new;
end;
$$;

create trigger trg_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_auth_user_created();

-- ── Realtime ──────────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.pickup_requests;
alter publication supabase_realtime add table public.notifications;
