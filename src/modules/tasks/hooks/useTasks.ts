"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { TASK_FILTERS } from "@/src/modules/tasks/constants";
import { taskService } from "@/src/modules/tasks/services/task.service";
import type { CreateTaskInput, Task, TaskAssignee, TaskFilter, TaskLabel, TaskStatistics, TaskStatus, UpdateTaskInput } from "@/src/modules/tasks/types";

export function useTasks() {
    const user = useAuthStore((state) => state.user);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
    const [labels, setLabels] = useState<TaskLabel[]>([]);
    const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<TaskFilter>(TASK_FILTERS.all);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

    const fetchTasksData = useCallback(async () => {
        if (!user) {
            return { taskList: [], assigneeList: [], labelList: [], stats: null };
        }

        const [taskList, assigneeList, labelList, stats] = await Promise.all([
            taskService.getTasks(user.id, user.email, user.fullName),
            taskService.getAssignees(user.id, user.email, user.fullName),
            taskService.getLabels(user.id, user.email, user.fullName),
            taskService.getStatistics(user.id, user.email, user.fullName),
        ]);

        return { taskList, assigneeList, labelList, stats };
    }, [user]);

    const loadData = useCallback(async () => {
        const { taskList, assigneeList, labelList, stats } = await fetchTasksData();
        setTasks(taskList);
        setAssignees(assigneeList);
        setLabels(labelList);
        setStatistics(stats);
        setLoading(false);
    }, [fetchTasksData]);

    useEffect(() => {
        let cancelled = false;

        void fetchTasksData().then(({ taskList, assigneeList, labelList, stats }) => {
            if (cancelled) {
                return;
            }

            setTasks(taskList);
            setAssignees(assigneeList);
            setLabels(labelList);
            setStatistics(stats);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [fetchTasksData]);

    const selectTask = useCallback(async (id: string) => {
        if (!user) {
            return;
        }

        const task = await taskService.getTask(user.id, user.email, id, user.fullName);
        setSelectedTask(task ?? null);
    }, [user]);

    const createTask = useCallback(async (input: CreateTaskInput) => {
        if (!user) {
            throw new Error("Authentication required");
        }

        const task = await taskService.createTask(user.id, user.email, input, user.fullName);
        await loadData();
        return task;
    }, [user, loadData]);

    const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
        if (!user) {
            throw new Error("Authentication required");
        }

        const task = await taskService.updateTask(user.id, user.email, id, input, user.fullName);
        await loadData();
        if (selectedTask?.id === id && task) {
            setSelectedTask(task);
        }
        return task;
    }, [user, loadData, selectedTask?.id]);

    const deleteTask = useCallback(async (id: string) => {
        if (!user) {
            return false;
        }

        const deleted = await taskService.deleteTask(user.id, user.email, id);
        if (deleted) {
            if (selectedTask?.id === id) {
                setSelectedTask(null);
            }
            await loadData();
        }
        return deleted;
    }, [user, loadData, selectedTask?.id]);

    const filteredTasks = useMemo(() => {
        const now = new Date();
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);

        return tasks.filter((task) => {
            if (statusFilter !== "all" && task.status !== statusFilter) {
                return false;
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query) ||
                    task.projectName?.toLowerCase().includes(query) ||
                    task.assignee?.name.toLowerCase().includes(query);

                if (!matchesSearch) {
                    return false;
                }
            }

            switch (activeFilter) {
                case TASK_FILTERS.myTasks:
                    return task.assignee?.id === user?.id;
                case TASK_FILTERS.overdue:
                    return task.status !== "done" && task.status !== "cancelled" && new Date(task.dueDate) < now;
                case TASK_FILTERS.dueThisWeek:
                    return task.status !== "done" && task.status !== "cancelled" && new Date(task.dueDate) >= now && new Date(task.dueDate) <= weekEnd;
                case TASK_FILTERS.highPriority:
                    return task.priority === "high" || task.priority === "critical" || task.priority === "urgent";
                case TASK_FILTERS.unassigned:
                    return task.assignee === null;
                default:
                    return true;
            }
        });
    }, [tasks, activeFilter, searchQuery, statusFilter, user?.id]);

    return {
        tasks: filteredTasks,
        allTasks: tasks,
        selectedTask,
        assignees,
        labels,
        statistics,
        loading,
        activeFilter,
        searchQuery,
        statusFilter,
        setActiveFilter,
        setSearchQuery,
        setStatusFilter,
        selectTask,
        createTask,
        updateTask,
        deleteTask,
        refresh: loadData,
    };
}
