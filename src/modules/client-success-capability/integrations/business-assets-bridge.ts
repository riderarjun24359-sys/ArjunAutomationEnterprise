import { businessAssetsService } from "@/src/modules/business-assets/services/business-assets.service";
import { getAllDocuments } from "@/src/modules/business-assets/lib/document-library";

export function getBusinessDocumentPaths(): { type: string; title: string; path: string }[] {
    const docs = getAllDocuments();
    return docs.map((d) => ({
        type: d.type,
        title: d.title,
        path: `/business-assets/documents/${d.id}`,
    }));
}

export function getDefaultBusinessAssetsState() {
    return businessAssetsService.getDefaultState();
}

export function getServiceCatalogItems() {
    return businessAssetsService.getDefaultState().servicesCatalog;
}

export { businessAssetsService };
