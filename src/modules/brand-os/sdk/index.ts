import { readFileSync, existsSync } from "node:fs";
import {
    BRAND_ASSET_FOLDERS,
    BRAND_DOCUMENTS,
    checkDocumentCompleteness,
    getAllDocuments,
} from "@/src/modules/brand-os/lib/documents";
import { verifyBrandBookCompleteness } from "@/src/modules/brand-os/lib/completeness";
import { resolveBrandOsContentPath } from "@/src/modules/brand-os/lib/content-path";
import type { BrandOsCompletenessReport, BrandOsDocumentSummary } from "@/src/modules/brand-os/types";

export class BrandOsClient {
    getDocuments(): BrandOsDocumentSummary[] {
        return getAllDocuments().map((doc) => ({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            description: doc.description,
            pdfReady: doc.pdfReady,
            path: doc.path,
        }));
    }

    readDocumentContent(documentId: string): string | null {
        const doc = BRAND_DOCUMENTS[documentId];
        if (!doc) return null;
        const fullPath = resolveBrandOsContentPath(doc.path);
        if (!existsSync(fullPath)) return null;
        return readFileSync(fullPath, "utf8");
    }

    verifyBrandBookCompleteness(): ReturnType<typeof verifyBrandBookCompleteness> {
        const content = this.readDocumentContent("brand-book") ?? "";
        return verifyBrandBookCompleteness(content);
    }

    getCompletenessReport(): BrandOsCompletenessReport {
        const brandBook = this.verifyBrandBookCompleteness();
        const documents = getAllDocuments().map((doc) => {
            const content = this.readDocumentContent(doc.id) ?? "";
            const result = checkDocumentCompleteness(content, doc);
            return {
                id: doc.id,
                title: doc.title,
                complete: result.complete,
                missing: result.missing,
            };
        });

        return {
            brandBook: {
                complete: brandBook.complete,
                totalRequired: brandBook.totalRequired,
                totalPresent: brandBook.totalPresent,
                missing: brandBook.missing,
            },
            documents,
            assetFolders: [...BRAND_ASSET_FOLDERS],
        };
    }
}

export function createBrandOsClient(): BrandOsClient {
    return new BrandOsClient();
}
