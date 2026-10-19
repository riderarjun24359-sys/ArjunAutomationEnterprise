import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
    CONSENT_STORAGE_KEY,
    DEFAULT_CONSENT,
    consentSignals,
    readConsent,
    writeConsent,
} from "./consent";

/**
 * Regression tests for the Oct 2026 production crash.
 *
 * `readConsent()` is consumed by `useSyncExternalStore`. When it returned a
 * freshly-parsed object on every call, the first consumer-driven store change
 * (pressing Accept on the cookie banner) cascaded into endless re-renders and
 * took the whole page down (React error #185, "maximum update depth exceeded").
 * These tests lock the referential-stability invariant plus the privacy rules.
 */

/**
 * The vitest jsdom window does not ship localStorage in this Node/vitest
 * combination, and `consent.ts` touches `window.localStorage` directly.
 * Install a minimal spec-compliant storage; keyed `Object` map, string values.
 */
function installMemoryStorage(): void {
    const data = new Map<string, string>();
    const storage: Storage = {
        get length() {
            return data.size;
        },
        clear: () => data.clear(),
        getItem: (k) => (data.has(k) ? data.get(k)! : null),
        key: (i) => Array.from(data.keys())[i] ?? null,
        removeItem: (k) => {
            data.delete(k);
        },
        setItem: (k, v) => {
            data.set(k, String(v));
        },
    };
    Object.defineProperty(window, "localStorage", { value: storage, configurable: true });
}

beforeEach(() => installMemoryStorage());

const granted = JSON.stringify({
    essential: "granted",
    analytics: "granted",
    marketing: "granted",
    decidedAt: "2026-10-19T00:00:00.000Z",
});

const denied = JSON.stringify({
    essential: "denied",
    analytics: "denied",
    marketing: "denied",
    decidedAt: "2026-10-19T00:00:00.000Z",
});

function resetStorage(initial: string | null = null): void {
    window.localStorage.clear();
    if (initial !== null) window.localStorage.setItem(CONSENT_STORAGE_KEY, initial);
}

afterEach(() => resetStorage());

describe("readConsent snapshot stability", () => {
    it("returns the SAME object instance while the stored value is unchanged", () => {
        resetStorage(granted);
        const first = readConsent();
        expect(readConsent()).toBe(first);
        expect(readConsent()).toBe(first);
    });

    it("stays stable for the no-decision case too", () => {
        resetStorage(null);
        expect(readConsent()).toBeNull();
        expect(readConsent()).toBeNull();
        expect(readConsent()).toBeNull();
    });

    it("re-parses only when the stored raw value actually changes", () => {
        resetStorage(granted);
        const grantedSnapshot = readConsent();
        window.localStorage.setItem(CONSENT_STORAGE_KEY, denied);
        const deniedSnapshot = readConsent();
        expect(deniedSnapshot).not.toBe(grantedSnapshot);
        expect(deniedSnapshot?.analytics).toBe("denied");
        expect(readConsent()).toBe(deniedSnapshot);
    });

    it("treats corrupt stored values as no-decision without crashing", () => {
        resetStorage("not json{{{");
        expect(readConsent()).toBeNull();
        expect(readConsent()).toBeNull();
    });
});

describe("writeConsent", () => {
    it("writes all-granted on accept and all-denied on reject", () => {
        resetStorage();
        writeConsent("accept");
        const accepted = readConsent();
        expect(accepted?.analytics).toBe("granted");
        expect(accepted?.marketing).toBe("granted");
        expect(accepted?.essential).toBe("granted");

        writeConsent("reject");
        expect(readConsent()?.analytics).toBe("denied");
    });

    it("maps onto Consent Mode v2 signals", () => {
        expect(consentSignals(DEFAULT_CONSENT).analytics_storage).toBe("denied");
        expect(consentSignals({ ...DEFAULT_CONSENT, analytics: "granted" } as never).analytics_storage).toBe("granted");
        // security_storage must always be granted — it is strictly necessary.
        expect(consentSignals(DEFAULT_CONSENT).security_storage).toBe("granted");
    });
});
