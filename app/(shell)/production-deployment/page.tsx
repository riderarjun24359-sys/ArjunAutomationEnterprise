import type { Metadata } from "next";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { ProductionHealthDashboard } from "@/src/modules/soft-launch/components/ProductionHealthDashboard";
import { buildMetadata } from "@/src/lib/seo";
import { ROUTES } from "@/src/constants/routes";

export const metadata: Metadata = buildMetadata({
    title: "Production Deployment",
    description: "Early Access production health, environment validation, and service readiness dashboard.",
    path: ROUTES.productionDeployment,
    noIndex: true,
});

export default function ProductionDeploymentPage() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--dos-text-tertiary)]">Early Access</p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--dos-text-primary)]">Production deployment</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">
                    Live validation of environment configuration, Supabase, storage, authentication, email, payment, and monitoring for v1.0.0-early-access.
                </p>
            </div>
            <ProductionHealthDashboard />
        </PageTransition>
    );
}
