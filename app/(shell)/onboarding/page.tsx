import type { Metadata } from "next";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { OnboardingWizard } from "@/src/modules/soft-launch/components/OnboardingWizard";
import { buildMetadata } from "@/src/lib/seo";
import { ROUTES } from "@/src/constants/routes";

export const metadata: Metadata = buildMetadata({
    title: "Onboarding",
    description: "Soft-launch onboarding wizard for organization, workspace, invites, and first project checklist.",
    path: ROUTES.onboarding,
    noIndex: true,
});

export default function OnboardingPage() {
    return (
        <PageTransition className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <OnboardingWizard />
        </PageTransition>
    );
}
