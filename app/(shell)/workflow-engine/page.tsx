import { requireOrganizationProduct } from "@/src/lib/saas/require-organization-product";
import { WorkflowEnginePage } from "@/src/modules/workflow-engine";

export default async function WorkflowEngineRoutePage() {
    await requireOrganizationProduct("automation");
    return <WorkflowEnginePage />;
}
