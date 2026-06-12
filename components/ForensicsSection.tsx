const insights = [
  {
    number: '01',
    title: 'Where leads are dropping',
    description:
      'See exactly which stage in your pipeline has the highest drop-off. Is it after the first call? After the site visit? Before the quote?',
    color: 'text-blue-400',
  },
  {
    number: '02',
    title: 'Who followed up — and who didn\'t',
    description:
      'Know which team member is following up within 24 hours and which one is letting leads go cold. Accountability, not assumptions.',
    color: 'text-violet-400',
  },
  {
    number: '03',
    title: 'Which source is converting',
    description:
      'Instagram leads vs. referrals vs. website. Not all sources are equal. Know where to invest and where to stop spending.',
    color: 'text-green-400',
  },
  {
    number: '04',
    title: 'Which leads need action today',
    description:
      'A prioritised list every morning. Hot leads that haven\'t been touched. Follow-ups that are overdue. No guessing, no scrolling.',
    color: 'text-amber-400',
  },
  {
    number: '05',
    title: 'Who is actually converting',
    description:
      'Track close rates by team member, lead source, city, and category. Build on what works and fix what doesn\'t.',
    color: 'text-cyan-400',
  },
  {
    number: '06',
    title: 'What\'s in the pipeline right now',
    description:
      'Live pipeline value across stages. Know your revenue potential today, not at the end of the quarter when it\'s too late.',
    color: 'text-pink-400',
  },
];

export default function ForensicsSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1 mb-6">
              <span className="text-blue-400 text-sm font-semibold">Sales Forensics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              See exactly where
              <br />
              <span className="gradient-text">your money is leaking.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Vouch gives you owner-level visibility into every lead — not just a list of
              names, but a forensic view of what happened, what didn&apos;t, and what needs
              to happen right now.
            </p>
            <a
              href="#lead-form"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Get this visibility
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.number}
                className="bg-navy-800/60 border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors"
              >
                <div className={`text-xs font-black mb-2 ${insight.color}`}>{insight.number}</div>
                <h3 className="text-white font-semibold text-sm mb-2">{insight.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
