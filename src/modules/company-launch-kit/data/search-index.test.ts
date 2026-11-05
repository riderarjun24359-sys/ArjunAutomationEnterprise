import { describe, expect, it } from "vitest";
import { searchContent } from "./search-index";

describe("public website search", () => {
    it("finds pages by title and keyword without case sensitivity", () => {
        const results = searchContent("SCHOOL");
        expect(results.some((result) => result.title === "School ERP")).toBe(true);
    });

    it("matches all words in a query", () => {
        const results = searchContent("AI automation");
        expect(results.length).toBeGreaterThan(0);
        expect(results.every((result) => {
            const haystack = [result.title, result.description, result.category, ...result.keywords].join(" ").toLowerCase();
            return ["ai", "automation"].every((term) => haystack.includes(term));
        })).toBe(true);
    });

    it("returns no results for an empty or unknown query", () => {
        expect(searchContent("")).toEqual([]);
        expect(searchContent("no-such-arjun-page-xyz")).toEqual([]);
    });
});
