// CarLine — CSV Import Edge Function
// Accepts a multipart or raw-body CSV file and bulk-upserts into Supabase.
//
// Supported types (passed as ?type= query param):
//   students          — columns: first_name, last_name, grade, homeroom, teacher_name, tint_index, veracross_id
//   guardians         — columns: first_name, last_name, email, phone, is_primary, veracross_id
//   guardian_students — columns: guardian_email, student_veracross_id
//
// Usage:
//   curl -X POST \
//     'https://<project>.supabase.co/functions/v1/import-csv?type=students' \
//     -H 'Authorization: Bearer <SERVICE_ROLE_KEY>' \
//     -H 'Content-Type: text/csv' \
//     --data-binary @students.csv

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BATCH_SIZE = 50

// ── Simple CSV parser (no external deps) ─────────────────────────────────────

/**
 * Parses a CSV string into an array of objects keyed by the header row.
 * Handles:
 *   - CRLF and LF line endings
 *   - Quoted fields containing commas or newlines
 *   - Double-quote escaping ("" → ")
 *   - Trailing newlines
 */
function parseCSV(text: string): Record<string, string>[] {
  // Normalize line endings
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!normalized) return []

  const lines = splitCSVLines(normalized)
  if (lines.length < 2) return []

  const headers = parseCSVRow(lines[0])
  const records: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = parseCSVRow(line)
    const record: Record<string, string> = {}
    for (let j = 0; j < headers.length; j++) {
      record[headers[j].trim()] = values[j]?.trim() ?? ''
    }
    records.push(record)
  }

  return records
}

/**
 * Splits CSV text into logical lines, respecting quoted fields that span lines.
 */
function splitCSVLines(text: string): string[] {
  const lines: string[] = []
  let current = ''
  let inQuote = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuote && text[i + 1] === '"') {
        current += '"'
        i++ // skip escaped quote
      } else {
        inQuote = !inQuote
        current += ch
      }
    } else if (ch === '\n' && !inQuote) {
      lines.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  if (current) lines.push(current)
  return lines
}

/**
 * Parses a single CSV row into an array of field values.
 * Strips surrounding quotes and un-escapes double-quotes.
 */
function parseCSVRow(row: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuote = false

  for (let i = 0; i < row.length; i++) {
    const ch = row[i]
    if (ch === '"') {
      if (inQuote && row[i + 1] === '"') {
        field += '"'
        i++
      } else {
        inQuote = !inQuote
      }
    } else if (ch === ',' && !inQuote) {
      fields.push(field)
      field = ''
    } else {
      field += ch
    }
  }
  fields.push(field)
  return fields
}

// ── Batch upsert helper ───────────────────────────────────────────────────────

async function batchUpsert(
  supabase: ReturnType<typeof createClient>,
  table: string,
  rows: Record<string, any>[],
  conflictColumn: string,
): Promise<{ imported: number; errors: string[] }> {
  let imported = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from(table)
      .upsert(batch, { onConflict: conflictColumn })

    if (error) {
      errors.push(`batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
    } else {
      imported += batch.length
    }
  }

  return { imported, errors }
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function mapStudentRow(r: Record<string, string>) {
  const tintIndex = parseInt(r.tint_index, 10)
  return {
    first_name: r.first_name,
    last_name: r.last_name,
    grade: r.grade,
    homeroom: r.homeroom,
    teacher_name: r.teacher_name,
    tint_index: isNaN(tintIndex) ? 0 : Math.min(4, Math.max(0, tintIndex)),
    veracross_id: r.veracross_id || null,
  }
}

function mapGuardianRow(r: Record<string, string>) {
  return {
    first_name: r.first_name,
    last_name: r.last_name,
    email: r.email,
    phone: r.phone || null,
    is_primary: r.is_primary?.toLowerCase() === 'true',
    veracross_id: r.veracross_id || null,
    role: 'guardian' as const,
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (req) => {
  // Only service-role callers may import data
  const authHeader = req.headers.get('Authorization') ?? ''
  const callerToken = authHeader.replace('Bearer ', '')
  if (callerToken !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(req.url)
  const type = url.searchParams.get('type')

  if (!type || !['students', 'guardians', 'guardian_students'].includes(type)) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid ?type= (students | guardians | guardian_students)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const csvText = await req.text()
  if (!csvText.trim()) {
    return new Response(
      JSON.stringify({ error: 'Empty CSV body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const records = parseCSV(csvText)
  if (records.length === 0) {
    return new Response(
      JSON.stringify({ imported: 0, skipped: 0, errors: ['No data rows found in CSV'] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  let imported = 0
  let skipped = 0
  let errors: string[] = []

  // ── students ────────────────────────────────────────────────────────────────
  if (type === 'students') {
    const rows: Record<string, any>[] = []

    for (let i = 0; i < records.length; i++) {
      const r = records[i]
      if (!r.first_name || !r.last_name || !r.grade || !r.homeroom || !r.teacher_name) {
        skipped++
        errors.push(`row ${i + 2}: missing required fields (first_name, last_name, grade, homeroom, teacher_name)`)
        continue
      }
      rows.push(mapStudentRow(r))
    }

    const result = await batchUpsert(supabase, 'students', rows, 'veracross_id')
    imported = result.imported
    errors = [...errors, ...result.errors]
  }

  // ── guardians ───────────────────────────────────────────────────────────────
  else if (type === 'guardians') {
    const rows: Record<string, any>[] = []

    for (let i = 0; i < records.length; i++) {
      const r = records[i]
      if (!r.first_name || !r.last_name || !r.email) {
        skipped++
        errors.push(`row ${i + 2}: missing required fields (first_name, last_name, email)`)
        continue
      }
      rows.push(mapGuardianRow(r))
    }

    const result = await batchUpsert(supabase, 'guardians', rows, 'email')
    imported = result.imported
    errors = [...errors, ...result.errors]
  }

  // ── guardian_students ────────────────────────────────────────────────────────
  // CSV columns: guardian_email, student_veracross_id
  // Looks up both IDs before inserting the junction row.
  else if (type === 'guardian_students') {
    for (let i = 0; i < records.length; i++) {
      const r = records[i]

      if (!r.guardian_email || !r.student_veracross_id) {
        skipped++
        errors.push(`row ${i + 2}: missing guardian_email or student_veracross_id`)
        continue
      }

      // Resolve guardian by email
      const { data: guardian, error: gErr } = await supabase
        .from('guardians')
        .select('id')
        .eq('email', r.guardian_email)
        .single()

      if (gErr || !guardian) {
        skipped++
        errors.push(`row ${i + 2}: guardian not found for email "${r.guardian_email}"`)
        continue
      }

      // Resolve student by veracross_id
      const { data: student, error: sErr } = await supabase
        .from('students')
        .select('id')
        .eq('veracross_id', r.student_veracross_id)
        .single()

      if (sErr || !student) {
        skipped++
        errors.push(`row ${i + 2}: student not found for veracross_id "${r.student_veracross_id}"`)
        continue
      }

      const { error } = await supabase
        .from('guardian_students')
        .upsert(
          { guardian_id: guardian.id, student_id: student.id },
          { onConflict: 'guardian_id,student_id' },
        )

      if (error) {
        errors.push(`row ${i + 2}: ${error.message}`)
      } else {
        imported++
      }
    }
  }

  const status = errors.length > 0 && imported === 0 ? 422 : 200

  return new Response(
    JSON.stringify({ imported, skipped, errors }),
    { status, headers: { 'Content-Type': 'application/json' } },
  )
})
