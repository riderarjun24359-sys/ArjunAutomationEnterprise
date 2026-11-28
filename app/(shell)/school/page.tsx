import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { SchoolPage } from "@/src/modules/school";

export default async function SchoolRoutePage() {
    await requireOrganizationProduct("school");
    return <SchoolPage />;
}
