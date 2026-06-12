const steps = [
  {
    step: '01',
    title: 'Capture enquiry',
    description:
      'Every lead from WhatsApp, Instagram, website, or referral is logged in one place. No more scattered chats.',
    icon: '📥',
  },
  {
    step: '02',
    title: 'Qualify lead',
    description:
      'Each enquiry is tagged with source, category, budget range, and intent signals. Your team works on what matters.',
    icon: '🎯',
  },
  {
    step: '03',
    title: 'Track stage',
    description:
      'Leads move through a clear pipeline: New → Contacted → Qualified → Proposal → Negotiation → Won/Lost.',
    icon: '📊',
  },
  {
    step: '04',
    title: 'Follow up intelligently',
    description:
      'Vouch surfaces which leads need follow-up today, who hasn\'t responded, and what action to take next.',
    icon: '🔔',
  },
  {
    step: '05',
    title: 'Owner sees the dashboard',
    description:
      'You see totals, hot leads, conversion rates, and team performance in one clean view. Every morning, every device.',
    icon: '👁️',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-navy-800/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1 mb-4">
            <span className="text-green-400 text-sm font-semibold">How Vouch Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Five steps. Zero lead left behind.
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Simple enough to use daily. Powerful enough to change how you sell.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-navy-900 border-2 border-accent/30 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/10">
                  <span className="text-2xl">{step.icon}</span>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-white/8" />
                )}

                <div className="text-xs font-black text-accent/60 mb-2">{step.step}</div>
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
