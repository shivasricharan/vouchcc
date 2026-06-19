'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ArrowRight } from 'lucide-react';

export default function Recommendations() {
  const { stats, leads } = useDashboard();

  const recs = useMemo(() => {
    const list: { text: string; priority: 'high' | 'medium' | 'low' }[] = [];

    const highIntent = leads.filter(l => l.probability >= 60 && l.daysInStage >= 3 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s)));
    if (highIntent.length > 0) {
      list.push({ text: 'Follow up with high-intent leads first', priority: 'high' });
    }

    const slowResponse = leads.filter(l => l.daysInStage >= 2 && ['New Inquiry', 'Enquiry', 'First Contact'].some(s => l.stage.includes(s)));
    if (slowResponse.length > 2) {
      list.push({ text: 'Create a 24-hour response rule for new inquiries', priority: 'high' });
    }

    const lowIntentMixed = leads.filter(l => l.probability <= 20).length;
    const highIntentCount = leads.filter(l => l.probability >= 60).length;
    if (lowIntentMixed > highIntentCount) {
      list.push({ text: 'Separate cold leads from serious leads to focus effort', priority: 'medium' });
    }

    const proposalLeads = leads.filter(l => ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)));
    if (proposalLeads.length > 0) {
      list.push({ text: 'Add proposal follow-up reminders for pending quotes', priority: 'high' });
    }

    if (Object.keys(stats.sourceCounts).length >= 3) {
      list.push({ text: 'Track source quality weekly to find best channels', priority: 'medium' });
    }

    const quotePending = leads.filter(l => ['Quotation Sent', 'Quote Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 5);
    if (quotePending.length > 0) {
      list.push({ text: 'Improve quote-to-close process for pending proposals', priority: 'medium' });
    }

    if (stats.stuckCount > 0) {
      list.push({ text: 'Review stuck leads every Friday', priority: 'medium' });
    }

    const unassigned = stats.teamCounts['Unassigned'] || 0;
    if (unassigned > 0) {
      list.push({ text: 'Assign ownership to unhandled leads immediately', priority: 'high' });
    }

    if (list.length === 0) {
      list.push({ text: 'Upload your data for personalised recommendations', priority: 'low' });
    }

    return list.slice(0, 8);
  }, [stats, leads]);

  const priorityColor = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-blue-500',
  };

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-4">
      <div className="mb-4">
        <div className="text-th-heading font-semibold text-sm">Recommendations</div>
        <div className="text-th-muted text-xs">Practical actions based on your data</div>
      </div>

      <div className="space-y-2">
        {recs.map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <ArrowRight size={12} className={`${priorityColor[rec.priority]} shrink-0 mt-0.5`} />
            <span className="text-th-body leading-relaxed">{rec.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
