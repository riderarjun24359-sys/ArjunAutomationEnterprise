export default function Navbar() {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="paint0_linear" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06b6d4"/>
                <stop offset="100%" stopColor="#38bdf8"/>
              </linearGradient>
            </defs>
            <path d="M50 10L10 90L25 90L37.5 65H62.5L75 90L90 90L50 10ZM50 25L68 60H32L50 25Z" fill="url(#paint0_linear)"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-white tracking-tight leading-none">
              Arjun Automations
            </span>
            <span className="text-xs text-cyan-400 font-medium tracking-wider uppercase mt-0.5">
              Enterprise AI Platform
            </span>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="/services" className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors">Services</a>
          <a href="/case-studies" className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors">Case Studies</a>
          <a href="/pricing" className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors">Pricing</a>
          <a href="/contact" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
