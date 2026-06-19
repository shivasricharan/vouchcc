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

    const proposalLeads = leads.filter(l => ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)));
    if (proposalLeads.length > 0) {
      list.push({ text: 'Add proposal follow-up reminders for pending quotes', priority: 'high' });
    }

    const unassigned = stats.teamCounts['Unassigned'] || 0;
    if (unassigned > 0) {
      list.push({ text: 'Assign ownership to unhandled leads immediately', priority: 'high' });
    }

    if (stats.stuckCount > 0) {
      list.push({ text: 'Review stuck leads every Friday', priority: 'medium' });
    }

    if (list.length === 0) {
      list.push({ text: 'Upload your data for personalised recommendations', priority: 'low' });
    }

    return list.slice(0, 5);
  }, [stats, leads]);

  const priorityDot = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500',
  };

  return (
    <div>
      <h2 className="text-th-heading font-bold text-lg mb-4">What To Do Next</h2>

      <div className="space-y-2.5">
        {recs.map((rec, i) => (
          <div key={i} className="bg-th-surface border border-th-border rounded-xl px-4 py-3 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${priorityDot[rec.priority]} shrink-0`} />
            <span className="text-th-body text-sm leading-relaxed flex-1">{rec.text}</span>
            <ArrowRight size={14} className="text-th-muted shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
