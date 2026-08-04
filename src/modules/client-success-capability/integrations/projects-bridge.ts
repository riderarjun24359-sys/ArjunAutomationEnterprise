import { projectService } from "@/src/modules/projects/services/project.service";
import type { ProjectSummary } from "@/src/modules/projects/types";

export async function fetchClientProjects(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<ProjectSummary[]> {
    return projectService.getProjects(authUserId, email, fullName);
}

export async function fetchProjectMilestones(projectId: string) {
    return projectService.getMilestones(projectId);
}

export async function fetchProjectTasks(
    authUserId: string,
    email: string,
    projectId: string,
    fullName?: string | null,
) {
    return projectService.getTasks(authUserId, email, projectId, fullName);
}

export function createLocalProjectWorkspace(clientId: string, clientName: string) {
    const projectId = `proj-${clientId}-${Date.now()}`;
    return {
        projectId,
        projectName: `${clientName} — Client Success Delivery`,
        milestones: AI_DELIVERY_MILESTONES.map((m, i) => ({
            id: `ms-${i + 1}`,
            name: m.title,
            status: i === 0 ? "in-progress" : "pending",
            dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        })),
        tasks: [
            { id: "t1", title: "Kickoff & requirement analysis", assignee: "AI Success Manager", status: "in-progress" },
            { id: "t2", title: "Stakeholder mapping", assignee: "CS Lead", status: "pending" },
            { id: "t3", title: "Success metrics definition", assignee: "CS Lead", status: "pending" },
            { id: "t4", title: "Project workspace setup", assignee: "Delivery Manager", status: "pending" },
        ],
        deliverables: [
            { id: "d1", name: "Onboarding Profile", type: "document", status: "draft" },
            { id: "d2", name: "Statement of Work", type: "document", status: "pending" },
            { id: "d3", name: "Solution Demo", type: "demo", status: "pending" },
        ],
        team: [
            { id: "tm1", name: "AI Success Manager", role: "Account Lead" },
            { id: "tm2", name: "Delivery Manager", role: "Project Lead" },
            { id: "tm3", name: "Solution Architect", role: "Technical Lead" },
        ],
    };
}

const AI_DELIVERY_MILESTONES = [
    { title: "AI Requirement Analysis" },
    { title: "AI Solution Generation" },
    { title: "Expert Engineering Review" },
    { title: "Customer Validation" },
    { title: "Secure Production Deployment" },
];

export { projectService };
