import { buildDefaultCompanyProfile } from "../data/company-profile";
import { DEFAULT_SERVICES_CATALOG } from "../data/services-catalog";
import { DEFAULT_PROPOSAL_TEMPLATE } from "../data/templates/proposal";
import { DEFAULT_NDA_TEMPLATE } from "../data/templates/nda";
import { DEFAULT_CLIENT_AGREEMENT_TEMPLATE } from "../data/templates/client-agreement";
import { DEFAULT_MAINTENANCE_AGREEMENT_TEMPLATE } from "../data/templates/maintenance-agreement";
import type {
    BusinessAssetsState,
    ProposalFormData,
    QuotationFormData,
    InvoiceFormData,
    SowFormData,
    LegalDocumentFormData,
    MaintenanceAgreementFormData,
    LineItem,
} from "../types";

function defaultClient() {
    return { name: "", company: "", email: "", phone: "", address: "" };
}

function defaultLineItem(): LineItem {
    return { id: `li-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 };
}

export function buildDefaultProposal(): ProposalFormData {
    return {
        templateId: "proposal",
        client: defaultClient(),
        reference: `AA-P-${new Date().getFullYear()}-001`,
        validUntil: "",
        executiveSummary: "",
        scope: "",
        deliverables: [""],
        timeline: "",
        commercials: "",
        terms: DEFAULT_PROPOSAL_TEMPLATE.slice(0, 500),
    };
}

export function buildDefaultQuotation(): QuotationFormData {
    return {
        reference: `AA-Q-${new Date().getFullYear()}-001`,
        client: defaultClient(),
        currency: "USD",
        validUntil: "",
        lineItems: [defaultLineItem()],
        discountPercent: 0,
        taxPercent: 18,
        notes: "",
        approvalStatus: "draft",
    };
}

export function buildDefaultInvoice(): InvoiceFormData {
    return {
        invoiceNumber: `AA-INV-${new Date().getFullYear()}-001`,
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: "",
        client: defaultClient(),
        gstin: "",
        lineItems: [defaultLineItem()],
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        paymentTerms: "Net 15 days from invoice date",
        status: "draft",
    };
}

export function buildDefaultSow(): SowFormData {
    return {
        reference: `AA-SOW-${new Date().getFullYear()}-001`,
        client: defaultClient(),
        projectTitle: "",
        scope: "",
        milestones: [
            { id: "m1", name: "Kickoff", week: "1", deliverable: "Project charter signed", acceptanceCriteria: "Charter approved by both parties" },
        ],
        terms: "",
        acceptanceTerms: "Deliverables accepted within 5 business days of submission unless rejection with written reasons.",
    };
}

export function buildDefaultNda(): LegalDocumentFormData {
    return {
        reference: `AA-NDA-${new Date().getFullYear()}-001`,
        counterparty: "",
        effectiveDate: new Date().toISOString().slice(0, 10),
        content: DEFAULT_NDA_TEMPLATE,
    };
}

export function buildDefaultClientAgreement(): LegalDocumentFormData {
    return {
        reference: `AA-MSA-${new Date().getFullYear()}-001`,
        counterparty: "",
        effectiveDate: new Date().toISOString().slice(0, 10),
        content: DEFAULT_CLIENT_AGREEMENT_TEMPLATE,
    };
}

export function buildDefaultMaintenanceAgreement(): MaintenanceAgreementFormData {
    return {
        reference: `AA-SUP-${new Date().getFullYear()}-001`,
        counterparty: "",
        effectiveDate: new Date().toISOString().slice(0, 10),
        content: DEFAULT_MAINTENANCE_AGREEMENT_TEMPLATE,
        slaTier: "Premium",
        responseTime: "4 hours for P1 incidents",
        renewalTerms: "Auto-renewal for 12-month periods with 60 days notice",
        escalationTiers: "Tier 1: Support Desk → Tier 2: Platform Engineering → Tier 3: Core Engineering → Executive",
    };
}

export function buildDefaultState(): BusinessAssetsState {
    return {
        companyProfile: buildDefaultCompanyProfile(),
        servicesCatalog: DEFAULT_SERVICES_CATALOG,
        proposal: buildDefaultProposal(),
        quotation: buildDefaultQuotation(),
        invoice: buildDefaultInvoice(),
        sow: buildDefaultSow(),
        nda: buildDefaultNda(),
        clientAgreement: buildDefaultClientAgreement(),
        maintenanceAgreement: buildDefaultMaintenanceAgreement(),
        library: [],
    };
}

export class BusinessAssetsService {
    getDefaultState(): BusinessAssetsState {
        return buildDefaultState();
    }

    calculateLineItemsTotal(items: LineItem[], discountPercent: number, taxPercent: number) {
        const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const discount = subtotal * (discountPercent / 100);
        const afterDiscount = subtotal - discount;
        const tax = afterDiscount * (taxPercent / 100);
        return { subtotal, discount, tax, total: afterDiscount + tax };
    }

    calculateInvoiceGst(items: LineItem[], cgst: number, sgst: number, igst: number) {
        const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const cgstAmount = subtotal * (cgst / 100);
        const sgstAmount = subtotal * (sgst / 100);
        const igstAmount = subtotal * (igst / 100);
        return { subtotal, cgstAmount, sgstAmount, igstAmount, total: subtotal + cgstAmount + sgstAmount + igstAmount };
    }
}

export const businessAssetsService = new BusinessAssetsService();
