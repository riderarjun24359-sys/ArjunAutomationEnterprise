import { describe, it, expect } from "vitest";
import { isTaskTransitionAllowed } from "./task-transitions";

describe("isTaskTransitionAllowed", () => {
    it("allows the delivery lifecycle path", () => {
        expect(isTaskTransitionAllowed("todo", "in_progress")).toBe(true);
        expect(isTaskTransitionAllowed("in_progress", "review")).toBe(true);
        expect(isTaskTransitionAllowed("review", "done")).toBe(true);
        expect(isTaskTransitionAllowed("review", "in_progress")).toBe(true);
        expect(isTaskTransitionAllowed("blocked", "todo")).toBe(true);
        expect(isTaskTransitionAllowed("todo", "todo")).toBe(true);
    });

    it("blocks skips and exits from terminal states", () => {
        expect(isTaskTransitionAllowed("todo", "done")).toBe(false);
        expect(isTaskTransitionAllowed("todo", "review")).toBe(false);
        expect(isTaskTransitionAllowed("done", "todo")).toBe(false);
        expect(isTaskTransitionAllowed("cancelled", "in_progress")).toBe(false);
        expect(isTaskTransitionAllowed("bogus", "done")).toBe(false);
    });
});
