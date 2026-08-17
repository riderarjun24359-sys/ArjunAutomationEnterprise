"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { RST_THEME, ORDER_TYPE_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/restaurant/constants";
import type { useRestaurant } from "@/src/modules/restaurant/hooks/useRestaurant";
import {
    restaurantHubsFormSchema,
    type restaurantHubsFormValues,
    brandsFormSchema,
    type brandsFormValues,
    branchesFormSchema,
    type branchesFormValues,
    businessLicensesFormSchema,
    type businessLicensesFormValues,
    diningAreasFormSchema,
    type diningAreasFormValues,
    restaurantTablesFormSchema,
    type restaurantTablesFormValues,
    menuCategoriesFormSchema,
    type menuCategoriesFormValues,
    menuItemsFormSchema,
    type menuItemsFormValues,
    menuVariantsFormSchema,
    type menuVariantsFormValues,
    addOnsFormSchema,
    type addOnsFormValues,
    comboMealsFormSchema,
    type comboMealsFormValues,
    ordersFormSchema,
    type ordersFormValues,
    orderItemsFormSchema,
    type orderItemsFormValues,
    orderQueueFormSchema,
    type orderQueueFormValues,
    kitchenRoutingFormSchema,
    type kitchenRoutingFormValues,
    orderTimelineFormSchema,
    type orderTimelineFormValues,
    kitchenStationsFormSchema,
    type kitchenStationsFormValues,
    preparationQueueFormSchema,
    type preparationQueueFormValues,
    cookingStatusFormSchema,
    type cookingStatusFormValues,
    readyQueueFormSchema,
    type readyQueueFormValues,
    rushOrdersFormSchema,
    type rushOrdersFormValues,
    reservationsFormSchema,
    type reservationsFormValues,
    waitingListFormSchema,
    type waitingListFormValues,
    customerProfilesFormSchema,
    type customerProfilesFormValues,
    loyaltyProgramsFormSchema,
    type loyaltyProgramsFormValues,
    feedbackReviewsFormSchema,
    type feedbackReviewsFormValues,
    restaurantMetricsFormSchema,
    type restaurantMetricsFormValues,
    restaurantHealthFormSchema,
    type restaurantHealthFormValues,
    revenueAnalyticsFormSchema,
    type revenueAnalyticsFormValues,
    kitchenPerformanceFormSchema,
    type kitchenPerformanceFormValues,
    restaurantFailuresFormSchema,
    type restaurantFailuresFormValues,
} from "@/src/modules/restaurant/schemas";

type RestaurantData = ReturnType<typeof useRestaurant>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}
function RestaurantHubSelect({ data, ...props }: { data: RestaurantData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select restaurant operating system</option>{data.restaurantHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function RestaurantOverviewPanel({ data }: { data: RestaurantData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Restaurant OS summary" description="System health, background jobs, event bus, reservations, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Restaurant Hubs" subtitle={`${data.stats?.totalRestaurantHubs ?? 0} total`} meta={`${data.stats?.activeRestaurantHubs ?? 0} active • ${data.stats?.diningAreaCount ?? 0} dining areas`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.menuCategoryCount ?? 0} menu categories`} meta={`${data.stats?.orderCount ?? 0} orders • ${data.stats?.openReservationCount ?? 0} open reservations`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallRestaurantScore ?? 0).toFixed(1)} overall restaurant score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first restaurant operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Restaurant operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Restaurant operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function RestaurantHubsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<restaurantHubsFormValues>({ resolver: zodResolver(restaurantHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restaurant Hubs" description="Enterprise restaurant operating system restaurant hubs" /><div className="mt-6 space-y-3">
                {data.restaurantHubs.length === 0 ? <EmptyState title="No restaurant hubs" description="Create the first restaurant hubs record." /> : data.restaurantHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restaurant hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestaurantHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrandsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<brandsFormValues>({ resolver: zodResolver(brandsFormSchema), defaultValues: {"restaurantHubId":"","brandKey":"","brandName":"","brandType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Brands" description="Enterprise restaurant operating system brands" /><div className="mt-6 space-y-3">
                {data.brands.length === 0 ? <EmptyState title="No brands" description="Create the first brands record." /> : data.brands.map((item) => (
                    <ListCard key={item.id} title={String(item.brandName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.brandType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create brands" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBrand(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("brandKey")} placeholder="brandKey" className={inputClass} />
                <input {...form.register("brandName")} placeholder="brandName" className={inputClass} />
                <input {...form.register("brandType")} placeholder="brandType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BranchsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<branchesFormValues>({ resolver: zodResolver(branchesFormSchema), defaultValues: {"restaurantHubId":"","branchKey":"","branchName":"","branchAddress":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Branches" description="Enterprise restaurant operating system branches" /><div className="mt-6 space-y-3">
                {data.branches.length === 0 ? <EmptyState title="No branches" description="Create the first branches record." /> : data.branches.map((item) => (
                    <ListCard key={item.id} title={String(item.branchName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.branchAddress}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create branches" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBranch(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("branchKey")} placeholder="branchKey" className={inputClass} />
                <input {...form.register("branchName")} placeholder="branchName" className={inputClass} />
                <input {...form.register("branchAddress")} placeholder="branchAddress" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessLicensesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<businessLicensesFormValues>({ resolver: zodResolver(businessLicensesFormSchema), defaultValues: {"restaurantHubId":"","licenseKey":"","licenseName":"","licenseType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Licenses" description="Enterprise restaurant operating system business licenses" /><div className="mt-6 space-y-3">
                {data.businessLicenses.length === 0 ? <EmptyState title="No business licenses" description="Create the first business licenses record." /> : data.businessLicenses.map((item) => (
                    <ListCard key={item.id} title={String(item.licenseName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.licenseType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business licenses" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessLicense(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("licenseKey")} placeholder="licenseKey" className={inputClass} />
                <input {...form.register("licenseName")} placeholder="licenseName" className={inputClass} />
                <input {...form.register("licenseType")} placeholder="licenseType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DiningAreasPanel({ data }: { data: RestaurantData }) {
    const form = useForm<diningAreasFormValues>({ resolver: zodResolver(diningAreasFormSchema), defaultValues: {"restaurantHubId":"","areaKey":"","areaName":"","areaType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Dining Areas" description="Enterprise restaurant operating system dining areas" /><div className="mt-6 space-y-3">
                {data.diningAreas.length === 0 ? <EmptyState title="No dining areas" description="Create the first dining areas record." /> : data.diningAreas.map((item) => (
                    <ListCard key={item.id} title={String(item.areaName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.areaType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create dining areas" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDiningArea(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("areaKey")} placeholder="areaKey" className={inputClass} />
                <input {...form.register("areaName")} placeholder="areaName" className={inputClass} />
                <input {...form.register("areaType")} placeholder="areaType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestaurantTablesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<restaurantTablesFormValues>({ resolver: zodResolver(restaurantTablesFormSchema), defaultValues: {"restaurantHubId":"","tableKey":"","tableName":"","tableStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restaurant Tables" description="Enterprise restaurant operating system restaurant tables" /><div className="mt-6 space-y-3">
                {data.restaurantTables.length === 0 ? <EmptyState title="No restaurant tables" description="Create the first restaurant tables record." /> : data.restaurantTables.map((item) => (
                    <ListCard key={item.id} title={String(item.tableName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.tableStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restaurant tables" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestaurantTable(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("tableKey")} placeholder="tableKey" className={inputClass} />
                <input {...form.register("tableName")} placeholder="tableName" className={inputClass} />
                <input {...form.register("tableStatus")} placeholder="tableStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MenuCategorysPanel({ data }: { data: RestaurantData }) {
    const form = useForm<menuCategoriesFormValues>({ resolver: zodResolver(menuCategoriesFormSchema), defaultValues: {"restaurantHubId":"","categoryKey":"","categoryName":"","categoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Menu Categories" description="Enterprise restaurant operating system menu categories" /><div className="mt-6 space-y-3">
                {data.menuCategories.length === 0 ? <EmptyState title="No menu categories" description="Create the first menu categories record." /> : data.menuCategories.map((item) => (
                    <ListCard key={item.id} title={String(item.categoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.categoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create menu categories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMenuCategory(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("categoryKey")} placeholder="categoryKey" className={inputClass} />
                <input {...form.register("categoryName")} placeholder="categoryName" className={inputClass} />
                <input {...form.register("categoryType")} placeholder="categoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MenuItemsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<menuItemsFormValues>({ resolver: zodResolver(menuItemsFormSchema), defaultValues: {"restaurantHubId":"","itemKey":"","itemName":"","itemPrice":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Menu Items" description="Enterprise restaurant operating system menu items" /><div className="mt-6 space-y-3">
                {data.menuItems.length === 0 ? <EmptyState title="No menu items" description="Create the first menu items record." /> : data.menuItems.map((item) => (
                    <ListCard key={item.id} title={String(item.itemName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.itemPrice}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create menu items" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMenuItem(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("itemKey")} placeholder="itemKey" className={inputClass} />
                <input {...form.register("itemName")} placeholder="itemName" className={inputClass} />
                <input type="number" step="any" {...form.register("itemPrice", { valueAsNumber: true })} placeholder="itemPrice" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MenuVariantsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<menuVariantsFormValues>({ resolver: zodResolver(menuVariantsFormSchema), defaultValues: {"restaurantHubId":"","variantKey":"","variantName":"","variantType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Menu Variants" description="Enterprise restaurant operating system menu variants" /><div className="mt-6 space-y-3">
                {data.menuVariants.length === 0 ? <EmptyState title="No menu variants" description="Create the first menu variants record." /> : data.menuVariants.map((item) => (
                    <ListCard key={item.id} title={String(item.variantName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.variantType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create menu variants" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMenuVariant(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("variantKey")} placeholder="variantKey" className={inputClass} />
                <input {...form.register("variantName")} placeholder="variantName" className={inputClass} />
                <input {...form.register("variantType")} placeholder="variantType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AddOnsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<addOnsFormValues>({ resolver: zodResolver(addOnsFormSchema), defaultValues: {"restaurantHubId":"","addonKey":"","addonName":"","addonPrice":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Add Ons" description="Enterprise restaurant operating system add ons" /><div className="mt-6 space-y-3">
                {data.addOns.length === 0 ? <EmptyState title="No add ons" description="Create the first add ons record." /> : data.addOns.map((item) => (
                    <ListCard key={item.id} title={String(item.addonName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.addonPrice}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create add ons" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAddOn(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("addonKey")} placeholder="addonKey" className={inputClass} />
                <input {...form.register("addonName")} placeholder="addonName" className={inputClass} />
                <input type="number" step="any" {...form.register("addonPrice", { valueAsNumber: true })} placeholder="addonPrice" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ComboMealsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<comboMealsFormValues>({ resolver: zodResolver(comboMealsFormSchema), defaultValues: {"restaurantHubId":"","comboKey":"","comboName":"","comboPrice":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Combo Meals" description="Enterprise restaurant operating system combo meals" /><div className="mt-6 space-y-3">
                {data.comboMeals.length === 0 ? <EmptyState title="No combo meals" description="Create the first combo meals record." /> : data.comboMeals.map((item) => (
                    <ListCard key={item.id} title={String(item.comboName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.comboPrice}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create combo meals" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createComboMeal(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("comboKey")} placeholder="comboKey" className={inputClass} />
                <input {...form.register("comboName")} placeholder="comboName" className={inputClass} />
                <input type="number" step="any" {...form.register("comboPrice", { valueAsNumber: true })} placeholder="comboPrice" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrdersPanel({ data }: { data: RestaurantData }) {
    const form = useForm<ordersFormValues>({ resolver: zodResolver(ordersFormSchema), defaultValues: {"restaurantHubId":"","orderKey":"","orderNumber":"","orderType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Orders" description="Enterprise restaurant operating system orders" /><div className="mt-6 space-y-3">
                {data.orders.length === 0 ? <EmptyState title="No orders" description="Create the first orders record." /> : data.orders.map((item) => (
                    <ListCard key={item.id} title={String(item.orderNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orderType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create orders" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrder(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("orderKey")} placeholder="orderKey" className={inputClass} />
                <input {...form.register("orderNumber")} placeholder="orderNumber" className={inputClass} />
                <select {...form.register("orderType")} className={inputClass}>{ORDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrderItemsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<orderItemsFormValues>({ resolver: zodResolver(orderItemsFormSchema), defaultValues: {"restaurantHubId":"","itemKey":"","itemName":"","itemQuantity":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Order Items" description="Enterprise restaurant operating system order items" /><div className="mt-6 space-y-3">
                {data.orderItems.length === 0 ? <EmptyState title="No order items" description="Create the first order items record." /> : data.orderItems.map((item) => (
                    <ListCard key={item.id} title={String(item.itemName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.itemQuantity}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create order items" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrderItem(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("itemKey")} placeholder="itemKey" className={inputClass} />
                <input {...form.register("itemName")} placeholder="itemName" className={inputClass} />
                <input type="number" step="any" {...form.register("itemQuantity", { valueAsNumber: true })} placeholder="itemQuantity" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrderQueuesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<orderQueueFormValues>({ resolver: zodResolver(orderQueueFormSchema), defaultValues: {"restaurantHubId":"","queueKey":"","queueName":"","queueStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Order Queue" description="Enterprise restaurant operating system order queue" /><div className="mt-6 space-y-3">
                {data.orderQueue.length === 0 ? <EmptyState title="No order queue" description="Create the first order queue record." /> : data.orderQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create order queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrderQueue(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("queueName")} placeholder="queueName" className={inputClass} />
                <input {...form.register("queueStatus")} placeholder="queueStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KitchenRoutingsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<kitchenRoutingFormValues>({ resolver: zodResolver(kitchenRoutingFormSchema), defaultValues: {"restaurantHubId":"","routingKey":"","routingName":"","routingStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kitchen Routing" description="Enterprise restaurant operating system kitchen routing" /><div className="mt-6 space-y-3">
                {data.kitchenRouting.length === 0 ? <EmptyState title="No kitchen routing" description="Create the first kitchen routing record." /> : data.kitchenRouting.map((item) => (
                    <ListCard key={item.id} title={String(item.routingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.routingStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kitchen routing" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKitchenRouting(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("routingKey")} placeholder="routingKey" className={inputClass} />
                <input {...form.register("routingName")} placeholder="routingName" className={inputClass} />
                <input {...form.register("routingStatus")} placeholder="routingStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OrderTimelinesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<orderTimelineFormValues>({ resolver: zodResolver(orderTimelineFormSchema), defaultValues: {"restaurantHubId":"","timelineKey":"","timelineEvent":"","timelineStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Order Timeline" description="Enterprise restaurant operating system order timeline" /><div className="mt-6 space-y-3">
                {data.orderTimeline.length === 0 ? <EmptyState title="No order timeline" description="Create the first order timeline record." /> : data.orderTimeline.map((item) => (
                    <ListCard key={item.id} title={String(item.timelineEvent)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.timelineStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create order timeline" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOrderTimeline(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("timelineKey")} placeholder="timelineKey" className={inputClass} />
                <input {...form.register("timelineEvent")} placeholder="timelineEvent" className={inputClass} />
                <input {...form.register("timelineStatus")} placeholder="timelineStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KitchenStationsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<kitchenStationsFormValues>({ resolver: zodResolver(kitchenStationsFormSchema), defaultValues: {"restaurantHubId":"","stationKey":"","stationName":"","stationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kitchen Stations" description="Enterprise restaurant operating system kitchen stations" /><div className="mt-6 space-y-3">
                {data.kitchenStations.length === 0 ? <EmptyState title="No kitchen stations" description="Create the first kitchen stations record." /> : data.kitchenStations.map((item) => (
                    <ListCard key={item.id} title={String(item.stationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.stationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kitchen stations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKitchenStation(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("stationKey")} placeholder="stationKey" className={inputClass} />
                <input {...form.register("stationName")} placeholder="stationName" className={inputClass} />
                <input {...form.register("stationType")} placeholder="stationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PreparationQueuesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<preparationQueueFormValues>({ resolver: zodResolver(preparationQueueFormSchema), defaultValues: {"restaurantHubId":"","prepKey":"","prepName":"","prepStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Preparation Queue" description="Enterprise restaurant operating system preparation queue" /><div className="mt-6 space-y-3">
                {data.preparationQueue.length === 0 ? <EmptyState title="No preparation queue" description="Create the first preparation queue record." /> : data.preparationQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.prepName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.prepStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create preparation queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPreparationQueue(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("prepKey")} placeholder="prepKey" className={inputClass} />
                <input {...form.register("prepName")} placeholder="prepName" className={inputClass} />
                <input {...form.register("prepStatus")} placeholder="prepStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CookingStatussPanel({ data }: { data: RestaurantData }) {
    const form = useForm<cookingStatusFormValues>({ resolver: zodResolver(cookingStatusFormSchema), defaultValues: {"restaurantHubId":"","cookingKey":"","cookingName":"","cookingStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cooking Status" description="Enterprise restaurant operating system cooking status" /><div className="mt-6 space-y-3">
                {data.cookingStatus.length === 0 ? <EmptyState title="No cooking status" description="Create the first cooking status record." /> : data.cookingStatus.map((item) => (
                    <ListCard key={item.id} title={String(item.cookingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.cookingStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cooking status" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCookingStatus(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("cookingKey")} placeholder="cookingKey" className={inputClass} />
                <input {...form.register("cookingName")} placeholder="cookingName" className={inputClass} />
                <input {...form.register("cookingStatus")} placeholder="cookingStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReadyQueuesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<readyQueueFormValues>({ resolver: zodResolver(readyQueueFormSchema), defaultValues: {"restaurantHubId":"","readyKey":"","readyName":"","readyStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Ready Queue" description="Enterprise restaurant operating system ready queue" /><div className="mt-6 space-y-3">
                {data.readyQueue.length === 0 ? <EmptyState title="No ready queue" description="Create the first ready queue record." /> : data.readyQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.readyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.readyStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ready queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReadyQueue(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("readyKey")} placeholder="readyKey" className={inputClass} />
                <input {...form.register("readyName")} placeholder="readyName" className={inputClass} />
                <input {...form.register("readyStatus")} placeholder="readyStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RushOrdersPanel({ data }: { data: RestaurantData }) {
    const form = useForm<rushOrdersFormValues>({ resolver: zodResolver(rushOrdersFormSchema), defaultValues: {"restaurantHubId":"","rushKey":"","rushName":"","rushPriority":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rush Orders" description="Enterprise restaurant operating system rush orders" /><div className="mt-6 space-y-3">
                {data.rushOrders.length === 0 ? <EmptyState title="No rush orders" description="Create the first rush orders record." /> : data.rushOrders.map((item) => (
                    <ListCard key={item.id} title={String(item.rushName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.rushPriority}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rush orders" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRushOrder(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("rushKey")} placeholder="rushKey" className={inputClass} />
                <input {...form.register("rushName")} placeholder="rushName" className={inputClass} />
                <input {...form.register("rushPriority")} placeholder="rushPriority" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReservationsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<reservationsFormValues>({ resolver: zodResolver(reservationsFormSchema), defaultValues: {"restaurantHubId":"","reservationKey":"","reservationName":"","reservationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reservations" description="Enterprise restaurant operating system reservations" /><div className="mt-6 space-y-3">
                {data.reservations.length === 0 ? <EmptyState title="No reservations" description="Create the first reservations record." /> : data.reservations.map((item) => (
                    <ListCard key={item.id} title={String(item.reservationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reservationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reservations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReservation(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("reservationKey")} placeholder="reservationKey" className={inputClass} />
                <input {...form.register("reservationName")} placeholder="reservationName" className={inputClass} />
                <input {...form.register("reservationStatus")} placeholder="reservationStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WaitingListsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<waitingListFormValues>({ resolver: zodResolver(waitingListFormSchema), defaultValues: {"restaurantHubId":"","waitKey":"","waitName":"","waitStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Waiting List" description="Enterprise restaurant operating system waiting list" /><div className="mt-6 space-y-3">
                {data.waitingList.length === 0 ? <EmptyState title="No waiting list" description="Create the first waiting list record." /> : data.waitingList.map((item) => (
                    <ListCard key={item.id} title={String(item.waitName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.waitStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create waiting list" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWaitingList(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("waitKey")} placeholder="waitKey" className={inputClass} />
                <input {...form.register("waitName")} placeholder="waitName" className={inputClass} />
                <input {...form.register("waitStatus")} placeholder="waitStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CustomerProfilesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<customerProfilesFormValues>({ resolver: zodResolver(customerProfilesFormSchema), defaultValues: {"restaurantHubId":"","profileKey":"","profileName":"","profileType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Customer Profiles" description="Enterprise restaurant operating system customer profiles" /><div className="mt-6 space-y-3">
                {data.customerProfiles.length === 0 ? <EmptyState title="No customer profiles" description="Create the first customer profiles record." /> : data.customerProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create customer profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCustomerProfile(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("profileType")} placeholder="profileType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LoyaltyProgramsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<loyaltyProgramsFormValues>({ resolver: zodResolver(loyaltyProgramsFormSchema), defaultValues: {"restaurantHubId":"","programKey":"","programName":"","programType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Loyalty Programs" description="Enterprise restaurant operating system loyalty programs" /><div className="mt-6 space-y-3">
                {data.loyaltyPrograms.length === 0 ? <EmptyState title="No loyalty programs" description="Create the first loyalty programs record." /> : data.loyaltyPrograms.map((item) => (
                    <ListCard key={item.id} title={String(item.programName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.programType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create loyalty programs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLoyaltyProgram(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("programKey")} placeholder="programKey" className={inputClass} />
                <input {...form.register("programName")} placeholder="programName" className={inputClass} />
                <input {...form.register("programType")} placeholder="programType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeedbackReviewsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<feedbackReviewsFormValues>({ resolver: zodResolver(feedbackReviewsFormSchema), defaultValues: {"restaurantHubId":"","reviewKey":"","reviewTitle":"","reviewRating":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Feedback Reviews" description="Enterprise restaurant operating system feedback reviews" /><div className="mt-6 space-y-3">
                {data.feedbackReviews.length === 0 ? <EmptyState title="No feedback reviews" description="Create the first feedback reviews record." /> : data.feedbackReviews.map((item) => (
                    <ListCard key={item.id} title={String(item.reviewTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reviewRating}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create feedback reviews" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeedbackReview(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("reviewKey")} placeholder="reviewKey" className={inputClass} />
                <input {...form.register("reviewTitle")} placeholder="reviewTitle" className={inputClass} />
                <input type="number" step="any" {...form.register("reviewRating", { valueAsNumber: true })} placeholder="reviewRating" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestaurantMetricsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<restaurantMetricsFormValues>({ resolver: zodResolver(restaurantMetricsFormSchema), defaultValues: {"metricsKey":"","orderCount":0,"overallRestaurantScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restaurant Metrics" description="Enterprise restaurant operating system restaurant metrics" /><div className="mt-6 space-y-3">
                {data.restaurantMetrics.length === 0 ? <EmptyState title="No restaurant metrics" description="Create the first restaurant metrics record." /> : data.restaurantMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallRestaurantScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restaurant metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestaurantMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("orderCount", { valueAsNumber: true })} placeholder="orderCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallRestaurantScore", { valueAsNumber: true })} placeholder="overallRestaurantScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestaurantHealthsPanel({ data }: { data: RestaurantData }) {
    const form = useForm<restaurantHealthFormValues>({ resolver: zodResolver(restaurantHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restaurant Health" description="Enterprise restaurant operating system restaurant health" /><div className="mt-6 space-y-3">
                {data.restaurantHealth.length === 0 ? <EmptyState title="No restaurant health" description="Create the first restaurant health record." /> : data.restaurantHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restaurant health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestaurantHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueAnalyticssPanel({ data }: { data: RestaurantData }) {
    const form = useForm<revenueAnalyticsFormValues>({ resolver: zodResolver(revenueAnalyticsFormSchema), defaultValues: {"restaurantHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Analytics" description="Enterprise restaurant operating system revenue analytics" /><div className="mt-6 space-y-3">
                {data.revenueAnalytics.length === 0 ? <EmptyState title="No revenue analytics" description="Create the first revenue analytics record." /> : data.revenueAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueAnalytics(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function KitchenPerformancesPanel({ data }: { data: RestaurantData }) {
    const form = useForm<kitchenPerformanceFormValues>({ resolver: zodResolver(kitchenPerformanceFormSchema), defaultValues: {"restaurantHubId":"","performanceKey":"","performanceType":"","performanceScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Kitchen Performance" description="Enterprise restaurant operating system kitchen performance" /><div className="mt-6 space-y-3">
                {data.kitchenPerformance.length === 0 ? <EmptyState title="No kitchen performance" description="Create the first kitchen performance record." /> : data.kitchenPerformance.map((item) => (
                    <ListCard key={item.id} title={String(item.performanceKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.performanceType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create kitchen performance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createKitchenPerformance(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("performanceKey")} placeholder="performanceKey" className={inputClass} />
                <input {...form.register("performanceType")} placeholder="performanceType" className={inputClass} />
                <input type="number" step="any" {...form.register("performanceScore", { valueAsNumber: true })} placeholder="performanceScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestaurantFailuresPanel({ data }: { data: RestaurantData }) {
    const form = useForm<restaurantFailuresFormValues>({ resolver: zodResolver(restaurantFailuresFormSchema), defaultValues: {"restaurantHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Restaurant Failures" description="Enterprise restaurant operating system restaurant failures" /><div className="mt-6 space-y-3">
                {data.restaurantFailures.length === 0 ? <EmptyState title="No restaurant failures" description="Create the first restaurant failures record." /> : data.restaurantFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create restaurant failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRestaurantFailure(v))}>
                <RestaurantHubSelect data={data} {...form.register("restaurantHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RestaurantAuditLogsPanel({ data }: { data: RestaurantData }) {
    return (
        <Card hover><SectionHeader title="Restaurant OS audit history" description="Security-first audit trail for jobs, events, reservations, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for restaurant operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function RestaurantSdkPanel({ data }: { data: RestaurantData }) {
    return (
        <Card hover><SectionHeader title="Shared Restaurant OS SDK" description="Import from @/src/modules/restaurant/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createRestaurantClient()" subtitle="Factory for module-scoped Restaurant OS client with auth context" meta="Primary SDK for enterprise restaurant operating system" />
            <ListCard title="sdkRegisterBrand()" subtitle="Register restaurant operating system with AI orchestration" meta="moduleSource: enterprise_restaurant_business_os" />
            <ListCard title="sdkConfigureMenu()" subtitle="Configure menu category with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunOrderWorkflow()" subtitle="Run order workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {RST_THEME.primary} • Integration hubs loaded: {data.restaurantHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createRestaurantClient } from "@/src/modules/restaurant/sdk";

const intg = createRestaurantClient(userId, email, fullName);
await intg.registerBrand({ restaurantHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureMenu({ restaurantHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runOrderWorkflow({ restaurantHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
