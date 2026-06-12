'use client';

import LeadTable from '../LeadTable';

export default function LeadsView() {
  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-white font-bold text-lg">Lead Management</h2>
        <p className="text-slate-500 text-sm mt-0.5">All leads — search, filter, and review</p>
      </div>
      <LeadTable />
    </div>
  );
}
