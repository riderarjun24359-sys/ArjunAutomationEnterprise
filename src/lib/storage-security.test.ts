import { describe, expect, it } from "vitest";
import { validateFileContent } from "./storage-security";

describe("validateFileContent", () => {
    it("accepts matching PNG, JPEG, GIF, WebP and PDF signatures", () => {
        expect(validateFileContent("image/png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
        expect(validateFileContent("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff, 0x00]))).toBe(true);
        expect(validateFileContent("image/gif", new TextEncoder().encode("GIF89a"))).toBe(true);
        expect(validateFileContent("image/webp", new TextEncoder().encode("RIFF0000WEBP"))).toBe(true);
        expect(validateFileContent("application/pdf", new TextEncoder().encode("%PDF-1.7"))).toBe(true);
    });

    it("accepts ZIP signatures for Office Open XML documents", () => {
        const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00]);
        expect(validateFileContent("application/vnd.openxmlformats-officedocument.wordprocessingml.document", bytes)).toBe(true);
        expect(validateFileContent("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes)).toBe(true);
    });

    it("accepts UTF-8 text and CSV without NUL bytes", () => {
        expect(validateFileContent("text/plain", new TextEncoder().encode("hello world"))).toBe(true);
        expect(validateFileContent("text/csv", new TextEncoder().encode("name,amount\nArjun,100"))).toBe(true);
    });

    it("rejects mismatched signatures, invalid UTF-8, NUL bytes and empty content", () => {
        expect(validateFileContent("image/png", new TextEncoder().encode("not a PNG"))).toBe(false);
        expect(validateFileContent("text/plain", new Uint8Array([0xff, 0xfe]))).toBe(false);
        expect(validateFileContent("text/plain", new Uint8Array([0x61, 0x00, 0x62]))).toBe(false);
        expect(validateFileContent("application/pdf", new Uint8Array())).toBe(false);
    });
});
