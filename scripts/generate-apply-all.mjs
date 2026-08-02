import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");
const seedsDir = join(root, "supabase", "seed");

const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const seedFiles = readdirSync(seedsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

const combined = [...migrationFiles, ...seedFiles]
    .map((file) => {
        const dir = file.startsWith("2026") ? migrationsDir : seedsDir;
        return `-- ${file}\n${readFileSync(join(dir, file), "utf8")}`;
    })
    .join("\n\n");

writeFileSync(join(root, "supabase", "apply_all.sql"), combined, "utf8");
console.log("Generated supabase/apply_all.sql");
