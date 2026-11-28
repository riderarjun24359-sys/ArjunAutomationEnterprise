import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { ProjectsPage } from "@/src/modules/projects";

export default async function ProjectsRoutePage() {
    await requireOrganizationProduct("business");
    return <ProjectsPage />;
}
