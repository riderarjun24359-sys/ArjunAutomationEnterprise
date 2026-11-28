import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { CommunicationHubPage } from "@/src/modules/communication-hub";

export default async function CommunicationHubRoutePage() {
    await requireOrganizationProduct("automation");
    return <CommunicationHubPage />;
}
