// CarLine — Veracross Sync Edge Function
// Triggered manually (curl) or on a cron schedule via pg_cron / external scheduler.
//
// TODO: Schedule this function daily via Supabase's pg_cron extension:
//   select cron.schedule('sync-veracross', '0 6 * * *', $$
//     select net.http_post(
//       url := 'https://<project>.supabase.co/functions/v1/sync-from-veracross',
//       headers := '{"Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb
//     )
//   $$);

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Veracross API configuration ──────────────────────────────────────────────

const VX_BASE_URL = Deno.env.get('VERACROSS_API_URL') ?? 'https://api.veracross.com/rambam/v3'
const VX_CLIENT_ID = Deno.env.get('VERACROSS_CLIENT_ID') ?? ''
const VX_CLIENT_SECRET = Deno.env.get('VERACROSS_CLIENT_SECRET') ?? ''
const VX_SCOPE = Deno.env.get('VERACROSS_SCOPE') ?? 'school:read'

// ── OAuth2 token fetch ───────────────────────────────────────────────────────

/**
 * Fetches a short-lived OAuth2 bearer token from Veracross using client_credentials flow.
 *
 * TODO: Adjust token_endpoint to match your Veracross instance URL.
 * The Veracross developer portal (https://developer.veracross.com/) lists the
 * exact token endpoint under your application's OAuth2 settings.
 *
 * Reference implementation matches Veracross API v3 OAuth2 docs:
 *   POST https://accounts.veracross.com/<school>/oauth2/token
 *   Content-Type: application/x-www-form-urlencoded
 *   Body: grant_type=client_credentials&client_id=...&client_secret=...&scope=school:read
 */
async function fetchVxToken(): Promise<string> {
  // TODO: Replace with your school's Veracross OAuth2 token endpoint
  const tokenEndpoint = `https://accounts.veracross.com/rambam/oauth2/token`

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: VX_CLIENT_ID,
    client_secret: VX_CLIENT_SECRET,
    scope: VX_SCOPE,
  })

  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Veracross token fetch failed (${res.status}): ${text}`)
  }

  const json = await res.json()
  return json.access_token as string
}

// ── Authenticated Veracross API helper ───────────────────────────────────────

async function vxFetch(path: string, token: string): Promise<any> {
  const url = `${VX_BASE_URL}${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Veracross API error at ${path} (${res.status}): ${text}`)
  }

  return res.json()
}

// ── Data mappers ─────────────────────────────────────────────────────────────

/**
 * Maps a Veracross student record to our DB schema.
 *
 * TODO: Verify exact Veracross v3 field names in your school's API explorer:
 *   - student.person_pk          → veracross_id (integer, convert to string)
 *   - student.first_name         → first_name
 *   - student.last_name          → last_name
 *   - student.grade_level_label  → grade (e.g. "3rd grade")
 *   - student.homeroom_name      → homeroom (e.g. "3-B")
 *   - student.homeroom_teacher.display_name → teacher_name
 */
function mapVxStudent(vx: any) {
  return {
    veracross_id: String(vx.person_pk),
    first_name: vx.first_name ?? '',
    last_name: vx.last_name ?? '',
    grade: vx.grade_level_label ?? '',
    homeroom: vx.homeroom_name ?? '',
    teacher_name: vx.homeroom_teacher?.display_name ?? '',
    tint_index: 0, // assigned by staff post-import
  }
}

/**
 * Maps a Veracross household/parent record to our guardians schema.
 *
 * TODO: Verify exact Veracross v3 field names:
 *   - parent.person_pk           → veracross_id
 *   - parent.first_name          → first_name
 *   - parent.last_name           → last_name
 *   - parent.mobile_phone        → phone
 *   - parent.email_1             → email (primary email)
 *   - parent.primary_parent      → is_primary (boolean flag)
 */
function mapVxHousehold(vx: any) {
  return {
    veracross_id: String(vx.person_pk),
    first_name: vx.first_name ?? '',
    last_name: vx.last_name ?? '',
    phone: vx.mobile_phone ?? null,
    email: vx.email_1 ?? '',
    is_primary: Boolean(vx.primary_parent),
    role: 'guardian' as const,
  }
}

/**
 * Maps a Veracross authorized pickup record.
 *
 * TODO: Veracross may expose authorized pickups as "emergency contacts" or
 * "additional contacts" per student. Check the contacts endpoint:
 *   GET /students/{id}/contacts
 * Field names to map:
 *   - contact.person_pk          → veracross_id
 *   - contact.display_name       → name
 *   - contact.relationship_label → relation (e.g. "Aunt", "Grandfather")
 */
function mapVxAuthorizedPickup(vx: any, guardianId: string, studentIds: string[]) {
  return {
    veracross_id: String(vx.person_pk),
    guardian_id: guardianId,
    name: vx.display_name ?? `${vx.first_name} ${vx.last_name}`.trim(),
    relation: vx.relationship_label ?? 'Other',
    is_primary: false,
    student_ids: studentIds,
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  // Require Bearer token matching SUPABASE_SERVICE_ROLE_KEY (caller must be staff/cron)
  const authHeader = req.headers.get('Authorization') ?? ''
  const callerToken = authHeader.replace('Bearer ', '')
  if (callerToken !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const synced: Record<string, number> = {
    students: 0,
    guardians: 0,
    guardian_students: 0,
    authorized_pickups: 0,
  }
  const errors: string[] = []

  let vxToken: string
  try {
    vxToken = await fetchVxToken()
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: `OAuth2 failed: ${err.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // ── 1. Sync students ───────────────────────────────────────────────────────
  // TODO: Veracross v3 uses cursor-based pagination. Implement a loop:
  //   let nextUrl: string | null = '/students?limit=100'
  //   while (nextUrl) {
  //     const page = await vxFetch(nextUrl, vxToken)
  //     students.push(...page.data)
  //     nextUrl = page.links?.next ?? null
  //   }
  try {
    const studentsRes = await vxFetch('/students', vxToken)
    const vxStudents: any[] = studentsRes.data ?? studentsRes

    for (const vx of vxStudents) {
      try {
        const row = mapVxStudent(vx)
        const { error } = await supabase
          .from('students')
          .upsert(row, { onConflict: 'veracross_id' })
        if (error) throw error
        synced.students++
      } catch (err: any) {
        errors.push(`student ${vx.person_pk}: ${err.message}`)
      }
    }
  } catch (err: any) {
    errors.push(`students fetch: ${err.message}`)
  }

  // ── 2. Sync guardians (parents/households) ────────────────────────────────
  // TODO: Veracross endpoint may be /parents, /households, or /contacts
  // depending on your school's data model. Confirm with Veracross support.
  try {
    const guardiansRes = await vxFetch('/parents', vxToken)
    const vxParents: any[] = guardiansRes.data ?? guardiansRes

    for (const vx of vxParents) {
      try {
        const row = mapVxHousehold(vx)
        if (!row.email) {
          errors.push(`guardian ${vx.person_pk}: missing email, skipped`)
          continue
        }
        const { error } = await supabase
          .from('guardians')
          .upsert(row, { onConflict: 'veracross_id' })
        if (error) throw error
        synced.guardians++
      } catch (err: any) {
        errors.push(`guardian ${vx.person_pk}: ${err.message}`)
      }
    }
  } catch (err: any) {
    errors.push(`guardians fetch: ${err.message}`)
  }

  // ── 3. Sync guardian_students links ──────────────────────────────────────
  // TODO: Pattern for resolving guardian↔student links from Veracross:
  //
  //   const vxLink = { parent_pk: 123, student_pk: 456 }
  //
  //   // Look up local IDs by veracross_id
  //   const { data: guardian } = await supabase
  //     .from('guardians')
  //     .select('id')
  //     .eq('veracross_id', String(vxLink.parent_pk))
  //     .single()
  //
  //   const { data: student } = await supabase
  //     .from('students')
  //     .select('id')
  //     .eq('veracross_id', String(vxLink.student_pk))
  //     .single()
  //
  //   if (guardian && student) {
  //     await supabase
  //       .from('guardian_students')
  //       .upsert({ guardian_id: guardian.id, student_id: student.id })
  //   }
  //
  // Veracross exposes these links via:
  //   GET /students/{id}/parents  → list of parent records for a student
  // OR
  //   GET /parents/{id}/students  → list of student records for a parent
  try {
    const studentsRes = await supabase.from('students').select('id, veracross_id')
    const guardiansRes = await supabase.from('guardians').select('id, veracross_id')

    const studentMap = new Map<string, string>()
    for (const s of studentsRes.data ?? []) {
      if (s.veracross_id) studentMap.set(s.veracross_id, s.id)
    }

    const guardianMap = new Map<string, string>()
    for (const g of guardiansRes.data ?? []) {
      if (g.veracross_id) guardianMap.set(g.veracross_id, g.id)
    }

    // TODO: Replace with actual Veracross household-student relationship endpoint.
    // The pattern below assumes a /households endpoint returns parent_pk + student_pks.
    const linksRes = await vxFetch('/households', vxToken).catch(() => ({ data: [] }))
    const vxLinks: any[] = linksRes.data ?? linksRes

    for (const link of vxLinks) {
      try {
        const guardianId = guardianMap.get(String(link.parent_pk))
        const studentId = studentMap.get(String(link.student_pk))
        if (!guardianId || !studentId) continue

        const { error } = await supabase
          .from('guardian_students')
          .upsert({ guardian_id: guardianId, student_id: studentId })
        if (error) throw error
        synced.guardian_students++
      } catch (err: any) {
        errors.push(`guardian_student link ${link.parent_pk}→${link.student_pk}: ${err.message}`)
      }
    }
  } catch (err: any) {
    errors.push(`guardian_students sync: ${err.message}`)
  }

  // ── 4. Sync authorized pickups ────────────────────────────────────────────
  // TODO: Verify Veracross endpoint for authorized pickups / emergency contacts.
  // These are often stored as "additional contacts" per student.
  try {
    // Fetch local guardian map for linking contacts to their sponsoring guardian
    const guardiansRes = await supabase.from('guardians').select('id, veracross_id')
    const guardianMap = new Map<string, string>()
    for (const g of guardiansRes.data ?? []) {
      if (g.veracross_id) guardianMap.set(g.veracross_id, g.id)
    }

    const studentsRes = await supabase.from('students').select('id, veracross_id')
    const studentMap = new Map<string, string>()
    for (const s of studentsRes.data ?? []) {
      if (s.veracross_id) studentMap.set(s.veracross_id, s.id)
    }

    // TODO: Replace with actual Veracross contacts endpoint
    const contactsRes = await vxFetch('/contacts', vxToken).catch(() => ({ data: [] }))
    const vxContacts: any[] = contactsRes.data ?? contactsRes

    for (const vx of vxContacts) {
      try {
        // TODO: Adjust field names: vx.sponsoring_parent_pk, vx.student_pks
        const guardianId = guardianMap.get(String(vx.sponsoring_parent_pk ?? ''))
        if (!guardianId) continue

        const studentIds = (vx.student_pks ?? [])
          .map((pk: any) => studentMap.get(String(pk)))
          .filter(Boolean) as string[]

        const row = mapVxAuthorizedPickup(vx, guardianId, studentIds)
        const { error } = await supabase
          .from('authorized_pickups')
          .upsert(row, { onConflict: 'veracross_id' })
        if (error) throw error
        synced.authorized_pickups++
      } catch (err: any) {
        errors.push(`authorized_pickup ${vx.person_pk}: ${err.message}`)
      }
    }
  } catch (err: any) {
    errors.push(`authorized_pickups fetch: ${err.message}`)
  }

  return new Response(
    JSON.stringify({ ok: errors.length === 0, synced, errors }),
    {
      status: errors.length === 0 ? 200 : 207,
      headers: { 'Content-Type': 'application/json' },
    },
  )
})
