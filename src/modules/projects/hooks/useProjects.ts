"use client";

import { useEffect, useState } from "react";
import { projectService } from "@/src/modules/projects/services/project.service";
import type { CommentSummary, FileSummary, MilestoneSummary, ProjectDashboardStats, ProjectDetail, ProjectSummary, TaskSummary, TeamMemberSummary, TimeEntrySummary } from "@/src/modules/projects/types";

export function useProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [milestones, setMilestones] = useState<MilestoneSummary[]>([]);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [team, setTeam] = useState<TeamMemberSummary[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntrySummary[]>([]);
  const [files, setFiles] = useState<FileSummary[]>([]);
  const [comments, setComments] = useState<CommentSummary[]>([]);
  const [stats, setStats] = useState<ProjectDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [projectList, milestoneList, taskList, teamList, timeList, fileList, commentList, dashboardStats] = await Promise.all([
        projectService.getProjects(),
        projectService.getMilestones(),
        projectService.getTasks(),
        projectService.getTeam(),
        projectService.getTimeEntries(),
        projectService.getFiles(),
        projectService.getComments(),
        projectService.getDashboardStats(),
      ]);

      setProjects(projectList);
      setMilestones(milestoneList);
      setTasks(taskList);
      setTeam(teamList);
      setTimeEntries(timeList);
      setFiles(fileList);
      setComments(commentList);
      setStats(dashboardStats);
      setLoading(false);
    };

    void load();
  }, []);

  const selectProject = async (id: string) => {
    const project = await projectService.getProject(id);
    setSelectedProject(project ?? null);
  };

  return { projects, selectedProject, milestones, tasks, team, timeEntries, files, comments, stats, loading, selectProject };
}
