import {
    proposalFormSchema,
    quotationFormSchema,
    invoiceFormSchema,
    sowFormSchema,
    legalDocumentSchema,
    maintenanceAgreementSchema,
    companyProfileSchema,
} from "../schemas";
import type { BusinessDocumentType } from "../types";

export function validateBusinessDocument(type: BusinessDocumentType, data: unknown) {
    switch (type) {
        case "proposal":
            return proposalFormSchema.safeParse(data);
        case "quotation":
            return quotationFormSchema.safeParse(data);
        case "invoice":
            return invoiceFormSchema.safeParse(data);
        case "sow":
            return sowFormSchema.safeParse(data);
        case "nda":
        case "client-agreement":
            return legalDocumentSchema.safeParse(data);
        case "maintenance-agreement":
            return maintenanceAgreementSchema.safeParse(data);
        case "company-profile":
            return companyProfileSchema.safeParse(data);
        default:
            return { success: true as const, data };
    }
}
