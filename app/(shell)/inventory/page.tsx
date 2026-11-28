import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { InventoryPage } from "@/src/modules/inventory";

export default async function InventoryRoutePage() {
    await requireOrganizationProduct("retail");
    return <InventoryPage />;
}
