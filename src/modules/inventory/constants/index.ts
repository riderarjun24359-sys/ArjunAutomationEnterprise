export const INVENTORY_TABS = {
    overview: "overview",
    catalog: "catalog",
    categories: "categories",
    warehouses: "warehouses",
    movements: "movements",
    adjustments: "adjustments",
    purchaseOrders: "purchaseOrders",
    suppliers: "suppliers",
    assets: "assets",
    barcodes: "barcodes",
    alerts: "alerts",
    transfers: "transfers",
    grn: "grn",
    valuation: "valuation",
    reports: "reports",
    audit: "audit",
} as const;

export const PRODUCT_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "discontinued", label: "Discontinued" },
    { value: "draft", label: "Draft" },
] as const;

export const PO_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "approved", label: "Approved" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const BARCODE_TYPE_OPTIONS = [
    { value: "code128", label: "Code 128" },
    { value: "qr", label: "QR Code" },
    { value: "ean13", label: "EAN-13" },
] as const;

export const INVENTORY_PERMISSIONS = ["inventory.view", "inventory.manage", "inventory.procurement.manage", "inventory.assets.manage"] as const;
