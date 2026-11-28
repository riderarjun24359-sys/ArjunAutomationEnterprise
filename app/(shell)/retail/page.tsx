import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { RetailPage } from "@/src/modules/retail";

export default async function RetailRoutePage() {
    await requireOrganizationProduct("retail");
    return <RetailPage />;
}
