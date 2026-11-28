import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { AutomationPage } from "@/src/modules/automation";

export default async function AutomationRoutePage() {
    await requireOrganizationProduct("automation");
    return <AutomationPage />;
}
