import type { BusinessDocumentType, DocumentCategory, StoredDocument, DocumentVersion } from "../types";
import { DOCUMENT_TYPE_CATEGORIES } from "../constants";

const LIBRARY_KEY = "arjun-business-assets-library";

function readLibrary(): StoredDocument[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(LIBRARY_KEY);
        return raw ? (JSON.parse(raw) as StoredDocument[]) : [];
    } catch {
        return [];
    }
}

function writeLibrary(docs: StoredDocument[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(docs));
}

export function getAllDocuments(): StoredDocument[] {
    return readLibrary();
}

export function getDocumentsByCategory(category: DocumentCategory): StoredDocument[] {
    return readLibrary().filter((d) => d.category === category);
}

export function searchDocuments(query: string): StoredDocument[] {
    const q = query.toLowerCase();
    return readLibrary().filter(
        (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.type.includes(q),
    );
}

export function saveDocument(input: {
    id?: string;
    type: BusinessDocumentType;
    title: string;
    content: string;
    html?: string;
}): StoredDocument {
    const docs = readLibrary();
    const now = new Date().toISOString();
    const category = DOCUMENT_TYPE_CATEGORIES[input.type];

    if (input.id) {
        const idx = docs.findIndex((d) => d.id === input.id);
        if (idx >= 0) {
            const existing = docs[idx];
            const version: DocumentVersion = {
                version: existing.version,
                content: existing.content,
                savedAt: existing.updatedAt,
            };
            const updated: StoredDocument = {
                ...existing,
                title: input.title,
                content: input.content,
                html: input.html,
                updatedAt: now,
                version: existing.version + 1,
                versions: [...existing.versions, version],
            };
            docs[idx] = updated;
            writeLibrary(docs);
            return updated;
        }
    }

    const doc: StoredDocument = {
        id: input.id ?? `doc-${Date.now()}`,
        type: input.type,
        title: input.title,
        category,
        content: input.content,
        html: input.html,
        createdAt: now,
        updatedAt: now,
        version: 1,
        versions: [],
    };
    docs.unshift(doc);
    writeLibrary(docs);
    return doc;
}

export function deleteDocument(id: string): void {
    writeLibrary(readLibrary().filter((d) => d.id !== id));
}

export function getDocumentById(id: string): StoredDocument | undefined {
    return readLibrary().find((d) => d.id === id);
}
