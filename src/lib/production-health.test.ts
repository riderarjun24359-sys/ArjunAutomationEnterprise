import { describe, it, expect } from "vitest";
import {
    buildProductionHealthReport,
    formatUptime,
    derivePlatformHealthScore,
    deriveSecurityScore,
} from "./production-health";

function backupCheck(report: ReturnType<typeof buildProductionHealthReport>) {
    const check = report.checks.find((c) => c.name === "Backup verification");
    if (!check) throw new Error("backup check missing");
    return check;
}

describe("formatUptime", () => {
    it("renders days/hours/minutes from a live counter", () => {
        expect(formatUptime(0)).toBe("process uptime 0d 0h 0m");
        expect(formatUptime(90)).toBe("process uptime 0d 0h 1m");
        expect(formatUptime(3661)).toBe("process uptime 0d 1h 1m");
        expect(formatUptime(90061)).toBe("process uptime 1d 1h 1m");
        expect(formatUptime(-5)).toBe("process uptime 0d 0h 0m");
    });
});

describe("buildProductionHealthReport backup honesty", () => {
    it("does not report a fabricated 99.9% uptime", () => {
        const report = buildProductionHealthReport();
        expect(report.uptime).toMatch(/^process uptime \d+d \d+h \d+m$/);
        expect(report.uptime).not.toBe("99.9%");
    });

    it("never claims a backup pass a caller did not request", () => {
        // No-argument callers performed no backup check: report unverified, not pass.
        expect(backupCheck(buildProductionHealthReport()).status).toBe("warn");
        // An explicit positive verification is still honored.
        expect(backupCheck(buildProductionHealthReport({ backupVerified: true })).status).toBe("pass");
    });

    it("treats backupVerified=false as a real failure", () => {
        const report = buildProductionHealthReport({ backupVerified: false });
        expect(backupCheck(report).status).toBe("fail");
        expect(report.status).toBe("critical");
    });

    it("reports an unverified backup as a warning, never a pass", () => {
        const report = buildProductionHealthReport({
            backupStatus: "unverified",
            backupDetail: "requires an authenticated organization context",
        });
        const check = backupCheck(report);
        expect(check.status).toBe("warn");
        expect(check.detail).toBe("requires an authenticated organization context");
    });

    it("lets an explicit backupStatus override a stale boolean", () => {
        const report = buildProductionHealthReport({ backupVerified: true, backupStatus: "unverified" });
        expect(backupCheck(report).status).toBe("warn");
    });
});

describe("derivePlatformHealthScore", () => {
    it("is 100 when every live signal is healthy", () => {
        expect(derivePlatformHealthScore({ supabaseOk: true, openErrors: 0, openBreakers: 0, criticalAlerts: 0 })).toBe(100);
    });

    it("penalizes an unconfigured database dependency", () => {
        expect(derivePlatformHealthScore({ supabaseOk: false, openErrors: 0, openBreakers: 0, criticalAlerts: 0 })).toBe(60);
    });

    it("caps the open-error penalty and never goes below zero", () => {
        expect(derivePlatformHealthScore({ supabaseOk: false, openErrors: 999, openBreakers: 999, criticalAlerts: 999 })).toBe(0);
    });

    it("deducts open breakers and unacknowledged critical alerts", () => {
        expect(derivePlatformHealthScore({ supabaseOk: true, openErrors: 1, openBreakers: 2, criticalAlerts: 1 })).toBe(73);
    });
});

describe("deriveSecurityScore", () => {
    it("returns 0 when the validator reports no security checks", () => {
        expect(deriveSecurityScore([])).toBe(0);
        expect(deriveSecurityScore([{ category: "database", status: "pass" }])).toBe(0);
    });

    it("derives a percentage from passing security checks only", () => {
        expect(
            deriveSecurityScore([
                { category: "security", status: "pass" },
                { category: "security", status: "pass" },
                { category: "security", status: "fail" },
                { category: "database", status: "fail" }, // ignored: not a security check
            ]),
        ).toBe(67);
    });

    it("is 100 when all security checks pass", () => {
        expect(deriveSecurityScore([{ category: "security", status: "pass" }])).toBe(100);
    });
});
