import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { ClientsPage } from "@/src/modules/clients";

export default async function ClientsRoutePage() {
    await requireOrganizationProduct("business");
    return <ClientsPage />;
}
