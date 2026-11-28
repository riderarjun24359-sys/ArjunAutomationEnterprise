import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { AiAutomationEnginePage } from "@/src/modules/ai-automation-engine";

export default async function AiAutomationEngineRoutePage() {
    await requireOrganizationProduct("automation");
    return <AiAutomationEnginePage />;
}
