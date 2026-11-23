type PremiumPageShellProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

/** Clean, accessible page frame shared by public marketing pages. */
export function PremiumPageShell({ title, description, children }: PremiumPageShellProps) {
    return (
        <>
            <section className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
                <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
                    <div className="h-1 w-14 rounded-full bg-blue-700" aria-hidden="true" />
                    <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
                    {description ? <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{description}</p> : null}
                </div>
            </section>
            <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">{children}</div>
        </>
    );
}
