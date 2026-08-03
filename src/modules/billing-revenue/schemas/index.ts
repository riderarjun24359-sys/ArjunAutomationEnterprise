import { z } from "zod";

export const billingAccountFormSchema = z.object({
    accountKey: z.string().min(2),
    accountName: z.string().min(2),
    currencyCode: z.string().min(2).optional(),
});

export const billingCycleFormSchema = z.object({
    billingAccountId: z.string().min(1),
    cycleKey: z.string().min(2),
    billingCycle: z.string().min(2).optional(),
});

export const subscriptionBillingFormSchema = z.object({
    billingAccountId: z.string().min(1),
    billingKey: z.string().min(2),
    amountUsd: z.number().optional(),
    billingCycle: z.string().min(2).optional(),
});

export const prorationRecordFormSchema = z.object({
    billingAccountId: z.string().min(1),
    prorationKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const paymentMethodFormSchema = z.object({
    billingAccountId: z.string().min(1),
    methodKey: z.string().min(2),
    methodType: z.string().min(2).optional(),
});

export const paymentAttemptFormSchema = z.object({
    billingAccountId: z.string().min(1),
    attemptKey: z.string().min(2),
    amountUsd: z.number().optional(),
    paymentStatus: z.string().min(2).optional(),
});

export const refundFormSchema = z.object({
    billingAccountId: z.string().min(1),
    refundKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const walletBalanceFormSchema = z.object({
    billingAccountId: z.string().min(1),
    walletKey: z.string().min(2),
    balanceUsd: z.number().optional(),
});

export const mrrSnapshotFormSchema = z.object({
    billingAccountId: z.string().min(1),
    snapshotKey: z.string().min(2),
    mrrUsd: z.number().optional(),
});

export const arrSnapshotFormSchema = z.object({
    billingAccountId: z.string().min(1),
    snapshotKey: z.string().min(2),
    arrUsd: z.number().optional(),
});

export const deferredRevenueFormSchema = z.object({
    billingAccountId: z.string().min(1),
    recordKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const revenueRecognitionFormSchema = z.object({
    billingAccountId: z.string().min(1),
    recognitionKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const invoiceFormSchema = z.object({
    billingAccountId: z.string().min(1),
    invoiceKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const creditNoteFormSchema = z.object({
    billingAccountId: z.string().min(1),
    noteKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const debitNoteFormSchema = z.object({
    billingAccountId: z.string().min(1),
    noteKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const taxConfigFormSchema = z.object({
    billingAccountId: z.string().min(1),
    configKey: z.string().min(2),
    gstRate: z.number().optional(),
});

export const outstandingBalanceFormSchema = z.object({
    billingAccountId: z.string().min(1),
    balanceKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const paymentReminderFormSchema = z.object({
    billingAccountId: z.string().min(1),
    reminderKey: z.string().min(2),
});

export const collectionCaseFormSchema = z.object({
    billingAccountId: z.string().min(1),
    caseKey: z.string().min(2),
});

export const writeOffFormSchema = z.object({
    billingAccountId: z.string().min(1),
    writeOffKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const analyticsSnapshotFormSchema = z.object({
    billingAccountId: z.string().min(1),
    snapshotKey: z.string().min(2),
});

export const revenueGrowthMetricFormSchema = z.object({
    billingAccountId: z.string().min(1),
    metricsKey: z.string().min(2),
    growthRatePercent: z.number().optional(),
});

export const cashFlowRecordFormSchema = z.object({
    billingAccountId: z.string().min(1),
    recordKey: z.string().min(2),
    amountUsd: z.number().optional(),
});

export const subscriptionTrendFormSchema = z.object({
    billingAccountId: z.string().min(1),
    trendKey: z.string().min(2),
});

export const renewalForecastFormSchema = z.object({
    billingAccountId: z.string().min(1),
    forecastKey: z.string().min(2),
});

export const mrrForecastFormSchema = z.object({
    billingAccountId: z.string().min(1),
    forecastKey: z.string().min(2),
    projectedMrrUsd: z.number().optional(),
});

export const arrForecastFormSchema = z.object({
    billingAccountId: z.string().min(1),
    forecastKey: z.string().min(2),
    projectedArrUsd: z.number().optional(),
});

export const revenueProjectionFormSchema = z.object({
    billingAccountId: z.string().min(1),
    projectionKey: z.string().min(2),
    projectedRevenueUsd: z.number().optional(),
});

export const financeMetricFormSchema = z.object({
    metricsKey: z.string().min(2),
    mrrUsd: z.number().optional(),
    arrUsd: z.number().optional(),
});

export const financialHealthFormSchema = z.object({
    healthKey: z.string().min(2),
    overallScore: z.number().optional(),
});

export const expansionContractionFormSchema = z.object({
    billingAccountId: z.string().min(1),
    recordKey: z.string().min(2),
    expansionUsd: z.number().optional(),
});

export type billingAccountFormValues = z.infer<typeof billingAccountFormSchema>;
export type billingCycleFormValues = z.infer<typeof billingCycleFormSchema>;
export type subscriptionBillingFormValues = z.infer<typeof subscriptionBillingFormSchema>;
export type prorationRecordFormValues = z.infer<typeof prorationRecordFormSchema>;
export type paymentMethodFormValues = z.infer<typeof paymentMethodFormSchema>;
export type paymentAttemptFormValues = z.infer<typeof paymentAttemptFormSchema>;
export type refundFormValues = z.infer<typeof refundFormSchema>;
export type walletBalanceFormValues = z.infer<typeof walletBalanceFormSchema>;
export type mrrSnapshotFormValues = z.infer<typeof mrrSnapshotFormSchema>;
export type arrSnapshotFormValues = z.infer<typeof arrSnapshotFormSchema>;
export type deferredRevenueFormValues = z.infer<typeof deferredRevenueFormSchema>;
export type revenueRecognitionFormValues = z.infer<typeof revenueRecognitionFormSchema>;
export type invoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type creditNoteFormValues = z.infer<typeof creditNoteFormSchema>;
export type debitNoteFormValues = z.infer<typeof debitNoteFormSchema>;
export type taxConfigFormValues = z.infer<typeof taxConfigFormSchema>;
export type outstandingBalanceFormValues = z.infer<typeof outstandingBalanceFormSchema>;
export type paymentReminderFormValues = z.infer<typeof paymentReminderFormSchema>;
export type collectionCaseFormValues = z.infer<typeof collectionCaseFormSchema>;
export type writeOffFormValues = z.infer<typeof writeOffFormSchema>;
export type analyticsSnapshotFormValues = z.infer<typeof analyticsSnapshotFormSchema>;
export type revenueGrowthMetricFormValues = z.infer<typeof revenueGrowthMetricFormSchema>;
export type cashFlowRecordFormValues = z.infer<typeof cashFlowRecordFormSchema>;
export type subscriptionTrendFormValues = z.infer<typeof subscriptionTrendFormSchema>;
export type renewalForecastFormValues = z.infer<typeof renewalForecastFormSchema>;
export type mrrForecastFormValues = z.infer<typeof mrrForecastFormSchema>;
export type arrForecastFormValues = z.infer<typeof arrForecastFormSchema>;
export type revenueProjectionFormValues = z.infer<typeof revenueProjectionFormSchema>;
export type financeMetricFormValues = z.infer<typeof financeMetricFormSchema>;
export type financialHealthFormValues = z.infer<typeof financialHealthFormSchema>;
export type expansionContractionFormValues = z.infer<typeof expansionContractionFormSchema>;
