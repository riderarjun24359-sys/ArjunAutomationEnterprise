export const DELIVERY_ENGINE_STORAGE_KEY = "aa-delivery-engine-state";

export const DELIVERY_ENGINE_TABS = {
    blueprints: "blueprints",
    components: "components",
    pipelines: "pipelines",
    playbook: "playbook",
    quality: "quality",
    knowledge: "knowledge",
    analytics: "analytics",
    aiAssistant: "ai-assistant",
} as const;

export const DELIVERY_ENGINE_TAB_LIST = [
    { id: DELIVERY_ENGINE_TABS.blueprints, label: "Blueprint Library", module: 1 },
    { id: DELIVERY_ENGINE_TABS.components, label: "Component Library", module: 2 },
    { id: DELIVERY_ENGINE_TABS.pipelines, label: "Automation Pipelines", module: 3 },
    { id: DELIVERY_ENGINE_TABS.playbook, label: "Delivery Playbook", module: 4 },
    { id: DELIVERY_ENGINE_TABS.quality, label: "Quality Engine", module: 5 },
    { id: DELIVERY_ENGINE_TABS.knowledge, label: "Knowledge Engine", module: 6 },
    { id: DELIVERY_ENGINE_TABS.analytics, label: "Delivery Analytics", module: 7 },
    { id: DELIVERY_ENGINE_TABS.aiAssistant, label: "AI Delivery Assistant", module: 8 },
] as const;

export const PROJECT_BLUEPRINTS = [
    { key: "business-website", name: "Business Website", category: "Marketing", estimatedHours: 8, components: 12 },
    { key: "ai-automation", name: "AI Automation", category: "Automation", estimatedHours: 16, components: 18 },
    { key: "crm", name: "CRM", category: "Business", estimatedHours: 24, components: 22 },
    { key: "erp", name: "ERP", category: "Enterprise", estimatedHours: 40, components: 35 },
    { key: "school-management", name: "School Management", category: "Industry", estimatedHours: 32, components: 28 },
    { key: "healthcare", name: "Healthcare", category: "Industry", estimatedHours: 36, components: 30 },
    { key: "restaurant", name: "Restaurant", category: "Industry", estimatedHours: 20, components: 20 },
    { key: "real-estate", name: "Real Estate", category: "Industry", estimatedHours: 24, components: 22 },
    { key: "ecommerce", name: "E-commerce", category: "Commerce", estimatedHours: 28, components: 26 },
    { key: "custom-enterprise", name: "Custom Enterprise Platform", category: "Enterprise", estimatedHours: 48, components: 40 },
] as const;

export const DELIVERY_PLAYBOOK_STAGES = [
    { id: "lead", label: "Lead" },
    { id: "discovery", label: "Discovery" },
    { id: "scope", label: "Scope" },
    { id: "blueprint", label: "Blueprint Selection" },
    { id: "build", label: "Build" },
    { id: "verification", label: "Verification" },
    { id: "deployment", label: "Deployment" },
    { id: "support", label: "Support" },
] as const;

export const PIPELINE_TYPES = [
    { id: "init", label: "Project Initialization" },
    { id: "environment", label: "Environment Setup" },
    { id: "quality", label: "Quality Verification" },
    { id: "testing", label: "Testing" },
    { id: "deployment", label: "Deployment Preparation" },
    { id: "documentation", label: "Documentation Generation" },
] as const;

export const QUALITY_DIMENSIONS = [
    { id: "performance", label: "Performance" },
    { id: "security", label: "Security" },
    { id: "accessibility", label: "Accessibility" },
    { id: "brand", label: "Brand" },
    { id: "seo", label: "SEO" },
    { id: "engineering", label: "Engineering" },
    { id: "business_rules", label: "Business Rules" },
] as const;

export const KNOWLEDGE_ENTRY_TYPES = [
    { id: "lesson", label: "Lesson Learned" },
    { id: "solution", label: "Reusable Solution" },
    { id: "fix", label: "Common Fix" },
    { id: "architecture", label: "Architecture Decision" },
    { id: "pattern", label: "Pattern" },
] as const;

export const DELIVERY_ENGINE_THEME = {
    accent: "text-violet-600 dark:text-violet-400",
    text: "text-[var(--dos-text-secondary)]",
    badge: "Delivery Engine v1.0",
} as const;
