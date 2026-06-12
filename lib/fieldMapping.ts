import type { UniversalLead, FunnelStage, LeadSource } from './leadTypes';
import { FUNNEL_STAGES } from './leadTypes';

const STAGE_MAP: Record<string, FunnelStage> = {
  'new inquiry': 'New Inquiry', 'new': 'New Inquiry', 'inquiry': 'New Inquiry',
  'first contact': 'First Contact', 'contacted': 'First Contact', 'contact': 'First Contact',
  'qualified': 'Qualified', 'qualify': 'Qualified',
  'consultation': 'Consultation', 'consult': 'Consultation',
  'site visit': 'Site Visit', 'visit': 'Site Visit', 'site': 'Site Visit',
  'proposal sent': 'Proposal Sent', 'proposal': 'Proposal Sent',
  'quotation sent': 'Quotation Sent', 'quotation': 'Quotation Sent', 'quote': 'Quotation Sent', 'quoted': 'Quotation Sent',
  'negotiation': 'Negotiation', 'negotiate': 'Negotiation',
  'advance received': 'Advance Received', 'advance': 'Advance Received', 'booking': 'Advance Received', 'booked': 'Advance Received',
  'execution': 'Execution', 'in progress': 'Execution', 'wip': 'Execution', 'active project': 'Execution',
  'completed': 'Completed', 'complete': 'Completed', 'done': 'Completed', 'delivered': 'Completed',
  'lost': 'Lost', 'dropped': 'Lost', 'cancelled': 'Lost', 'canceled': 'Lost',
};

const SOURCE_MAP: Record<string, LeadSource> = {
  'whatsapp': 'WhatsApp', 'wa': 'WhatsApp',
  'instagram': 'Instagram', 'ig': 'Instagram', 'insta': 'Instagram',
  'referral': 'Referral', 'referred': 'Referral', 'reference': 'Referral',
  'website': 'Website', 'web': 'Website', 'online': 'Website',
  'phone': 'Phone Call', 'phone call': 'Phone Call', 'call': 'Phone Call', 'telecall': 'Phone Call',
  'walk-in': 'Walk-in', 'walkin': 'Walk-in', 'walk in': 'Walk-in', 'direct': 'Walk-in',
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchField(headers: string[], candidates: string[]): string | undefined {
  for (const c of candidates) {
    const found = headers.find((h) => norm(h) === norm(c) || norm(h).includes(norm(c)) || norm(c).includes(norm(h)));
    if (found) return found;
  }
  return undefined;
}

export interface ColumnMap {
  id?: string;
  client?: string;
  source?: string;
  location?: string;
  requirement?: string;
  stage?: string;
  owner?: string;
  lastContacted?: string;
  daysInStage?: string;
  value?: string;
  nextAction?: string;
}

export function detectColumns(headers: string[]): ColumnMap {
  return {
    id: matchField(headers, ['id', 'lead id', 'leadid', 'lead_id', 'ref', 'reference', 'ticket']),
    client: matchField(headers, ['client', 'name', 'customer', 'lead name', 'contact name', 'full name', 'prospect']),
    source: matchField(headers, ['source', 'lead source', 'channel', 'origin', 'how did you hear']),
    location: matchField(headers, ['location', 'city', 'area', 'address', 'locality', 'place']),
    requirement: matchField(headers, ['requirement', 'requirements', 'project', 'scope', 'work', 'description', 'details']),
    stage: matchField(headers, ['stage', 'status', 'pipeline stage', 'funnel stage', 'current stage', 'phase']),
    owner: matchField(headers, ['owner', 'assigned to', 'sales rep', 'team member', 'designer', 'assigned', 'rep', 'agent']),
    lastContacted: matchField(headers, ['last contacted', 'last contact', 'last follow up', 'follow up date', 'contact date', 'last activity']),
    daysInStage: matchField(headers, ['days in stage', 'days', 'age', 'days stuck', 'stage days', 'days old']),
    value: matchField(headers, ['value', 'budget', 'project value', 'deal value', 'amount', 'revenue', 'deal size']),
    nextAction: matchField(headers, ['next action', 'action', 'next step', 'follow up', 'remarks', 'notes', 'comment']),
  };
}

function mapStage(raw: string): FunnelStage {
  const key = raw.toLowerCase().trim();
  return STAGE_MAP[key] || (FUNNEL_STAGES.find((s) => s.toLowerCase() === key) as FunnelStage) || 'New Inquiry';
}

function mapSource(raw: string): LeadSource {
  const key = raw.toLowerCase().trim();
  return SOURCE_MAP[key] || 'Other';
}

function parseValue(raw: string): number {
  const cleaned = raw.replace(/[₹,\s]/g, '').replace(/l$/i, '').replace(/lakh/i, '').replace(/lac/i, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function parseDays(raw: string): number {
  const n = parseInt(raw.replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

export function mapRowsToLeads(rows: Record<string, string>[], colMap: ColumnMap): UniversalLead[] {
  return rows
    .filter((row) => Object.values(row).some((v) => v?.trim()))
    .map((row, i) => {
      const get = (key: keyof ColumnMap) => (colMap[key] ? (row[colMap[key]!] || '').trim() : '');
      return {
        id: get('id') || `L-${String(i + 1).padStart(3, '0')}`,
        client: get('client') || `Lead ${i + 1}`,
        source: mapSource(get('source') || 'Other'),
        location: get('location') || '—',
        requirement: get('requirement') || '—',
        stage: mapStage(get('stage') || 'New Inquiry'),
        owner: get('owner') || 'Unassigned',
        lastContacted: get('lastContacted') || '—',
        daysInStage: parseDays(get('daysInStage') || '0'),
        value: parseValue(get('value') || '0'),
        nextAction: get('nextAction') || '—',
      };
    });
}
