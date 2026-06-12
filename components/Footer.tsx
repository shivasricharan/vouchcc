export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <span className="text-white font-bold">Vouch CC</span>
              <p className="text-slate-600 text-xs">Customer Capture</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {[
              { label: 'Problem', href: '#problem' },
              { label: 'How it Works', href: '#how-it-works' },
              { label: 'Dashboard', href: '#dashboard' },
              { label: 'Apply', href: '#lead-form' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Vouch CC. Built for service businesses that hate losing leads.
          </p>
          <p className="text-slate-700 text-xs mt-2">
            Your data is yours. We don&apos;t sell, spam, or share.
          </p>
        </div>
      </div>
    </footer>
  );
}
