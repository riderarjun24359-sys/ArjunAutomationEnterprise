import { describe, expect, it } from "vitest";
import { withinJarvisCallingWindow } from "./jarvis-calling-window";

describe("withinJarvisCallingWindow (Asia/Kolkata)", () => {
    it("allows Monday through Saturday at 08:00 IST", () => {
        const mondayToSaturday = [
            "2026-11-23T02:30:00.000Z",
            "2026-11-24T02:30:00.000Z",
            "2026-11-25T02:30:00.000Z",
            "2026-11-26T02:30:00.000Z",
            "2026-11-27T02:30:00.000Z",
            "2026-11-28T02:30:00.000Z",
        ];
        for (const instant of mondayToSaturday) {
            expect(withinJarvisCallingWindow(new Date(instant))).toBe(true);
        }
    });

    it("rejects Sunday regardless of the hour", () => {
        expect(withinJarvisCallingWindow(new Date("2026-11-22T02:30:00.000Z"))).toBe(false);
        expect(withinJarvisCallingWindow(new Date("2026-11-22T10:30:00.000Z"))).toBe(false);
    });

    it("enforces the inclusive 08:00 and exclusive 21:00 IST boundaries", () => {
        expect(withinJarvisCallingWindow(new Date("2026-11-23T02:29:00.000Z"))).toBe(false);
        expect(withinJarvisCallingWindow(new Date("2026-11-23T02:30:00.000Z"))).toBe(true);
        expect(withinJarvisCallingWindow(new Date("2026-11-23T15:29:00.000Z"))).toBe(true);
        expect(withinJarvisCallingWindow(new Date("2026-11-23T15:30:00.000Z"))).toBe(false);
    });
});
