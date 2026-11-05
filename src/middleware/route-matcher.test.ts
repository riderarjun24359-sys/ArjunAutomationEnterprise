import { describe, expect, it } from "vitest";
import { matchesAnyRoutePath, matchesRoutePath } from "./route-matcher";

describe("route path matching", () => {
    it("matches the route itself and nested paths", () => {
        expect(matchesRoutePath("/school", "/school")).toBe(true);
        expect(matchesRoutePath("/school/students", "/school")).toBe(true);
    });

    it("does not match a different route with the same prefix", () => {
        expect(matchesRoutePath("/school-erp", "/school")).toBe(false);
        expect(matchesRoutePath("/schooling", "/school")).toBe(false);
    });

    it("checks route lists using path boundaries", () => {
        expect(matchesAnyRoutePath("/school-erp", ["/school", "/hospital"])).toBe(false);
        expect(matchesAnyRoutePath("/school/fees", ["/school", "/hospital"])).toBe(true);
    });
});
