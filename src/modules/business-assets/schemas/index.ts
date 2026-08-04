import { z } from "zod";

export const clientInfoSchema = z.object({
    name: z.string().min(1, "Contact name required"),
    company: z.string().min(1, "Company name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(1, "Phone required"),
    address: z.string().min(1, "Address required"),
});

export const lineItemSchema = z.object({
    id: z.string(),
    description: z.string().min(1),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    taxRate: z.number().min(0).max(100).optional(),
});

export const proposalFormSchema = z.object({
    templateId: z.string(),
    client: clientInfoSchema,
    reference: z.string().min(1),
    validUntil: z.string().min(1),
    executiveSummary: z.string().min(10),
    scope: z.string().min(10),
    deliverables: z.array(z.string()),
    timeline: z.string().min(1),
    commercials: z.string().min(1),
    terms: z.string().min(1),
    signatureDataUrl: z.string().optional(),
});

export const quotationFormSchema = z.object({
    reference: z.string().min(1),
    client: clientInfoSchema,
    currency: z.string().min(1),
    validUntil: z.string().min(1),
    lineItems: z.array(lineItemSchema).min(1),
    discountPercent: z.number().min(0).max(100),
    taxPercent: z.number().min(0).max(100),
    notes: z.string(),
    approvalStatus: z.enum(["draft", "pending", "approved", "rejected"]),
    signatureDataUrl: z.string().optional(),
});

export const invoiceFormSchema = z.object({
    invoiceNumber: z.string().min(1),
    invoiceDate: z.string().min(1),
    dueDate: z.string().min(1),
    client: clientInfoSchema,
    gstin: z.string(),
    lineItems: z.array(lineItemSchema).min(1),
    cgstPercent: z.number().min(0).max(100),
    sgstPercent: z.number().min(0).max(100),
    igstPercent: z.number().min(0).max(100),
    paymentTerms: z.string().min(1),
    status: z.enum(["draft", "sent", "paid"]),
    signatureDataUrl: z.string().optional(),
});

export const sowMilestoneSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    week: z.string().min(1),
    deliverable: z.string().min(1),
    acceptanceCriteria: z.string().min(1),
});

export const sowFormSchema = z.object({
    reference: z.string().min(1),
    client: clientInfoSchema,
    projectTitle: z.string().min(1),
    scope: z.string().min(10),
    milestones: z.array(sowMilestoneSchema).min(1),
    terms: z.string().min(1),
    acceptanceTerms: z.string().min(1),
    signatureDataUrl: z.string().optional(),
});

export const legalDocumentSchema = z.object({
    reference: z.string().min(1),
    counterparty: z.string().min(1),
    effectiveDate: z.string().min(1),
    content: z.string().min(10),
    signatureDataUrl: z.string().optional(),
});

export const maintenanceAgreementSchema = legalDocumentSchema.extend({
    slaTier: z.string().min(1),
    responseTime: z.string().min(1),
    renewalTerms: z.string().min(1),
    escalationTiers: z.string().min(1),
});

export const companyProfileSectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
});

export const companyProfileSchema = z.object({
    sections: z.array(companyProfileSectionSchema).min(13),
    updatedAt: z.string(),
});
