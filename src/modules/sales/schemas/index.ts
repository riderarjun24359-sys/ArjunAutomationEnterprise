import { z } from "zod";

export const pipelineFormSchema = z.object({ name: z.string().min(2), code: z.string().min(2), description: z.string() });
export const stageFormSchema = z.object({ pipelineId: z.string().min(1), name: z.string().min(2), sortOrder: z.number().min(0), probability: z.number().min(0).max(100) });
export const leadFormSchema = z.object({ leadName: z.string().min(2), companyName: z.string(), email: z.string().email().or(z.literal("")), phone: z.string(), source: z.string().min(1), assignedTo: z.string().optional() });
export const opportunityFormSchema = z.object({ opportunityNumber: z.string().min(2), name: z.string().min(2), description: z.string(), pipelineId: z.string().optional(), stageId: z.string().optional(), clientId: z.string().optional(), assignedTo: z.string().optional(), amount: z.number().min(0), expectedCloseDate: z.string().optional() });
export const quoteFormSchema = z.object({ quoteNumber: z.string().min(2), opportunityId: z.string().optional(), clientId: z.string().optional(), title: z.string().min(2), totalAmount: z.number().min(0) });
export const forecastFormSchema = z.object({ forecastPeriod: z.string().min(2), pipelineValue: z.number().min(0), weightedValue: z.number().min(0), closedValue: z.number().min(0), notes: z.string() });
export const activityFormSchema = z.object({ opportunityId: z.string().optional(), leadId: z.string().optional(), activityType: z.string().min(1), subject: z.string().min(2), description: z.string(), dueAt: z.string().optional(), assignedTo: z.string().optional() });
export const meetingFormSchema = z.object({ opportunityId: z.string().optional(), leadId: z.string().optional(), title: z.string().min(2), scheduledAt: z.string().min(1), durationMinutes: z.number().min(1), attendeeNames: z.string() });
export const callLogFormSchema = z.object({ opportunityId: z.string().optional(), leadId: z.string().optional(), direction: z.string().min(1), phoneNumber: z.string(), durationSeconds: z.number().min(0), outcome: z.string(), notes: z.string() });
export const emailTrackingFormSchema = z.object({ opportunityId: z.string().optional(), leadId: z.string().optional(), subject: z.string().min(2), recipientEmail: z.string().email() });
export const targetFormSchema = z.object({ employeeId: z.string().min(1), periodLabel: z.string().min(2), targetAmount: z.number().min(0), periodStart: z.string().min(1), periodEnd: z.string().min(1) });

export type PipelineFormValues = z.infer<typeof pipelineFormSchema>;
export type StageFormValues = z.infer<typeof stageFormSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
export type ForecastFormValues = z.infer<typeof forecastFormSchema>;
export type ActivityFormValues = z.infer<typeof activityFormSchema>;
export type MeetingFormValues = z.infer<typeof meetingFormSchema>;
export type CallLogFormValues = z.infer<typeof callLogFormSchema>;
export type EmailTrackingFormValues = z.infer<typeof emailTrackingFormSchema>;
export type TargetFormValues = z.infer<typeof targetFormSchema>;
