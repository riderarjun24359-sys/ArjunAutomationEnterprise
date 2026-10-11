import { describe, it, expect } from "vitest";
import { selectDueFollowUps } from "./follow-ups";

describe("selectDueFollowUps", () => {
    const NOW = new Date("2026-10-10T00:00:00Z").getTime();
    const rows = [
        { id: "overdue", due_at: "2026-10-01T00:00:00Z", completed_at: null },
        { id: "soon", due_at: "2026-10-12T00:00:00Z", completed_at: null },
        { id: "later", due_at: "2026-11-01T00:00:00Z", completed_at: null },
        { id: "done", due_at: "2026-10-01T00:00:00Z", completed_at: "2026-10-02T00:00:00Z" },
        { id: "nodate", due_at: null, completed_at: null },
    ];

    it("returns overdue and due-within-horizon items, sorted, excluding completed", () => {
        const out = selectDueFollowUps(rows, NOW, 7);
        expect(out.map((r) => r.id)).toEqual(["overdue", "soon"]);
    });

    it("never includes completed or undated rows", () => {
        const out = selectDueFollowUps(rows, NOW, 365);
        expect(out.map((r) => r.id)).toContain("later");
        expect(out.map((r) => r.id)).not.toContain("done");
        expect(out.map((r) => r.id)).not.toContain("nodate");
    });
});
