export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 sm:p-24 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Arjun Automations Enterprise Platform
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
          Autonomous AI Enterprise Infrastructure
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Deploy high-end autonomous AI workers, neural orchestration layers, and real-time enterprise intelligence systems for next-generation companies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a href="/contact" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/25">
            Initialize Platform
          </a>
          <a href="/services" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold hover:bg-slate-800 transition-all duration-300">
            Explore Capabilities
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-900 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">Autonomous Core</h3>
            <p className="text-slate-400 text-sm">Self-healing operational engines designed for 99.999% enterprise uptime.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">Neural Analytics</h3>
            <p className="text-slate-400 text-sm">Real-time business intelligence processing millions of data points instantly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="text-cyan-400 font-bold text-lg mb-2">Secure Orchestration</h3>
            <p className="text-slate-400 text-sm">Bank-grade encryption with complete multi-tenant enterprise isolation.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
