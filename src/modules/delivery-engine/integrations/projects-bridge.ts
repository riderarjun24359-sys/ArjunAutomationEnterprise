import { projectService } from "@/src/modules/projects/services/project.service";
import type { ProjectSummary } from "@/src/modules/projects/types";

export async function fetchProjects(authUserId: string, email: string, fullName?: string | null): Promise<ProjectSummary[]> {
    return projectService.getProjects(authUserId, email, fullName);
}
