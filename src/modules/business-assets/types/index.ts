export type BusinessDocumentType =
    | "company-profile"
    | "service-catalog"
    | "proposal"
    | "quotation"
    | "invoice"
    | "sow"
    | "nda"
    | "client-agreement"
    | "maintenance-agreement";

export type DocumentCategory = "profile" | "sales" | "legal" | "finance" | "catalog";

export interface CompanyProfileSection {
    id: string;
    title: string;
    content: string;
}

export interface CompanyProfile {
    sections: CompanyProfileSection[];
    updatedAt: string;
}

export interface ServiceCatalogItem {
    id: string;
    name: string;
    slug: string;
    overview: string;
    benefits: string[];
    deliverables: string[];
    timeline: string;
    pricingPlaceholder: string;
    industries: string[];
    technology: string[];
    faq: { question: string; answer: string }[];
}

export interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
}

export interface ClientInfo {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
}

export interface ProposalFormData {
    templateId: string;
    client: ClientInfo;
    reference: string;
    validUntil: string;
    executiveSummary: string;
    scope: string;
    deliverables: string[];
    timeline: string;
    commercials: string;
    terms: string;
    signatureDataUrl?: string;
}

export interface QuotationFormData {
    reference: string;
    client: ClientInfo;
    currency: string;
    validUntil: string;
    lineItems: LineItem[];
    discountPercent: number;
    taxPercent: number;
    notes: string;
    approvalStatus: "draft" | "pending" | "approved" | "rejected";
    signatureDataUrl?: string;
}

export interface InvoiceFormData {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    client: ClientInfo;
    gstin: string;
    lineItems: LineItem[];
    cgstPercent: number;
    sgstPercent: number;
    igstPercent: number;
    paymentTerms: string;
    status: "draft" | "sent" | "paid";
    signatureDataUrl?: string;
}

export interface SowMilestone {
    id: string;
    name: string;
    week: string;
    deliverable: string;
    acceptanceCriteria: string;
}

export interface SowFormData {
    reference: string;
    client: ClientInfo;
    projectTitle: string;
    scope: string;
    milestones: SowMilestone[];
    terms: string;
    acceptanceTerms: string;
    signatureDataUrl?: string;
}

export interface LegalDocumentFormData {
    reference: string;
    counterparty: string;
    effectiveDate: string;
    content: string;
    signatureDataUrl?: string;
}

export interface MaintenanceAgreementFormData extends LegalDocumentFormData {
    slaTier: string;
    responseTime: string;
    renewalTerms: string;
    escalationTiers: string;
}

export interface StoredDocument {
    id: string;
    type: BusinessDocumentType;
    title: string;
    category: DocumentCategory;
    content: string;
    html?: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    versions: DocumentVersion[];
}

export interface DocumentVersion {
    version: number;
    content: string;
    savedAt: string;
}

export interface BusinessAssetsState {
    companyProfile: CompanyProfile;
    servicesCatalog: ServiceCatalogItem[];
    proposal: ProposalFormData;
    quotation: QuotationFormData;
    invoice: InvoiceFormData;
    sow: SowFormData;
    nda: LegalDocumentFormData;
    clientAgreement: LegalDocumentFormData;
    maintenanceAgreement: MaintenanceAgreementFormData;
    library: StoredDocument[];
}
