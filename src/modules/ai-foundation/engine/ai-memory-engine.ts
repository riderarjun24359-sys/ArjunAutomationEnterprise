import { MEMORY_TYPES } from "../constants";
import type { MemoryRecord } from "../types";

const SEED: MemoryRecord[] = MEMORY_TYPES.map((type, i) => ({
    id: `mem-${type}`,
    type,
    key: `${type}-context`,
    content: `Sample ${type} memory context`,
    scope: "platform",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    ttlDays: type === "conversation" ? 30 : null,
}));

export function getMemories(type?: string): MemoryRecord[] {
    if (type) return SEED.filter((m) => m.type === type);
    return SEED;
}

export function storeMemory(input: { type: MemoryRecord["type"]; key: string; content: string; scope: string }): MemoryRecord {
    return {
        id: `mem-${Date.now()}`,
        type: input.type,
        key: input.key,
        content: input.content,
        scope: input.scope,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function searchMemories(query: string): MemoryRecord[] {
    const q = query.toLowerCase();
    return SEED.filter((m) => m.content.toLowerCase().includes(q) || m.key.toLowerCase().includes(q));
}

