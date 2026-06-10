-- ============================================================
-- CarLine — Supabase Schema
-- Run this once in the Supabase SQL Editor (project dashboard)
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS students (
  id           text PRIMARY KEY,
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  grade        text NOT NULL,
  homeroom     text NOT NULL,
  teacher_name text NOT NULL,
  tint_index   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardians (
  id           text PRIMARY KEY,
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  phone        text,
  email        text,
  is_primary   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardian_students (
  guardian_id  text NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  student_id   text NOT NULL REFERENCES students(id)  ON DELETE CASCADE,
  PRIMARY KEY (guardian_id, student_id)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id           text PRIMARY KEY DEFAULT 'v' || extract(epoch from now())::bigint,
  guardian_id  text NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  year         text NOT NULL,
  make         text NOT NULL,
  model        text NOT NULL,
  color        text NOT NULL,
  color_hex    text NOT NULL DEFAULT '#888888',
  plate        text NOT NULL,
  state        text NOT NULL DEFAULT 'NY',
  is_active    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authorized_pickups (
  id           text PRIMARY KEY,
  guardian_id  text NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  name         text NOT NULL,
  relation     text NOT NULL,
  is_primary   boolean NOT NULL DEFAULT false,
  student_ids  text[] NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Main real-time table: one row per student per request
CREATE TABLE IF NOT EXISTS queue_entries (
  request_id    text NOT NULL,
  student_id    text NOT NULL REFERENCES students(id),
  guardian_id   text NOT NULL DEFAULT '',
  vehicle_id    text,
  pickup_type   text NOT NULL DEFAULT 'carline',  -- carline | walkin | early | bus | message
  status        text NOT NULL DEFAULT 'requested', -- requested | arrived | called | released
  arrived_at    text NOT NULL,
  queue_position integer NOT NULL DEFAULT 0,
  group_num     integer,
  position_num  integer,
  bus_plate     text,
  alert         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (request_id, student_id)
);

CREATE TABLE IF NOT EXISTS early_pickup_approvals (
  id           text PRIMARY KEY DEFAULT 'ea' || extract(epoch from now())::bigint,
  request_id   text NOT NULL,
  student_id   text NOT NULL REFERENCES students(id),
  guardian_id  text NOT NULL REFERENCES guardians(id),
  pickup_time  text NOT NULL,
  reason       text NOT NULL,
  note         text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status       text NOT NULL DEFAULT 'pending', -- pending | approved | denied
  reviewed_by  text,
  denial_note  text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id                text PRIMARY KEY DEFAULT 'n' || extract(epoch from now())::bigint,
  guardian_id       text NOT NULL,
  type              text NOT NULL,
  title             text NOT NULL,
  body              text NOT NULL,
  target_student_id text,
  read              boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ── Enable Realtime ──────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE queue_entries;

-- ── Seed data ────────────────────────────────────────────────

INSERT INTO students (id, first_name, last_name, grade, homeroom, teacher_name, tint_index) VALUES
  ('s1',  'Naomi',   'Levin',     '3rd grade',    '3-B', 'Mrs. Cohen',   0),
  ('s2',  'Eli',     'Levin',     'Kindergarten', 'K-A', 'Ms. Stein',    1),
  ('s3',  'Mira',    'Abramson',  '1st grade',    '1-A', 'Mrs. Kaplan',  2),
  ('s4',  'Asher',   'Goldberg',  '4th grade',    '4-B', 'Mr. Friedman', 3),
  ('s5',  'Yael',    'Roth',      '2nd grade',    '2-A', 'Mrs. Adler',   4),
  ('s6',  'Daniel',  'Weisman',   '5th grade',    '5-A', 'Mr. Stern',    0),
  ('s7',  'Hannah',  'Berkowitz', '3rd grade',    '3-A', 'Mrs. Cohen',   1),
  ('s8',  'Sam',     'Friedman',  'Kindergarten', 'K-B', 'Ms. Wexler',   2),
  ('s9',  'Ava',     'Klein',     '2nd grade',    '2-B', 'Mrs. Adler',   3),
  ('s10', 'Levi',    'Cohen',     '5th grade',    '5-B', 'Mr. Stern',    4),
  ('s11', 'Maya',    'Shapiro',   '4th grade',    '4-A', 'Mr. Friedman', 2),
  ('s12', 'Noah',    'Stern',     '2nd grade',    '2-B', 'Mrs. Adler',   3),
  ('s13', 'Leah',    'Weiss',     'Kindergarten', 'K-B', 'Ms. Wexler',   0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO guardians (id, first_name, last_name, phone, email, is_primary) VALUES
  ('g1', 'Sarah',  'Levin',     '+1 (917) 555-0142', 'sarah@levin.com',    true),
  ('g2', 'David',  'Abramson',  '+1 (917) 555-0199', 'david@abramson.com', true),
  ('g3', 'Rachel', 'Goldberg',  '+1 (917) 555-0211', 'rachel@rg.com',      true),
  ('g4', 'Esther', 'Roth',      '+1 (917) 555-0233', 'esther@roth.com',    false),
  ('g5', 'Avi',    'Weisman',   '+1 (917) 555-0244', 'avi@weisman.com',    true),
  ('g6', 'Miriam', 'Berkowitz', '+1 (917) 555-0255', 'miriam@berk.com',    true),
  ('g7', 'Joel',   'Friedman',  '+1 (917) 555-0266', 'joel@friedman.com',  true),
  ('g8', 'Talia',  'Klein',     '+1 (917) 555-0277', 'talia@klein.com',    true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO guardian_students (guardian_id, student_id) VALUES
  ('g1','s1'),('g1','s2'),
  ('g2','s3'),
  ('g3','s4'),
  ('g4','s5'),
  ('g5','s6'),
  ('g6','s7'),
  ('g7','s8'),
  ('g8','s9')
ON CONFLICT DO NOTHING;

INSERT INTO vehicles (id, guardian_id, year, make, model, color, color_hex, plate, state, is_active) VALUES
  ('v1','g1','2022','Subaru', 'Outback',    'Forest Green','#2F5A3A','RDS 7821','NY',true),
  ('v2','g2','2020','Honda',  'Odyssey',    'White',       '#F2EEE5','HQR 4421','NY',true),
  ('v3','g3','2021','Toyota', 'Highlander', 'Charcoal',    '#2B2B30','9LMK 02', 'NY',true),
  ('v4','g4','2023','Tesla',  'Model Y',    'Silver',      '#B8BCC2','JK 88123','NY',true),
  ('v5','g5','2019','Volvo',  'XC60',       'Navy',        '#1F3A5F','HRT 0044','NY',true),
  ('v6','g6','2020','Mazda',  'CX-5',       'Red',         '#A8392E','GHA 7710','NY',true),
  ('v7','g7','2021','Lexus',  'RX',         'Beige',       '#D8C39A','BBQ 1019','NY',true),
  ('v8','g8','2022','Honda',  'Pilot',      'White',       '#F2EEE5','AVA 0001','NY',true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO authorized_pickups (id, guardian_id, name, relation, is_primary, student_ids) VALUES
  ('ap1','g1','Sarah Levin',  'Mother',      true,  '{s1,s2}'),
  ('ap2','g1','David Levin',  'Father',      true,  '{s1,s2}'),
  ('ap3','g1','Rachel Adler', 'Aunt',        false, '{s1,s2}'),
  ('ap4','g1','Mike Levin',   'Grandfather', false, '{s2}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO queue_entries (request_id, student_id, guardian_id, vehicle_id, pickup_type, status, arrived_at, queue_position, group_num, position_num) VALUES
  ('q1',  's1',  'g1','v1','carline','called',  '3:22 PM',1,1,2),
  ('q2',  's2',  'g1','v1','carline','called',  '3:22 PM',1,1,2),
  ('q3',  's3',  'g2','v2','carline','arrived', '3:23 PM',2,NULL,NULL),
  ('q4',  's4',  'g3','v3','carline','arrived', '3:24 PM',3,NULL,NULL),
  ('q5',  's5',  'g4','v4','carline','arrived', '3:25 PM',4,NULL,NULL),
  ('q6',  's7',  'g6','v6','carline','arrived', '3:26 PM',5,NULL,NULL),
  ('qw1', 's6',  'g5',NULL,'walkin', 'arrived', '3:24 PM',0,NULL,NULL),
  ('qe1', 's9',  'g8',NULL,'early',  'arrived', '2:45 PM',0,NULL,NULL),
  ('q8',  's8',  'g7','v7','carline','released','3:27 PM',0,NULL,NULL),
  ('bus1','s10', '',  NULL,'bus',    'arrived', '3:30 PM',0,NULL,NULL),
  ('bus2','s11', '',  NULL,'bus',    'arrived', '3:30 PM',0,NULL,NULL),
  ('bus3','s12', '',  NULL,'bus',    'arrived', '3:30 PM',0,NULL,NULL),
  ('bus4','s13', '',  NULL,'bus',    'released','3:15 PM',0,NULL,NULL)
ON CONFLICT DO NOTHING;

INSERT INTO early_pickup_approvals (id, request_id, student_id, guardian_id, pickup_time, reason, note, submitted_at, status) VALUES
  ('ea1','req-ep1','s1','g1','2:15', 'doctor','Orthodontist on Atlantic Ave',         '2026-05-28T08:12:00Z','pending'),
  ('ea2','req-ep2','s4','g3','1:30', 'family','Cousin''s bat mitzvah rehearsal',      '2026-05-27T16:40:00Z','approved'),
  ('ea3','req-ep3','s7','g6','11:00','doctor','Pediatrician — Dr. Schwartz',          '2026-05-28T07:45:00Z','pending')
ON CONFLICT (id) DO NOTHING;
