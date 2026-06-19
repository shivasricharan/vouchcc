import type { ComputedStats, UniversalLead } from './leadTypes';

export function generateTextSummary(stats: ComputedStats, leads: UniversalLead[], businessName = 'Your Business'): string {
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const topSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[0];
  const topOwner = Object.entries(stats.teamCounts).filter(([k]) => k !== 'Unassigned').sort((a, b) => b[1] - a[1])[0];

  const lines = [
    `VOUCH INSIGHTS — PIPELINE SUMMARY`,
    `${businessName} · Generated ${date}`,
    `${'='.repeat(50)}`,
    ``,
    `OVERVIEW`,
    `  Total Leads       : ${stats.total}`,
    `  Active in Funnel  : ${stats.activeFunnelCount}`,
    `  Stuck (≥7 days)   : ${stats.stuckCount}`,
    `  Pipeline Value    : ₹${(stats.pipelineValue / 100).toFixed(1)} Cr`,
    `  At-Risk Value     : ₹${stats.atRiskValue}L`,
    ``,
    `STAGE BREAKDOWN`,
    ...stats.byStage.map(s => `  ${s.stage.padEnd(22)} : ${String(s.count).padStart(3)} leads   ₹${s.value}L`),
    ``,
    `TOP LEAD SOURCES`,
    ...Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, cnt]) => `  ${src.padEnd(15)} : ${cnt} leads`),
    ``,
    `TEAM WORKLOAD`,
    ...Object.entries(stats.teamCounts).sort((a, b) => b[1] - a[1]).map(([name, cnt]) => `  ${name.padEnd(18)} : ${cnt} leads`),
    ``,
    `URGENT: TOP STUCK LEADS`,
    ...stats.topStuckLeads.slice(0, 5).map(l => `  ${l.id} — ${l.client} (${l.stage}, ${l.daysInStage}d, ₹${l.value}L) → ${l.nextAction}`),
    ``,
    `INSIGHTS`,
    topSource ? `  • Top source: ${topSource[0]} (${topSource[1]} leads)` : '',
    topOwner ? `  • Most loaded: ${topOwner[0]} (${topOwner[1]} leads)` : '',
    stats.stuckCount > 0 ? `  • ${stats.stuckCount} leads stuck ≥7 days — immediate action needed` : '',
    stats.atRiskValue > 0 ? `  • ₹${stats.atRiskValue}L pipeline at risk from stuck high-value leads` : '',
    ``,
    `Powered by Vouch Insights · yourvouch.com`,
  ];
  return lines.filter(l => l !== undefined).join('\n');
}

export function generateHTMLSummary(stats: ComputedStats, leads: UniversalLead[], businessName = 'Your Business'): string {
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Pipeline Summary — ${businessName}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:720px;margin:40px auto;padding:0 24px;color:#1e293b}h1{font-size:22px;margin-bottom:4px}.sub{color:#64748b;font-size:13px;margin-bottom:32px}h2{font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#475569;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:28px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:8px}.kpi{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px}.kpi-val{font-size:24px;font-weight:800}.kpi-label{font-size:11px;color:#94a3b8;margin-top:2px}table{width:100%;border-collapse:collapse;font-size:12px}th{text-align:left;padding:6px 8px;background:#f1f5f9;font-size:10px;text-transform:uppercase;color:#64748b}td{padding:6px 8px;border-bottom:1px solid #f1f5f9}.tag{display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600}.urgent{background:#fee2e2;color:#b91c1c}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px;text-align:center}</style></head><body>
<h1>Pipeline Summary — ${businessName}</h1><p class="sub">Generated ${date} · Powered by Vouch</p>
<h2>Overview</h2><div class="grid">
<div class="kpi"><div class="kpi-val">${stats.total}</div><div class="kpi-label">Total Leads</div></div>
<div class="kpi"><div class="kpi-val">${stats.activeFunnelCount}</div><div class="kpi-label">Active</div></div>
<div class="kpi"><div class="kpi-val">${stats.stuckCount}</div><div class="kpi-label">Stuck</div></div>
<div class="kpi"><div class="kpi-val">₹${(stats.pipelineValue / 100).toFixed(1)} Cr</div><div class="kpi-label">Pipeline</div></div>
<div class="kpi"><div class="kpi-val">₹${stats.atRiskValue}L</div><div class="kpi-label">At Risk</div></div>
<div class="kpi"><div class="kpi-val">${stats.followUpCount}</div><div class="kpi-label">Follow-Up</div></div></div>
<h2>Stages</h2><table><tr><th>Stage</th><th>Count</th><th>Value</th></tr>
${stats.byStage.map(s => `<tr><td>${s.stage}</td><td>${s.count}</td><td>₹${s.value}L</td></tr>`).join('')}</table>
<h2>Stuck Leads</h2><table><tr><th>Lead</th><th>Client</th><th>Stage</th><th>Days</th><th>Value</th><th>Action</th></tr>
${stats.topStuckLeads.slice(0, 8).map(l => `<tr><td>${l.id}</td><td>${l.client}</td><td>${l.stage}</td><td><span class="tag ${l.daysInStage >= 9 ? 'urgent' : ''}">${l.daysInStage}d</span></td><td>₹${l.value}L</td><td style="font-size:11px;color:#64748b">${l.nextAction}</td></tr>`).join('')}</table>
<h2>Team</h2><table><tr><th>Member</th><th>Leads</th></tr>
${Object.entries(stats.teamCounts).sort((a, b) => b[1] - a[1]).map(([n, c]) => `<tr><td>${n}</td><td>${c}</td></tr>`).join('')}</table>
<div class="footer">Vouch Insights · yourvouch.com</div></body></html>`;
}

export function buildMailtoLink(toEmail: string, stats: ComputedStats, businessName = 'Your Business'): string {
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const subject = encodeURIComponent(`Pipeline Summary — ${businessName} · ${date}`);
  const body = encodeURIComponent(generateTextSummary(stats, [], businessName));
  return `mailto:${toEmail}?subject=${subject}&body=${body}`;
}
