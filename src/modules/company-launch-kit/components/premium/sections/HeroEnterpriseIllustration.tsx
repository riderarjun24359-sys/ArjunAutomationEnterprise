/** Premium enterprise platform illustration — static server render, CSS motion only. */
export function HeroEnterpriseIllustration() {
    return (
        <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true" role="presentation">
            <div className="premium-glass relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-indigo-500/20 shadow-2xl shadow-indigo-950/40">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-cyan-950/60" />

                <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-400/40" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>

                <div className="hero-panel-float-a absolute left-[8%] top-[12%] h-[28%] w-[38%] rounded-lg border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm motion-reduce:animate-none">
                    <div className="flex h-full flex-col gap-2 p-3">
                        <div className="h-2 w-1/2 rounded bg-indigo-400/50" />
                        <div className="mt-auto flex items-end gap-1">
                            {[40, 65, 45, 80, 55].map((h, i) => (
                                <div key={i} className="flex-1 rounded-sm bg-cyan-400/40" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hero-panel-float-b absolute right-[8%] top-[18%] h-[22%] w-[42%] rounded-lg border border-cyan-400/25 bg-cyan-500/10 backdrop-blur-sm motion-reduce:animate-none">
                    <div className="flex h-full flex-col justify-center gap-2 p-3">
                        <div className="h-1.5 w-3/4 rounded bg-cyan-300/40" />
                        <div className="h-1.5 w-1/2 rounded bg-cyan-300/30" />
                        <div className="mt-1 h-8 w-full rounded bg-gradient-to-r from-cyan-500/20 to-indigo-500/20" />
                    </div>
                </div>

                <div className="hero-panel-float-c absolute bottom-[14%] left-[10%] right-[10%] h-[32%] rounded-xl border border-violet-400/25 bg-violet-500/10 backdrop-blur-sm motion-reduce:animate-none">
                    <div className="flex h-full flex-col p-4">
                        <div className="mb-3 flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
                            <div className="h-2 w-16 rounded bg-violet-300/40" />
                        </div>
                        <div className="grid flex-1 grid-cols-3 gap-2">
                            {[1, 2, 3].map((col) => (
                                <div key={col} className="rounded-md bg-violet-400/10 p-2">
                                    <div className="mb-2 h-1.5 w-full rounded bg-violet-300/30" />
                                    <div className="space-y-1.5">
                                        <div className="h-1 w-full rounded bg-violet-300/20" />
                                        <div className="h-1 w-4/5 rounded bg-violet-300/20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-cyan-500/15 blur-2xl" />
            </div>
        </div>
    );
}
