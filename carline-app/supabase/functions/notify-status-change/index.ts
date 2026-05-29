import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

interface PickupRequestRecord {
  id: string
  guardian_id: string
  status: string
  student_ids: string[]
  vehicle_id: string | null
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: PickupRequestRecord
  old_record: PickupRequestRecord | null
}

const STATUS_COPY: Record<string, { title: string; body: string }> = {
  arrived: {
    title: "You're in the queue",
    body: "Staff has you — your child's teacher has been notified.",
  },
  called: {
    title: 'Your child is on the way out',
    body: 'Walk toward the curb — staff is bringing them now.',
  },
  released: {
    title: 'Pickup complete',
    body: "Your child is in your car. Drive safe!",
  },
}

serve(async (req) => {
  const secret = req.headers.get('x-webhook-secret')
  if (secret !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 })
  }

  let payload: WebhookPayload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { record, old_record } = payload
  if (!record || record.status === old_record?.status) {
    return new Response('no-op', { status: 200 })
  }

  const copy = STATUS_COPY[record.status]
  if (!copy) return new Response('no-op', { status: 200 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Get guardian's push token
  const { data: guardian } = await supabase
    .from('guardians')
    .select('expo_push_token')
    .eq('id', record.guardian_id)
    .single()

  const token = guardian?.expo_push_token

  // Get student names
  let studentNames = ''
  if (record.student_ids?.length > 0) {
    const { data: students } = await supabase
      .from('students')
      .select('first_name')
      .in('id', record.student_ids)
    studentNames = (students ?? []).map((s: any) => s.first_name).join(' & ')
  }

  const notifBody = studentNames ? `${studentNames}: ${copy.body}` : copy.body

  // Store notification in DB — wrapped to prevent a DB error from killing the webhook
  try {
    const { error: notifError } = await supabase.from('notifications').insert({
      guardian_id: record.guardian_id,
      type: 'status_change',
      title: copy.title,
      body: notifBody,
      target_student_id: record.student_ids?.[0] ?? null,
    })
    if (notifError) console.error('notifications insert failed:', notifError.message)
  } catch (err) {
    console.error('notifications insert threw:', err)
  }

  // Send Expo push if token exists
  if (token) {
    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          title: copy.title,
          body: notifBody,
          sound: 'default',
          data: { requestId: record.id, status: record.status },
        }),
      })
      if (!response.ok) {
        console.error('Expo push failed:', await response.text())
      }
    } catch (err) {
      console.error('Expo push threw:', err)
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
