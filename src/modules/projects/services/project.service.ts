import type { CommentSummary, FileSummary, MilestoneSummary, ProjectDashboardStats, ProjectDetail, ProjectSummary, TaskSummary, TeamMemberSummary, TimeEntrySummary } from "@/src/modules/projects/types";

const projects: ProjectSummary[] = [
  { id: "project-1", name: "Northstar Expansion", status: "active", priority: "high", progress: 74, budget: "$284k", timeline: "Q3 2026", owner: "Mina Park", updatedAt: "2h ago" },
  { id: "project-2", name: "FinOps Refresh", status: "planning", priority: "medium", progress: 36, budget: "$92k", timeline: "Q4 2026", owner: "Drew Hsu", updatedAt: "5h ago" },
];

const projectDetails: Record<string, ProjectDetail> = {
  "project-1": {
    id: "project-1",
    name: "Northstar Expansion",
    status: "active",
    priority: "high",
    progress: 74,
    budget: "$284k",
    timeline: "Q3 2026",
    owner: "Mina Park",
    updatedAt: "2h ago",
    description: "Expand the enterprise implementation footprint across new verticals.",
    template: "Enterprise Delivery",
    client: "Northstar Labs",
    teamSize: 8,
  },
};

const milestones: MilestoneSummary[] = [
  { id: "milestone-1", title: "Discovery complete", dueDate: "2026-08-10", status: "completed", progress: 100 },
  { id: "milestone-2", title: "Pilot launch", dueDate: "2026-08-24", status: "in_progress", progress: 62 },
];

const tasks: TaskSummary[] = [
  { id: "task-1", title: "Finalize rollout plan", status: "in_progress", assignee: "Lina Ortiz", dueDate: "2026-08-06", priority: "high" },
  { id: "task-2", title: "Review integration requirements", status: "todo", assignee: "Jordan Lee", dueDate: "2026-08-08", priority: "medium" },
];

const team: TeamMemberSummary[] = [
  { id: "team-1", name: "Mina Park", role: "owner", capacity: "92%", status: "active" },
  { id: "team-2", name: "Lina Ortiz", role: "manager", capacity: "78%", status: "active" },
];

const timeEntries: TimeEntrySummary[] = [
  { id: "time-1", projectName: "Northstar Expansion", startedAt: "09:15", duration: "2h 12m", status: "running" },
  { id: "time-2", projectName: "FinOps Refresh", startedAt: "13:40", duration: "1h 05m", status: "paused" },
];

const files: FileSummary[] = [
  { id: "file-1", name: "Implementation Plan.pdf", folder: "Planning", version: "v3", updatedAt: "Today" },
  { id: "file-2", name: "Architecture Diagram.png", folder: "Design", version: "v1", updatedAt: "Yesterday" },
];

const comments: CommentSummary[] = [
  { id: "comment-1", author: "Mina Park", body: "Need final sign-off before the pilot starts.", mentions: ["Lina"], attachments: ["plan.pdf"], createdAt: "1h ago" },
];

const dashboardStats: ProjectDashboardStats = {
  health: "Healthy",
  progress: "74%",
  budget: "$284k / $380k",
  timeline: "On track",
  upcomingDeadlines: ["Pilot launch - Aug 24", "Budget review - Aug 28"],
  recentActivity: ["Milestone updated", "New comment added", "Task moved to review"],
};

export class ProjectService {
  async getProjects(): Promise<ProjectSummary[]> {
    return projects;
  }

  async getProject(id: string): Promise<ProjectDetail | undefined> {
    return projectDetails[id];
  }

  async getMilestones(): Promise<MilestoneSummary[]> {
    return milestones;
  }

  async getTasks(): Promise<TaskSummary[]> {
    return tasks;
  }

  async getTeam(): Promise<TeamMemberSummary[]> {
    return team;
  }

  async getTimeEntries(): Promise<TimeEntrySummary[]> {
    return timeEntries;
  }

  async getFiles(): Promise<FileSummary[]> {
    return files;
  }

  async getComments(): Promise<CommentSummary[]> {
    return comments;
  }

  async getDashboardStats(): Promise<ProjectDashboardStats> {
    return dashboardStats;
  }
}

export const projectService = new ProjectService();
