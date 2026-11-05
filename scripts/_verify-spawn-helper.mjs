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

    // Preserve nested verifier diagnostics. Without this, callers only see a
    // non-zero status and the CI failure is reported with an empty detail.
    if (result.status !== 0) {
        const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
        process.stderr.write(`\n[verification child failed: ${scriptRel}; status=${result.status ?? "null"}; signal=${result.signal ?? "none"}]\n`);
        if (output) process.stderr.write(`${output.slice(-12_000)}\n`);
        if (result.error) process.stderr.write(`[spawn error] ${result.error.message}\n`);
    }

    return result;
}
