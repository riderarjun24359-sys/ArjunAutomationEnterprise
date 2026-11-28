import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { SalesPage } from "@/src/modules/sales";

export default async function SalesRoutePage() {
    await requireOrganizationProduct("business");
    return <SalesPage />;
}
