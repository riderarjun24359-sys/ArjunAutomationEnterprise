import { buildCreateTaskPayload, buildUpdateTaskPayload, computeTaskStatistics, mapTaskAssignee, mapTaskLabel, mapTaskRecord } from "@/src/modules/database/lib/task-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { CreateTaskInput, Task, TaskAssignee, TaskLabel, TaskStatistics, UpdateTaskInput } from "@/src/modules/tasks/types";

export class TaskService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async hydrateTasks(authUserId: string, email: string, fullName?: string | null): Promise<Task[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const [records, labels, assignments] = await Promise.all([
            databaseService.tasks.listByOrganization(context.organizationId),
            databaseService.tasks.listLabels(context.organizationId),
            databaseService.tasks.listByOrganization(context.organizationId).then((tasks) =>
                databaseService.tasks.listLabelAssignments(tasks.map((task) => task.id)),
            ),
        ]);

        const labelMap = new Map(labels.map((label) => [label.id, mapTaskLabel(label)]));
        const assignmentsByTask = assignments.reduce<Map<string, TaskLabel[]>>((map, assignment) => {
            const current = map.get(assignment.task_id) ?? [];
            const label = labelMap.get(assignment.label_id);
            if (label) {
                current.push(label);
            }
            map.set(assignment.task_id, current);
            return map;
        }, new Map());

        const projects = await Promise.all(
            [...new Set(records.map((record) => record.project_id).filter(Boolean))].map(async (projectId) => {
                const project = await databaseService.projects.getById(String(projectId));
                return [String(projectId), project] as const;
            }),
        );
        const projectMap = new Map(projects);

        return records.map((record) =>
            mapTaskRecord(
                record,
                assignmentsByTask.get(record.id) ?? [],
                record.project_id ? projectMap.get(record.project_id) : null,
                record.assignee_id ? mapTaskAssignee({ id: record.assignee_id, auth_user_id: record.assignee_id, email: record.assignee_name ?? "", full_name: record.assignee_name, created_at: record.created_at, updated_at: record.updated_at }) : null,
            ),
        );
    }

    async getTasks(authUserId: string, email: string, fullName?: string | null): Promise<Task[]> {
        return this.hydrateTasks(authUserId, email, fullName);
    }

    async getTask(authUserId: string, email: string, id: string, fullName?: string | null): Promise<Task | undefined> {
        const tasks = await this.hydrateTasks(authUserId, email, fullName);
        return tasks.find((task) => task.id === id);
    }

    async createTask(authUserId: string, email: string, input: CreateTaskInput, fullName?: string | null): Promise<Task> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            throw new Error("Unable to resolve organization context");
        }

        const created = await databaseService.tasks.create(buildCreateTaskPayload(context.organizationId, input));
        if (!created) {
            throw new Error("Failed to create task");
        }

        if (input.labelIds?.length) {
            await databaseService.tasks.setLabelAssignments(created.id, input.labelIds);
        }

        const task = await this.getTask(authUserId, email, created.id, fullName);
        if (!task) {
            throw new Error("Failed to load created task");
        }

        return task;
    }

    async updateTask(authUserId: string, email: string, id: string, input: UpdateTaskInput, fullName?: string | null): Promise<Task | undefined> {
        const updated = await databaseService.tasks.update(id, buildUpdateTaskPayload(input));
        if (!updated) {
            return undefined;
        }

        if (input.labelIds) {
            await databaseService.tasks.setLabelAssignments(id, input.labelIds);
        }

        return this.getTask(authUserId, email, id, fullName);
    }

    async deleteTask(authUserId: string, email: string, id: string): Promise<boolean> {
        return databaseService.tasks.delete(id);
    }

    async getStatistics(authUserId: string, email: string, fullName?: string | null): Promise<TaskStatistics> {
        const tasks = await this.hydrateTasks(authUserId, email, fullName);
        return computeTaskStatistics(tasks);
    }

    async getAssignees(authUserId: string, email: string, fullName?: string | null): Promise<TaskAssignee[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const memberships = await databaseService.memberships.listByOrganization(context.organizationId);
        const profiles = await Promise.all(memberships.map((membership) => databaseService.profiles.getById(membership.user_id)));

        return profiles.filter(Boolean).map((profile) => mapTaskAssignee(profile!));
    }

    async getLabels(authUserId: string, email: string, fullName?: string | null): Promise<TaskLabel[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const labels = await databaseService.tasks.listLabels(context.organizationId);
        return labels.map(mapTaskLabel);
    }
}

export const taskService = new TaskService();
