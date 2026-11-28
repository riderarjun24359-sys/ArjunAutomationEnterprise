import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { FinancePage } from "@/src/modules/finance";

export default async function FinanceRoutePage() {
    await requireOrganizationProduct("business");
    return <FinancePage />;
}
