import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { IntegrationPlatformPage } from "@/src/modules/integration-platform";

export default async function IntegrationPlatformRoutePage() {
    await requireOrganizationProduct("automation");
    return <IntegrationPlatformPage />;
}
