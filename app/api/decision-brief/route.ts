import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const FROM_EMAIL = 'Shiva from Vouch <shiva@yourvouch.com>';
const FOUNDER_EMAIL = 'shiva@yourvouch.com';
const TALK_URL = 'https://yourvouch.com/?from=decision-brief#discuss-results';
const DEMO_URL = 'https://demo.yourvouch.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestWindows = new Map<string, number[]>();

interface BriefAction {
  title: string;
  owner: string;
  dueDate: string;
  impact: string;
}

interface BriefRequest {
  name: string;
  email: string;
  company: string;
  role: string;
  reportConsent: boolean;
  pilotConsent: boolean;
  website: string;
  summary: {
    recordCount: number;
    followUpCount: number;
    stuckCount: number;
    atRiskValue: number;
    mappingConfidence: number;
    topPriority: BriefAction | null;
    nextActions: BriefAction[];
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

function cleanText(value: unknown, maximum: number): string {
  return String(value ?? '').trim().slice(0, maximum);
}

function boundedNumber(value: unknown, maximum: number): number {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.min(number, maximum);
}

function cleanAction(value: unknown): BriefAction | null {
  if (!value || typeof value !== 'object') return null;
  const action = value as Record<string, unknown>;
  const title = cleanText(action.title, 180);
  if (!title) return null;
  return {
    title,
    owner: cleanText(action.owner, 80) || 'Team owner',
    dueDate: cleanText(action.dueDate, 60) || 'Review next',
    impact: cleanText(action.impact, 240),
  };
}

function parseBody(value: unknown): BriefRequest | null {
  if (!value || typeof value !== 'object') return null;
  const body = value as Record<string, unknown>;
  const summaryValue = body.summary;
  if (!summaryValue || typeof summaryValue !== 'object') return null;
  const summary = summaryValue as Record<string, unknown>;
  const nextActions = Array.isArray(summary.nextActions)
    ? summary.nextActions.map(cleanAction).filter((action): action is BriefAction => action !== null).slice(0, 2)
    : [];

  return {
    name: cleanText(body.name, 80),
    email: cleanText(body.email, 160).toLowerCase(),
    company: cleanText(body.company, 100),
    role: cleanText(body.role, 60),
    reportConsent: body.reportConsent === true,
    pilotConsent: body.pilotConsent === true,
    website: cleanText(body.website, 200),
    summary: {
      recordCount: Math.round(boundedNumber(summary.recordCount, 100_000)),
      followUpCount: Math.round(boundedNumber(summary.followUpCount, 100_000)),
      stuckCount: Math.round(boundedNumber(summary.stuckCount, 100_000)),
      atRiskValue: boundedNumber(summary.atRiskValue, 10_000_000),
      mappingConfidence: Math.round(boundedNumber(summary.mappingConfidence, 100)),
      topPriority: cleanAction(summary.topPriority),
      nextActions,
    },
  };
}

function formatMoney(value: number): string {
  if (value >= 100) return `₹${(value / 100).toFixed(1)}Cr`;
  if (value >= 10) return `₹${Math.round(value)}L`;
  if (value > 0) return `₹${value.toFixed(1)}L`;
  return 'Not calculated';
}

function allowRequest(key: string): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const recent = (requestWindows.get(key) ?? []).filter(timestamp => timestamp > hourAgo);
  if (recent.length >= 3) return false;
  recent.push(now);
  requestWindows.set(key, recent);
  return true;
}

function actionHtml(action: BriefAction, index?: number): string {
  const prefix = typeof index === 'number' ? `${index + 1}. ` : '';
  return `
    <div style="padding:16px;border:1px solid #e2e8f0;border-radius:12px;margin-top:10px;background:#ffffff">
      <div style="font-size:14px;font-weight:700;color:#0f172a;line-height:1.45">${prefix}${escapeHtml(action.title)}</div>
      ${action.impact ? `<div style="font-size:12px;color:#64748b;line-height:1.55;margin-top:6px">${escapeHtml(action.impact)}</div>` : ''}
      <div style="font-size:11px;color:#94a3b8;margin-top:8px">Owner: ${escapeHtml(action.owner)} &nbsp;·&nbsp; ${escapeHtml(action.dueDate)}</div>
    </div>`;
}

function reportEmail(data: BriefRequest): string {
  const { summary } = data;
  const companyLine = data.company ? ` for ${escapeHtml(data.company)}` : '';
  const priority = summary.topPriority
    ? actionHtml(summary.topPriority)
    : '<div style="padding:16px;border:1px solid #dcfce7;border-radius:12px;background:#f0fdf4;color:#166534">No critical priority was detected in this analysis.</div>';
  const nextActions = summary.nextActions.length > 0
    ? summary.nextActions.map((action, index) => actionHtml(action, index)).join('')
    : '<div style="font-size:13px;color:#64748b">No additional actions were generated.</div>';

  return `<!doctype html>
  <html><body style="margin:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#334155">
    <div style="display:none;max-height:0;overflow:hidden">Your Vouch decision brief is ready.</div>
    <div style="max-width:640px;margin:0 auto;padding:28px 16px">
      <div style="background:#0d1530;border-radius:18px;padding:28px;color:#f8fafc">
        <div style="font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa">Vouch Decision Brief</div>
        <h1 style="font-size:24px;line-height:1.25;margin:12px 0 8px">Here’s what needs your attention${companyLine}.</h1>
        <p style="font-size:14px;line-height:1.6;color:#94a3b8;margin:0">Hi ${escapeHtml(data.name)}, Vouch analysed ${summary.recordCount} records and reduced the result to the signals and actions below.</p>
      </div>

      <div style="display:table;width:100%;border-spacing:8px;margin:18px -8px 8px">
        <div style="display:table-cell;width:33%;padding:16px 10px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#0f172a">${summary.followUpCount}</div><div style="font-size:10px;color:#64748b;margin-top:4px">Needs follow-up</div>
        </div>
        <div style="display:table-cell;width:33%;padding:16px 10px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#0f172a">${summary.stuckCount}</div><div style="font-size:10px;color:#64748b;margin-top:4px">Stalled 7+ days</div>
        </div>
        <div style="display:table-cell;width:33%;padding:16px 10px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#0f172a">${formatMoney(summary.atRiskValue)}</div><div style="font-size:10px;color:#64748b;margin-top:4px">Open value affected</div>
        </div>
      </div>

      <div style="margin-top:24px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#2563eb">Recommended first</div>
      ${priority}

      <div style="margin-top:24px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#2563eb">Then review</div>
      ${nextActions}

      <div style="margin-top:22px;padding:14px 16px;background:#eff6ff;border-radius:12px;font-size:12px;line-height:1.55;color:#475569">
        Data confidence: <strong>${summary.mappingConfidence}%</strong>. This email contains only aggregated insights and recommended actions. Your uploaded CSV and its customer-level records were not sent with this report.
      </div>

      <div style="text-align:center;margin:28px 0 12px">
        <a href="${TALK_URL}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 20px;border-radius:10px">Discuss a 14-day Vouch pilot</a>
      </div>
      <div style="text-align:center;font-size:11px;line-height:1.6;color:#94a3b8">
        Requested through <a href="${DEMO_URL}" style="color:#64748b">demo.yourvouch.com</a><br>
        Shiva from Vouch · <a href="https://yourvouch.com" style="color:#64748b">yourvouch.com</a>
      </div>
    </div>
  </body></html>`;
}

function founderEmail(data: BriefRequest): string {
  const { summary } = data;
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#0f172a;line-height:1.55">
    <h2>Someone requested a Vouch decision brief</h2>
    <p><strong>${escapeHtml(data.name)}</strong>${data.company ? ` from <strong>${escapeHtml(data.company)}</strong>` : ''} requested the report.</p>
    <ul>
      <li>Email: ${escapeHtml(data.email)}</li>
      <li>Role: ${escapeHtml(data.role || 'Not provided')}</li>
      <li>Records analysed: ${summary.recordCount}</li>
      <li>Needs follow-up: ${summary.followUpCount}</li>
      <li>Stalled: ${summary.stuckCount}</li>
      <li>Value affected: ${formatMoney(summary.atRiskValue)}</li>
      <li>Pilot follow-up permission: <strong>${data.pilotConsent ? 'Yes' : 'No'}</strong></li>
    </ul>
    <p>${data.pilotConsent ? 'You may reply to this notification to continue the pilot conversation.' : 'Deliver the requested report only. Do not add this person to marketing follow-ups.'}</p>
  </body></html>`;
}

async function sendEmail(payload: Record<string, unknown>, apiKey: string): Promise<Response> {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12_000),
  });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, message: 'Email delivery is not configured.' }, { status: 503 });
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const allowedHosts = new Set([
        request.nextUrl.host,
        request.headers.get('host'),
        request.headers.get('x-forwarded-host')?.split(',')[0]?.trim(),
        'demo.yourvouch.com',
      ].filter((host): host is string => Boolean(host)));
      if (!allowedHosts.has(new URL(origin).host)) {
        return NextResponse.json({ success: false, message: 'Request origin is not allowed.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ success: false, message: 'Request origin is not valid.' }, { status: 403 });
    }
  }

  try {
    const data = parseBody(await request.json());
    if (!data || !data.name || !EMAIL_PATTERN.test(data.email) || !data.reportConsent) {
      return NextResponse.json({ success: false, message: 'Enter a valid name and email, then confirm report delivery.' }, { status: 400 });
    }
    if (data.website) {
      return NextResponse.json({ success: true, message: 'Your decision brief is on its way.' });
    }
    if (data.summary.recordCount < 1) {
      return NextResponse.json({ success: false, message: 'There is no analysed data to send.' }, { status: 400 });
    }

    const forwardedIp = request.headers.get('x-nf-client-connection-ip')
      ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? 'unknown';
    if (!allowRequest(`ip:${forwardedIp}`) || !allowRequest(`email:${data.email}`)) {
      return NextResponse.json({ success: false, message: 'Too many report requests. Please try again later.' }, { status: 429 });
    }

    const reportResponse = await sendEmail({
      from: FROM_EMAIL,
      to: [data.email],
      reply_to: FOUNDER_EMAIL,
      subject: `${data.company ? `${data.company}: ` : ''}Your Vouch decision brief`,
      html: reportEmail(data),
    }, apiKey);

    if (!reportResponse.ok) {
      const failure = await reportResponse.text();
      console.error('Resend report delivery failed', reportResponse.status, failure.slice(0, 500));
      return NextResponse.json({ success: false, message: 'The report could not be delivered. Please try again.' }, { status: 502 });
    }

    const founderResponse = await sendEmail({
      from: FROM_EMAIL,
      to: [FOUNDER_EMAIL],
      reply_to: data.email,
      subject: `[Vouch demo] ${data.name} requested a decision brief`,
      html: founderEmail(data),
    }, apiKey);
    if (!founderResponse.ok) {
      console.error('Founder notification failed', founderResponse.status, (await founderResponse.text()).slice(0, 500));
    }

    return NextResponse.json({ success: true, message: 'Your decision brief has been emailed.' });
  } catch (error) {
    console.error('Decision brief request failed', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
