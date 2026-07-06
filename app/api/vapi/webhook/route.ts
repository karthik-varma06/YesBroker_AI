import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

/**
 * POST /api/vapi/webhook
 *
 * Thin proxy: forwards Vapi events to production n8n (N8N_WEBHOOK_URL)
 * and mirrors call state into Supabase for the dashboard.
 *
 * n8n workflow path: vapi-real-estate (Real Estate Voice Agent Pro)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const supabase = getServiceClient();

  const msg = body.message ?? body;
  const eventType = String(
    msg.type || body.event || body.type || ''
  ).toLowerCase();

  const call = msg.call ?? body.call ?? {};
  const callId = call.id ?? body.callId ?? msg.callId ?? '';
  const assistantId = call.assistantId ?? body.assistantId ?? '';
  const customer = call.customer ?? body.customer ?? {};
  const customerPhone = customer.number ?? customer.phone ?? body.customerPhone ?? '';
  const customerName = customer.name ?? body.customerName ?? '';
  const transcript =
    msg.artifact?.transcript ??
    body.artifact?.transcript ??
    body.transcript ??
    '';
  const summary =
    msg.analysis?.summary ??
    body.analysis?.summary ??
    body.artifact?.summary ??
    msg.artifact?.summary ??
    body.summary ??
    '';
  const structured = msg.analysis?.structuredData ?? body.analysis?.structuredData ?? {};
  const recordingUrl =
    msg.artifact?.recording ??
    msg.artifact?.recordingUrl ??
    body.artifact?.recording ??
    '';

  // ── 1. Forward to production n8n ────────────────────────────────────────
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nUrl) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(err => console.error('[vapi→n8n]', err));
  }

  // ── 2. Mirror to Supabase (same fields n8n writes) ──────────────────────
  try {
    if (eventType === 'call-started' && callId) {
      await supabase.from('call_logs').upsert(
        {
          call_id: callId,
          assistant_id: assistantId,
          customer_name: customerName,
          customer_phone: customerPhone,
          event_type: eventType,
          route: 'call_started',
          call_status: 'active',
          received_at: new Date().toISOString(),
          raw_payload: body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'call_id' }
      );
    }

    if (
      (eventType === 'call-ended' ||
        eventType === 'end-of-call-report' ||
        eventType === 'analysis-ready') &&
      callId
    ) {
      const duration =
        msg.duration ??
        body.duration ??
        msg.artifact?.duration ??
        null;

      await supabase.from('call_logs').upsert(
        {
          call_id: callId,
          assistant_id: assistantId,
          customer_name: customerName,
          customer_phone: customerPhone,
          event_type: eventType,
          route: 'call_end',
          transcript,
          summary,
          sentiment: structured.sentiment ?? msg.analysis?.successEvaluation ?? null,
          interest_score: structured.interestScore ?? null,
          next_action: structured.nextAction ?? null,
          recording_url: recordingUrl,
          duration_seconds: duration,
          call_status: 'ended',
          ended_reason: msg.endedReason ?? body.endedReason ?? '',
          raw_payload: body,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'call_id' }
      );

      await supabase.from('call_analytics').insert({
        call_id: callId,
        customer_name: customerName,
        budget: structured.budget ?? '',
        preferred_location: structured.preferredLocation ?? '',
        interest_score: structured.interestScore ?? null,
        sentiment: structured.sentiment ?? '',
        next_action: structured.nextAction ?? '',
        summary,
        call_duration_seconds: duration,
        property_queried: structured.propertyQueried ?? '',
        visit_booked: Boolean(structured.visitBooked),
        recording_url: recordingUrl,
      });
    }
  } catch (err) {
    console.error('[vapi webhook supabase]', err);
  }

  return NextResponse.json({ received: true, eventType, forwarded: Boolean(n8nUrl) });
}

export async function GET() {
  return NextResponse.json({
    status: 'Vapi webhook ready',
    n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
  });
}
