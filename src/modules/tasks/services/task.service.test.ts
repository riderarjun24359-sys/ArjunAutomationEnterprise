import { describe, it, expect, vi, beforeEach } from "vitest";

const orgContext = vi.hoisted(() => ({ current: { profileId: "p1", organizationId: "org-1" } as { profileId: string; organizationId: string } | null }));
vi.mock("@/src/modules/database/lib/organization-context", () => ({
    resolveOrganizationContext: vi.fn(async () => orgContext.current),
}));

const mocks = vi.hoisted(() => ({
    tasksGetById: vi.fn(),
    tasksUpdate: vi.fn(),
    tasksDelete: vi.fn(),
    tasksListByOrganization: vi.fn(async (_org: string) => [] as import("@/src/modules/database/types/platform").DbTask[]),
    tasksListLabels: vi.fn(async () => []),
    tasksListLabelAssignments: vi.fn(async () => []),
    tasksSetLabelAssignments: vi.fn(async () => undefined),
    projectsGetById: vi.fn(async () => null),
}));

vi.mock("@/src/modules/database/services/database-service", () => ({
    databaseService: {
        tasks: {
            getById: mocks.tasksGetById,
            update: mocks.tasksUpdate,
            delete: mocks.tasksDelete,
            listByOrganization: mocks.tasksListByOrganization,
            listLabels: mocks.tasksListLabels,
            listLabelAssignments: mocks.tasksListLabelAssignments,
            setLabelAssignments: mocks.tasksSetLabelAssignments,
        },
        projects: { getById: mocks.projectsGetById },
    },
}));

import { taskService } from "./task.service";
import type { DbTask } from "@/src/modules/database/types/platform";

const taskRow = (org: string, status = "todo"): DbTask => ({
    id: "task-1",
    organization_id: org,
    title: "Ship it",
    description: "",
    status,
    priority: "medium",
    project_id: null,
    assignee_id: null,
    assignee_name: null,
    due_date: null,
    created_at: "2026-10-01T00:00:00Z",
    updated_at: "2026-10-01T00:00:00Z",
    estimated_hours: null,
    completed_hours: null,
    tags: null,
});

describe("task service tenant guards", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        orgContext.current = { profileId: "p1", organizationId: "org-1" };
        mocks.tasksListByOrganization.mockImplementation(async (org: string) =>
            org === "org-1" ? [taskRow("org-1")] : [],
        );
    });

    it("updates a same-org task through the guarded path", async () => {
        mocks.tasksUpdate.mockResolvedValue({ ...taskRow("org-1"), status: "in_progress" });
        mocks.tasksListByOrganization.mockImplementation(async () => [{ ...taskRow("org-1"), status: "in_progress" }]);
        const result = await taskService.updateTask("u1", "u1@test.dev", "task-1", { status: "in_progress" });
        expect(result?.status).toBe("in_progress");
    });

    it("still rejects an illegal transition on a same-org task", async () => {
        await expect(taskService.updateTask("u1", "u1@test.dev", "task-1", { status: "done" })).rejects.toThrow(
            /not allowed/,
        );
        expect(mocks.tasksUpdate).not.toHaveBeenCalled();
    });

    it("refuses a foreign task on updateTask without writing", async () => {
        mocks.tasksListByOrganization.mockResolvedValue([]);
        await expect(taskService.updateTask("u1", "u1@test.dev", "task-9", { title: "hijack" })).resolves.toBeUndefined();
        expect(mocks.tasksUpdate).not.toHaveBeenCalled();
    });

    it("updateTaskById writes only when the task belongs to the given organization", async () => {
        mocks.tasksGetById.mockResolvedValue(taskRow("org-1"));
        mocks.tasksUpdate.mockResolvedValue(taskRow("org-1"));
        const ok = await taskService.updateTaskById("task-1", { priority: "urgent" }, "org-1");
        expect(ok?.id).toBe("task-1");
        expect(mocks.tasksUpdate).toHaveBeenCalledTimes(1);

        mocks.tasksGetById.mockResolvedValue(taskRow("org-2"));
        await expect(taskService.updateTaskById("task-1", { priority: "urgent" }, "org-1")).resolves.toBeUndefined();
        expect(mocks.tasksUpdate).toHaveBeenCalledTimes(1);
    });

    it("deleteTask deletes same-org tasks and refuses foreign ones", async () => {
        mocks.tasksDelete.mockResolvedValue(true);
        await expect(taskService.deleteTask("u1", "u1@test.dev", "task-1")).resolves.toBe(true);
        expect(mocks.tasksDelete).toHaveBeenCalledTimes(1);

        mocks.tasksListByOrganization.mockResolvedValue([]);
        await expect(taskService.deleteTask("u1", "u1@test.dev", "task-9")).resolves.toBe(false);
        expect(mocks.tasksDelete).toHaveBeenCalledTimes(1);
    });
});
