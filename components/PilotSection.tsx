export default function PilotSection() {
  return (
    <section id="pilot" className="py-24 bg-navy-800/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1 mb-8">
          <span className="text-green-400 text-sm font-semibold">Limited Pilot</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
          Try Vouch with your
          <br />
          <span className="gradient-text">real enquiries.</span>
        </h2>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          We work directly with a small number of businesses to set up Vouch around your exact
          workflow. No generic onboarding, no wasted config.
        </p>

        <p className="text-xl font-bold text-white mb-10">
          One extra converted deal can pay for the entire pilot.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: '🎯',
              title: 'Built for your business',
              desc: 'We configure Vouch around how you actually work — not a generic template.',
            },
            {
              icon: '⚡',
              title: 'Up in 48 hours',
              desc: 'Start capturing and tracking leads within two business days of onboarding.',
            },
            {
              icon: '📈',
              title: 'Measurable ROI',
              desc: 'Know exactly how many leads you saved, followed up, and converted.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-navy-900/60 border border-white/8 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#lead-form"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5"
          >
            Start Pilot
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <p className="text-slate-600 text-sm mt-6">
          Only a few pilot spots available each quarter. No commitment required to apply.
        </p>
      </div>
    </section>
  );
}
