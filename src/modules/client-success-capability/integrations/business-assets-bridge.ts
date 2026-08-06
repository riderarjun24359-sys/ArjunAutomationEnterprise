import { DEFAULT_SERVICES_CATALOG } from "@/src/modules/business-assets/data/services-catalog";
import { getAllDocuments } from "@/src/modules/business-assets/lib/document-library";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";

/** Document paths resolved via shared document library; catalog via static business assets data — no cross-capability service calls. */
export function getBusinessDocumentPaths(): { type: string; title: string; path: string }[] {
    const docs = getAllDocuments();
    lazyMissionCoreClient().invokeSharedService("documentEngine", "listTemplates", []);
    return docs.map((d) => ({
        type: d.type,
        title: d.title,
        path: `/business-assets/documents/${d.id}`,
    }));
}

export function getDefaultBusinessAssetsState() {
    return { servicesCatalog: DEFAULT_SERVICES_CATALOG, documents: getAllDocuments() };
}

export function getServiceCatalogItems() {
    return DEFAULT_SERVICES_CATALOG;
}

export { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
