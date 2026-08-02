"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { projectService } from "@/src/modules/projects/services/project.service";
import type { CommentSummary, FileSummary, MilestoneSummary, ProjectDashboardStats, ProjectDetail, ProjectSummary, TaskSummary, TeamMemberSummary, TimeEntrySummary } from "@/src/modules/projects/types";

const loadProjectBundle = async (
    authUserId: string,
    email: string,
    fullName: string | undefined,
    projectId: string,
) => {
    const [project, milestoneList, taskList, teamList, timeList, fileList, commentList, dashboardStats] = await Promise.all([
        projectService.getProject(authUserId, email, projectId, fullName),
        projectService.getMilestones(projectId),
        projectService.getTasks(authUserId, email, projectId, fullName),
        projectService.getTeam(projectId),
        projectService.getTimeEntries(projectId),
        projectService.getFiles(projectId),
        projectService.getComments(projectId),
        projectService.getDashboardStats(authUserId, email, projectId, fullName),
    ]);

    return {
        project: project ?? null,
        milestoneList,
        taskList,
        teamList,
        timeList,
        fileList,
        commentList,
        dashboardStats,
    };
};

export function useProjects() {
    const user = useAuthStore((state) => state.user);
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

    const applyProjectBundle = useCallback((bundle: Awaited<ReturnType<typeof loadProjectBundle>>) => {
        setSelectedProject(bundle.project);
        setMilestones(bundle.milestoneList);
        setTasks(bundle.taskList);
        setTeam(bundle.teamList);
        setTimeEntries(bundle.timeList);
        setFiles(bundle.fileList);
        setComments(bundle.commentList);
        setStats(bundle.dashboardStats);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setLoading(false);
                }
                return;
            }

            try {
                const projectList = await projectService.getProjects(user.id, user.email, user.fullName);
                if (cancelled) {
                    return;
                }

                setProjects(projectList);

                if (projectList[0]) {
                    const bundle = await loadProjectBundle(user.id, user.email, user.fullName ?? undefined, projectList[0].id);
                    if (!cancelled) {
                        applyProjectBundle(bundle);
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [user, applyProjectBundle]);

    const selectProject = async (id: string) => {
        if (!user) {
            return;
        }

        setLoading(true);
        try {
            const bundle = await loadProjectBundle(user.id, user.email, user.fullName ?? undefined, id);
            applyProjectBundle(bundle);
        } finally {
            setLoading(false);
        }
    };

    return { projects, selectedProject, milestones, tasks, team, timeEntries, files, comments, stats, loading, selectProject };
}
