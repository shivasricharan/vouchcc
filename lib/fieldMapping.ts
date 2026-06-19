import type { UniversalLead, LeadSource, TemplateId } from './leadTypes';
import { TEMPLATES } from './leadTypes';

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchField(headers: string[], candidates: string[]): string | undefined {
  for (const c of candidates) {
    const cn = norm(c);
    const found = headers.find((h) => {
      const hn = norm(h);
      return hn === cn || hn.includes(cn) || cn.includes(hn);
    });
    if (found) return found;
  }
  return undefined;
}

export interface ColumnMap {
  id?: string;
  client?: string;
  phone?: string;
  email?: string;
  source?: string;
  location?: string;
  requirement?: string;
  stage?: string;
  status?: string;
  ownerTeam?: string;
  owner?: string;
  createdAt?: string;
  lastContacted?: string;
  daysInStage?: string;
  daysSinceUpdate?: string;
  value?: string;
  probability?: string;
  nextAction?: string;
}

export const FIELD_DEFS: { key: keyof ColumnMap; label: string; required?: boolean; candidates: string[] }[] = [
  { key: 'client', label: 'Client Name', required: true, candidates: ['client', 'name', 'full name', 'customer', 'customer name', 'lead name', 'contact name', 'prospect', 'company', 'business name', 'student name', 'patient name', 'buyer'] },
  { key: 'stage', label: 'Stage / Status', required: true, candidates: ['stage', 'status', 'pipeline stage', 'current stage', 'funnel stage', 'lead status', 'current status', 'phase', 'step'] },
  { key: 'source', label: 'Lead Source', candidates: ['source', 'lead source', 'channel', 'campaign', 'origin', 'how did you hear', 'medium', 'utm source', 'marketing channel', 'referral source'] },
  { key: 'owner', label: 'Assigned To', candidates: ['owner', 'assigned to', 'assigned', 'sales person', 'salesperson', 'agent', 'team member', 'rep', 'sales rep', 'account manager', 'counselor', 'advisor', 'designer'] },
  { key: 'value', label: 'Deal Value', candidates: ['value', 'deal value', 'budget', 'amount', 'project value', 'revenue', 'deal size', 'expected value', 'total value', 'contract value', 'fee', 'price', 'cost'] },
  { key: 'phone', label: 'Phone', candidates: ['phone', 'mobile', 'whatsapp', 'contact number', 'phone number', 'cell', 'telephone', 'mobile number', 'contact'] },
  { key: 'email', label: 'Email', candidates: ['email', 'email address', 'email id', 'mail', 'e-mail'] },
  { key: 'location', label: 'Location / City', candidates: ['location', 'city', 'area', 'address', 'locality', 'place', 'region', 'state', 'country', 'zone'] },
  { key: 'requirement', label: 'Requirement', candidates: ['requirement', 'requirements', 'project', 'scope', 'work', 'description', 'details', 'service', 'product', 'need', 'interest', 'course', 'property type'] },
  { key: 'createdAt', label: 'Created Date', candidates: ['created', 'created at', 'created date', 'lead date', 'enquiry date', 'date', 'registration date', 'signup date', 'entry date', 'date added', 'date created'] },
  { key: 'lastContacted', label: 'Last Updated', candidates: ['last contacted', 'last contact', 'last updated', 'last follow up', 'follow up date', 'follow-up date', 'contact date', 'last activity', 'updated', 'updated at', 'last modified', 'last touch'] },
  { key: 'daysInStage', label: 'Days in Stage', candidates: ['days in stage', 'days', 'age', 'days stuck', 'stage days', 'days old', 'lead age'] },
  { key: 'daysSinceUpdate', label: 'Days Since Update', candidates: ['days since update', 'days inactive', 'inactivity', 'days since contact'] },
  { key: 'probability', label: 'Probability', candidates: ['probability', 'likelihood', 'confidence', 'win probability', 'close probability', 'chance'] },
  { key: 'nextAction', label: 'Next Action', candidates: ['next action', 'action', 'next step', 'follow up', 'remarks', 'notes', 'comment', 'todo', 'task'] },
  { key: 'ownerTeam', label: 'Team', candidates: ['team', 'department', 'group', 'division', 'owner team'] },
  { key: 'status', label: 'Status', candidates: ['status', 'lead status', 'current status', 'active', 'state'] },
  { key: 'id', label: 'Lead ID', candidates: ['id', 'lead id', 'leadid', 'lead_id', 'ref', 'reference', 'ticket', 'ticket id', 'sr no', 'serial', 'number'] },
];

export function detectColumns(headers: string[]): ColumnMap {
  const map: ColumnMap = {};
  const used = new Set<string>();

  for (const def of FIELD_DEFS) {
    const match = matchField(
      headers.filter((h) => !used.has(h)),
      def.candidates
    );
    if (match) {
      (map as Record<string, string>)[def.key] = match;
      used.add(match);
    }
  }
  return map;
}

export function getMappingConfidence(headers: string[], colMap: ColumnMap): number {
  const totalFields = FIELD_DEFS.length;
  let mapped = 0;
  let requiredMapped = 0;
  let requiredTotal = 0;

  for (const def of FIELD_DEFS) {
    if (def.required) requiredTotal++;
    if (colMap[def.key]) {
      mapped++;
      if (def.required) requiredMapped++;
    }
  }

  const requiredScore = requiredTotal > 0 ? (requiredMapped / requiredTotal) * 50 : 25;
  const optionalScore = (mapped / totalFields) * 50;
  return Math.round(requiredScore + optionalScore);
}

// ─── Stage normalization ─────────────────────────────────────

const STAGE_ALIASES: Record<string, string> = {
  'new': 'New Inquiry', 'new inquiry': 'New Inquiry', 'new lead': 'New Inquiry', 'inquiry': 'New Inquiry', 'enquiry': 'New Inquiry',
  'first contact': 'First Contact', 'contacted': 'First Contact', 'contact': 'First Contact', 'called': 'First Contact',
  'qualified': 'Qualified', 'qualify': 'Qualified', 'mql': 'Qualified', 'sql': 'Qualified',
  'consultation': 'Consultation', 'consult': 'Consultation', 'counselling': 'Consultation', 'counseling': 'Consultation', 'meeting': 'Consultation',
  'site visit': 'Site Visit', 'visit': 'Site Visit', 'site': 'Site Visit',
  'proposal sent': 'Proposal Sent', 'proposal': 'Proposal Sent', 'proposal shared': 'Proposal Sent',
  'quotation sent': 'Quotation Sent', 'quotation': 'Quotation Sent', 'quote': 'Quotation Sent', 'quoted': 'Quotation Sent', 'quote sent': 'Quotation Sent',
  'negotiation': 'Negotiation', 'negotiate': 'Negotiation', 'pricing discussion': 'Negotiation',
  'advance received': 'Advance Received', 'advance': 'Advance Received', 'booking': 'Advance Received', 'booked': 'Advance Received', 'deposit': 'Advance Received',
  'execution': 'Execution', 'in progress': 'Execution', 'wip': 'Execution', 'active project': 'Execution', 'work started': 'Execution', 'in treatment': 'Execution',
  'completed': 'Completed', 'complete': 'Completed', 'done': 'Completed', 'delivered': 'Completed', 'closed': 'Completed', 'registered': 'Completed', 'enrolled': 'Completed',
  'lost': 'Lost', 'dropped': 'Lost', 'cancelled': 'Lost', 'canceled': 'Lost', 'dead': 'Lost', 'rejected': 'Lost', 'not interested': 'Lost',
  'demo booked': 'Demo Booked', 'demo scheduled': 'Demo Booked',
  'demo completed': 'Demo Completed', 'demo done': 'Demo Completed',
  'trial started': 'Trial Started', 'trial': 'Trial Started', 'free trial': 'Trial Started',
  'contract sent': 'Contract Sent', 'contract': 'Contract Sent', 'agreement sent': 'Contract Sent',
  'closed won': 'Closed Won', 'won': 'Closed Won', 'converted': 'Closed Won',
  'closed lost': 'Closed Lost',
  'onboarding': 'Onboarding', 'onboard': 'Onboarding',
  'active customer': 'Active Customer', 'active': 'Active Customer',
  'follow up': 'Follow-up', 'follow-up': 'Follow-up', 'followup': 'Follow-up',
  'requirement captured': 'Requirement Captured', 'requirement': 'Requirement Captured',
  'appointment booked': 'Consultation', 'appointment': 'Consultation',
  'treatment plan': 'Proposal Sent', 'plan': 'Proposal Sent',
  'payment': 'Advance Received', 'fee paid': 'Advance Received',
  'interested': 'Qualified', 'warm': 'Qualified', 'hot': 'Negotiation', 'cold': 'New Inquiry',
  'application': 'Qualified', 'document submitted': 'Proposal Sent', 'admission offered': 'Quotation Sent',
  'agreement': 'Advance Received', 'planning': 'Execution',
};

function normalizeStage(raw: string): string {
  const key = raw.toLowerCase().trim();
  return STAGE_ALIASES[key] || raw.trim();
}

// ─── Source normalization ─────────────────────────────────────

const SOURCE_ALIASES: Record<string, LeadSource> = {
  'whatsapp': 'WhatsApp', 'wa': 'WhatsApp', 'whats app': 'WhatsApp',
  'instagram': 'Instagram', 'ig': 'Instagram', 'insta': 'Instagram',
  'referral': 'Referral', 'referred': 'Referral', 'reference': 'Referral', 'word of mouth': 'Referral',
  'website': 'Website', 'web': 'Website', 'online': 'Website', 'organic': 'Website', 'seo': 'Website',
  'phone': 'Phone Call', 'phone call': 'Phone Call', 'call': 'Phone Call', 'telecall': 'Phone Call', 'inbound call': 'Phone Call',
  'walk-in': 'Walk-in', 'walkin': 'Walk-in', 'walk in': 'Walk-in', 'direct': 'Walk-in', 'office visit': 'Walk-in',
  'email': 'Email', 'mail': 'Email', 'e-mail': 'Email',
  'linkedin': 'LinkedIn', 'linked in': 'LinkedIn',
  'facebook': 'Facebook', 'fb': 'Facebook', 'meta': 'Facebook',
  'google': 'Google Ads', 'google ads': 'Google Ads', 'adwords': 'Google Ads', 'ppc': 'Google Ads', 'sem': 'Google Ads',
  'campaign': 'Campaign', 'marketing': 'Campaign', 'ad': 'Campaign', 'advertisement': 'Campaign',
};

function normalizeSource(raw: string): LeadSource {
  const key = raw.toLowerCase().trim();
  return SOURCE_ALIASES[key] || 'Other';
}

function parseValue(raw: string): number {
  const cleaned = raw.replace(/[₹$€£,\s]/g, '').replace(/l$/i, '').replace(/lakh/i, '').replace(/lac/i, '').replace(/cr$/i, '').replace(/crore/i, '').replace(/k$/i, '');
  const n = parseFloat(cleaned);
  if (isNaN(n)) return 0;
  if (/cr(ore)?$/i.test(raw.trim())) return n * 100;
  if (/k$/i.test(raw.trim())) return n / 100;
  return n;
}

function parseDays(raw: string): number {
  const n = parseInt(raw.replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function parseProbability(raw: string, stage: string): number {
  if (raw) {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!isNaN(n)) return Math.min(100, n);
  }
  return inferProbability(stage);
}

function inferProbability(stage: string): number {
  const s = stage.toLowerCase();
  if (['completed', 'closed won', 'won', 'converted', 'active customer', 'enrolled', 'registered'].some(k => s.includes(k))) return 100;
  if (['lost', 'closed lost', 'cancelled', 'dead', 'dropped'].some(k => s.includes(k))) return 0;
  if (['advance', 'booking', 'deposit', 'payment', 'fee paid', 'agreement'].some(k => s.includes(k))) return 90;
  if (['execution', 'work started', 'in treatment', 'onboarding', 'planning'].some(k => s.includes(k))) return 85;
  if (['negotiation', 'negotiate', 'pricing'].some(k => s.includes(k))) return 60;
  if (['quotation', 'quote', 'contract'].some(k => s.includes(k))) return 45;
  if (['proposal'].some(k => s.includes(k))) return 35;
  if (['consultation', 'site visit', 'demo completed', 'visit', 'meeting', 'counselling'].some(k => s.includes(k))) return 25;
  if (['qualified', 'interested', 'trial', 'application'].some(k => s.includes(k))) return 20;
  if (['first contact', 'contacted', 'called'].some(k => s.includes(k))) return 10;
  return 5;
}

function inferStatus(stage: string, daysInStage: number): string {
  const lc = stage.toLowerCase();
  if (['lost', 'closed lost', 'cancelled', 'dead', 'dropped'].some(k => lc.includes(k))) return 'lost';
  if (['completed', 'closed won', 'won', 'active customer', 'enrolled', 'registered'].some(k => lc.includes(k))) return 'won';
  if (['advance', 'execution', 'work started', 'booking', 'onboarding', 'planning', 'in treatment'].some(k => lc.includes(k))) return 'won';
  if (daysInStage >= 7) return 'stuck';
  return 'active';
}

function daysBetween(dateStr: string): number {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 0;
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
}

export function mapRowsToLeads(rows: Record<string, string>[], colMap: ColumnMap): UniversalLead[] {
  return rows
    .filter((row) => Object.values(row).some((v) => v?.trim()))
    .map((row, i) => {
      const get = (key: keyof ColumnMap) => (colMap[key] ? (row[colMap[key]!] || '').trim() : '');

      const rawStage = get('stage') || get('status') || 'New Inquiry';
      const stage = normalizeStage(rawStage);

      const rawDays = get('daysInStage');
      const rawLastContacted = get('lastContacted');
      const rawCreatedAt = get('createdAt');
      const daysInStage = rawDays ? parseDays(rawDays) : (rawLastContacted ? daysBetween(rawLastContacted) : (rawCreatedAt ? daysBetween(rawCreatedAt) : 0));

      const rawDaysSinceUpdate = get('daysSinceUpdate');
      const daysSinceUpdate = rawDaysSinceUpdate ? parseDays(rawDaysSinceUpdate) : (rawLastContacted ? daysBetween(rawLastContacted) : daysInStage);

      const status = get('status') ? get('status') : inferStatus(stage, daysInStage);

      return {
        id: get('id') || `L-${String(i + 1).padStart(3, '0')}`,
        client: get('client') || `Lead ${i + 1}`,
        phone: get('phone') || '—',
        email: get('email') || '—',
        source: normalizeSource(get('source') || 'Other'),
        location: get('location') || '—',
        requirement: get('requirement') || '—',
        stage,
        status,
        ownerTeam: get('ownerTeam') || '—',
        owner: get('owner') || 'Unassigned',
        createdAt: get('createdAt') || '—',
        lastContacted: get('lastContacted') || rawCreatedAt || '—',
        daysInStage,
        daysSinceUpdate,
        value: parseValue(get('value') || '0'),
        probability: parseProbability(get('probability'), stage),
        nextAction: get('nextAction') || inferNextAction(stage),
      };
    });
}

function inferNextAction(stage: string): string {
  const s = stage.toLowerCase();
  if (s.includes('new') || s.includes('enquiry') || s.includes('inquiry')) return 'Send welcome message and qualify';
  if (s.includes('first contact') || s.includes('contacted')) return 'Schedule detailed discussion';
  if (s.includes('qualified') || s.includes('interested')) return 'Book consultation or demo';
  if (s.includes('consultation') || s.includes('demo') || s.includes('visit')) return 'Prepare and send proposal';
  if (s.includes('proposal') || s.includes('quotation') || s.includes('quote') || s.includes('contract')) return 'Follow up for decision';
  if (s.includes('negotiation')) return 'Finalize terms and close';
  if (s.includes('advance') || s.includes('booking') || s.includes('payment')) return 'Begin delivery';
  if (s.includes('execution') || s.includes('work started') || s.includes('onboarding')) return 'Track progress';
  return '—';
}

export function detectTemplate(leads: UniversalLead[]): TemplateId {
  const stages = new Set(leads.map((l) => l.stage.toLowerCase()));

  if (['demo booked', 'demo completed', 'trial started', 'closed won', 'onboarding'].some(s => stages.has(s.toLowerCase()))) return 'saas';
  if (['site visit', 'quotation sent', 'advance received', 'execution'].some(s => stages.has(s.toLowerCase()))) return 'interior';
  if (['appointment booked', 'treatment plan', 'in treatment'].some(s => stages.has(s.toLowerCase()))) return 'healthcare';
  if (['admission offered', 'fee paid', 'enrolled'].some(s => stages.has(s.toLowerCase()))) return 'education';
  if (['booking', 'agreement', 'registered'].some(s => stages.has(s.toLowerCase()))) return 'realestate';
  if (['planning'].some(s => stages.has(s.toLowerCase()))) return 'events';

  return 'service';
}

export function getActiveStages(leads: UniversalLead[], templateId: TemplateId): string[] {
  if (templateId !== 'auto') {
    return TEMPLATES[templateId].stages;
  }
  const stageOrder: string[] = [];
  const seen = new Set<string>();
  for (const l of leads) {
    if (!seen.has(l.stage)) {
      seen.add(l.stage);
      stageOrder.push(l.stage);
    }
  }
  return stageOrder;
}
