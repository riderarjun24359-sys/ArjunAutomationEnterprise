export const RTL_TABS = {
    overview: "overview",
    retailHubs: "retailHubs",
    retailBrands: "retailBrands",
    stores: "stores",
    cashRegisters: "cashRegisters",
    storeDepartments: "storeDepartments",
    products: "products",
    productCategories: "productCategories",
    productVariants: "productVariants",
    promotions: "promotions",
    salesOrders: "salesOrders",
    posTransactions: "posTransactions",
    returnsExchanges: "returnsExchanges",
    shiftClosings: "shiftClosings",
    warehouses: "warehouses",
    stockLevels: "stockLevels",
    purchaseOrders: "purchaseOrders",
    suppliers: "suppliers",
    customerProfiles: "customerProfiles",
    loyaltyPrograms: "loyaltyPrograms",
    rewardPoints: "rewardPoints",
    campaigns: "campaigns",
    dailyClosings: "dailyClosings",
    branchPerformance: "branchPerformance",
    commissionRecords: "commissionRecords",
    salesAnalytics: "salesAnalytics",
    inventoryAnalytics: "inventoryAnalytics",
    profitabilityAnalytics: "profitabilityAnalytics",
    retailMetrics: "retailMetrics",
    retailHealth: "retailHealth",
    executiveKpis: "executiveKpis",
    retailFailures: "retailFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const REGISTER_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
    { value: "offline", label: "Offline" },
] as const;

export const PROMOTION_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const SALES_ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const RETURN_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "processed", label: "Processed" },
] as const;

export const POS_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const RTL_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "waiting", label: "Waiting" },
    { value: "completed", label: "Completed" },
    { value: "available", label: "Available" },
] as const;

export const RTL_PERMISSIONS = ["rtl.view", "rtl.manage", "rtl.approve", "rtl.admin"] as const;


export const RTL_THEME = {
    primary: "lime-600",
    primaryHover: "lime-500",
    ring: "lime-500/20",
    text: "text-lime-600",
    textDark: "dark:text-lime-400",
    bg: "bg-lime-600",
    bgHover: "hover:bg-lime-500",
} as const;
