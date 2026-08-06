import type { Metadata } from "next";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { GoLiveReadinessDashboard } from "@/src/modules/soft-launch/components/GoLiveReadinessDashboard";
import { buildMetadata } from "@/src/lib/seo";
import { ROUTES } from "@/src/constants/routes";

export const metadata: Metadata = buildMetadata({
    title: "Production Go-Live",
    description: "Customer onboarding go-live readiness: environment, Supabase, storage, email, payment, monitoring, backups, and security.",
    path: ROUTES.goLive,
    noIndex: true,
});

export default function GoLivePage() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Production</p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">Go-Live readiness</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">
                    Validate production configuration for real customer onboarding. Set AAOS_GO_LIVE=true for strict gate enforcement.
                </p>
            </div>
            <GoLiveReadinessDashboard />
        </PageTransition>
    );
}
