import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { IntegrationHubPage } from "@/src/modules/integration-hub";

export default async function IntegrationHubRoutePage() {
    await requireOrganizationProduct("automation");
    return <IntegrationHubPage />;
}
