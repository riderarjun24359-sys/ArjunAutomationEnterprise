"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TASK_FILTERS } from "@/src/modules/tasks/constants";
import { taskService } from "@/src/modules/tasks/services/task.service";
import type { CreateTaskInput, Task, TaskAssignee, TaskFilter, TaskLabel, TaskStatistics, TaskStatus, UpdateTaskInput } from "@/src/modules/tasks/types";

const fetchTasksData = async () => {
    const [taskList, assigneeList, labelList, stats] = await Promise.all([
        taskService.getTasks(),
        taskService.getAssignees(),
        taskService.getLabels(),
        taskService.getStatistics(),
    ]);

    return { taskList, assigneeList, labelList, stats };
};

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
    const [labels, setLabels] = useState<TaskLabel[]>([]);
    const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<TaskFilter>(TASK_FILTERS.all);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

    const loadData = useCallback(async () => {
        const { taskList, assigneeList, labelList, stats } = await fetchTasksData();
        setTasks(taskList);
        setAssignees(assigneeList);
        setLabels(labelList);
        setStatistics(stats);
        setLoading(false);
    }, []);

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
    }, []);

    const selectTask = useCallback(async (id: string) => {
        const task = await taskService.getTask(id);
        setSelectedTask(task ?? null);
    }, []);

    const createTask = useCallback(async (input: CreateTaskInput) => {
        const task = await taskService.createTask(input);
        await loadData();
        return task;
    }, [loadData]);

    const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
        const task = await taskService.updateTask(id, input);
        await loadData();
        if (selectedTask?.id === id && task) {
            setSelectedTask(task);
        }
        return task;
    }, [loadData, selectedTask?.id]);

    const deleteTask = useCallback(async (id: string) => {
        const deleted = await taskService.deleteTask(id);
        if (deleted) {
            if (selectedTask?.id === id) {
                setSelectedTask(null);
            }
            await loadData();
        }
        return deleted;
    }, [loadData, selectedTask?.id]);

    const filteredTasks = useMemo(() => {
        const now = new Date("2026-08-02");
        const weekEnd = new Date("2026-08-09");

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
                    return task.assignee?.id === "assignee-1";
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
    }, [tasks, activeFilter, searchQuery, statusFilter]);

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
