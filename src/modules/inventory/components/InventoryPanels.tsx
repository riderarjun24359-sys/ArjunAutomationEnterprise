"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { BARCODE_TYPE_OPTIONS } from "@/src/modules/inventory/constants";
import type { useInventory } from "@/src/modules/inventory/hooks/useInventory";
import {
    adjustmentFormSchema,
    assetFormSchema,
    barcodeFormSchema,
    categoryFormSchema,
    productFormSchema,
    purchaseOrderFormSchema,
    supplierFormSchema,
    warehouseFormSchema,
    type AdjustmentFormValues,
    type AssetFormValues,
    type BarcodeFormValues,
    type CategoryFormValues,
    type ProductFormValues,
    type PurchaseOrderFormValues,
    type SupplierFormValues,
    type WarehouseFormValues,
} from "@/src/modules/inventory/schemas";

type InventoryData = ReturnType<typeof useInventory>;

const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";

function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return (
        <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">
            {loading ? "Saving..." : label}
        </button>
    );
}

function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-slate-500">{subtitle}</p>
            {meta ? <p className="mt-1 text-xs text-emerald-600">{meta}</p> : null}
        </div>
    );
}

export function InventoryOverviewPanel({ data }: { data: InventoryData }) {
    const links = data.crossModuleLinks;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Inventory summary" description="Current stock and asset coverage" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <ListCard title="Products" subtitle={`${data.stats?.totalProducts ?? 0} SKUs cataloged`} />
                    <ListCard title="Stock units" subtitle={`${data.stats?.totalStockUnits ?? 0} total units`} />
                    <ListCard title="Warehouses" subtitle={`${data.stats?.totalWarehouses ?? 0} locations`} />
                    <ListCard title="Active assets" subtitle={`${data.stats?.activeAssets ?? 0} tracked assets`} />
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Cross-module integration" description="Links to Finance, Projects, HR, Automation, and Analytics" />
                <div className="mt-6 space-y-3">
                    {links ? (
                        <>
                            <ListCard title="Finance" subtitle={`${links.financeExpenses} purchase orders linked to expenses`} meta="Procurement cost tracking" />
                            <ListCard title="Projects" subtitle={`${links.projectAssets} assets assigned to projects`} meta="Project asset allocation" />
                            <ListCard title="HR" subtitle={`${links.hrAssignedAssets} assets assigned to employees`} meta="Employee asset custody" />
                            <ListCard title="Automation" subtitle={`${links.automationAlerts} low-stock alerts for workflows`} meta="Automated replenishment triggers" />
                            <ListCard title="Analytics" subtitle={`${links.analyticsMetrics} inventory metrics available`} meta="Reporting and dashboards" />
                        </>
                    ) : (
                        <EmptyState title="No cross-module data" description="Integration metrics will appear once inventory data is available." />
                    )}
                </div>
            </Card>
        </div>
    );
}

export function CatalogPanel({ data }: { data: InventoryData }) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: { sku: "", name: "", description: "", categoryId: "", unitOfMeasure: "each", unitCost: 0, unitPrice: 0, reorderLevel: 0 },
    });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Product catalog" description="SKUs, pricing, and stock levels" />
                <div className="mt-6 space-y-3">
                    {data.products.length === 0 ? (
                        <EmptyState title="No products" description="Add products to build your catalog." />
                    ) : (
                        data.products.map((product) => (
                            <ListCard
                                key={product.id}
                                title={`${product.sku} — ${product.name}`}
                                subtitle={`${product.categoryName ?? "Uncategorized"} • ${product.unitOfMeasure}`}
                                meta={`Stock: ${product.totalStock} • Cost: $${product.unitCost} • Price: $${product.unitPrice} • ${product.status}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add product" description="Create a new catalog item" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createProduct(values))}>
                    <input {...form.register("sku")} placeholder="SKU" className={inputClass} />
                    <input {...form.register("name")} placeholder="Product name" className={inputClass} />
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <select {...form.register("categoryId")} className={inputClass}>
                        <option value="">Select category</option>
                        {data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                    <input {...form.register("unitOfMeasure")} placeholder="Unit of measure" className={inputClass} />
                    <input type="number" step="0.01" {...form.register("unitCost", { valueAsNumber: true })} placeholder="Unit cost" className={inputClass} />
                    <input type="number" step="0.01" {...form.register("unitPrice", { valueAsNumber: true })} placeholder="Unit price" className={inputClass} />
                    <input type="number" {...form.register("reorderLevel", { valueAsNumber: true })} placeholder="Reorder level" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add product" />
                </form>
            </Card>
        </div>
    );
}

export function CategoriesPanel({ data }: { data: InventoryData }) {
    const form = useForm<CategoryFormValues>({ resolver: zodResolver(categoryFormSchema), defaultValues: { name: "", slug: "", description: "" } });

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Product categories" description="Organize catalog items by category" />
                <div className="mt-6 space-y-3">
                    {data.categories.length === 0 ? (
                        <EmptyState title="No categories" description="Create categories to organize products." />
                    ) : (
                        data.categories.map((category) => (
                            <ListCard key={category.id} title={category.name} subtitle={category.description || category.slug} meta={`${category.productCount} products`} />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add category" description="Create a new product category" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createCategory(values))}>
                    <input {...form.register("name")} placeholder="Category name" className={inputClass} />
                    <input {...form.register("slug")} placeholder="Slug" className={inputClass} />
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add category" />
                </form>
            </Card>
        </div>
    );
}

export function WarehousesPanel({ data }: { data: InventoryData }) {
    const form = useForm<WarehouseFormValues>({ resolver: zodResolver(warehouseFormSchema), defaultValues: { name: "", code: "", location: "", managerName: "" } });

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Warehouses" description="Storage locations and capacity" />
                <div className="mt-6 space-y-3">
                    {data.warehouses.length === 0 ? (
                        <EmptyState title="No warehouses" description="Add warehouses to track stock locations." />
                    ) : (
                        data.warehouses.map((warehouse) => (
                            <ListCard
                                key={warehouse.id}
                                title={`${warehouse.code} — ${warehouse.name}`}
                                subtitle={warehouse.location}
                                meta={`Manager: ${warehouse.managerName || "Unassigned"} • ${warehouse.productCount} products • ${warehouse.totalUnits} units • ${warehouse.status}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add warehouse" description="Register a new storage location" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createWarehouse(values))}>
                    <input {...form.register("name")} placeholder="Warehouse name" className={inputClass} />
                    <input {...form.register("code")} placeholder="Warehouse code" className={inputClass} />
                    <input {...form.register("location")} placeholder="Location" className={inputClass} />
                    <input {...form.register("managerName")} placeholder="Manager name" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add warehouse" />
                </form>
            </Card>
        </div>
    );
}

export function MovementsPanel({ data }: { data: InventoryData }) {
    return (
        <Card hover>
            <SectionHeader title="Stock movements" description="Inbound, outbound, and transfer activity" />
            <div className="mt-6 space-y-3">
                {data.movements.length === 0 ? (
                    <EmptyState title="No movements" description="Stock movements will appear as inventory activity occurs." />
                ) : (
                    data.movements.map((movement) => (
                        <ListCard
                            key={movement.id}
                            title={movement.productName}
                            subtitle={`${movement.warehouseName} • ${movement.movementType}`}
                            meta={`Qty: ${movement.quantity} • Ref: ${movement.referenceType} • ${new Date(movement.movedAt).toLocaleDateString()}`}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}

export function AdjustmentsPanel({ data }: { data: InventoryData }) {
    const form = useForm<AdjustmentFormValues>({
        resolver: zodResolver(adjustmentFormSchema),
        defaultValues: { productId: "", warehouseId: "", quantityDelta: 0, reason: "" },
    });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Inventory adjustments" description="Manual stock corrections and cycle counts" />
                <div className="mt-6 space-y-3">
                    {data.adjustments.length === 0 ? (
                        <EmptyState title="No adjustments" description="Adjustments will appear when stock is corrected." />
                    ) : (
                        data.adjustments.map((adjustment) => (
                            <ListCard
                                key={adjustment.id}
                                title={adjustment.productName}
                                subtitle={`${adjustment.warehouseName} • ${adjustment.adjustmentType}`}
                                meta={`Delta: ${adjustment.quantityDelta > 0 ? "+" : ""}${adjustment.quantityDelta} • ${adjustment.reason} • ${new Date(adjustment.createdAt).toLocaleDateString()}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Create adjustment" description="Record a stock correction" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createAdjustment(values))}>
                    <select {...form.register("productId")} className={inputClass}>
                        <option value="">Select product</option>
                        {data.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                    </select>
                    <select {...form.register("warehouseId")} className={inputClass}>
                        <option value="">Select warehouse</option>
                        {data.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
                    </select>
                    <input type="number" {...form.register("quantityDelta", { valueAsNumber: true })} placeholder="Quantity delta (+/-)" className={inputClass} />
                    <input {...form.register("reason")} placeholder="Reason" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Create adjustment" />
                </form>
            </Card>
        </div>
    );
}

export function PurchaseOrdersPanel({ data }: { data: InventoryData }) {
    const form = useForm<PurchaseOrderFormValues>({ resolver: zodResolver(purchaseOrderFormSchema), defaultValues: { supplierId: "", poNumber: "", notes: "" } });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Purchase orders" description="Procurement and supplier orders" />
                <div className="mt-6 space-y-3">
                    {data.purchaseOrders.length === 0 ? (
                        <EmptyState title="No purchase orders" description="Create purchase orders to manage procurement." />
                    ) : (
                        data.purchaseOrders.map((po) => (
                            <ListCard
                                key={po.id}
                                title={po.poNumber}
                                subtitle={`${po.supplierName} • ${po.status}`}
                                meta={`$${po.totalAmount.toLocaleString()} • ${po.itemCount} items • ${po.financeLinked ? "Finance linked" : "No finance link"} • ${new Date(po.orderDate).toLocaleDateString()}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Create purchase order" description="Start a new procurement order" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createPurchaseOrder(values))}>
                    <select {...form.register("supplierId")} className={inputClass}>
                        <option value="">Select supplier</option>
                        {data.suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
                    </select>
                    <input {...form.register("poNumber")} placeholder="PO number" className={inputClass} />
                    <input {...form.register("notes")} placeholder="Notes" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Create PO" />
                </form>
            </Card>
        </div>
    );
}

export function SuppliersPanel({ data }: { data: InventoryData }) {
    const form = useForm<SupplierFormValues>({ resolver: zodResolver(supplierFormSchema), defaultValues: { name: "", code: "", email: "", phone: "", address: "" } });

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Suppliers" description="Vendor directory and procurement partners" />
                <div className="mt-6 space-y-3">
                    {data.suppliers.length === 0 ? (
                        <EmptyState title="No suppliers" description="Add suppliers to manage procurement." />
                    ) : (
                        data.suppliers.map((supplier) => (
                            <ListCard
                                key={supplier.id}
                                title={`${supplier.code} — ${supplier.name}`}
                                subtitle={`${supplier.email} • ${supplier.phone}`}
                                meta={`${supplier.address} • ${supplier.purchaseOrderCount} POs • ${supplier.status}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add supplier" description="Register a new vendor" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createSupplier(values))}>
                    <input {...form.register("name")} placeholder="Supplier name" className={inputClass} />
                    <input {...form.register("code")} placeholder="Supplier code" className={inputClass} />
                    <input {...form.register("email")} placeholder="Email" className={inputClass} />
                    <input {...form.register("phone")} placeholder="Phone" className={inputClass} />
                    <input {...form.register("address")} placeholder="Address" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add supplier" />
                </form>
            </Card>
        </div>
    );
}

export function AssetsPanel({ data }: { data: InventoryData }) {
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetFormSchema),
        defaultValues: { assetTag: "", name: "", category: "", serialNumber: "", purchaseCost: 0, warehouseId: "" },
    });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Asset management" description="Fixed assets with project and HR assignments" />
                <div className="mt-6 space-y-3">
                    {data.assets.length === 0 ? (
                        <EmptyState title="No assets" description="Register assets to track equipment and capital items." />
                    ) : (
                        data.assets.map((asset) => (
                            <ListCard
                                key={asset.id}
                                title={`${asset.assetTag} — ${asset.name}`}
                                subtitle={`${asset.category} • S/N: ${asset.serialNumber || "N/A"}`}
                                meta={`$${asset.purchaseCost.toLocaleString()} • ${asset.warehouseName ?? "No warehouse"} • Project: ${asset.projectName ?? "None"} • Employee: ${asset.employeeName ?? "Unassigned"} • ${asset.status}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Register asset" description="Add a new tracked asset" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createAsset(values))}>
                    <input {...form.register("assetTag")} placeholder="Asset tag" className={inputClass} />
                    <input {...form.register("name")} placeholder="Asset name" className={inputClass} />
                    <input {...form.register("category")} placeholder="Category" className={inputClass} />
                    <input {...form.register("serialNumber")} placeholder="Serial number" className={inputClass} />
                    <input type="number" step="0.01" {...form.register("purchaseCost", { valueAsNumber: true })} placeholder="Purchase cost" className={inputClass} />
                    <select {...form.register("warehouseId")} className={inputClass}>
                        <option value="">Select warehouse (optional)</option>
                        {data.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Register asset" />
                </form>
            </Card>
        </div>
    );
}

export function BarcodesPanel({ data }: { data: InventoryData }) {
    const form = useForm<BarcodeFormValues>({
        resolver: zodResolver(barcodeFormSchema),
        defaultValues: { barcodeValue: "", barcodeType: "code128", productId: "", assetId: "" },
    });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Barcodes & QR codes" description="Product and asset identification labels" />
                <div className="mt-6 space-y-3">
                    {data.barcodes.length === 0 ? (
                        <EmptyState title="No barcodes" description="Generate barcodes for products and assets." />
                    ) : (
                        data.barcodes.map((barcode) => (
                            <ListCard
                                key={barcode.id}
                                title={barcode.barcodeValue}
                                subtitle={`${barcode.barcodeType.toUpperCase()} • ${barcode.linkedType}`}
                                meta={`Linked to: ${barcode.linkedName || "Unlinked"}`}
                            />
                        ))
                    )}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Generate barcode" description="Create a barcode or QR code" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createBarcode(values))}>
                    <input {...form.register("barcodeValue")} placeholder="Barcode value" className={inputClass} />
                    <select {...form.register("barcodeType")} className={inputClass}>
                        {BARCODE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <select {...form.register("productId")} className={inputClass}>
                        <option value="">Link to product (optional)</option>
                        {data.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                    </select>
                    <select {...form.register("assetId")} className={inputClass}>
                        <option value="">Link to asset (optional)</option>
                        {data.assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Generate barcode" />
                </form>
            </Card>
        </div>
    );
}

export function AlertsPanel({ data }: { data: InventoryData }) {
    return (
        <Card hover>
            <SectionHeader title="Low-stock alerts" description="Reorder notifications and threshold breaches" />
            <div className="mt-6 space-y-3">
                {data.alerts.length === 0 ? (
                    <EmptyState title="No alerts" description="Low-stock alerts will appear when inventory falls below reorder levels." />
                ) : (
                    data.alerts.map((alert) => (
                        <div key={alert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div>
                                <p className="font-medium">{alert.productName}</p>
                                <p className="text-sm text-slate-500">{alert.warehouseName} • Current: {alert.currentQuantity} / Reorder: {alert.reorderLevel}</p>
                                <p className="mt-1 text-xs text-emerald-600">{new Date(alert.triggeredAt).toLocaleDateString()}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => data.updateAlertStatus(alert.id, { status: alert.status === "open" ? "resolved" : "open" })}
                                className="rounded-full border border-emerald-300 px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
                            >
                                {alert.status}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}

export function TransfersPanel({ data }: { data: InventoryData }) {
    return (
        <Card hover>
            <SectionHeader title="Stock transfers" description="Inter-warehouse stock movements" />
            <div className="mt-6 space-y-3">
                {data.transfers.length === 0 ? (
                    <EmptyState title="No transfers" description="Stock transfers will appear when inventory is moved between warehouses." />
                ) : (
                    data.transfers.map((transfer) => (
                        <ListCard
                            key={transfer.id}
                            title={transfer.transferNumber}
                            subtitle={`${transfer.sourceWarehouse} → ${transfer.destinationWarehouse}`}
                            meta={`${transfer.itemCount} items • ${transfer.status}${transfer.transferredAt ? ` • ${new Date(transfer.transferredAt).toLocaleDateString()}` : ""}`}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}

export function GrnPanel({ data }: { data: InventoryData }) {
    return (
        <Card hover>
            <SectionHeader title="Goods received notes" description="Inbound receipt documentation" />
            <div className="mt-6 space-y-3">
                {data.grns.length === 0 ? (
                    <EmptyState title="No GRNs" description="Goods received notes will appear when shipments are received." />
                ) : (
                    data.grns.map((grn) => (
                        <ListCard
                            key={grn.id}
                            title={grn.grnNumber}
                            subtitle={`${grn.warehouseName} • PO: ${grn.purchaseOrderNumber ?? "Direct receipt"}`}
                            meta={`${grn.supplierName ?? "Unknown supplier"} • ${grn.itemCount} items • ${grn.status} • ${new Date(grn.receivedDate).toLocaleDateString()}`}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}

export function ValuationPanel({ data }: { data: InventoryData }) {
    return (
        <Card hover>
            <SectionHeader title="Inventory valuation" description="Periodic stock value assessments" />
            <div className="mt-6 space-y-3">
                {data.valuations.length === 0 ? (
                    <EmptyState title="No valuations" description="Valuation snapshots will appear once recorded." />
                ) : (
                    data.valuations.map((valuation) => (
                        <ListCard
                            key={valuation.id}
                            title={`$${valuation.totalValue.toLocaleString()}`}
                            subtitle={`${valuation.method} • ${valuation.totalUnits} units`}
                            meta={`${new Date(valuation.valuationDate).toLocaleDateString()}${valuation.notes ? ` • ${valuation.notes}` : ""}`}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}

export function InventoryReportsPanel({ data }: { data: InventoryData }) {
    const report = data.report;
    if (!report) return <EmptyState title="No reports" description="Inventory reports will appear once data is available." />;

    const sections = [
        { title: "Stock by warehouse", rows: report.stockByWarehouse.map((row) => `${row.warehouse}: ${row.units} units ($${row.value.toLocaleString()})`) },
        { title: "Movement summary", rows: report.movementSummary.map((row) => `${row.type}: ${row.count}`) },
        { title: "Category distribution", rows: report.categoryDistribution.map((row) => `${row.category}: ${row.products} products`) },
        { title: "Procurement status", rows: report.procurementStatus.map((row) => `${row.status}: ${row.count}`) },
        { title: "Asset status", rows: report.assetStatus.map((row) => `${row.status}: ${row.count}`) },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
                <Card key={section.title} hover>
                    <SectionHeader title={section.title} description="Inventory analytics snapshot" />
                    <div className="mt-6 space-y-2">
                        {section.rows.length === 0 ? <p className="text-sm text-slate-500">No data</p> : section.rows.map((row) => <p key={row} className="text-sm">{row}</p>)}
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function AuditPanel({ data }: { data: InventoryData }) {
    return (
        <Card hover>
            <SectionHeader title="Audit history" description="Inventory change log and compliance trail" />
            <div className="mt-6 space-y-3">
                {data.auditLogs.length === 0 ? (
                    <EmptyState title="No audit entries" description="Audit logs will appear as inventory changes are recorded." />
                ) : (
                    data.auditLogs.map((entry) => (
                        <ListCard
                            key={entry.id}
                            title={entry.summary}
                            subtitle={`${entry.entityType} • ${entry.action}`}
                            meta={new Date(entry.createdAt).toLocaleString()}
                        />
                    ))
                )}
            </div>
        </Card>
    );
}
