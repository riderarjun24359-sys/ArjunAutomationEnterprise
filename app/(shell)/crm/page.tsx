import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { CrmPage } from "@/src/modules/crm";

export default async function CrmRoutePage() {
    await requireOrganizationProduct("business");
    return <CrmPage />;
}
