import type { BusinessDocumentType, DocumentCategory } from "../types";

export const BUSINESS_ASSETS_TABS = {
    companyProfile: "company-profile",
    serviceCatalog: "service-catalog",
    proposal: "proposal",
    quotation: "quotation",
    invoice: "invoice",
    sow: "sow",
    nda: "nda",
    clientAgreement: "client-agreement",
    maintenanceAgreement: "maintenance-agreement",
    documentLibrary: "document-library",
} as const;

export const BUSINESS_ASSETS_TAB_LIST = [
    { id: BUSINESS_ASSETS_TABS.companyProfile, label: "Company Profile" },
    { id: BUSINESS_ASSETS_TABS.serviceCatalog, label: "Service Catalog" },
    { id: BUSINESS_ASSETS_TABS.proposal, label: "Proposal Generator" },
    { id: BUSINESS_ASSETS_TABS.quotation, label: "Quotation Generator" },
    { id: BUSINESS_ASSETS_TABS.invoice, label: "Invoice Generator" },
    { id: BUSINESS_ASSETS_TABS.sow, label: "SOW Generator" },
    { id: BUSINESS_ASSETS_TABS.nda, label: "NDA Generator" },
    { id: BUSINESS_ASSETS_TABS.clientAgreement, label: "Client Agreement" },
    { id: BUSINESS_ASSETS_TABS.maintenanceAgreement, label: "Maintenance Agreement" },
    { id: BUSINESS_ASSETS_TABS.documentLibrary, label: "Document Library" },
] as const;

export const BUSINESS_ASSETS_THEME = {
    accent: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/60",
    surface: "bg-emerald-50/50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
} as const;

export const COMPANY_PROFILE_SECTION_IDS = [
    "company-overview",
    "mission",
    "vision",
    "core-values",
    "founder-message",
    "why-us",
    "industries",
    "services",
    "technology-stack",
    "methodology",
    "delivery-process",
    "support-model",
    "contact-information",
] as const;

export const DOCUMENT_TYPE_CATEGORIES: Record<BusinessDocumentType, DocumentCategory> = {
    "company-profile": "profile",
    "service-catalog": "catalog",
    proposal: "sales",
    quotation: "sales",
    invoice: "finance",
    sow: "sales",
    nda: "legal",
    "client-agreement": "legal",
    "maintenance-agreement": "legal",
};

export const STORAGE_KEY = "arjun-business-assets-v1";
