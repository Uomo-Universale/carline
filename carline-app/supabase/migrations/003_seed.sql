-- ============================================================
-- CarLine — Seed Data
-- Migration 003: Development / test data matching MockDataSource
-- ============================================================
-- UUIDs are deterministic so foreign-key references work across statements.

-- Students: s1–s10
-- 00000000-0000-0000-0000-00000000000x

insert into public.students
  (id, first_name, last_name, grade, homeroom, teacher_name, tint_index)
values
  ('00000000-0000-0000-0000-000000000001', 'Naomi',  'Levin',     '3rd grade',    '3-B', 'Mrs. Cohen',   0),
  ('00000000-0000-0000-0000-000000000002', 'Eli',    'Levin',     'Kindergarten', 'K-A', 'Ms. Stein',    1),
  ('00000000-0000-0000-0000-000000000003', 'Mira',   'Abramson',  '1st grade',    '1-A', 'Mrs. Kaplan',  2),
  ('00000000-0000-0000-0000-000000000004', 'Asher',  'Goldberg',  '4th grade',    '4-B', 'Mr. Friedman', 3),
  ('00000000-0000-0000-0000-000000000005', 'Yael',   'Roth',      '2nd grade',    '2-A', 'Mrs. Adler',   4),
  ('00000000-0000-0000-0000-000000000006', 'Daniel', 'Weisman',   '5th grade',    '5-A', 'Mr. Stern',    0),
  ('00000000-0000-0000-0000-000000000007', 'Hannah', 'Berkowitz', '3rd grade',    '3-A', 'Mrs. Cohen',   1),
  ('00000000-0000-0000-0000-000000000008', 'Sam',    'Friedman',  'Kindergarten', 'K-B', 'Ms. Wexler',   2),
  ('00000000-0000-0000-0000-000000000009', 'Ava',    'Klein',     '2nd grade',    '2-B', 'Mrs. Adler',   3),
  ('00000000-0000-0000-0000-000000000010', 'Levi',   'Cohen',     '5th grade',    '5-B', 'Mr. Stern',    4);

-- Guardians: g1–g8
-- 00000000-0000-0000-0000-0000000000[2x]

insert into public.guardians
  (id, first_name, last_name, phone, email, is_primary, role)
values
  ('00000000-0000-0000-0000-000000000021', 'Sarah',  'Levin',     '+1 (917) 555-0142', 'sarah@levin.com',    true,  'guardian'),
  ('00000000-0000-0000-0000-000000000022', 'David',  'Abramson',  '+1 (917) 555-0199', 'david@abramson.com', true,  'guardian'),
  ('00000000-0000-0000-0000-000000000023', 'Rachel', 'Goldberg',  '+1 (917) 555-0211', 'rachel@rg.com',      true,  'guardian'),
  ('00000000-0000-0000-0000-000000000024', 'Esther', 'Roth',      '+1 (917) 555-0233', 'esther@roth.com',    false, 'guardian'),
  ('00000000-0000-0000-0000-000000000025', 'Avi',    'Weisman',   '+1 (917) 555-0244', 'avi@weisman.com',    true,  'guardian'),
  ('00000000-0000-0000-0000-000000000026', 'Miriam', 'Berkowitz', '+1 (917) 555-0255', 'miriam@berk.com',    true,  'guardian'),
  ('00000000-0000-0000-0000-000000000027', 'Joel',   'Friedman',  '+1 (917) 555-0266', 'joel@friedman.com',  true,  'guardian'),
  ('00000000-0000-0000-0000-000000000028', 'Talia',  'Klein',     '+1 (917) 555-0277', 'talia@klein.com',    true,  'guardian');

-- Guardian–Student links (matches MockDataSource GUARDIANS[].studentIds)

insert into public.guardian_students (guardian_id, student_id) values
  -- Sarah Levin → Naomi, Eli
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002'),
  -- David Abramson → Mira
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000003'),
  -- Rachel Goldberg → Asher
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000004'),
  -- Esther Roth → Yael
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000005'),
  -- Avi Weisman → Daniel
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000006'),
  -- Miriam Berkowitz → Hannah
  ('00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000007'),
  -- Joel Friedman → Sam
  ('00000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000008'),
  -- Talia Klein → Ava
  ('00000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000009');

-- Vehicles: v1–v8
-- 00000000-0000-0000-0000-0000000000[3x]

insert into public.vehicles
  (id, guardian_id, year, make, model, color, color_hex, plate, state, is_active)
values
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000021', '2022', 'Subaru',  'Outback',    'Forest Green', '#2F5A3A', 'RDS 7821', 'NY', true),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000022', '2020', 'Honda',   'Odyssey',    'White',        '#F2EEE5', 'HQR 4421', 'NY', true),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000023', '2021', 'Toyota',  'Highlander', 'Charcoal',     '#2B2B30', '9LMK 02',  'NY', true),
  ('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000024', '2023', 'Tesla',   'Model Y',    'Silver',       '#B8BCC2', 'JK 88123', 'NY', true),
  ('00000000-0000-0000-0000-000000000035', '00000000-0000-0000-0000-000000000025', '2019', 'Volvo',   'XC60',       'Navy',         '#1F3A5F', 'HRT 0044', 'NY', true),
  ('00000000-0000-0000-0000-000000000036', '00000000-0000-0000-0000-000000000026', '2020', 'Mazda',   'CX-5',       'Red',          '#A8392E', 'GHA 7710', 'NY', true),
  ('00000000-0000-0000-0000-000000000037', '00000000-0000-0000-0000-000000000027', '2021', 'Lexus',   'RX',         'Beige',        '#D8C39A', 'BBQ 1019', 'NY', true),
  ('00000000-0000-0000-0000-000000000038', '00000000-0000-0000-0000-000000000028', '2022', 'Honda',   'Pilot',      'White',        '#F2EEE5', 'AVA 0001', 'NY', true);

-- Authorized pickups: ap1–ap4
-- 00000000-0000-0000-0000-0000000000[4x]

insert into public.authorized_pickups
  (id, guardian_id, name, relation, is_primary, student_ids)
values
  (
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000021',
    'Sarah Levin',
    'Mother',
    true,
    ARRAY[
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000002'::uuid
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000042',
    '00000000-0000-0000-0000-000000000021',
    'David Levin',
    'Father',
    true,
    ARRAY[
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000002'::uuid
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000043',
    '00000000-0000-0000-0000-000000000021',
    'Rachel Adler',
    'Aunt',
    false,
    ARRAY[
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000002'::uuid
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000044',
    '00000000-0000-0000-0000-000000000021',
    'Mike Levin',
    'Grandfather',
    false,
    ARRAY[
      '00000000-0000-0000-0000-000000000002'::uuid
    ]
  );

-- Pickup requests: req51–req53 (early pickup requests for approval workflow)
-- 00000000-0000-0000-0000-0000000000[5x]

insert into public.pickup_requests
  (id, guardian_id, vehicle_id, type, status, student_ids, early_pickup_time, early_pickup_reason, early_pickup_note, approval_status, requested_at)
values
  (
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000021',
    null,
    'early',
    'requested',
    ARRAY['00000000-0000-0000-0000-000000000001'::uuid],
    '2:15',
    'doctor',
    'Orthodontist on Atlantic Ave',
    'pending',
    '2026-05-28T08:12:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000023',
    null,
    'early',
    'requested',
    ARRAY['00000000-0000-0000-0000-000000000004'::uuid],
    '1:30',
    'family',
    'Cousin''s bat mitzvah rehearsal',
    'approved',
    '2026-05-27T16:40:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000053',
    '00000000-0000-0000-0000-000000000026',
    null,
    'early',
    'requested',
    ARRAY['00000000-0000-0000-0000-000000000007'::uuid],
    '11:00',
    'doctor',
    'Pediatrician — Dr. Schwartz',
    'pending',
    '2026-05-28T07:45:00Z'
  );

-- Early pickup approvals: ea61–ea63
-- 00000000-0000-0000-0000-0000000000[6x]

insert into public.early_pickup_approvals
  (id, request_id, student_id, guardian_id, pickup_time, reason, note, submitted_at, status)
values
  (
    '00000000-0000-0000-0000-000000000061',
    '00000000-0000-0000-0000-000000000051',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000021',
    '2:15',
    'doctor',
    'Orthodontist on Atlantic Ave',
    '2026-05-28T08:12:00Z',
    'pending'
  ),
  (
    '00000000-0000-0000-0000-000000000062',
    '00000000-0000-0000-0000-000000000052',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000023',
    '1:30',
    'family',
    'Cousin''s bat mitzvah rehearsal',
    '2026-05-27T16:40:00Z',
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000063',
    '00000000-0000-0000-0000-000000000053',
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000026',
    '11:00',
    'doctor',
    'Pediatrician — Dr. Schwartz',
    '2026-05-28T07:45:00Z',
    'pending'
  );
