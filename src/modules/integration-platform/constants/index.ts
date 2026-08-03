export const INTG_TABS = {
    overview: "overview",
    integrationHubs: "integrationHubs",
    connectedServices: "connectedServices",
    connectorConfigs: "connectorConfigs",
    connectorHealth: "connectorHealth",
    paymentConnectors: "paymentConnectors",
    paymentConnectorHealth: "paymentConnectorHealth",
    paymentRetryQueue: "paymentRetryQueue",
    paymentTransactions: "paymentTransactions",
    accountingConnectors: "accountingConnectors",
    accountingSyncStatus: "accountingSyncStatus",
    exportMappings: "exportMappings",
    accountingExports: "accountingExports",
    apiKeys: "apiKeys",
    apiScopes: "apiScopes",
    rateLimits: "rateLimits",
    apiUsage: "apiUsage",
    incomingWebhooks: "incomingWebhooks",
    outgoingWebhooks: "outgoingWebhooks",
    webhookDeadLetter: "webhookDeadLetter",
    webhookDeliveryLogs: "webhookDeliveryLogs",
    marketplaceConnectors: "marketplaceConnectors",
    marketplaceInstallations: "marketplaceInstallations",
    marketplaceCompatibility: "marketplaceCompatibility",
    marketplaceVersions: "marketplaceVersions",
    apiAnalytics: "apiAnalytics",
    latencyMetrics: "latencyMetrics",
    webhookAnalytics: "webhookAnalytics",
    usageTrends: "usageTrends",
    integrationMetrics: "integrationMetrics",
    integrationHealth: "integrationHealth",
    integrationFailures: "integrationFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const PROVIDER_TYPE_OPTIONS = [
    { value: "google", label: "Google" },
    { value: "stripe", label: "Stripe" },
    { value: "microsoft", label: "Microsoft" },
    { value: "quickbooks", label: "QuickBooks" },
    { value: "xero", label: "Xero" },
    { value: "razorpay", label: "Razorpay" },
    { value: "salesforce", label: "Salesforce" },
    { value: "custom", label: "Custom" },
] as const;

export const CONNECTOR_STATUS_OPTIONS = [
    { value: "configured", label: "Configured" },
    { value: "connected", label: "Connected" },
    { value: "syncing", label: "Syncing" },
    { value: "active", label: "Active" },
    { value: "degraded", label: "Degraded" },
    { value: "disconnected", label: "Disconnected" },
    { value: "failed", label: "Failed" },
] as const;

export const API_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
] as const;

export const API_VERSION_OPTIONS = [
    { value: "v1", label: "v1" },
    { value: "v2", label: "v2" },
    { value: "v3", label: "v3" },
] as const;

export const INTG_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "connected", label: "Connected" },
    { value: "failed", label: "Failed" },
    { value: "healthy", label: "Healthy" },
] as const;

export const INTG_PERMISSIONS = ["intg.view", "intg.manage", "intg.approve", "intg.admin"] as const;

export const INTG_THEME = {
    primary: "indigo-600",
    primaryHover: "indigo-500",
    ring: "indigo-500/20",
    text: "text-indigo-600",
    textDark: "dark:text-indigo-400",
    bg: "bg-indigo-600",
    bgHover: "hover:bg-indigo-500",
} as const;
