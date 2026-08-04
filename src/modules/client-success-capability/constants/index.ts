export const CLIENT_SUCCESS_STORAGE_KEY = "aa-client-success-capability-state";

export const CLIENT_SUCCESS_TABS = {
    aiOnboarding: "ai-onboarding",
    projectWorkspace: "project-workspace",
    clientPortal: "client-portal",
    communicationCenter: "communication-center",
    approvalCenter: "approval-center",
    changeRequest: "change-request",
    deliveryCenter: "delivery-center",
    customerHealth: "customer-health",
    renewalGrowth: "renewal-growth",
    aiSuccessManager: "ai-success-manager",
} as const;

export const CLIENT_SUCCESS_TAB_LIST = [
    { id: CLIENT_SUCCESS_TABS.aiOnboarding, label: "AI Onboarding" },
    { id: CLIENT_SUCCESS_TABS.projectWorkspace, label: "Project Workspace" },
    { id: CLIENT_SUCCESS_TABS.clientPortal, label: "Client Portal" },
    { id: CLIENT_SUCCESS_TABS.communicationCenter, label: "Communication" },
    { id: CLIENT_SUCCESS_TABS.approvalCenter, label: "Approvals" },
    { id: CLIENT_SUCCESS_TABS.changeRequest, label: "Change Requests" },
    { id: CLIENT_SUCCESS_TABS.deliveryCenter, label: "Delivery" },
    { id: CLIENT_SUCCESS_TABS.customerHealth, label: "Customer Health" },
    { id: CLIENT_SUCCESS_TABS.renewalGrowth, label: "Renewal & Growth" },
    { id: CLIENT_SUCCESS_TABS.aiSuccessManager, label: "AI Success Manager" },
] as const;

export const CLIENT_SUCCESS_THEME = {
    accent: "text-emerald-600",
    text: "text-[var(--dos-text-secondary)]",
    badge: "Client Success",
} as const;

export const CLIENT_SUCCESS_CAPABILITY_ID = "client-success-capability";
