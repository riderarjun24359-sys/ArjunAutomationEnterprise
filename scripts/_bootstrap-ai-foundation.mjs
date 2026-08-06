/**
 * Bootstrap AI Foundation V2.0 module.
 * Run: node scripts/_bootstrap-ai-foundation.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();
const mod = join(root, "src", "modules", "ai-foundation");

function write(path, content) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", path);
}

// ── types ──────────────────────────────────────────────────────────────────
write("src/modules/ai-foundation/types/index.ts", `export type MemoryType =
    | "persistent"
    | "conversation"
    | "project"
    | "customer"
    | "business"
    | "workflow";

export interface MemoryRecord {
    id: string;
    type: MemoryType;
    key: string;
    content: string;
    scope: string;
    createdAt: string;
    updatedAt: string;
    ttlDays?: number | null;
}

export type KnowledgeNodeType =
    | "customer"
    | "project"
    | "capability"
    | "document"
    | "aiAgent"
    | "workflow"
    | "businessAsset"
    | "missionCore";

export interface KnowledgeNode {
    id: string;
    type: KnowledgeNodeType;
    label: string;
    metadata?: Record<string, unknown> | null;
}

export interface KnowledgeEdge {
    id: string;
    sourceId: string;
    targetId: string;
    relationship: string;
    weight: number;
}

export type PromptStatus = "draft" | "testing" | "approved" | "deprecated";

export interface PromptTemplate {
    id: string;
    name: string;
    version: string;
    content: string;
    status: PromptStatus;
    usageCount: number;
    approvedBy?: string | null;
    approvedAt?: string | null;
    createdAt: string;
}

export type AgentStatus = "active" | "inactive" | "degraded" | "maintenance";

export interface AiAgent {
    id: string;
    name: string;
    capabilities: string[];
    permissions: string[];
    health: "healthy" | "degraded" | "offline";
    version: string;
    owner: string;
    status: AgentStatus;
}

export type WorkflowExecutionMode = "sequential" | "parallel" | "conditional";

export interface AiWorkflowStep {
    id: string;
    agentId: string;
    action: string;
    requiresApproval: boolean;
    condition?: string | null;
}

export interface AiWorkflow {
    id: string;
    name: string;
    mode: WorkflowExecutionMode;
    steps: AiWorkflowStep[];
    status: "idle" | "running" | "completed" | "failed";
    orchestratedBy: "missionCore";
}

export interface EvaluationMetric {
    id: string;
    name: string;
    category: "accuracy" | "quality" | "consistency" | "latency" | "failures" | "hallucination";
    value: number;
    unit: string;
    threshold: number;
    status: "pass" | "warning" | "fail";
    measuredAt: string;
}

export type GovernancePolicyType = "model" | "pii" | "prompt_safety" | "output_validation" | "risk";

export interface GovernancePolicy {
    id: string;
    type: GovernancePolicyType;
    name: string;
    enforced: boolean;
    riskScore: number;
    approvedModels: string[];
    lastReviewedAt: string;
}

export interface CostUsageRecord {
    id: string;
    model: string;
    tokens: number;
    requests: number;
    costUsd: number;
    department: string;
    customer?: string | null;
    recordedAt: string;
}

export interface LearningFeedback {
    id: string;
    source: string;
    feedback: string;
    rating: number;
    status: "pending" | "reviewed" | "applied";
    createdAt: string;
}

export interface ExecutiveDashboardStats {
    aiHealthScore: number;
    activeAgents: number;
    modelHealth: "healthy" | "degraded" | "critical";
    totalTokens: number;
    totalCostUsd: number;
    qualityScore: number;
    riskScore: number;
    lastUpdatedAt: string;
}

export interface AiFoundationState {
    memories: MemoryRecord[];
    knowledgeNodes: KnowledgeNode[];
    knowledgeEdges: KnowledgeEdge[];
    prompts: PromptTemplate[];
    agents: AiAgent[];
    workflows: AiWorkflow[];
    evaluations: EvaluationMetric[];
    policies: GovernancePolicy[];
    costUsage: CostUsageRecord[];
    feedback: LearningFeedback[];
    dashboard: ExecutiveDashboardStats;
}
`);

// ── constants ──────────────────────────────────────────────────────────────
write("src/modules/ai-foundation/constants/index.ts", `import type { KnowledgeNodeType, MemoryType, GovernancePolicyType } from "../types";

export const AI_FOUNDATION_STORAGE_KEY = "aa-ai-foundation-state";

export const MEMORY_TYPES: MemoryType[] = [
    "persistent",
    "conversation",
    "project",
    "customer",
    "business",
    "workflow",
];

export const KNOWLEDGE_NODE_TYPES: KnowledgeNodeType[] = [
    "customer",
    "project",
    "capability",
    "document",
    "aiAgent",
    "workflow",
    "businessAsset",
    "missionCore",
];

export const GOVERNANCE_POLICY_TYPES: GovernancePolicyType[] = [
    "model",
    "pii",
    "prompt_safety",
    "output_validation",
    "risk",
];

export const EVALUATION_CATEGORIES = [
    "accuracy",
    "quality",
    "consistency",
    "latency",
    "failures",
    "hallucination",
] as const;

export const AI_FOUNDATION_EVENTS = {
    AiRoutingEvent: "AiRoutingEvent",
    AgentSelectedEvent: "AgentSelectedEvent",
    AiWorkflowExecutedEvent: "AiWorkflowExecutedEvent",
    MemoryAccessEvent: "MemoryAccessEvent",
    KnowledgeAccessEvent: "KnowledgeAccessEvent",
    PolicyEnforcedEvent: "PolicyEnforcedEvent",
} as const;

export const GCI_PRESERVATION_RULES = {
    businessIntent: "Preserve business intent across language adaptation",
    technicalMeaning: "Preserve technical meaning in translations",
    legalTerminology: "Preserve legal terminology exactly",
    professionalTone: "Maintain professional tone in all locales",
} as const;

export const AI_FOUNDATION_TABS = {
    memory: "memory",
    knowledgeGraph: "knowledge-graph",
    prompts: "prompts",
    agents: "agents",
    workflows: "workflows",
    evaluation: "evaluation",
    governance: "governance",
    costUsage: "cost-usage",
    learning: "learning",
    dashboard: "dashboard",
} as const;

export const AI_FOUNDATION_TAB_LIST = [
    { id: AI_FOUNDATION_TABS.memory, label: "AI Memory Engine" },
    { id: AI_FOUNDATION_TABS.knowledgeGraph, label: "Knowledge Graph" },
    { id: AI_FOUNDATION_TABS.prompts, label: "Prompt Management" },
    { id: AI_FOUNDATION_TABS.agents, label: "Agent Registry" },
    { id: AI_FOUNDATION_TABS.workflows, label: "AI Workflow Engine" },
    { id: AI_FOUNDATION_TABS.evaluation, label: "Evaluation Center" },
    { id: AI_FOUNDATION_TABS.governance, label: "AI Governance" },
    { id: AI_FOUNDATION_TABS.costUsage, label: "Cost & Usage" },
    { id: AI_FOUNDATION_TABS.learning, label: "Learning Pipeline" },
    { id: AI_FOUNDATION_TABS.dashboard, label: "Executive Dashboard" },
] as const;

export const AI_FOUNDATION_THEME = {
    accent: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/60 dark:border-violet-800/60",
    surface: "bg-violet-50/50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-300",
} as const;
`);

// ── lib ────────────────────────────────────────────────────────────────────
write("src/modules/ai-foundation/lib/ai-governance-policies.ts", `export function computeRiskScore(factors: { piiDetected?: boolean; promptUnsafe?: boolean; outputInvalid?: boolean; modelUnapproved?: boolean }): number {
    let score = 0;
    if (factors.piiDetected) score += 30;
    if (factors.promptUnsafe) score += 25;
    if (factors.outputInvalid) score += 25;
    if (factors.modelUnapproved) score += 20;
    return Math.min(100, score);
}

export function isApprovedModel(model: string, approvedModels: string[]): boolean {
    return approvedModels.includes(model) || approvedModels.includes("*");
}

export function validateOutput(output: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    if (output.includes("{{UNSAFE}}")) issues.push("unsafe_content");
    if (output.length > 50000) issues.push("output_too_large");
    return { valid: issues.length === 0, issues };
}
`);

// ── engines ────────────────────────────────────────────────────────────────
const engineTemplate = (name, fn, returnType, body) => `import { ${fn.includes("MEMORY") ? "MEMORY_TYPES" : fn.includes("KNOWLEDGE") ? "KNOWLEDGE_NODE_TYPES" : fn.includes("GOVERNANCE") ? "GOVERNANCE_POLICY_TYPES" : "EVALUATION_CATEGORIES"} } from "../constants";
import type { ${returnType} } from "../types";

${body}
`;

write("src/modules/ai-foundation/engine/ai-memory-engine.ts", engineTemplate("memory", "MEMORY", "MemoryRecord", `const SEED: MemoryRecord[] = MEMORY_TYPES.map((type, i) => ({
    id: \`mem-\${type}\`,
    type,
    key: \`\${type}-context\`,
    content: \`Sample \${type} memory context\`,
    scope: "platform",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    ttlDays: type === "conversation" ? 30 : null,
}));

export function getMemories(type?: string): MemoryRecord[] {
    if (type) return SEED.filter((m) => m.type === type);
    return SEED;
}

export function storeMemory(input: { type: MemoryRecord["type"]; key: string; content: string; scope: string }): MemoryRecord {
    return {
        id: \`mem-\${Date.now()}\`,
        type: input.type,
        key: input.key,
        content: input.content,
        scope: input.scope,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function searchMemories(query: string): MemoryRecord[] {
    const q = query.toLowerCase();
    return SEED.filter((m) => m.content.toLowerCase().includes(q) || m.key.toLowerCase().includes(q));
}
`));

write("src/modules/ai-foundation/engine/knowledge-graph-engine.ts", engineTemplate("kg", "KNOWLEDGE", "KnowledgeNode", `const NODES: KnowledgeNode[] = KNOWLEDGE_NODE_TYPES.map((type, i) => ({
    id: \`node-\${type}\`,
    type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    metadata: { index: i },
}));

const EDGES = [
    { id: "edge-1", sourceId: "node-customer", targetId: "node-project", relationship: "owns", weight: 1 },
    { id: "edge-2", sourceId: "node-project", targetId: "node-capability", relationship: "uses", weight: 0.9 },
    { id: "edge-3", sourceId: "node-aiAgent", targetId: "node-workflow", relationship: "executes", weight: 0.85 },
    { id: "edge-4", sourceId: "node-missionCore", targetId: "node-capability", relationship: "orchestrates", weight: 1 },
    { id: "edge-5", sourceId: "node-document", targetId: "node-businessAsset", relationship: "references", weight: 0.7 },
];

export function getKnowledgeNodes(type?: string) {
    if (type) return NODES.filter((n) => n.type === type);
    return NODES;
}

export function getKnowledgeEdges(nodeId?: string) {
    if (!nodeId) return EDGES;
    return EDGES.filter((e) => e.sourceId === nodeId || e.targetId === nodeId);
}

export function getRelatedNodes(nodeId: string): KnowledgeNode[] {
    const relatedIds = new Set(
        EDGES.filter((e) => e.sourceId === nodeId || e.targetId === nodeId)
            .flatMap((e) => [e.sourceId, e.targetId])
            .filter((id) => id !== nodeId),
    );
    return NODES.filter((n) => relatedIds.has(n.id));
}
`));

write("src/modules/ai-foundation/engine/prompt-management-engine.ts", `import type { PromptTemplate } from "../types";

const PROMPTS: PromptTemplate[] = [
    { id: "prompt-1", name: "Client Onboarding", version: "2.1", content: "You are an onboarding assistant...", status: "approved", usageCount: 1240, approvedBy: "admin", approvedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "prompt-2", name: "Requirements Analysis", version: "1.4", content: "Analyze the following requirements...", status: "approved", usageCount: 890, approvedBy: "admin", approvedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "prompt-3", name: "Code Review", version: "3.0", content: "Review this code for...", status: "testing", usageCount: 45, createdAt: new Date().toISOString() },
];

export function getPrompts(status?: string): PromptTemplate[] {
    if (status) return PROMPTS.filter((p) => p.status === status);
    return PROMPTS;
}

export function getPromptVersions(name: string): PromptTemplate[] {
    return PROMPTS.filter((p) => p.name === name);
}

export function testPrompt(id: string): { passed: boolean; score: number } {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (!prompt) return { passed: false, score: 0 };
    return { passed: true, score: 85 + Math.random() * 10 };
}

export function approvePrompt(id: string, approvedBy: string): PromptTemplate | null {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (!prompt) return null;
    prompt.status = "approved";
    prompt.approvedBy = approvedBy;
    prompt.approvedAt = new Date().toISOString();
    return prompt;
}

export function rollbackPrompt(id: string): PromptTemplate | null {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (!prompt) return null;
    const parts = prompt.version.split(".");
    parts[1] = String(Math.max(0, parseInt(parts[1] ?? "0", 10) - 1));
    prompt.version = parts.join(".");
    prompt.status = "draft";
    return prompt;
}

export function trackPromptUsage(id: string): void {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (prompt) prompt.usageCount += 1;
}
`);

write("src/modules/ai-foundation/engine/agent-registry-engine.ts", `import type { AiAgent } from "../types";

const AGENTS: AiAgent[] = [
    { id: "agent-ba", name: "Business Analyst", capabilities: ["requirements", "analysis"], permissions: ["read:projects", "write:documents"], health: "healthy", version: "2.0", owner: "platform", status: "active" },
    { id: "agent-sa", name: "Solution Architect", capabilities: ["architecture", "design"], permissions: ["read:all", "write:designs"], health: "healthy", version: "2.0", owner: "platform", status: "active" },
    { id: "agent-dev", name: "Development Factory", capabilities: ["codegen", "review"], permissions: ["write:code"], health: "degraded", version: "1.8", owner: "platform", status: "active" },
    { id: "agent-qa", name: "QA Engineer", capabilities: ["testing", "validation"], permissions: ["read:code", "write:tests"], health: "healthy", version: "1.5", owner: "platform", status: "active" },
];

export function getAgents(status?: string): AiAgent[] {
    if (status) return AGENTS.filter((a) => a.status === status);
    return AGENTS;
}

export function registerAgent(input: Omit<AiAgent, "id">): AiAgent {
    return { ...input, id: \`agent-\${Date.now()}\` };
}

export function getAgentHealth(id: string): AiAgent["health"] | null {
    return AGENTS.find((a) => a.id === id)?.health ?? null;
}

export function selectAgent(capability: string): AiAgent | null {
    return AGENTS.find((a) => a.capabilities.includes(capability) && a.status === "active") ?? null;
}
`);

write("src/modules/ai-foundation/engine/ai-workflow-engine.ts", `import type { AiWorkflow, AiWorkflowStep } from "../types";

const WORKFLOWS: AiWorkflow[] = [
    {
        id: "wf-onboard",
        name: "Client Onboarding AI Chain",
        mode: "sequential",
        steps: [
            { id: "s1", agentId: "agent-ba", action: "analyze-requirements", requiresApproval: false },
            { id: "s2", agentId: "agent-sa", action: "design-solution", requiresApproval: true },
            { id: "s3", agentId: "agent-dev", action: "generate-code", requiresApproval: false },
        ],
        status: "idle",
        orchestratedBy: "missionCore",
    },
    {
        id: "wf-review",
        name: "Parallel Code Review",
        mode: "parallel",
        steps: [
            { id: "s1", agentId: "agent-qa", action: "run-tests", requiresApproval: false },
            { id: "s2", agentId: "agent-dev", action: "review-code", requiresApproval: false },
        ],
        status: "idle",
        orchestratedBy: "missionCore",
    },
];

export function getWorkflows(): AiWorkflow[] {
    return WORKFLOWS;
}

export function executeWorkflow(id: string, mode?: "sequential" | "parallel" | "conditional"): AiWorkflow | null {
    const wf = WORKFLOWS.find((w) => w.id === id);
    if (!wf) return null;
    wf.status = "running";
    wf.mode = mode ?? wf.mode;
    return wf;
}

export function routeConditionally(step: AiWorkflowStep, context: Record<string, unknown>): boolean {
    if (!step.condition) return true;
    return Boolean(context[step.condition]);
}

export function requiresHumanApproval(step: AiWorkflowStep): boolean {
    return step.requiresApproval;
}

export function completeWorkflow(id: string): AiWorkflow | null {
    const wf = WORKFLOWS.find((w) => w.id === id);
    if (!wf) return null;
    wf.status = "completed";
    return wf;
}
`);

write("src/modules/ai-foundation/engine/evaluation-center-engine.ts", `import { EVALUATION_CATEGORIES } from "../constants";
import type { EvaluationMetric } from "../types";

export function getEvaluationMetrics(): EvaluationMetric[] {
    return EVALUATION_CATEGORIES.map((category, i) => {
        const value = category === "latency" ? 120 + i * 10 : 85 + Math.random() * 10;
        const threshold = category === "latency" ? 500 : category === "failures" ? 5 : 80;
        const status = category === "latency" ? (value < threshold ? "pass" : "warning") : value >= threshold ? "pass" : "warning";
        return {
            id: \`eval-\${category}\`,
            name: category.charAt(0).toUpperCase() + category.slice(1),
            category,
            value: Math.round(value * 10) / 10,
            unit: category === "latency" ? "ms" : category === "failures" ? "%" : "score",
            threshold,
            status: status as EvaluationMetric["status"],
            measuredAt: new Date().toISOString(),
        };
    });
}

export function getHallucinationIndicators(): EvaluationMetric[] {
    return getEvaluationMetrics().filter((m) => m.category === "hallucination");
}

export function getOverallQualityScore(): number {
    const metrics = getEvaluationMetrics().filter((m) => m.category !== "latency" && m.category !== "failures");
    return Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length);
}
`);

write("src/modules/ai-foundation/engine/ai-governance-engine.ts", engineTemplate("gov", "GOVERNANCE", "GovernancePolicy", `import { computeRiskScore, isApprovedModel, validateOutput } from "../lib/ai-governance-policies";

const POLICIES: GovernancePolicy[] = GOVERNANCE_POLICY_TYPES.map((type, i) => ({
    id: \`policy-\${type}\`,
    type,
    name: type.replace(/_/g, " ").replace(/\\b\\w/g, (c) => c.toUpperCase()),
    enforced: true,
    riskScore: 10 + i * 5,
    approvedModels: ["gpt-4", "claude-3", "gemini-pro"],
    lastReviewedAt: new Date().toISOString(),
}));

export function getGovernancePolicies(): GovernancePolicy[] {
    return POLICIES;
}

export function enforcePolicy(model: string, output: string): { allowed: boolean; riskScore: number; issues: string[] } {
    const policy = POLICIES.find((p) => p.type === "model");
    const approved = policy ? isApprovedModel(model, policy.approvedModels) : false;
    const validation = validateOutput(output);
    const riskScore = computeRiskScore({ modelUnapproved: !approved, outputInvalid: !validation.valid });
    return { allowed: approved && validation.valid, riskScore, issues: validation.issues };
}

export function getApprovedModels(): string[] {
    return POLICIES.find((p) => p.type === "model")?.approvedModels ?? [];
}

export function checkPiiProtection(content: string): boolean {
    return !/\\b\\d{3}-\\d{2}-\\d{4}\\b/.test(content);
}

export function checkPromptSafety(prompt: string): boolean {
    return !prompt.toLowerCase().includes("ignore previous instructions");
}
`));

write("src/modules/ai-foundation/engine/cost-usage-engine.ts", `import type { CostUsageRecord } from "../types";

const RECORDS: CostUsageRecord[] = [
    { id: "cost-1", model: "gpt-4", tokens: 1250000, requests: 4200, costUsd: 125.50, department: "Engineering", customer: "Acme Corp", recordedAt: new Date().toISOString() },
    { id: "cost-2", model: "claude-3", tokens: 890000, requests: 3100, costUsd: 89.20, department: "Sales", recordedAt: new Date().toISOString() },
    { id: "cost-3", model: "gemini-pro", tokens: 450000, requests: 1800, costUsd: 45.00, department: "Support", customer: "Beta Inc", recordedAt: new Date().toISOString() },
];

export function getCostUsageRecords(): CostUsageRecord[] {
    return RECORDS;
}

export function getTotalTokens(): number {
    return RECORDS.reduce((sum, r) => sum + r.tokens, 0);
}

export function getTotalCost(): number {
    return Math.round(RECORDS.reduce((sum, r) => sum + r.costUsd, 0) * 100) / 100;
}

export function getUsageByDepartment(): Record<string, number> {
    return RECORDS.reduce((acc, r) => {
        acc[r.department] = (acc[r.department] ?? 0) + r.costUsd;
        return acc;
    }, {} as Record<string, number>);
}

export function getOptimizationRecommendations(): string[] {
    return [
        "Switch high-volume tasks to gpt-4o-mini for 60% cost reduction",
        "Enable prompt caching for repeated onboarding flows",
        "Consolidate parallel agent calls in workflow wf-review",
    ];
}
`);

write("src/modules/ai-foundation/engine/learning-pipeline-engine.ts", `import type { LearningFeedback } from "../types";

const FEEDBACK: LearningFeedback[] = [
    { id: "fb-1", source: "agent-ba", feedback: "Requirements analysis was accurate but missed edge case", rating: 4, status: "reviewed", createdAt: new Date().toISOString() },
    { id: "fb-2", source: "agent-dev", feedback: "Generated code needed minor refactoring", rating: 3, status: "pending", createdAt: new Date().toISOString() },
    { id: "fb-3", source: "human-reviewer", feedback: "Architecture design approved with suggestions", rating: 5, status: "applied", createdAt: new Date().toISOString() },
];

export function getFeedbackQueue(status?: string): LearningFeedback[] {
    if (status) return FEEDBACK.filter((f) => f.status === status);
    return FEEDBACK;
}

export function captureFeedback(input: { source: string; feedback: string; rating: number }): LearningFeedback {
    return { id: \`fb-\${Date.now()}\`, ...input, status: "pending", createdAt: new Date().toISOString() };
}

export function getHumanReviewQueue(): LearningFeedback[] {
    return FEEDBACK.filter((f) => f.status === "pending");
}

export function applyKnowledgeUpdate(id: string): LearningFeedback | null {
    const fb = FEEDBACK.find((f) => f.id === id);
    if (!fb) return null;
    fb.status = "applied";
    return fb;
}
`);

write("src/modules/ai-foundation/engine/executive-dashboard-engine.ts", `import type { ExecutiveDashboardStats } from "../types";
import { getAgents } from "./agent-registry-engine";
import { getTotalTokens, getTotalCost } from "./cost-usage-engine";
import { getOverallQualityScore } from "./evaluation-center-engine";
import { getGovernancePolicies } from "./ai-governance-engine";

export function getExecutiveDashboard(): ExecutiveDashboardStats {
    const agents = getAgents("active");
    const policies = getGovernancePolicies();
    const avgRisk = policies.reduce((sum, p) => sum + p.riskScore, 0) / policies.length;
    const healthyAgents = agents.filter((a) => a.health === "healthy").length;
    const aiHealthScore = Math.round((healthyAgents / Math.max(agents.length, 1)) * 100);

    return {
        aiHealthScore,
        activeAgents: agents.length,
        modelHealth: aiHealthScore >= 80 ? "healthy" : aiHealthScore >= 50 ? "degraded" : "critical",
        totalTokens: getTotalTokens(),
        totalCostUsd: getTotalCost(),
        qualityScore: getOverallQualityScore(),
        riskScore: Math.round(avgRisk),
        lastUpdatedAt: new Date().toISOString(),
    };
}
`);

console.log("\nBootstrap complete. Run wiring + verify next.");
