import { validateBusinessDocument } from "../lib/validation";
import { businessAssetsService } from "../services/business-assets.service";
import { getAllDocuments, saveDocument, searchDocuments } from "../lib/document-library";
import type { BusinessDocumentType } from "../types";

export function createBusinessAssetsClient() {
    return {
        getDefaultState: () => businessAssetsService.getDefaultState(),
        validateDocument: (type: BusinessDocumentType, data: unknown) => validateBusinessDocument(type, data),
        getLibrary: () => getAllDocuments(),
        searchLibrary: (query: string) => searchDocuments(query),
        saveToLibrary: saveDocument,
    };
}

export { validateBusinessDocument as validateDocument };

export type BusinessAssetsClient = ReturnType<typeof createBusinessAssetsClient>;
