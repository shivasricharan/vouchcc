const problems = [
  {
    icon: '📱',
    title: 'Leads come from everywhere',
    description:
      'WhatsApp, Instagram DMs, phone calls, website forms, referrals, walk-ins. Every source needs a different follow-up and nothing is in one place.',
  },
  {
    icon: '💬',
    title: 'Teams reply manually, inconsistently',
    description:
      'Each team member handles leads differently. No standard response, no timing discipline, no qualification criteria. The experience is unpredictable.',
  },
  {
    icon: '🕐',
    title: 'Follow-ups get forgotten',
    description:
      'A lead says "I\'ll call back next week." No one creates a task. No one follows up. Three weeks later, they\'ve already hired someone else.',
  },
  {
    icon: '❓',
    title: 'Owners are flying blind',
    description:
      'No one knows how many enquiries came in this month, which ones are hot, which are cold, or which team member is actually converting.',
  },
  {
    icon: '💸',
    title: 'Good enquiries quietly die',
    description:
      'That ₹15L interior project. The corporate design mandate. The architect referral. They came in, got buried in chat, and silently slipped away.',
  },
  {
    icon: '📊',
    title: 'No visibility, no learning',
    description:
      'Without data, you can\'t fix the problem. You don\'t know which source converts best, which price point stalls, or which stage is leaking.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-navy-800/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1 mb-4">
            <span className="text-red-400 text-sm font-semibold">The Real Problem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Your pipeline is leaking.
            <br />
            <span className="text-slate-400">You just can&apos;t see where.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Most businesses don&apos;t need more leads first. They need to stop losing the
            ones they already have.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-navy-800/60 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-colors card-glow"
            >
              <div className="text-3xl mb-4">{problem.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{problem.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-2xl p-8 text-center">
          <p className="text-xl sm:text-2xl font-bold text-white mb-2">
            The average service business loses{' '}
            <span className="text-red-400">3–5 qualified leads every month</span>
          </p>
          <p className="text-slate-400">
            Not because they don&apos;t do good work. Because no one followed up in time.
          </p>
        </div>
      </div>
    </section>
  );
}
