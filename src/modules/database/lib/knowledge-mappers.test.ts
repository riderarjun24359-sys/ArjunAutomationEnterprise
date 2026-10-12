import { describe, it, expect } from "vitest";
import { buildLookupMaps, searchSemanticIndex } from "./knowledge-mappers";
import type { DbKnowledgeEntry, DbKnowledgeSemanticIndex } from "@/src/modules/database/types/platform";

function entry(id: string, title: string): DbKnowledgeEntry {
    return { id, title } as DbKnowledgeEntry;
}

function record(entryId: string, searchText: string): DbKnowledgeSemanticIndex {
    return { id: `idx-${entryId}`, entry_id: entryId, search_text: searchText } as DbKnowledgeSemanticIndex;
}

const maps = () =>
    buildLookupMaps(
        [entry("e1", "Refund Policy"), entry("e2", "Onboarding Guide"), entry("e3", "Archive")],
        [],
        [],
        [],
        [],
        [],
    );

const records = () => [
    record("e1", "customers may request a refund within 30 days of purchase"),
    record("e2", "welcome billing setup billing walkthrough"),
    record("e3", "refund refund legacy notes"),
];

describe("searchSemanticIndex ranking", () => {
    it("returns nothing for empty or too-short queries", () => {
        expect(searchSemanticIndex(records(), [], "", maps())).toEqual([]);
        expect(searchSemanticIndex(records(), [], "   ", maps())).toEqual([]);
        expect(searchSemanticIndex(records(), [], "a", maps())).toEqual([]);
    });

    it("returns nothing when no record matches", () => {
        expect(searchSemanticIndex(records(), [], "zookeeper", maps())).toEqual([]);
    });

    it("ranks title matches above content-only matches", () => {
        const results = searchSemanticIndex(records(), [], "refund", maps());
        expect(results.map((r) => r.entryId)).toEqual(["e1", "e3"]);
        expect(results[0].score).toBeGreaterThan(results[1].score);
    });

    it("rewards term frequency for content-only matches", () => {
        const results = searchSemanticIndex(records(), [], "billing", maps());
        expect(results.map((r) => r.entryId)).toEqual(["e2"]);
        expect(results[0].score).toBe(5);
    });

    it("rewards multi-term coverage and exact phrases", () => {
        const partial = searchSemanticIndex(records(), [], "refund billing", maps());
        expect(partial[0].entryId).toBe("e1");
        expect(partial.map((r) => r.entryId).sort()).toEqual(["e1", "e2", "e3"]);
        const full = searchSemanticIndex(records(), [], "refund policy", maps());
        expect(full[0].entryId).toBe("e1");
        expect(full[0].score).toBe(10);
    });

    it("is case-insensitive and centers the preview on the hit", () => {
        const long = `intro words here `.repeat(20) + "refund buried deep in the text";
        const results = searchSemanticIndex([record("e1", long)], [], "REFUND", maps());
        expect(results).toHaveLength(1);
        expect(results[0].matchPreview).toContain("refund buried deep");
    });

    it("falls back to entry title Unknown for orphan index rows", () => {
        const results = searchSemanticIndex([record("ghost", "refund policy text")], [], "refund", maps());
        expect(results).toHaveLength(1);
        expect(results[0].entryTitle).toBe("Unknown");
    });
});
