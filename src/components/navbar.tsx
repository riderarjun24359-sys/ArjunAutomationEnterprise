import Image from "next/image";
export default function Navbar() {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3" aria-label="Arjun Automation Enterprises home">
          <Image src="/brand/logos/arjun-enterprise.svg" alt="Arjun Automation Enterprises" width={900} height={240} priority unoptimized className="h-12 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="/services" className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors">Services</a>
          <a href="/case-studies" className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors">Case Studies</a>
          <a href="/pricing" className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors">Pricing</a>
          <a href="/contact" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Get Started</a>
        </div>
      </div>
    </header>
  );
}
