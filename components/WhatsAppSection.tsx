const verticals = [
  { icon: '🛋️', label: 'Interior Designers' },
  { icon: '🏛️', label: 'Architects' },
  { icon: '✏️', label: 'Design Studios' },
  { icon: '🤝', label: 'Consultants' },
  { icon: '🔨', label: 'Contractors' },
  { icon: '🏢', label: 'Service Businesses' },
];

export default function WhatsAppSection() {
  return (
    <section className="py-24 bg-navy-800/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1 mb-6">
              <span className="text-green-400 text-sm font-semibold">Built for your business</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 tracking-tight leading-tight">
              Built first for
              <br />
              <span className="gradient-text">WhatsApp-heavy service businesses.</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Vouch is especially useful when high-value enquiries get lost between WhatsApp
              threads, phone calls, Instagram DMs, and manual follow-ups. The leads are
              real. The gaps are avoidable.
            </p>
            <p className="text-slate-400 leading-relaxed">
              If your team runs on WhatsApp and your CRM is a spreadsheet you open once a
              month — Vouch is built for exactly that transition.
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {verticals.map((v) => (
                <div
                  key={v.label}
                  className="flex items-center gap-3 bg-navy-900/60 border border-white/8 rounded-xl px-4 py-3"
                >
                  <span className="text-xl">{v.icon}</span>
                  <span className="text-slate-300 text-sm font-medium">{v.label}</span>
                </div>
              ))}
            </div>

            {/* Pilot example */}
            <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/20 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wide">Pilot Example</span>
              </div>
              <p className="text-white font-semibold text-base leading-relaxed mb-3">
                A design studio receives ~40 enquiries a month.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Without Vouch, 8–12 of those quietly die in WhatsApp before anyone follows
                up. Even recovering 2–3 serious leads from going cold — at ₹8–15L per project
                — creates a meaningful revenue impact every single month.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-slate-400">
                  One extra converted deal can pay for the pilot.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
