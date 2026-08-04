export type BrandDocumentCategory = "foundation" | "services" | "sales-kit";

export interface BrandDocument {
    id: string;
    title: string;
    category: BrandDocumentCategory;
    description: string;
    path: string;
    pdfReady: boolean;
    requiredSections?: string[];
    serviceFields?: string[];
}

export type BrandDocumentRegistry = Record<string, BrandDocument>;

export interface BrandOsTab {
    id: string;
    label: string;
    category?: BrandDocumentCategory;
}

export interface BrandOsDocumentSummary {
    id: string;
    title: string;
    category: BrandDocumentCategory;
    description: string;
    pdfReady: boolean;
    path: string;
}

export interface BrandOsCompletenessReport {
    brandBook: {
        complete: boolean;
        totalRequired: number;
        totalPresent: number;
        missing: string[];
    };
    documents: {
        id: string;
        title: string;
        complete: boolean;
        missing: string[];
    }[];
    assetFolders: string[];
}
