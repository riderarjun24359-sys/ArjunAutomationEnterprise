import { CRITICAL_ACTION_KEYWORDS, EXECUTIVE_AGENTS, type ExecutiveAgentKey } from "../constants";
import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function isCritical(text: string): boolean {
    const lower = text.toLowerCase();
    return CRITICAL_ACTION_KEYWORDS.some((k) => lower.includes(k));
}

type AgentGenerator = (knowledge: SharedKnowledgeSnapshot) => AgentRecommendation[];

const agentGenerators: Record<ExecutiveAgentKey, AgentGenerator> = {
    cto: (k) => {
        const recs: AgentRecommendation[] = [];
        if (k.productionReadiness.overallScore < 85) {
            recs.push({ id: uid("cto"), agentKey: "cto", title: "Review architecture against production readiness gaps", detail: `Production readiness at ${k.productionReadiness.overallScore}%. Prioritize technical debt in low-scoring pillars.`, confidence: 0.88, requiresApproval: false, status: "pending", sourceModules: "production-readiness,delivery-engine", createdAt: new Date().toISOString() });
        }
        if (k.deliveryEngine.qualityPassRate < 90) {
            recs.push({ id: uid("cto"), agentKey: "cto", title: "Engineering quality gate review", detail: `Delivery quality pass rate ${k.deliveryEngine.qualityPassRate}%. Schedule sprint planning for verification fixes.`, confidence: 0.85, requiresApproval: false, status: "pending", sourceModules: "delivery-engine", createdAt: new Date().toISOString() });
        }
        recs.push({ id: uid("cto"), agentKey: "cto", title: "Sprint planning recommendation", detail: "Focus next sprint on EIP failure remediation and delivery pipeline automation.", confidence: 0.82, requiresApproval: false, status: "pending", sourceModules: "executive-intelligence-platform", createdAt: new Date().toISOString() });
        return recs;
    },
    ceo: (k) => [
        { id: uid("ceo"), agentKey: "ceo", title: "Executive priority summary", detail: `${k.executiveIntelligence.risks} risks and ${k.executiveIntelligence.opportunities} opportunities identified. Unified intelligence ${k.executiveIntelligence.unifiedScore}%.`, confidence: 0.9, requiresApproval: false, status: "pending", sourceModules: "executive-intelligence-platform,business-platform", createdAt: new Date().toISOString() },
        { id: uid("ceo"), agentKey: "ceo", title: "Strategic prioritization", detail: "Prioritize client lifecycle conversion and delivery velocity — both directly impact company health.", confidence: 0.87, requiresApproval: false, status: "pending", sourceModules: "business-platform,delivery-engine", createdAt: new Date().toISOString() },
    ],
    coo: (k) => [
        { id: uid("coo"), agentKey: "coo", title: "Operations workflow optimization", detail: `${k.deliveryEngine.activeEngagements} active deliveries. Align resource allocation with playbook stages.`, confidence: 0.86, requiresApproval: false, status: "pending", sourceModules: "delivery-engine,business-platform", createdAt: new Date().toISOString() },
        { id: uid("coo"), agentKey: "coo", title: "Delivery monitoring alert", detail: k.productionReadiness.alerts > 0 ? `${k.productionReadiness.alerts} production alerts require ops attention.` : "Operations nominal.", confidence: 0.84, requiresApproval: false, status: "pending", sourceModules: "production-readiness", createdAt: new Date().toISOString() },
    ],
    cfo: (k) => [
        { id: uid("cfo"), agentKey: "cfo", title: "Revenue pipeline review", detail: `${k.businessPlatform.leads} leads, ${k.businessPlatform.clients} active clients. Review open invoices and forecast.`, confidence: 0.88, requiresApproval: false, status: "pending", sourceModules: "business-platform,executive-intelligence-platform", createdAt: new Date().toISOString() },
        { id: uid("cfo"), agentKey: "cfo", title: "Pricing recommendation", detail: "Analyze proposal win rates before adjusting enterprise pricing tiers.", confidence: 0.79, requiresApproval: true, status: "pending", sourceModules: "business-platform", createdAt: new Date().toISOString() },
    ],
    cmo: (k) => [
        { id: uid("cmo"), agentKey: "cmo", title: "Lead generation insights", detail: `${k.businessPlatform.leads} leads in pipeline. Increase SEO content for high-intent service pages.`, confidence: 0.83, requiresApproval: false, status: "pending", sourceModules: "business-platform", createdAt: new Date().toISOString() },
        { id: uid("cmo"), agentKey: "cmo", title: "Campaign planning", detail: "Launch case-study campaign targeting enterprise automation buyers.", confidence: 0.8, requiresApproval: false, status: "pending", sourceModules: "business-platform,knowledge-engine", createdAt: new Date().toISOString() },
    ],
    cso: (k) => [
        { id: uid("cso"), agentKey: "cso", title: "Pipeline forecast", detail: `Score top ${Math.max(1, Math.floor(k.businessPlatform.leads / 3))} leads for consultation scheduling.`, confidence: 0.87, requiresApproval: false, status: "pending", sourceModules: "business-platform", createdAt: new Date().toISOString() },
        { id: uid("cso"), agentKey: "cso", title: "Proposal recommendation", detail: "Draft proposals for qualified leads with pending consultations.", confidence: 0.85, requiresApproval: false, status: "pending", sourceModules: "business-platform,delivery-engine", createdAt: new Date().toISOString() },
    ],
    customerSuccess: (k) => [
        { id: uid("cs"), agentKey: "customerSuccess", title: "Customer health review", detail: `${k.businessPlatform.clients} active clients. Monitor renewal signals and satisfaction.`, confidence: 0.86, requiresApproval: false, status: "pending", sourceModules: "business-platform,executive-intelligence-platform", createdAt: new Date().toISOString() },
        { id: uid("cs"), agentKey: "customerSuccess", title: "Renewal prediction", detail: k.businessPlatform.pendingAi > 0 ? `${k.businessPlatform.pendingAi} AI lifecycle recommendations pending client review.` : "No pending renewal risks.", confidence: 0.84, requiresApproval: false, status: "pending", sourceModules: "business-platform", createdAt: new Date().toISOString() },
    ],
    security: (k) => [
        { id: uid("sec"), agentKey: "security", title: "Security posture summary", detail: `Production security score ${k.productionReadiness.overallScore > 0 ? "tracked via readiness module" : "pending"}. ${k.productionReadiness.alerts} active alerts.`, confidence: 0.9, requiresApproval: false, status: "pending", sourceModules: "production-readiness", createdAt: new Date().toISOString() },
        { id: uid("sec"), agentKey: "security", title: "Compliance recommendation", detail: "Run permission audit across org-scoped tables before next deployment.", confidence: 0.88, requiresApproval: true, status: "pending", sourceModules: "production-readiness,executive-intelligence-platform", createdAt: new Date().toISOString() },
    ],
    analytics: (k) => [
        { id: uid("ana"), agentKey: "analytics", title: "KPI trend analysis", detail: `Unified score ${k.executiveIntelligence.unifiedScore}%. Track week-over-week delta across EIP metrics.`, confidence: 0.89, requiresApproval: false, status: "pending", sourceModules: "executive-intelligence-platform", createdAt: new Date().toISOString() },
        { id: uid("ana"), agentKey: "analytics", title: "Executive reporting", detail: "Generate consolidated executive brief from all 9 agent recommendations.", confidence: 0.91, requiresApproval: false, status: "pending", sourceModules: "executive-intelligence-platform,business-platform,delivery-engine", createdAt: new Date().toISOString() },
    ],
};

export function generateAllAgentRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const all: AgentRecommendation[] = [];
    for (const key of Object.keys(EXECUTIVE_AGENTS) as ExecutiveAgentKey[]) {
        all.push(...agentGenerators[key](knowledge));
    }
    return all.map((r) => ({
        ...r,
        requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail),
    }));
}

export function routeTaskToAgents(taskType: string): ExecutiveAgentKey[] {
    const lower = taskType.toLowerCase();
    if (/architect|code|debt|sprint|engineering/.test(lower)) return ["cto", "analytics"];
    if (/strategy|priorit|decision|company/.test(lower)) return ["ceo", "analytics"];
    if (/operat|deliver|resource|workflow/.test(lower)) return ["coo", "cto"];
    if (/revenue|cost|profit|cash|pric/.test(lower)) return ["cfo", "analytics"];
    if (/market|campaign|seo|content|lead/.test(lower)) return ["cmo", "cso"];
    if (/sales|pipeline|proposal|opportun/.test(lower)) return ["cso", "cmo"];
    if (/customer|renewal|satisf/.test(lower)) return ["customerSuccess", "cso"];
    if (/security|vulner|compliance|incident/.test(lower)) return ["security", "cto"];
    if (/kpi|trend|forecast|report/.test(lower)) return ["analytics", "ceo"];
    return ["ceo", "analytics"];
}

export { EXECUTIVE_AGENTS };
