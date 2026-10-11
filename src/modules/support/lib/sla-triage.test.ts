import { describe, it, expect } from "vitest";
import { selectOverdueTickets, selectResponseBreaches } from "./sla-triage";

const NOW = new Date("2026-10-11T12:00:00Z").getTime();

describe("support triage", () => {
    it("selects overdue tickets, excluding resolved and undated", () => {
        const out = selectOverdueTickets(
            [
                { id: "o1", status: "open", dueAt: "2026-10-10T00:00:00Z", resolvedAt: null },
                { id: "r1", status: "resolved", dueAt: "2026-10-01T00:00:00Z", resolvedAt: "2026-10-02T00:00:00Z" },
                { id: "f1", status: "open", dueAt: "2026-10-20T00:00:00Z", resolvedAt: null },
                { id: "n1", status: "open", dueAt: null, resolvedAt: null },
            ],
            NOW,
        );
        expect(out.map((t) => t.id)).toEqual(["o1"]);
    });

    it("detects first-response breaches from SLA minutes", () => {
        const tickets = [
            { id: "u1", status: "open", createdAt: "2026-10-11T09:00:00Z" },
            { id: "u2", status: "open", createdAt: "2026-10-11T11:30:00Z" },
            { id: "u3", status: "closed", createdAt: "2026-10-01T00:00:00Z" },
        ];
        expect(selectResponseBreaches(tickets, new Set(["u1"]), 60, NOW).map((t) => t.id)).toEqual([]);
        expect(selectResponseBreaches(tickets, new Set(), 60, NOW).map((t) => t.id)).toEqual(["u1"]);
    });
});
