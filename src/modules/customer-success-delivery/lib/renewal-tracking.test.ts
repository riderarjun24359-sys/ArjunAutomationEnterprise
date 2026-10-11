import { describe, it, expect } from "vitest";
import { selectRenewalsDue, totalRenewalValue } from "./renewal-tracking";

const NOW = new Date("2026-10-11T00:00:00Z").getTime();
const rows = [
    { id: "overdue", forecastStatus: "pending", status: "active", renewalDate: "2026-10-01", forecastValue: 100 },
    { id: "soon", forecastStatus: "contacted", status: "active", renewalDate: "2026-10-20", forecastValue: 200 },
    { id: "later", forecastStatus: "pending", status: "active", renewalDate: "2027-03-01", forecastValue: 300 },
    { id: "won", forecastStatus: "won", status: "active", renewalDate: "2026-10-01", forecastValue: 400 },
    { id: "inactive", forecastStatus: "pending", status: "archived", renewalDate: "2026-10-01", forecastValue: 500 },
    { id: "nodate", forecastStatus: "pending", status: "active", renewalDate: null, forecastValue: 600 },
];

describe("selectRenewalsDue", () => {
    it("splits overdue and upcoming, excluding terminal/inactive/undated", () => {
        const { overdue, upcoming } = selectRenewalsDue(rows, NOW, 30);
        expect(overdue.map((r) => r.id)).toEqual(["overdue"]);
        expect(upcoming.map((r) => r.id)).toEqual(["soon"]);
    });

    it("totals pipeline value honestly", () => {
        const { overdue, upcoming } = selectRenewalsDue(rows, NOW, 30);
        expect(totalRenewalValue([...overdue, ...upcoming])).toBe(300);
        expect(totalRenewalValue([])).toBe(0);
    });
});
