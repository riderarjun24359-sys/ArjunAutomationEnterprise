import { KNOWLEDGE_NODE_TYPES } from "../constants";
import type { KnowledgeNode } from "../types";

const NODES: KnowledgeNode[] = KNOWLEDGE_NODE_TYPES.map((type, i) => ({
    id: `node-${type}`,
    type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    metadata: { index: i },
}));

const EDGES = [
    { id: "edge-1", sourceId: "node-customer", targetId: "node-project", relationship: "owns", weight: 1 },
    { id: "edge-2", sourceId: "node-project", targetId: "node-capability", relationship: "uses", weight: 0.9 },
    { id: "edge-3", sourceId: "node-aiAgent", targetId: "node-workflow", relationship: "executes", weight: 0.85 },
    { id: "edge-4", sourceId: "node-missionCore", targetId: "node-capability", relationship: "orchestrates", weight: 1 },
    { id: "edge-5", sourceId: "node-document", targetId: "node-businessAsset", relationship: "references", weight: 0.7 },
];

export function getKnowledgeNodes(type?: string) {
    if (type) return NODES.filter((n) => n.type === type);
    return NODES;
}

export function getKnowledgeEdges(nodeId?: string) {
    if (!nodeId) return EDGES;
    return EDGES.filter((e) => e.sourceId === nodeId || e.targetId === nodeId);
}

export function getRelatedNodes(nodeId: string): KnowledgeNode[] {
    const relatedIds = new Set(
        EDGES.filter((e) => e.sourceId === nodeId || e.targetId === nodeId)
            .flatMap((e) => [e.sourceId, e.targetId])
            .filter((id) => id !== nodeId),
    );
    return NODES.filter((n) => relatedIds.has(n.id));
}

