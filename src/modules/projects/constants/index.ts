export const PROJECT_TABS = {
  overview: "overview",
  milestones: "milestones",
  tasks: "tasks",
  team: "team",
  time: "time",
  files: "files",
  comments: "comments",
} as const;

export const TASK_VIEWS = {
  kanban: "kanban",
  list: "list",
  calendar: "calendar",
  timeline: "timeline",
} as const;

export const PROJECT_STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;
