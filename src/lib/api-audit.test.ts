// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/lib/supabase-service-role", () => ({
    getServiceRoleClient: vi.fn(),
}));

import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { logApiAudit } from "./api-audit";

const mockedClient = vi.mocked(getServiceRoleClient);

function stubClient(insertResult: { error: { message: string } | null }) {
    return {
        from: vi.fn(() => ({
            insert: () => Promise.resolve(insertResult),
        })),
    };
}

describe("logApiAudit server path", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockedClient.mockReset();
    });

    it("writes to audit_logs when the service client exists", async () => {
        const client = stubClient({ error: null });
        mockedClient.mockReturnValue(client as never);
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        await expect(
            logApiAudit({ action: "lead_captured", organizationId: "org_1", metadata: { email: "t@example.com" } }),
        ).resolves.toBeUndefined();
        expect(client.from).toHaveBeenCalledWith("audit_logs");
        expect(warn).not.toHaveBeenCalled();
    });

    it("warns and resolves when the service client is unconfigured", async () => {
        mockedClient.mockReturnValue(null);
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        await expect(logApiAudit({ action: "lead_captured", organizationId: "org_1" })).resolves.toBeUndefined();
        expect(warn).toHaveBeenCalledTimes(1);
    });

    it("warns with the DB message and still resolves on insert failure (fail-open)", async () => {
        const client = stubClient({ error: { message: "row violates policy" } });
        mockedClient.mockReturnValue(client as never);
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        await expect(logApiAudit({ action: "lead_notification_attempt", organizationId: "org_1" })).resolves.toBeUndefined();
        expect(warn).toHaveBeenCalledTimes(1);
    });

    it("never logs email addresses, metadata, or secrets", async () => {
        const client = stubClient({ error: { message: "boom" } });
        mockedClient.mockReturnValue(client as never);
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
        await logApiAudit({
            action: "lead_captured",
            organizationId: "org_1",
            metadata: { email: "private@example.com", leadId: "abc" },
        });
        const logged = JSON.stringify([warn.mock.calls, info.mock.calls]);
        expect(logged).not.toContain("private@example.com");
        expect(logged).not.toContain("leadId");
    });
});
