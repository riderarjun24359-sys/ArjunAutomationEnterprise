"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { RTL_THEME, SALES_ORDER_STATUS_OPTIONS, REGISTER_STATUS_OPTIONS, PROMOTION_STATUS_OPTIONS, RETURN_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/retail/constants";
import type { useRetail } from "@/src/modules/retail/hooks/useRetail";
import {
    retailHubsFormSchema,
    type retailHubsFormValues,
    retailBrandsFormSchema,
    type retailBrandsFormValues,
    storesFormSchema,
    type storesFormValues,
    cashRegistersFormSchema,
    type cashRegistersFormValues,
    storeDepartmentsFormSchema,
    type storeDepartmentsFormValues,
    productsFormSchema,
    type productsFormValues,
    productCategoriesFormSchema,
    type productCategoriesFormValues,
    productVariantsFormSchema,
    type productVariantsFormValues,
    promotionsFormSchema,
    type promotionsFormValues,
    salesOrdersFormSchema,
    type salesOrdersFormValues,
    posTransactionsFormSchema,
    type posTransactionsFormValues,
    returnsExchangesFormSchema,
    type returnsExchangesFormValues,
    shiftClosingsFormSchema,
    type shiftClosingsFormValues,
    warehousesFormSchema,
    type warehousesFormValues,
    stockLevelsFormSchema,
    type stockLevelsFormValues,
    purchaseOrdersFormSchema,
    type purchaseOrdersFormValues,
    suppliersFormSchema,
    type suppliersFormValues,
    customerProfilesFormSchema,
    type customerProfilesFormValues,
    loyaltyProgramsFormSchema,
    type loyaltyProgramsFormValues,
    rewardPointsFormSchema,
    type rewardPointsFormValues,
    campaignsFormSchema,
    type campaignsFormValues,
    dailyClosingsFormSchema,
    type dailyClosingsFormValues,
    branchPerformanceFormSchema,
    type branchPerformanceFormValues,
    commissionRecordsFormSchema,
    type commissionRecordsFormValues,
    salesAnalyticsFormSchema,
    type salesAnalyticsFormValues,
    inventoryAnalyticsFormSchema,
    type inventoryAnalyticsFormValues,
    profitabilityAnalyticsFormSchema,
    type profitabilityAnalyticsFormValues,
    retailMetricsFormSchema,
    type retailMetricsFormValues,
    retailHealthFormSchema,
    type retailHealthFormValues,
    executiveKpisFormSchema,
    type executiveKpisFormValues,
    retailFailuresFormSchema,
    type retailFailuresFormValues,
} from "@/src/modules/retail/schemas";

type RetailData = ReturnType<typeof useRetail>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-lime-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-lime-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-lime-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-lime-600">{meta}</p> : null}</div>;
}
function RetailHubSelect({ data, ...props }: { data: RetailData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select retail operating system</option>{data.retailHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RetailOverviewPanel({ data }: { data: RetailData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Retail OS summary" description="System health, background jobs, event bus, retailInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Retail Hubs" subtitle={`${data.stats?.totalRetailHubs ?? 0} total`} meta={`${data.stats?.activeRetailHubs ?? 0} active • ${data.stats?.retailBrandCount ?? 0} dining areas`} />
                <ListCard title="Sales & POS" subtitle={`${data.stats?.customerProfileCount ?? 0} customer profiles`} meta={`${data.stats?.salesOrderCount ?? 0} sales orders • ${data.stats?.openPosTransactionCount ?? 0} open POS transactions`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallRetailScore ?? 0).toFixed(1)} overall retail score`} meta={`${data.stats?.openRetailFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first retail operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Retail operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Retail operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function RetailHubsPanel({ data }: { data: RetailData }) {
    const form = useForm<retailHubsFormValues>({ resolver: zodResolver(retailHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retail Hubs" description="Enterprise retail operating system retail hubs" /><div className="mt-6 space-y-3">
                {data.retailHubs.length === 0 ? <EmptyState title="No retail hubs" description="Create the first retail hubs record." /> : data.retailHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retail hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetailHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailBrandsPanel({ data }: { data: RetailData }) {
    const form = useForm<retailBrandsFormValues>({ resolver: zodResolver(retailBrandsFormSchema), defaultValues: {"retailHubId":"","brandKey":"","brandName":"","brandType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retail Brands" description="Enterprise retail operating system retail brands" /><div className="mt-6 space-y-3">
                {data.retailBrands.length === 0 ? <EmptyState title="No retail brands" description="Create the first retail brands record." /> : data.retailBrands.map((item) => (
                    <ListCard key={item.id} title={String(item.brandName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.brandType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retail brands" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetailBrand(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("brandKey")} placeholder="brandKey" className={inputClass} />
                <input {...form.register("brandName")} placeholder="brandName" className={inputClass} />
                <input {...form.register("brandType")} placeholder="brandType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StoresPanel({ data }: { data: RetailData }) {
    const form = useForm<storesFormValues>({ resolver: zodResolver(storesFormSchema), defaultValues: {"retailHubId":"","storeKey":"","storeName":"","storeType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Stores" description="Enterprise retail operating system stores" /><div className="mt-6 space-y-3">
                {data.stores.length === 0 ? <EmptyState title="No stores" description="Create the first stores record." /> : data.stores.map((item) => (
                    <ListCard key={item.id} title={String(item.storeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.storeType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create stores" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStore(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("storeKey")} placeholder="storeKey" className={inputClass} />
                <input {...form.register("storeName")} placeholder="storeName" className={inputClass} />
                <input {...form.register("storeType")} placeholder="storeType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CashRegistersPanel({ data }: { data: RetailData }) {
    const form = useForm<cashRegistersFormValues>({ resolver: zodResolver(cashRegistersFormSchema), defaultValues: {"retailHubId":"","registerKey":"","registerName":"","registerStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cash Registers" description="Enterprise retail operating system cash registers" /><div className="mt-6 space-y-3">
                {data.cashRegisters.length === 0 ? <EmptyState title="No cash registers" description="Create the first cash registers record." /> : data.cashRegisters.map((item) => (
                    <ListCard key={item.id} title={String(item.registerName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.registerStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cash registers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCashRegister(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("registerKey")} placeholder="registerKey" className={inputClass} />
                <input {...form.register("registerName")} placeholder="registerName" className={inputClass} />
                <select {...form.register("registerStatus")} className={inputClass}>{REGISTER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StoreDepartmentsPanel({ data }: { data: RetailData }) {
    const form = useForm<storeDepartmentsFormValues>({ resolver: zodResolver(storeDepartmentsFormSchema), defaultValues: {"retailHubId":"","departmentKey":"","departmentName":"","departmentType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Store Departments" description="Enterprise retail operating system store departments" /><div className="mt-6 space-y-3">
                {data.storeDepartments.length === 0 ? <EmptyState title="No store departments" description="Create the first store departments record." /> : data.storeDepartments.map((item) => (
                    <ListCard key={item.id} title={String(item.departmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.departmentType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create store departments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStoreDepartment(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("departmentKey")} placeholder="departmentKey" className={inputClass} />
                <input {...form.register("departmentName")} placeholder="departmentName" className={inputClass} />
                <input {...form.register("departmentType")} placeholder="departmentType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductsPanel({ data }: { data: RetailData }) {
    const form = useForm<productsFormValues>({ resolver: zodResolver(productsFormSchema), defaultValues: {"retailHubId":"","productKey":"","productName":"","productType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Products" description="Enterprise retail operating system products" /><div className="mt-6 space-y-3">
                {data.products.length === 0 ? <EmptyState title="No products" description="Create the first products record." /> : data.products.map((item) => (
                    <ListCard key={item.id} title={String(item.productName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.productType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create products" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProduct(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("productKey")} placeholder="productKey" className={inputClass} />
                <input {...form.register("productName")} placeholder="productName" className={inputClass} />
                <input {...form.register("productType")} placeholder="productType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductCategorysPanel({ data }: { data: RetailData }) {
    const form = useForm<productCategoriesFormValues>({ resolver: zodResolver(productCategoriesFormSchema), defaultValues: {"retailHubId":"","categoryKey":"","categoryName":"","categoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Product Categories" description="Enterprise retail operating system product categories" /><div className="mt-6 space-y-3">
                {data.productCategories.length === 0 ? <EmptyState title="No product categories" description="Create the first product categories record." /> : data.productCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create product categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductCategory(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <input {...form.register("categoryType")} placeholder="categoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProductVariantsPanel({ data }: { data: RetailData }) {
    const form = useForm<productVariantsFormValues>({ resolver: zodResolver(productVariantsFormSchema), defaultValues: {"retailHubId":"","variantKey":"","variantName":"","variantType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Product Variants" description="Enterprise retail operating system product variants" /><div className="mt-6 space-y-3">
                {data.productVariants.length === 0 ? <EmptyState title="No product variants" description="Create the first product variants record." /> : data.productVariants.map((item) => (
                    <ListCard key={item.id} title={String(item.variantName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.variantType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create product variants" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProductVariant(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("variantKey")} placeholder="variantKey" className={inputClass} />
                <input {...form.register("variantName")} placeholder="variantName" className={inputClass} />
                <input {...form.register("variantType")} placeholder="variantType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PromotionsPanel({ data }: { data: RetailData }) {
    const form = useForm<promotionsFormValues>({ resolver: zodResolver(promotionsFormSchema), defaultValues: {"retailHubId":"","promotionKey":"","promotionName":"","promotionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Promotions" description="Enterprise retail operating system promotions" /><div className="mt-6 space-y-3">
                {data.promotions.length === 0 ? <EmptyState title="No promotions" description="Create the first promotions record." /> : data.promotions.map((item) => (
                    <ListCard key={item.id} title={String(item.promotionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.promotionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create promotions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPromotion(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("promotionKey")} placeholder="promotionKey" className={inputClass} />
                <input {...form.register("promotionName")} placeholder="promotionName" className={inputClass} />
                <select {...form.register("promotionStatus")} className={inputClass}>{PROMOTION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SalesOrdersPanel({ data }: { data: RetailData }) {
    const form = useForm<salesOrdersFormValues>({ resolver: zodResolver(salesOrdersFormSchema), defaultValues: {"retailHubId":"","orderKey":"","orderName":"","orderStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sales Orders" description="Enterprise retail operating system sales orders" /><div className="mt-6 space-y-3">
                {data.salesOrders.length === 0 ? <EmptyState title="No sales orders" description="Create the first sales orders record." /> : data.salesOrders.map((item) => (
                    <ListCard key={item.id} title={String(item.orderName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orderStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sales orders" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSalesOrder(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("orderKey")} placeholder="orderKey" className={inputClass} />
                <input {...form.register("orderName")} placeholder="orderName" className={inputClass} />
                <select {...form.register("orderStatus")} className={inputClass}>{SALES_ORDER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PosTransactionsPanel({ data }: { data: RetailData }) {
    const form = useForm<posTransactionsFormValues>({ resolver: zodResolver(posTransactionsFormSchema), defaultValues: {"retailHubId":"","transactionKey":"","transactionName":"","transactionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pos Transactions" description="Enterprise retail operating system pos transactions" /><div className="mt-6 space-y-3">
                {data.posTransactions.length === 0 ? <EmptyState title="No pos transactions" description="Create the first pos transactions record." /> : data.posTransactions.map((item) => (
                    <ListCard key={item.id} title={String(item.transactionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.transactionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pos transactions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPosTransaction(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("transactionKey")} placeholder="transactionKey" className={inputClass} />
                <input {...form.register("transactionName")} placeholder="transactionName" className={inputClass} />
                <input {...form.register("transactionStatus")} placeholder="transactionStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReturnsExchangesPanel({ data }: { data: RetailData }) {
    const form = useForm<returnsExchangesFormValues>({ resolver: zodResolver(returnsExchangesFormSchema), defaultValues: {"retailHubId":"","returnKey":"","returnName":"","returnStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Returns Exchanges" description="Enterprise retail operating system returns exchanges" /><div className="mt-6 space-y-3">
                {data.returnsExchanges.length === 0 ? <EmptyState title="No returns exchanges" description="Create the first returns exchanges record." /> : data.returnsExchanges.map((item) => (
                    <ListCard key={item.id} title={String(item.returnName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.returnStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create returns exchanges" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReturnsExchange(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("returnKey")} placeholder="returnKey" className={inputClass} />
                <input {...form.register("returnName")} placeholder="returnName" className={inputClass} />
                <select {...form.register("returnStatus")} className={inputClass}>{RETURN_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ShiftClosingsPanel({ data }: { data: RetailData }) {
    const form = useForm<shiftClosingsFormValues>({ resolver: zodResolver(shiftClosingsFormSchema), defaultValues: {"retailHubId":"","closingKey":"","closingName":"","closingStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Shift Closings" description="Enterprise retail operating system shift closings" /><div className="mt-6 space-y-3">
                {data.shiftClosings.length === 0 ? <EmptyState title="No shift closings" description="Create the first shift closings record." /> : data.shiftClosings.map((item) => (
                    <ListCard key={item.id} title={String(item.closingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.closingStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create shift closings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createShiftClosing(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("closingKey")} placeholder="closingKey" className={inputClass} />
                <input {...form.register("closingName")} placeholder="closingName" className={inputClass} />
                <input {...form.register("closingStatus")} placeholder="closingStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WarehousesPanel({ data }: { data: RetailData }) {
    const form = useForm<warehousesFormValues>({ resolver: zodResolver(warehousesFormSchema), defaultValues: {"retailHubId":"","warehouseKey":"","warehouseName":"","warehouseType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Warehouses" description="Enterprise retail operating system warehouses" /><div className="mt-6 space-y-3">
                {data.warehouses.length === 0 ? <EmptyState title="No warehouses" description="Create the first warehouses record." /> : data.warehouses.map((item) => (
                    <ListCard key={item.id} title={String(item.warehouseName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.warehouseType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create warehouses" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWarehouse(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("warehouseKey")} placeholder="warehouseKey" className={inputClass} />
                <input {...form.register("warehouseName")} placeholder="warehouseName" className={inputClass} />
                <input {...form.register("warehouseType")} placeholder="warehouseType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StockLevelsPanel({ data }: { data: RetailData }) {
    const form = useForm<stockLevelsFormValues>({ resolver: zodResolver(stockLevelsFormSchema), defaultValues: {"retailHubId":"","stockKey":"","stockName":"","stockQuantity":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Stock Levels" description="Enterprise retail operating system stock levels" /><div className="mt-6 space-y-3">
                {data.stockLevels.length === 0 ? <EmptyState title="No stock levels" description="Create the first stock levels record." /> : data.stockLevels.map((item) => (
                    <ListCard key={item.id} title={String(item.stockName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.stockQuantity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create stock levels" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStockLevel(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("stockKey")} placeholder="stockKey" className={inputClass} />
                <input {...form.register("stockName")} placeholder="stockName" className={inputClass} />
                <input type="number" step="any" {...form.register("stockQuantity", { valueAsNumber: true })} placeholder="stockQuantity" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PurchaseOrdersPanel({ data }: { data: RetailData }) {
    const form = useForm<purchaseOrdersFormValues>({ resolver: zodResolver(purchaseOrdersFormSchema), defaultValues: {"retailHubId":"","orderKey":"","orderName":"","orderStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Purchase Orders" description="Enterprise retail operating system purchase orders" /><div className="mt-6 space-y-3">
                {data.purchaseOrders.length === 0 ? <EmptyState title="No purchase orders" description="Create the first purchase orders record." /> : data.purchaseOrders.map((item) => (
                    <ListCard key={item.id} title={String(item.orderName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orderStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create purchase orders" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPurchaseOrder(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("orderKey")} placeholder="orderKey" className={inputClass} />
                <input {...form.register("orderName")} placeholder="orderName" className={inputClass} />
                <input {...form.register("orderStatus")} placeholder="orderStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SuppliersPanel({ data }: { data: RetailData }) {
    const form = useForm<suppliersFormValues>({ resolver: zodResolver(suppliersFormSchema), defaultValues: {"retailHubId":"","supplierKey":"","supplierName":"","supplierType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Suppliers" description="Enterprise retail operating system suppliers" /><div className="mt-6 space-y-3">
                {data.suppliers.length === 0 ? <EmptyState title="No suppliers" description="Create the first suppliers record." /> : data.suppliers.map((item) => (
                    <ListCard key={item.id} title={String(item.supplierName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.supplierType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create suppliers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSupplier(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("supplierKey")} placeholder="supplierKey" className={inputClass} />
                <input {...form.register("supplierName")} placeholder="supplierName" className={inputClass} />
                <input {...form.register("supplierType")} placeholder="supplierType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerProfilesPanel({ data }: { data: RetailData }) {
    const form = useForm<customerProfilesFormValues>({ resolver: zodResolver(customerProfilesFormSchema), defaultValues: {"retailHubId":"","profileKey":"","profileName":"","profileType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Profiles" description="Enterprise retail operating system customer profiles" /><div className="mt-6 space-y-3">
                {data.customerProfiles.length === 0 ? <EmptyState title="No customer profiles" description="Create the first customer profiles record." /> : data.customerProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerProfile(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("profileType")} placeholder="profileType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LoyaltyProgramsPanel({ data }: { data: RetailData }) {
    const form = useForm<loyaltyProgramsFormValues>({ resolver: zodResolver(loyaltyProgramsFormSchema), defaultValues: {"retailHubId":"","programKey":"","programName":"","programType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Loyalty Programs" description="Enterprise retail operating system loyalty programs" /><div className="mt-6 space-y-3">
                {data.loyaltyPrograms.length === 0 ? <EmptyState title="No loyalty programs" description="Create the first loyalty programs record." /> : data.loyaltyPrograms.map((item) => (
                    <ListCard key={item.id} title={String(item.programName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.programType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create loyalty programs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLoyaltyProgram(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("programKey")} placeholder="programKey" className={inputClass} />
                <input {...form.register("programName")} placeholder="programName" className={inputClass} />
                <input {...form.register("programType")} placeholder="programType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RewardPointsPanel({ data }: { data: RetailData }) {
    const form = useForm<rewardPointsFormValues>({ resolver: zodResolver(rewardPointsFormSchema), defaultValues: {"retailHubId":"","pointsKey":"","pointsName":"","pointsBalance":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reward Points" description="Enterprise retail operating system reward points" /><div className="mt-6 space-y-3">
                {data.rewardPoints.length === 0 ? <EmptyState title="No reward points" description="Create the first reward points record." /> : data.rewardPoints.map((item) => (
                    <ListCard key={item.id} title={String(item.pointsName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.pointsBalance}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reward points" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRewardPoint(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("pointsKey")} placeholder="pointsKey" className={inputClass} />
                <input {...form.register("pointsName")} placeholder="pointsName" className={inputClass} />
                <input type="number" step="any" {...form.register("pointsBalance", { valueAsNumber: true })} placeholder="pointsBalance" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampaignsPanel({ data }: { data: RetailData }) {
    const form = useForm<campaignsFormValues>({ resolver: zodResolver(campaignsFormSchema), defaultValues: {"retailHubId":"","campaignKey":"","campaignName":"","campaignStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campaigns" description="Enterprise retail operating system campaigns" /><div className="mt-6 space-y-3">
                {data.campaigns.length === 0 ? <EmptyState title="No campaigns" description="Create the first campaigns record." /> : data.campaigns.map((item) => (
                    <ListCard key={item.id} title={String(item.campaignName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.campaignStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campaigns" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampaign(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("campaignKey")} placeholder="campaignKey" className={inputClass} />
                <input {...form.register("campaignName")} placeholder="campaignName" className={inputClass} />
                <input {...form.register("campaignStatus")} placeholder="campaignStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DailyClosingsPanel({ data }: { data: RetailData }) {
    const form = useForm<dailyClosingsFormValues>({ resolver: zodResolver(dailyClosingsFormSchema), defaultValues: {"retailHubId":"","closingKey":"","closingName":"","closingAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Daily Closings" description="Enterprise retail operating system daily closings" /><div className="mt-6 space-y-3">
                {data.dailyClosings.length === 0 ? <EmptyState title="No daily closings" description="Create the first daily closings record." /> : data.dailyClosings.map((item) => (
                    <ListCard key={item.id} title={String(item.closingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.closingAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create daily closings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDailyClosing(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("closingKey")} placeholder="closingKey" className={inputClass} />
                <input {...form.register("closingName")} placeholder="closingName" className={inputClass} />
                <input type="number" step="any" {...form.register("closingAmount", { valueAsNumber: true })} placeholder="closingAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BranchPerformancesPanel({ data }: { data: RetailData }) {
    const form = useForm<branchPerformanceFormValues>({ resolver: zodResolver(branchPerformanceFormSchema), defaultValues: {"retailHubId":"","performanceKey":"","performanceName":"","performanceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Branch Performance" description="Enterprise retail operating system branch performance" /><div className="mt-6 space-y-3">
                {data.branchPerformance.length === 0 ? <EmptyState title="No branch performance" description="Create the first branch performance record." /> : data.branchPerformance.map((item) => (
                    <ListCard key={item.id} title={String(item.performanceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.performanceScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create branch performance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBranchPerformance(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("performanceKey")} placeholder="performanceKey" className={inputClass} />
                <input {...form.register("performanceName")} placeholder="performanceName" className={inputClass} />
                <input type="number" step="any" {...form.register("performanceScore", { valueAsNumber: true })} placeholder="performanceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CommissionRecordsPanel({ data }: { data: RetailData }) {
    const form = useForm<commissionRecordsFormValues>({ resolver: zodResolver(commissionRecordsFormSchema), defaultValues: {"retailHubId":"","commissionKey":"","commissionName":"","commissionAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Commission Records" description="Enterprise retail operating system commission records" /><div className="mt-6 space-y-3">
                {data.commissionRecords.length === 0 ? <EmptyState title="No commission records" description="Create the first commission records record." /> : data.commissionRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.commissionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.commissionAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create commission records" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCommissionRecord(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("commissionKey")} placeholder="commissionKey" className={inputClass} />
                <input {...form.register("commissionName")} placeholder="commissionName" className={inputClass} />
                <input type="number" step="any" {...form.register("commissionAmount", { valueAsNumber: true })} placeholder="commissionAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SalesAnalyticssPanel({ data }: { data: RetailData }) {
    const form = useForm<salesAnalyticsFormValues>({ resolver: zodResolver(salesAnalyticsFormSchema), defaultValues: {"retailHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Sales Analytics" description="Enterprise retail operating system sales analytics" /><div className="mt-6 space-y-3">
                {data.salesAnalytics.length === 0 ? <EmptyState title="No sales analytics" description="Create the first sales analytics record." /> : data.salesAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create sales analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSalesAnalytics(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InventoryAnalyticssPanel({ data }: { data: RetailData }) {
    const form = useForm<inventoryAnalyticsFormValues>({ resolver: zodResolver(inventoryAnalyticsFormSchema), defaultValues: {"retailHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Inventory Analytics" description="Enterprise retail operating system inventory analytics" /><div className="mt-6 space-y-3">
                {data.inventoryAnalytics.length === 0 ? <EmptyState title="No inventory analytics" description="Create the first inventory analytics record." /> : data.inventoryAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create inventory analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInventoryAnalytics(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProfitabilityAnalyticssPanel({ data }: { data: RetailData }) {
    const form = useForm<profitabilityAnalyticsFormValues>({ resolver: zodResolver(profitabilityAnalyticsFormSchema), defaultValues: {"retailHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Profitability Analytics" description="Enterprise retail operating system profitability analytics" /><div className="mt-6 space-y-3">
                {data.profitabilityAnalytics.length === 0 ? <EmptyState title="No profitability analytics" description="Create the first profitability analytics record." /> : data.profitabilityAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create profitability analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProfitabilityAnalytics(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailMetricsPanel({ data }: { data: RetailData }) {
    const form = useForm<retailMetricsFormValues>({ resolver: zodResolver(retailMetricsFormSchema), defaultValues: {"metricsKey":"","revenueTotal":0,"overallRetailScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retail Metrics" description="Enterprise retail operating system retail metrics" /><div className="mt-6 space-y-3">
                {data.retailMetrics.length === 0 ? <EmptyState title="No retail metrics" description="Create the first retail metrics record." /> : data.retailMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallRetailScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retail metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetailMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("revenueTotal", { valueAsNumber: true })} placeholder="revenueTotal" className={inputClass} />
                <input type="number" step="any" {...form.register("overallRetailScore", { valueAsNumber: true })} placeholder="overallRetailScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailHealthsPanel({ data }: { data: RetailData }) {
    const form = useForm<retailHealthFormValues>({ resolver: zodResolver(retailHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retail Health" description="Enterprise retail operating system retail health" /><div className="mt-6 space-y-3">
                {data.retailHealth.length === 0 ? <EmptyState title="No retail health" description="Create the first retail health record." /> : data.retailHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retail health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetailHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveKpisPanel({ data }: { data: RetailData }) {
    const form = useForm<executiveKpisFormValues>({ resolver: zodResolver(executiveKpisFormSchema), defaultValues: {"retailHubId":"","kpiKey":"","kpiName":"","kpiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Kpis" description="Enterprise retail operating system executive kpis" /><div className="mt-6 space-y-3">
                {data.executiveKpis.length === 0 ? <EmptyState title="No executive kpis" description="Create the first executive kpis record." /> : data.executiveKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveKpi(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiScore", { valueAsNumber: true })} placeholder="kpiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailFailuresPanel({ data }: { data: RetailData }) {
    const form = useForm<retailFailuresFormValues>({ resolver: zodResolver(retailFailuresFormSchema), defaultValues: {"retailHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Retail Failures" description="Enterprise retail operating system retail failures" /><div className="mt-6 space-y-3">
                {data.retailFailures.length === 0 ? <EmptyState title="No retail failures" description="Create the first retail failures record." /> : data.retailFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create retail failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRetailFailure(v))}>
                <RetailHubSelect data={data} {...form.register("retailHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RetailAuditLogsPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Retail OS audit history" description="Security-first audit trail for jobs, events, retailInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for retail operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RetailSdkPanel({ data }: { data: RetailData }) {
    return (
        <Card hover><SectionHeader title="Shared Retail OS SDK" description="Import from @/src/modules/retail/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createRetailClient()" subtitle="Factory for module-scoped Retail OS client with auth context" meta="Primary SDK for enterprise retail operating system" />
            <ListCard title="sdkRegisterRetailBrand()" subtitle="Register retail operating system with AI orchestration" meta="moduleSource: enterprise_retail_business_os" />
            <ListCard title="sdkConfigureCustomerProfile()" subtitle="Configure customer profile with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunSalesOrderWorkflow()" subtitle="Run sales order workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {RTL_THEME.primary} • Integration hubs loaded: {data.retailHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createRetailClient } from "@/src/modules/retail/sdk";

const intg = createRetailClient(userId, email, fullName);
await intg.registerRetailBrand({ retailHubId, brandKey: "brand-001", brandName: "Northstar" });
await intg.configureCustomerProfile({ retailHubId, profileKey: "cust-001", profileName: "Smith" });
await intg.runSalesOrderWorkflow({ retailHubId, orderKey: "ord-001", orderName: "In-store sale" });`}</pre>
        </div></Card>
    );
}
