export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "archived";
export type ProjectPriority = "low" | "medium" | "high" | "critical";
export type MilestoneStatus = "pending" | "in_progress" | "completed";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskView = "kanban" | "list" | "calendar" | "timeline";
export type TeamRole = "owner" | "manager" | "member" | "viewer";
export type TimeEntryStatus = "running" | "paused" | "stopped";

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  budget: string;
  timeline: string;
  owner: string;
  clientName?: string;
  updatedAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  description: string;
  template: string;
  client: string;
  teamSize: number;
}

export interface MilestoneSummary {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
  progress: number;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  priority: ProjectPriority;
}

export interface TeamMemberSummary {
  id: string;
  name: string;
  role: TeamRole;
  capacity: string;
  status: "active" | "offline";
}

export interface TimeEntrySummary {
  id: string;
  projectName: string;
  startedAt: string;
  duration: string;
  status: TimeEntryStatus;
}

export interface FileSummary {
  id: string;
  name: string;
  folder: string;
  version: string;
  updatedAt: string;
}

export interface CommentSummary {
  id: string;
  author: string;
  body: string;
  mentions: string[];
  attachments: string[];
  createdAt: string;
}

export interface ProjectDashboardStats {
  health: string;
  progress: string;
  budget: string;
  timeline: string;
  upcomingDeadlines: string[];
  recentActivity: string[];
}

export interface CreateProjectInput {
  name: string;
  clientId?: string;
  clientName?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}
