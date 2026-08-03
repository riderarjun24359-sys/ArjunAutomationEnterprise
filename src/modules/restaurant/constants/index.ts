export const RST_TABS = {
    overview: "overview",
    restaurantHubs: "restaurantHubs",
    brands: "brands",
    branches: "branches",
    businessLicenses: "businessLicenses",
    diningAreas: "diningAreas",
    restaurantTables: "restaurantTables",
    menuCategories: "menuCategories",
    menuItems: "menuItems",
    menuVariants: "menuVariants",
    addOns: "addOns",
    comboMeals: "comboMeals",
    orders: "orders",
    orderItems: "orderItems",
    orderQueue: "orderQueue",
    kitchenRouting: "kitchenRouting",
    orderTimeline: "orderTimeline",
    kitchenStations: "kitchenStations",
    preparationQueue: "preparationQueue",
    cookingStatus: "cookingStatus",
    readyQueue: "readyQueue",
    rushOrders: "rushOrders",
    reservations: "reservations",
    waitingList: "waitingList",
    customerProfiles: "customerProfiles",
    loyaltyPrograms: "loyaltyPrograms",
    feedbackReviews: "feedbackReviews",
    restaurantMetrics: "restaurantMetrics",
    restaurantHealth: "restaurantHealth",
    revenueAnalytics: "revenueAnalytics",
    kitchenPerformance: "kitchenPerformance",
    restaurantFailures: "restaurantFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const ORDER_TYPE_OPTIONS = [
    { value: "dine-in", label: "Dine In" },
    { value: "takeaway", label: "Takeaway" },
    { value: "delivery", label: "Delivery" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const RST_STATUS_OPTIONS = [
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

export const RST_PERMISSIONS = ["rst.view", "rst.manage", "rst.approve", "rst.admin"] as const;


export const RST_THEME = {
    primary: "orange-600",
    primaryHover: "orange-500",
    ring: "orange-500/20",
    text: "text-orange-600",
    textDark: "dark:text-orange-400",
    bg: "bg-orange-600",
    bgHover: "hover:bg-orange-500",
} as const;
