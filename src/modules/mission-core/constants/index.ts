export const MISSION_CORE_STORAGE_KEY = "aa-mission-core-state";

export const MISSION_CORE_CAPABILITY_IDS = {
    clientSuccess: "client-success-capability",
    aiOnboarding: "ai-onboarding-workflow",
    projectProvisioning: "project-provisioning-workflow",
    deliveryHandover: "delivery-handover-workflow",
} as const;

export const MISSION_CORE_WORKFLOWS = {
    registerClient: "register-client",
    runOnboarding: "run-onboarding",
    provisionWorkspace: "provision-workspace",
    trackDelivery: "track-delivery",
    healthMonitoring: "health-monitoring",
} as const;
