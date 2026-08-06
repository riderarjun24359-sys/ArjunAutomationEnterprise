/**
 * Load .env.local / .env into process.env (does not override existing keys).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export function loadEnvFile(root, relativePath) {
    const filePath = join(root, relativePath);
    if (!existsSync(filePath)) return false;

    for (const line of readFileSync(filePath, "utf8").split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator === -1) continue;
        const key = trimmed.slice(0, separator).trim();
        let value = trimmed.slice(separator + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
    return true;
}

export function loadProjectEnv(root = process.cwd()) {
    loadEnvFile(root, ".env.local");
    loadEnvFile(root, ".env");
    loadEnvFile(root, ".env.production.local");
}
