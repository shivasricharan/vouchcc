import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function clean(value: unknown, max = 300): string {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const webhook = process.env.SHEET_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!webhook) return NextResponse.json({ success: true, logged: false });

    const summary = body.summary && typeof body.summary === 'object'
      ? body.summary as Record<string, unknown>
      : {};

    const payload = JSON.stringify({
      formType: 'decision_brief_request',
      sheetName: 'Vouch Pilot Leads',
      timestamp: new Date().toISOString(),
      sourcePage: 'demo.yourvouch.com',
      name: clean(body.name, 80),
      email: clean(body.email, 160),
      company: clean(body.company, 120),
      role: clean(body.role, 80),
      pilotConsent: body.pilotConsent === true ? 'Yes' : 'No',
      recordCount: Number(summary.recordCount || 0),
      followUpCount: Number(summary.followUpCount || 0),
      stuckCount: Number(summary.stuckCount || 0),
      atRiskValue: Number(summary.atRiskValue || 0),
      mappingConfidence: Number(summary.mappingConfidence || 0),
    });

    await fetch(webhook, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload,
      signal: AbortSignal.timeout(10000),
    });

    return NextResponse.json({ success: true, logged: true });
  } catch (error) {
    console.error('Demo lead logging failed', error);
    return NextResponse.json({ success: true, logged: false });
  }
}
