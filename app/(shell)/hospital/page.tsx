import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { HospitalPage } from "@/src/modules/hospital";

export default async function HospitalRoutePage() {
    await requireOrganizationProduct("clinic");
    return <HospitalPage />;
}
