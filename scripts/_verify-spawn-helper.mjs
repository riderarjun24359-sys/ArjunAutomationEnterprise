/**
 * Reliable spawn helpers for verification scripts (avoids npx hangs on Windows).
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";

export function runTsc(root) {
    if (process.env.SKIP_TSC === "1") return { status: 0, skipped: true, stdout: "", stderr: "" };
    const tscBin = join(root, "node_modules", "typescript", "bin", "tsc");
    return spawnSync(process.execPath, [tscBin, "--noEmit"], {
        cwd: root,
        encoding: "utf8",
        timeout: 600_000,
    });
}

export function runLint(root) {
    if (process.env.SKIP_LINT === "1") return { status: 0, skipped: true, stdout: "", stderr: "" };
    const eslintBin = join(root, "node_modules", "eslint", "bin", "eslint.js");
    return spawnSync(process.execPath, [eslintBin, "src", "app"], {
        cwd: root,
        encoding: "utf8",
        timeout: 900_000,
    });
}

export function spawnVerify(root, scriptRel) {
    const result = spawnSync(process.execPath, [join(root, scriptRel)], {
        cwd: root,
        encoding: "utf8",
        timeout: 600_000,
        env: process.env,
    });

    if (result.status !== 0) {
        console.error(`\n[verify-chain] ${scriptRel} failed (exit ${result.status ?? "unknown"}).`);
        const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
        if (output) console.error(output.slice(-7000));
    }

    return result;
}
