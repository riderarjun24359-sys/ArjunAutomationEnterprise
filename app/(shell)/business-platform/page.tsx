import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { BusinessPlatformPage } from "@/src/modules/business-platform";

export default async function BusinessPlatformRoutePage() {
    await requireOrganizationProduct("business");
    return <BusinessPlatformPage />;
}
