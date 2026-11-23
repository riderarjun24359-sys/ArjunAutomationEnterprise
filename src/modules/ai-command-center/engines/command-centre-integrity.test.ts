import { describe, expect, it } from "vitest";
import { buildAgentStatuses } from "./health-monitoring.engine";
import { buildRevenueSummary } from "./executive-analytics.engine";
import { buildRecommendations } from "./recommendation.engine";
import { withinJarvisCallingWindow } from "@/src/modules/ai-sales-lead-engine/services/jarvis-calling-window";

describe("Command Centre trust guarantees", () => {
    it("does not infer individual agent availability from aggregate system health", () => {
        const agents = buildAgentStatuses({ systemHealth: 99, pendingApprovals: 0 });
        expect(agents.length).toBeGreaterThan(0);
        expect(agents.every((agent) => agent.status === "unknown")).toBe(true);
        expect(agents.every((agent) => agent.healthScore === 0 && agent.lastActivity === "")).toBe(true);
    });

    it("does not fabricate MRR from client counts", () => {
        const revenue = buildRevenueSummary({
            activeClients: 25,
            openInvoices: 2,
            renewalsDue: 1,
            pipelineLeads: 8,
        });
        expect(revenue.mrr).toBe(0);
        expect(revenue.mrrVerified).toBe(false);
    });

    it("uses stable UUIDs for repeat recommendations", () => {
        const input = {
            decisions: [],
            systemHealth: 40,
            clientHealth: 40,
            supportHealth: 40,
            deliveryHealth: 40,
            pendingAi: 1,
            organizationId: "org-a",
        };
        const first = buildRecommendations(input);
        const second = buildRecommendations(input);
        const otherTenant = buildRecommendations({ ...input, organizationId: "org-b" });
        expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
        expect(first.map((item) => item.id)).not.toEqual(otherTenant.map((item) => item.id));
        expect(first.every((item) => /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id))).toBe(true);
    });
});

describe("Jarvis IST calling window", () => {
    it("allows Monday through Saturday only from 08:00 to before 21:00 IST", () => {
        expect(withinJarvisCallingWindow(new Date("2026-11-23T02:30:00.000Z"))).toBe(true); // Monday 08:00 IST
        expect(withinJarvisCallingWindow(new Date("2026-11-28T15:29:00.000Z"))).toBe(true); // Saturday 20:59 IST
        expect(withinJarvisCallingWindow(new Date("2026-11-23T02:29:00.000Z"))).toBe(false); // Monday 07:59 IST
        expect(withinJarvisCallingWindow(new Date("2026-11-23T15:30:00.000Z"))).toBe(false); // Monday 21:00 IST
        expect(withinJarvisCallingWindow(new Date("2026-11-22T03:30:00.000Z"))).toBe(false); // Sunday 09:00 IST
    });
});
