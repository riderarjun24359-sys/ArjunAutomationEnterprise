import type { ExecutiveRawSignals, ExecutiveOpportunityItem } from "../../types";

export function runOpportunityEngine(signals: ExecutiveRawSignals): ExecutiveOpportunityItem[] {
    const { eip, aix, business } = signals;
    const opportunities: ExecutiveOpportunityItem[] = [];

    if (eip.growthScore > 60) {
        opportunities.push({
            id: "opp-growth-score",
            title: "Strong growth trajectory",
            detail: `EIP growth score ${eip.growthScore}% — consider expansion initiatives.`,
            module: "business",
            impact: "high",
            actionHref: "/sales",
        });
    }

    if (eip.revenueForecastTotal > 0) {
        opportunities.push({
            id: "opp-revenue-forecast",
            title: "Revenue forecast available",
            detail: `Projected revenue pipeline totals ${eip.revenueForecastTotal.toLocaleString()}.`,
            module: "business",
            impact: "high",
            actionHref: "/enterprise-intelligence-platform",
        });
    }

    if (aix.growthScore > 65) {
        opportunities.push({
            id: "opp-aix-growth",
            title: "AI-identified growth signals",
            detail: "Executive intelligence detected favorable expansion patterns.",
            module: "business",
            impact: "medium",
            actionHref: "/executive-intelligence",
        });
    }

    if (business && business.leadsCount > 0) {
        opportunities.push({
            id: "opp-leads",
            title: `${business.leadsCount} leads in pipeline`,
            detail: "Convert inbound leads through consultation and proposal workflow.",
            module: "customer",
            impact: business.leadsCount > 5 ? "high" : "medium",
            actionHref: "/business-platform",
        });
    }

    if (business && business.proposalsDraft > 0) {
        opportunities.push({
            id: "opp-proposals",
            title: `${business.proposalsDraft} draft proposals ready`,
            detail: "Finalize and send proposals to accelerate deal closure.",
            module: "business",
            impact: "medium",
            actionHref: "/business-platform",
        });
    }

    if (opportunities.length === 0) {
        opportunities.push({
            id: "opp-monitor",
            title: "Monitor emerging signals",
            detail: "Connect more data sources to surface growth opportunities.",
            module: "business",
            impact: "low",
        });
    }

    return opportunities;
}
