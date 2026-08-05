import { projectService } from "@/src/modules/projects/services/project.service";
import type { ProjectSummary } from "@/src/modules/projects/types";

export async function fetchProjects(authUserId: string, email: string, fullName?: string | null): Promise<ProjectSummary[]> {
    return projectService.getProjects(authUserId, email, fullName);
}

export async function createProject(
    authUserId: string,
    email: string,
    input: { name: string; clientId?: string; clientName?: string; description?: string },
    fullName?: string | null,
) {
    return projectService.createProject(authUserId, email, input, fullName);
}
