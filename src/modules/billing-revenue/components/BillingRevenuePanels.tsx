"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { BRV_THEME, BILLING_CYCLE_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/src/modules/billing-revenue/constants";
import type { useBillingRevenue } from "@/src/modules/billing-revenue/hooks/useBillingRevenue";
import {
    billingAccountFormSchema,
    billingCycleFormSchema,
    subscriptionBillingFormSchema,
    prorationRecordFormSchema,
    paymentMethodFormSchema,
    paymentAttemptFormSchema,
    refundFormSchema,
    walletBalanceFormSchema,
    mrrSnapshotFormSchema,
    arrSnapshotFormSchema,
    deferredRevenueFormSchema,
    revenueRecognitionFormSchema,
    invoiceFormSchema,
    creditNoteFormSchema,
    debitNoteFormSchema,
    taxConfigFormSchema,
    outstandingBalanceFormSchema,
    paymentReminderFormSchema,
    collectionCaseFormSchema,
    writeOffFormSchema,
    analyticsSnapshotFormSchema,
    revenueGrowthMetricFormSchema,
    cashFlowRecordFormSchema,
    subscriptionTrendFormSchema,
    renewalForecastFormSchema,
    mrrForecastFormSchema,
    arrForecastFormSchema,
    revenueProjectionFormSchema,
    financeMetricFormSchema,
    financialHealthFormSchema,
    expansionContractionFormSchema,
    type billingAccountFormValues,
    type billingCycleFormValues,
    type subscriptionBillingFormValues,
    type prorationRecordFormValues,
    type paymentMethodFormValues,
    type paymentAttemptFormValues,
    type refundFormValues,
    type walletBalanceFormValues,
    type mrrSnapshotFormValues,
    type arrSnapshotFormValues,
    type deferredRevenueFormValues,
    type revenueRecognitionFormValues,
    type invoiceFormValues,
    type creditNoteFormValues,
    type debitNoteFormValues,
    type taxConfigFormValues,
    type outstandingBalanceFormValues,
    type paymentReminderFormValues,
    type collectionCaseFormValues,
    type writeOffFormValues,
    type analyticsSnapshotFormValues,
    type revenueGrowthMetricFormValues,
    type cashFlowRecordFormValues,
    type subscriptionTrendFormValues,
    type renewalForecastFormValues,
    type mrrForecastFormValues,
    type arrForecastFormValues,
    type revenueProjectionFormValues,
    type financeMetricFormValues,
    type financialHealthFormValues,
    type expansionContractionFormValues,
} from "@/src/modules/billing-revenue/schemas";

type BillingRevenueData = ReturnType<typeof useBillingRevenue>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-amber-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-amber-600">{meta}</p> : null}</div>;
}
function BillingAccountSelect({ data, ...props }: { data: BillingRevenueData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select billing account</option>{data.billingAccountOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function BillingRevenueOverviewPanel({ data }: { data: BillingRevenueData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Billing & Revenue summary" description="Subscription billing, payments, revenue management, invoices, collections, analytics, and forecasting" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Billing Accounts" subtitle={`${data.stats?.totalBillingAccounts ?? 0} total`} meta={`${data.stats?.activeBillingAccounts ?? 0} active • MRR $${(data.stats?.mrrUsd ?? 0).toFixed(0)}`} />
                <ListCard title="Revenue" subtitle={`ARR $${(data.stats?.arrUsd ?? 0).toFixed(0)}`} meta={`Outstanding $${(data.stats?.outstandingBalanceUsd ?? 0).toFixed(0)} • ${data.stats?.openInvoiceCount ?? 0} open invoices`} />
                <ListCard title="Payments & Collections" subtitle={`${data.stats?.failedPaymentCount ?? 0} failed payments`} meta={`${data.stats?.collectionCaseCount ?? 0} collection cases`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first financial operations" />
            </div></Card>
            <Card hover><SectionHeader title="Billing pipeline" description={`${pipeline?.previousStage ?? "monthly"} → ${pipeline?.currentStage ?? "quarterly"} → ${pipeline?.nextStage ?? "annual"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Billing pipeline stages will appear as accounts are configured." />}
            </div></Card>
        </div>
    );
}

export function BillingAccountsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<billingAccountFormValues>({ resolver: zodResolver(billingAccountFormSchema), defaultValues: { accountKey: "", accountName: "", currencyCode: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Billing Accounts" description="Billing & revenue billing accounts" /><div className="mt-6 space-y-3">
                {data.billingAccounts.length === 0 ? <EmptyState title="No billing accounts" description="Create the first billing accounts record." /> : data.billingAccounts.map((item) => (
                    <ListCard key={item.id} title={String(item.accountName)} subtitle={`${item.accountKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create billing account" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBillingAccount(v))}>
                <input {...form.register("accountKey")} placeholder="Account key" className={inputClass} />
                <input {...form.register("accountName")} placeholder="Account name" className={inputClass} />
                <input {...form.register("currencyCode")} placeholder="Currency code" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BillingCyclesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<billingCycleFormValues>({ resolver: zodResolver(billingCycleFormSchema), defaultValues: { billingAccountId: "", cycleKey: "", billingCycle: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Billing Cycles" description="Billing & revenue billing cycles" /><div className="mt-6 space-y-3">
                {data.billingCycles.length === 0 ? <EmptyState title="No billing cycles" description="Create the first billing cycles record." /> : data.billingCycles.map((item) => (
                    <ListCard key={item.id} title={String(item.cycleKey)} subtitle={`${item.billingAccountName} • ${item.cycleKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create billing cycle" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBillingCycle(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("cycleKey")} placeholder="Cycle key" className={inputClass} />
                <select {...form.register("billingCycle")} className={inputClass}>{BILLING_CYCLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubscriptionBillingsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<subscriptionBillingFormValues>({ resolver: zodResolver(subscriptionBillingFormSchema), defaultValues: { billingAccountId: "", billingKey: "", amountUsd: 0, billingCycle: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Subscription Billings" description="Billing & revenue subscription billings" /><div className="mt-6 space-y-3">
                {data.subscriptionBillings.length === 0 ? <EmptyState title="No subscription billings" description="Create the first subscription billings record." /> : data.subscriptionBillings.map((item) => (
                    <ListCard key={item.id} title={String(item.billingKey)} subtitle={`${item.billingAccountName} • ${item.billingKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create subscription billing" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubscriptionBilling(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("billingKey")} placeholder="Billing key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <select {...form.register("billingCycle")} className={inputClass}>{BILLING_CYCLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProrationRecordsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<prorationRecordFormValues>({ resolver: zodResolver(prorationRecordFormSchema), defaultValues: { billingAccountId: "", prorationKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Proration Records" description="Billing & revenue proration records" /><div className="mt-6 space-y-3">
                {data.prorationRecords.length === 0 ? <EmptyState title="No proration records" description="Create the first proration records record." /> : data.prorationRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.prorationKey)} subtitle={`${item.billingAccountName} • ${item.prorationKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create proration record" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProrationRecord(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("prorationKey")} placeholder="Proration key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentMethodsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<paymentMethodFormValues>({ resolver: zodResolver(paymentMethodFormSchema), defaultValues: { billingAccountId: "", methodKey: "", methodType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Methods" description="Billing & revenue payment methods" /><div className="mt-6 space-y-3">
                {data.paymentMethods.length === 0 ? <EmptyState title="No payment methods" description="Create the first payment methods record." /> : data.paymentMethods.map((item) => (
                    <ListCard key={item.id} title={String(item.methodKey)} subtitle={`${item.billingAccountName} • ${item.methodKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment method" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentMethod(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("methodKey")} placeholder="Method key" className={inputClass} />
                <input {...form.register("methodType")} placeholder="Method type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentAttemptsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<paymentAttemptFormValues>({ resolver: zodResolver(paymentAttemptFormSchema), defaultValues: { billingAccountId: "", attemptKey: "", amountUsd: 0, paymentStatus: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Attempts" description="Billing & revenue payment attempts" /><div className="mt-6 space-y-3">
                {data.paymentAttempts.length === 0 ? <EmptyState title="No payment attempts" description="Create the first payment attempts record." /> : data.paymentAttempts.map((item) => (
                    <ListCard key={item.id} title={String(item.attemptKey)} subtitle={`${item.billingAccountName} • ${item.attemptKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment attempt" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentAttempt(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("attemptKey")} placeholder="Attempt key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <select {...form.register("paymentStatus")} className={inputClass}>{PAYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RefundsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<refundFormValues>({ resolver: zodResolver(refundFormSchema), defaultValues: { billingAccountId: "", refundKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Refunds" description="Billing & revenue refunds" /><div className="mt-6 space-y-3">
                {data.refunds.length === 0 ? <EmptyState title="No refunds" description="Create the first refunds record." /> : data.refunds.map((item) => (
                    <ListCard key={item.id} title={String(item.refundKey)} subtitle={`${item.billingAccountName} • ${item.refundKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create refund" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRefund(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("refundKey")} placeholder="Refund key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WalletBalancesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<walletBalanceFormValues>({ resolver: zodResolver(walletBalanceFormSchema), defaultValues: { billingAccountId: "", walletKey: "", balanceUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Wallet Balances" description="Billing & revenue wallet balances" /><div className="mt-6 space-y-3">
                {data.walletBalances.length === 0 ? <EmptyState title="No wallet balances" description="Create the first wallet balances record." /> : data.walletBalances.map((item) => (
                    <ListCard key={item.id} title={String(item.walletKey)} subtitle={`${item.billingAccountName} • ${item.walletKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create wallet balance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWalletBalance(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("walletKey")} placeholder="Wallet key" className={inputClass} />
                <input type="number" step="any" {...form.register("balanceUsd", { valueAsNumber: true })} placeholder="Balance USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MrrSnapshotsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<mrrSnapshotFormValues>({ resolver: zodResolver(mrrSnapshotFormSchema), defaultValues: { billingAccountId: "", snapshotKey: "", mrrUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="MRR Snapshots" description="Billing & revenue mrr snapshots" /><div className="mt-6 space-y-3">
                {data.mrrSnapshots.length === 0 ? <EmptyState title="No mrr snapshots" description="Create the first mrr snapshots record." /> : data.mrrSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotKey)} subtitle={`${item.billingAccountName} • ${item.snapshotKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mrr snapshot" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMrrSnapshot(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("snapshotKey")} placeholder="Snapshot key" className={inputClass} />
                <input type="number" step="any" {...form.register("mrrUsd", { valueAsNumber: true })} placeholder="MRR USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ArrSnapshotsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<arrSnapshotFormValues>({ resolver: zodResolver(arrSnapshotFormSchema), defaultValues: { billingAccountId: "", snapshotKey: "", arrUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="ARR Snapshots" description="Billing & revenue arr snapshots" /><div className="mt-6 space-y-3">
                {data.arrSnapshots.length === 0 ? <EmptyState title="No arr snapshots" description="Create the first arr snapshots record." /> : data.arrSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotKey)} subtitle={`${item.billingAccountName} • ${item.snapshotKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create arr snapshot" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createArrSnapshot(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("snapshotKey")} placeholder="Snapshot key" className={inputClass} />
                <input type="number" step="any" {...form.register("arrUsd", { valueAsNumber: true })} placeholder="ARR USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeferredRevenuesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<deferredRevenueFormValues>({ resolver: zodResolver(deferredRevenueFormSchema), defaultValues: { billingAccountId: "", recordKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Deferred Revenue" description="Billing & revenue deferred revenue" /><div className="mt-6 space-y-3">
                {data.deferredRevenue.length === 0 ? <EmptyState title="No deferred revenue" description="Create the first deferred revenue record." /> : data.deferredRevenue.map((item) => (
                    <ListCard key={item.id} title={String(item.recordKey)} subtitle={`${item.billingAccountName} • ${item.recordKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create deferred revenue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeferredRevenue(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("recordKey")} placeholder="Record key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueRecognitionsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<revenueRecognitionFormValues>({ resolver: zodResolver(revenueRecognitionFormSchema), defaultValues: { billingAccountId: "", recognitionKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Recognition" description="Billing & revenue revenue recognition" /><div className="mt-6 space-y-3">
                {data.revenueRecognition.length === 0 ? <EmptyState title="No revenue recognition" description="Create the first revenue recognition record." /> : data.revenueRecognition.map((item) => (
                    <ListCard key={item.id} title={String(item.recognitionKey)} subtitle={`${item.billingAccountName} • ${item.recognitionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue recognition" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueRecognition(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("recognitionKey")} placeholder="Recognition key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InvoicesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<invoiceFormValues>({ resolver: zodResolver(invoiceFormSchema), defaultValues: { billingAccountId: "", invoiceKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Invoices" description="Billing & revenue invoices" /><div className="mt-6 space-y-3">
                {data.invoices.length === 0 ? <EmptyState title="No invoices" description="Create the first invoices record." /> : data.invoices.map((item) => (
                    <ListCard key={item.id} title={String(item.invoiceKey)} subtitle={`${item.billingAccountName} • ${item.invoiceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create invoice" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInvoice(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("invoiceKey")} placeholder="Invoice key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CreditNotesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<creditNoteFormValues>({ resolver: zodResolver(creditNoteFormSchema), defaultValues: { billingAccountId: "", noteKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Credit Notes" description="Billing & revenue credit notes" /><div className="mt-6 space-y-3">
                {data.creditNotes.length === 0 ? <EmptyState title="No credit notes" description="Create the first credit notes record." /> : data.creditNotes.map((item) => (
                    <ListCard key={item.id} title={String(item.noteKey)} subtitle={`${item.billingAccountName} • ${item.noteKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create credit note" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCreditNote(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("noteKey")} placeholder="Note key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DebitNotesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<debitNoteFormValues>({ resolver: zodResolver(debitNoteFormSchema), defaultValues: { billingAccountId: "", noteKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Debit Notes" description="Billing & revenue debit notes" /><div className="mt-6 space-y-3">
                {data.debitNotes.length === 0 ? <EmptyState title="No debit notes" description="Create the first debit notes record." /> : data.debitNotes.map((item) => (
                    <ListCard key={item.id} title={String(item.noteKey)} subtitle={`${item.billingAccountName} • ${item.noteKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create debit note" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDebitNote(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("noteKey")} placeholder="Note key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TaxConfigsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<taxConfigFormValues>({ resolver: zodResolver(taxConfigFormSchema), defaultValues: { billingAccountId: "", configKey: "", gstRate: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Tax Configs" description="Billing & revenue tax configs" /><div className="mt-6 space-y-3">
                {data.taxConfigs.length === 0 ? <EmptyState title="No tax configs" description="Create the first tax configs record." /> : data.taxConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configKey)} subtitle={`${item.billingAccountName} • ${item.configKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create tax config" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTaxConfig(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("configKey")} placeholder="Config key" className={inputClass} />
                <input type="number" step="any" {...form.register("gstRate", { valueAsNumber: true })} placeholder="GST rate %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OutstandingBalancesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<outstandingBalanceFormValues>({ resolver: zodResolver(outstandingBalanceFormSchema), defaultValues: { billingAccountId: "", balanceKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Outstanding Balances" description="Billing & revenue outstanding balances" /><div className="mt-6 space-y-3">
                {data.outstandingBalances.length === 0 ? <EmptyState title="No outstanding balances" description="Create the first outstanding balances record." /> : data.outstandingBalances.map((item) => (
                    <ListCard key={item.id} title={String(item.balanceKey)} subtitle={`${item.billingAccountName} • ${item.balanceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create outstanding balance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOutstandingBalance(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("balanceKey")} placeholder="Balance key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentRemindersPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<paymentReminderFormValues>({ resolver: zodResolver(paymentReminderFormSchema), defaultValues: { billingAccountId: "", reminderKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Reminders" description="Billing & revenue payment reminders" /><div className="mt-6 space-y-3">
                {data.paymentReminders.length === 0 ? <EmptyState title="No payment reminders" description="Create the first payment reminders record." /> : data.paymentReminders.map((item) => (
                    <ListCard key={item.id} title={String(item.reminderKey)} subtitle={`${item.billingAccountName} • ${item.reminderKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment reminder" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentReminder(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("reminderKey")} placeholder="Reminder key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CollectionCasesPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<collectionCaseFormValues>({ resolver: zodResolver(collectionCaseFormSchema), defaultValues: { billingAccountId: "", caseKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Collection Cases" description="Billing & revenue collection cases" /><div className="mt-6 space-y-3">
                {data.collectionCases.length === 0 ? <EmptyState title="No collection cases" description="Create the first collection cases record." /> : data.collectionCases.map((item) => (
                    <ListCard key={item.id} title={String(item.caseKey)} subtitle={`${item.billingAccountName} • ${item.caseKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create collection case" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCollectionCase(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("caseKey")} placeholder="Case key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WriteOffsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<writeOffFormValues>({ resolver: zodResolver(writeOffFormSchema), defaultValues: { billingAccountId: "", writeOffKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Write-offs" description="Billing & revenue write-offs" /><div className="mt-6 space-y-3">
                {data.writeOffs.length === 0 ? <EmptyState title="No write-offs" description="Create the first write-offs record." /> : data.writeOffs.map((item) => (
                    <ListCard key={item.id} title={String(item.writeOffKey)} subtitle={`${item.billingAccountName} • ${item.writeOffKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create write-off" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWriteOff(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("writeOffKey")} placeholder="Write-off key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AnalyticsSnapshotsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<analyticsSnapshotFormValues>({ resolver: zodResolver(analyticsSnapshotFormSchema), defaultValues: { billingAccountId: "", snapshotKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Analytics Snapshots" description="Billing & revenue analytics snapshots" /><div className="mt-6 space-y-3">
                {data.analyticsSnapshots.length === 0 ? <EmptyState title="No analytics snapshots" description="Create the first analytics snapshots record." /> : data.analyticsSnapshots.map((item) => (
                    <ListCard key={item.id} title={String(item.snapshotKey)} subtitle={`${item.billingAccountName} • ${item.snapshotKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create analytics snapshot" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAnalyticsSnapshot(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("snapshotKey")} placeholder="Snapshot key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueGrowthMetricsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<revenueGrowthMetricFormValues>({ resolver: zodResolver(revenueGrowthMetricFormSchema), defaultValues: { billingAccountId: "", metricsKey: "", growthRatePercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Growth Metrics" description="Billing & revenue revenue growth metrics" /><div className="mt-6 space-y-3">
                {data.revenueGrowthMetrics.length === 0 ? <EmptyState title="No revenue growth metrics" description="Create the first revenue growth metrics record." /> : data.revenueGrowthMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.billingAccountName} • ${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue growth metric" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueGrowthMetric(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <input type="number" step="any" {...form.register("growthRatePercent", { valueAsNumber: true })} placeholder="Growth rate %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CashFlowRecordsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<cashFlowRecordFormValues>({ resolver: zodResolver(cashFlowRecordFormSchema), defaultValues: { billingAccountId: "", recordKey: "", amountUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Cash Flow Records" description="Billing & revenue cash flow records" /><div className="mt-6 space-y-3">
                {data.cashFlowRecords.length === 0 ? <EmptyState title="No cash flow records" description="Create the first cash flow records record." /> : data.cashFlowRecords.map((item) => (
                    <ListCard key={item.id} title={String(item.recordKey)} subtitle={`${item.billingAccountName} • ${item.recordKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create cash flow record" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCashFlowRecord(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("recordKey")} placeholder="Record key" className={inputClass} />
                <input type="number" step="any" {...form.register("amountUsd", { valueAsNumber: true })} placeholder="Amount USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubscriptionTrendsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<subscriptionTrendFormValues>({ resolver: zodResolver(subscriptionTrendFormSchema), defaultValues: { billingAccountId: "", trendKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Subscription Trends" description="Billing & revenue subscription trends" /><div className="mt-6 space-y-3">
                {data.subscriptionTrends.length === 0 ? <EmptyState title="No subscription trends" description="Create the first subscription trends record." /> : data.subscriptionTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendKey)} subtitle={`${item.billingAccountName} • ${item.trendKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create subscription trend" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubscriptionTrend(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("trendKey")} placeholder="Trend key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RenewalForecastsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<renewalForecastFormValues>({ resolver: zodResolver(renewalForecastFormSchema), defaultValues: { billingAccountId: "", forecastKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Renewal Forecasts" description="Billing & revenue renewal forecasts" /><div className="mt-6 space-y-3">
                {data.renewalForecasts.length === 0 ? <EmptyState title="No renewal forecasts" description="Create the first renewal forecasts record." /> : data.renewalForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastKey)} subtitle={`${item.billingAccountName} • ${item.forecastKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create renewal forecast" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRenewalForecast(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("forecastKey")} placeholder="Forecast key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MrrForecastsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<mrrForecastFormValues>({ resolver: zodResolver(mrrForecastFormSchema), defaultValues: { billingAccountId: "", forecastKey: "", projectedMrrUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="MRR Forecasts" description="Billing & revenue mrr forecasts" /><div className="mt-6 space-y-3">
                {data.mrrForecasts.length === 0 ? <EmptyState title="No mrr forecasts" description="Create the first mrr forecasts record." /> : data.mrrForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastKey)} subtitle={`${item.billingAccountName} • ${item.forecastKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mrr forecast" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMrrForecast(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("forecastKey")} placeholder="Forecast key" className={inputClass} />
                <input type="number" step="any" {...form.register("projectedMrrUsd", { valueAsNumber: true })} placeholder="Projected MRR USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ArrForecastsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<arrForecastFormValues>({ resolver: zodResolver(arrForecastFormSchema), defaultValues: { billingAccountId: "", forecastKey: "", projectedArrUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="ARR Forecasts" description="Billing & revenue arr forecasts" /><div className="mt-6 space-y-3">
                {data.arrForecasts.length === 0 ? <EmptyState title="No arr forecasts" description="Create the first arr forecasts record." /> : data.arrForecasts.map((item) => (
                    <ListCard key={item.id} title={String(item.forecastKey)} subtitle={`${item.billingAccountName} • ${item.forecastKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create arr forecast" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createArrForecast(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("forecastKey")} placeholder="Forecast key" className={inputClass} />
                <input type="number" step="any" {...form.register("projectedArrUsd", { valueAsNumber: true })} placeholder="Projected ARR USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueProjectionsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<revenueProjectionFormValues>({ resolver: zodResolver(revenueProjectionFormSchema), defaultValues: { billingAccountId: "", projectionKey: "", projectedRevenueUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Projections" description="Billing & revenue revenue projections" /><div className="mt-6 space-y-3">
                {data.revenueProjections.length === 0 ? <EmptyState title="No revenue projections" description="Create the first revenue projections record." /> : data.revenueProjections.map((item) => (
                    <ListCard key={item.id} title={String(item.projectionKey)} subtitle={`${item.billingAccountName} • ${item.projectionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue projection" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueProjection(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("projectionKey")} placeholder="Projection key" className={inputClass} />
                <input type="number" step="any" {...form.register("projectedRevenueUsd", { valueAsNumber: true })} placeholder="Projected revenue USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FinanceMetricsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<financeMetricFormValues>({ resolver: zodResolver(financeMetricFormSchema), defaultValues: { metricsKey: "", mrrUsd: 0, arrUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Finance Metrics" description="Billing & revenue finance metrics" /><div className="mt-6 space-y-3">
                {data.financeMetrics.length === 0 ? <EmptyState title="No finance metrics" description="Create the first finance metrics record." /> : data.financeMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.metricsKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create finance metric" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFinanceMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <input type="number" step="any" {...form.register("mrrUsd", { valueAsNumber: true })} placeholder="MRR USD" className={inputClass} />
                <input type="number" step="any" {...form.register("arrUsd", { valueAsNumber: true })} placeholder="ARR USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FinancialHealthsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<financialHealthFormValues>({ resolver: zodResolver(financialHealthFormSchema), defaultValues: { healthKey: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Financial Health" description="Billing & revenue financial health" /><div className="mt-6 space-y-3">
                {data.financialHealth.length === 0 ? <EmptyState title="No financial health" description="Create the first financial health record." /> : data.financialHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.healthKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create financial health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFinancialHealth(v))}>
                <input {...form.register("healthKey")} placeholder="Health key" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExpansionContractionsPanel({ data }: { data: BillingRevenueData }) {
    const form = useForm<expansionContractionFormValues>({ resolver: zodResolver(expansionContractionFormSchema), defaultValues: { billingAccountId: "", recordKey: "", expansionUsd: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Expansion & Contraction" description="Billing & revenue expansion & contraction" /><div className="mt-6 space-y-3">
                {data.expansionContraction.length === 0 ? <EmptyState title="No expansion & contraction" description="Create the first expansion & contraction record." /> : data.expansionContraction.map((item) => (
                    <ListCard key={item.id} title={String(item.recordKey)} subtitle={`${item.billingAccountName} • ${item.recordKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create expansion & contraction" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExpansionContraction(v))}>
                <BillingAccountSelect data={data} {...form.register("billingAccountId")} />
                <input {...form.register("recordKey")} placeholder="Record key" className={inputClass} />
                <input type="number" step="any" {...form.register("expansionUsd", { valueAsNumber: true })} placeholder="Expansion USD" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BrvAuditLogsPanel({ data }: { data: BillingRevenueData }) {
    return (
        <Card hover><SectionHeader title="Billing & Revenue audit history" description="Security-first audit trail for subscription billing, payments, revenue, invoices, and collections" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for billing and revenue operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function BillingRevenueSdkPanel({ data }: { data: BillingRevenueData }) {
    return (
        <Card hover><SectionHeader title="Shared Billing & Revenue SDK" description="Import from @/src/modules/billing-revenue/sdk for invoice generation, payment processing, and revenue recognition" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createBillingRevenueClient()" subtitle="Factory for module-scoped Billing & Revenue client with auth context" meta="Primary SDK for enterprise billing operations" />
            <ListCard title="sdkGenerateInvoice()" subtitle="Generate invoice with AI orchestration" meta="moduleSource: billing_revenue" />
            <ListCard title="sdkProcessPayment()" subtitle="Process payment attempt with knowledge context" meta="Succeeded, failed, partial, refunded" />
            <ListCard title="sdkRecognizeRevenue()" subtitle="Recognize revenue with audit trail" meta="Deferred → recognized revenue" />
            <p className="text-xs text-slate-500">Theme: {BRV_THEME.primary} • Billing accounts loaded: {data.billingAccounts.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createBillingRevenueClient } from "@/src/modules/billing-revenue/sdk";

const brv = createBillingRevenueClient(userId, email, fullName);
await brv.generateInvoice({ billingAccountId, invoiceKey: "inv-001", amountUsd: 299 });
await brv.processPayment({ billingAccountId, attemptKey: "pay-001", amountUsd: 299 });
await brv.recognizeRevenue({ billingAccountId, recognitionKey: "rev-001", amountUsd: 299 });`}</pre>
        </div></Card>
    );
}
