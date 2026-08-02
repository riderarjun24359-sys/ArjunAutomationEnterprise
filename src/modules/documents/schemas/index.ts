import { z } from "zod";

export const folderFormSchema = z.object({ name: z.string().min(2), slug: z.string().min(2), description: z.string(), parentFolderId: z.string().optional() });
export const documentFormSchema = z.object({ title: z.string().min(2), fileName: z.string().min(2), fileUrl: z.string().url().or(z.literal("")), mimeType: z.string().min(1), fileSize: z.number().min(0), folderId: z.string().optional(), clientId: z.string().optional(), projectId: z.string().optional() });
export const tagFormSchema = z.object({ name: z.string().min(2), color: z.string().min(4), documentId: z.string().optional() });
export const versionFormSchema = z.object({ documentId: z.string().min(1), versionNumber: z.number().min(1), fileUrl: z.string().url().or(z.literal("")), fileSize: z.number().min(0), changeSummary: z.string() });
export const approvalFormSchema = z.object({ documentId: z.string().min(1), approverId: z.string().optional(), comments: z.string() });
export const esignFormSchema = z.object({ documentId: z.string().min(1), signerName: z.string().min(2), signerEmail: z.string().email() });
export const shareFormSchema = z.object({ documentId: z.string().min(1), shareToken: z.string().min(4), recipientEmail: z.string().email(), permissionLevel: z.string().min(1), expiresAt: z.string().optional() });
export const accessGrantFormSchema = z.object({ documentId: z.string().optional(), folderId: z.string().optional(), granteeType: z.string().min(1), granteeId: z.string().optional(), permissionLevel: z.string().min(1) });
export const templateFormSchema = z.object({ name: z.string().min(2), category: z.string().min(1), description: z.string(), templateContent: z.string().min(10) });
export const retentionPolicyFormSchema = z.object({ name: z.string().min(2), retentionDays: z.number().min(1), actionOnExpiry: z.string().min(1), appliesToCategory: z.string().min(1) });

export type FolderFormValues = z.infer<typeof folderFormSchema>;
export type DocumentFormValues = z.infer<typeof documentFormSchema>;
export type TagFormValues = z.infer<typeof tagFormSchema>;
export type VersionFormValues = z.infer<typeof versionFormSchema>;
export type ApprovalFormValues = z.infer<typeof approvalFormSchema>;
export type EsignFormValues = z.infer<typeof esignFormSchema>;
export type ShareFormValues = z.infer<typeof shareFormSchema>;
export type AccessGrantFormValues = z.infer<typeof accessGrantFormSchema>;
export type TemplateFormValues = z.infer<typeof templateFormSchema>;
export type RetentionPolicyFormValues = z.infer<typeof retentionPolicyFormSchema>;
