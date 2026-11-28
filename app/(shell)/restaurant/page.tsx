import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { RestaurantPage } from "@/src/modules/restaurant";

export default async function RestaurantRoutePage() {
    await requireOrganizationProduct("retail");
    return <RestaurantPage />;
}
