import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { EnterpriseIntegrationsPage } from "@/src/modules/enterprise-integrations";

export default async function EnterpriseIntegrationsRoutePage() {
    await requireOrganizationProduct("automation");
    return <EnterpriseIntegrationsPage />;
}
