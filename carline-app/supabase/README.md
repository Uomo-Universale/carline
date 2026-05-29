# CarLine — Supabase Backend

## 1. Structure

```
supabase/
├── config.toml                         Local dev configuration (supabase start)
├── migrations/
│   ├── 001_schema.sql                  All tables, ENUMs, indexes, triggers, Realtime
│   ├── 002_rls.sql                     FERPA-compliant Row Level Security policies
│   └── 003_seed.sql                    Development seed data (matches MockDataSource)
├── functions/
│   ├── notify-status-change/index.ts   Webhook → Expo push + DB notification
│   ├── sync-from-veracross/index.ts    Veracross v3 API sync (students, guardians, etc.)
│   └── import-csv/index.ts            Bulk CSV import (students, guardians, links)
└── README.md                           This file
```

---

## 2. Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) v1.200+  
  `brew install supabase/tap/supabase`
- [Deno](https://deno.land/) v1.40+ (for local Edge Function testing)  
  `brew install deno`
- A Supabase project (free tier works for development)

---

## 3. Local Dev Setup

```bash
# 1. Start the local Supabase stack (Docker required)
supabase start

# 2. Apply migrations
supabase db push

# 3. Seed development data
supabase db reset   # runs all migrations + seed in order

# 4. Serve Edge Functions locally
supabase functions serve --env-file .env.local

# 5. Run the Expo app pointing at local Supabase
# Update app.json extra.supabaseUrl to http://127.0.0.1:54321
# Update app.json extra.supabaseAnonKey to the anon key from `supabase status`
npx expo start
```

`supabase status` prints the local API URL, anon key, and service role key.

---

## 4. Production Deployment Checklist

- [ ] Create a new Supabase project at https://app.supabase.com
- [ ] Run `supabase db push --db-url <connection-string>` to apply migrations
- [ ] Set environment variables in Supabase Dashboard → Settings → Edge Functions
- [ ] Deploy Edge Functions: `supabase functions deploy --project-ref <ref>`
- [ ] Configure DB Webhook in Dashboard → Database → Webhooks:
  - Table: `pickup_requests`, Event: `UPDATE`
  - URL: `https://<ref>.supabase.co/functions/v1/notify-status-change`
  - Secret header: `x-webhook-secret: <WEBHOOK_SECRET>`
- [ ] Enable Realtime for `pickup_requests` and `notifications` tables
- [ ] Update `app.json` extra with production `supabaseUrl` and `supabaseAnonKey`
- [ ] Test auth flow end-to-end with a real device
- [ ] Confirm RLS blocks cross-guardian data access with a second test account

---

## 5. Environment Variables

| Variable | Where Set | Description |
|---|---|---|
| `SUPABASE_URL` | Auto-injected in Edge Functions | Project API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected in Edge Functions | Bypasses RLS — never expose client-side |
| `SUPABASE_ANON_KEY` | `app.json` extra | Safe for client; RLS enforces access |
| `WEBHOOK_SECRET` | Edge Function secrets | Shared secret for DB webhook authentication |
| `VERACROSS_CLIENT_ID` | Edge Function secrets | OAuth2 client ID from Veracross developer portal |
| `VERACROSS_CLIENT_SECRET` | Edge Function secrets | OAuth2 client secret |
| `VERACROSS_API_URL` | Edge Function secrets | Base URL for Veracross v3 API |
| `VERACROSS_SCOPE` | Edge Function secrets | OAuth2 scope (usually `school:read`) |

Set Edge Function secrets via:
```bash
supabase secrets set WEBHOOK_SECRET=<value> --project-ref <ref>
```

---

## 6. FERPA Enforcement Per Table

All tables have Row Level Security enabled. `service_role` bypasses RLS — only Edge Functions and server-side scripts use it. The mobile client uses the `anon` key, which is fully governed by policies.

| Table | Guardian Access | Staff Access |
|---|---|---|
| `students` | Own linked students only (via `guardian_students`) | All students |
| `guardian_students` | Own rows only | All rows |
| `guardians` | Own record only; cannot self-promote role | All records |
| `vehicles` | Own vehicles (CRUD) | Read-only |
| `authorized_pickups` | Own records (CRUD) | Full CRUD |
| `pickup_requests` | Own requests; cannot change status | Full CRUD |
| `early_pickup_approvals` | Own records; cannot approve/deny | Full CRUD |
| `notifications` | Own notifications; can mark read | N/A (created by service_role) |

Helper functions (SECURITY DEFINER):
- `current_guardian_id()` — returns the UUID of the authenticated guardian
- `current_user_is_staff()` — true if role is `staff` or `admin`

---

## 7. Auth Flow

1. Guardian opens the app → `supabase.auth.signInWithOtp({ email })` sends a magic link
2. Guardian clicks the link → Supabase Auth creates/updates an `auth.users` row
3. The `trg_link_guardian_on_signup` trigger fires and sets `guardians.auth_user_id = auth.uid()` where email matches
4. The app calls `getCurrentGuardian()` which looks up `guardians WHERE auth_user_id = auth.uid()`
5. All subsequent RLS policies use `current_guardian_id()` to scope data

For staff: same flow, but a school admin must manually set `role = 'staff'` or `role = 'admin'` in the dashboard or via a direct DB update (RLS prevents self-promotion).

---

## 8. Staff Role Promotion

Guardians cannot promote themselves — the RLS `WITH CHECK` on `guardians UPDATE` enforces `role = 'guardian'`. To grant staff access:

```sql
-- Run as Supabase service role (Dashboard → SQL Editor)
update public.guardians
set role = 'staff'
where email = 'teacher@school.edu';
```

Or via a dedicated admin panel using `service_role` credentials.

---

## 9. Veracross Sync

### Manual trigger

```bash
curl -X POST \
  'https://<ref>.supabase.co/functions/v1/sync-from-veracross' \
  -H 'Authorization: Bearer <SERVICE_ROLE_KEY>'
```

### TODOs before enabling

1. Obtain OAuth2 credentials from your Veracross developer portal
2. Confirm field names for students, parents, and contacts endpoints
3. Implement pagination for the `/students` endpoint (cursor-based)
4. Map `parent_pk` + `student_pk` to the `guardian_students` link table
5. Confirm the endpoint for authorized pickups / emergency contacts

### Recommended timeline

| Step | Owner | Est. Time |
|---|---|---|
| Obtain Veracross API access | School IT | 1–2 weeks |
| Map field names in `sync-from-veracross/index.ts` | Developer | 1 day |
| Test against Veracross sandbox | Developer | 1 day |
| Enable nightly cron | Developer | 1 hour |

---

## 10. CSV Import

### Format specs

**students.csv**
```
first_name,last_name,grade,homeroom,teacher_name,tint_index,veracross_id
Naomi,Levin,3rd grade,3-B,Mrs. Cohen,0,VX-1001
```

**guardians.csv**
```
first_name,last_name,email,phone,is_primary,veracross_id
Sarah,Levin,sarah@levin.com,+1 (917) 555-0142,true,VX-2001
```

**guardian_students.csv**
```
guardian_email,student_veracross_id
sarah@levin.com,VX-1001
sarah@levin.com,VX-1002
```

### Import curl examples

```bash
# Import students
curl -X POST \
  'https://<ref>.supabase.co/functions/v1/import-csv?type=students' \
  -H 'Authorization: Bearer <SERVICE_ROLE_KEY>' \
  -H 'Content-Type: text/csv' \
  --data-binary @students.csv

# Import guardians
curl -X POST \
  'https://<ref>.supabase.co/functions/v1/import-csv?type=guardians' \
  -H 'Authorization: Bearer <SERVICE_ROLE_KEY>' \
  -H 'Content-Type: text/csv' \
  --data-binary @guardians.csv

# Link guardians to students
curl -X POST \
  'https://<ref>.supabase.co/functions/v1/import-csv?type=guardian_students' \
  -H 'Authorization: Bearer <SERVICE_ROLE_KEY>' \
  -H 'Content-Type: text/csv' \
  --data-binary @guardian_students.csv
```

Response:
```json
{ "imported": 42, "skipped": 0, "errors": [] }
```

---

## 11. Switching from Mock to Supabase

Change **one line** in `/src/data/provider.ts`:

```typescript
// Before (mock):
import { MockDataSource } from './MockDataSource';
export const dataSource: DataSource = new MockDataSource();

// After (Supabase):
import { SupabaseDataSource } from './SupabaseDataSource';
export const dataSource: DataSource = new SupabaseDataSource();
```

Make sure `app.json` has valid `supabaseUrl` and `supabaseAnonKey` values first.

---

## 12. Troubleshooting

**"Missing supabaseUrl or supabaseAnonKey"**  
Add the values to `app.json` under `expo.extra`. Run `npx expo start --clear` after changing `app.json`.

**RLS blocking all data**  
The guardian must be signed in AND have a row in the `guardians` table with `auth_user_id` set. Check:
```sql
select * from public.guardians where email = 'your@email.com';
```
If `auth_user_id` is null, the auth trigger may not have fired. Set it manually:
```sql
update public.guardians
set auth_user_id = auth.uid()
where email = 'your@email.com';
```

**Realtime not receiving events**  
Confirm the table is in the `supabase_realtime` publication:
```sql
select * from pg_publication_tables where pubname = 'supabase_realtime';
```

**Edge Function 401 Unauthorized**  
For `notify-status-change`: verify the `x-webhook-secret` header matches `WEBHOOK_SECRET`.  
For `sync-from-veracross` and `import-csv`: use the service role key, not the anon key.

**Expo push token not saving**  
`registerAndStorePushToken` only works on a physical device (not simulator). Confirm `expo-device` returns `isDevice = true`. Check the guardian's `expo_push_token` column in the DB after running.

**TypeScript errors on `@supabase/supabase-js`**  
Run `npm install` to install the new dependencies added to `package.json`.
