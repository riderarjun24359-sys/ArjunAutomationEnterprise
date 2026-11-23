import { describe, expect, it } from "vitest";
import { buildSupportDashboardStats } from "@/src/modules/database/lib/support-mappers";
import { generateAiRecommendations, generateImprovementBacklog } from "./continuous-improvement.engine";

describe("Global Operations data integrity", () => {
    it("does not report 100 percent SLA when there are no measurable tickets", () => {
        const stats = buildSupportDashboardStats({
            tickets: [],
            ratings: [],
            agents: [],
            articles: [],
            escalationRules: [],
        });
        expect(stats.slaCompliance).toBe(0);
        expect(stats.avgSatisfaction).toBe(0);
    });

    it("does not invent improvement items when every health source is unavailable", () => {
        expect(generateImprovementBacklog({
            feedback: [],
            deliveryHealth: null,
            supportHealth: null,
            customerHealth: null,
            openTickets: 0,
        })).toEqual([]);
    });

    it("does not emit an Operations nominal recommendation without real health data", () => {
        expect(generateAiRecommendations({
            customerHealth: null,
            supportHealth: null,
            deliveryHealth: null,
            openTickets: 0,
            renewals: [],
            escalations: [],
        })).toEqual([]);
    });
});
