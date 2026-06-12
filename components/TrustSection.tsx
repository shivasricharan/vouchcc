const trustPoints = [
  {
    icon: '🔒',
    title: 'Your data stays yours',
    description:
      'All lead data belongs to your business. We never sell, share, or access it for any purpose other than running Vouch for you.',
  },
  {
    icon: '🚫',
    title: 'No spam, no blasting',
    description:
      'Vouch is designed for intelligent, timed follow-up — not mass messaging. Your clients are not a marketing list.',
  },
  {
    icon: '🤝',
    title: 'Consent-first follow-up',
    description:
      'Every follow-up action is triggered by your team, on your timeline. No auto-sends. No surprises for your clients.',
  },
  {
    icon: '👁️',
    title: 'Owner visibility, not surveillance',
    description:
      'The dashboard shows business intelligence — pipeline, conversion, stage. Not personal tracking of employees.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-slate-500/10 border border-slate-500/20 rounded-full px-4 py-1 mb-6">
              <span className="text-slate-300 text-sm font-semibold">Privacy & Trust</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
              Built for owner visibility.
              <br />
              <span className="text-slate-400">Not random blasting.</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              We built Vouch for founders who care about their reputation. Your client
              relationships are sacred. We help you protect them by following up with
              intelligence — not noise.
            </p>

            <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl">✅</div>
              <div>
                <div className="text-white font-semibold text-sm">Privacy-first by design.</div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Built to respect customer data, consent, and responsible follow-up.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="bg-navy-800/60 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-colors"
              >
                <div className="text-3xl mb-4">{point.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{point.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
