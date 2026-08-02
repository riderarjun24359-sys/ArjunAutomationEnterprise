/**
 * Sprint 8 local verification (no browser).
 * Run: node scripts/verify-sprint8.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
    "app/tasks/page.tsx",
    "src/modules/tasks/index.ts",
    "src/modules/tasks/components/TasksPage.tsx",
    "src/modules/tasks/hooks/useTasks.ts",
    "src/modules/tasks/services/task.service.ts",
    "app/auth/callback/route.ts",
    "src/lib/supabase-config.ts",
    "src/lib/supabase-middleware.ts",
];

const results = [];

for (const file of requiredFiles) {
    results.push({ check: `file:${file}`, pass: existsSync(join(root, file)) });
}

const envLocal = join(root, ".env.local");
if (existsSync(envLocal)) {
    const content = readFileSync(envLocal, "utf8");
    results.push({ check: "env:NEXT_PUBLIC_SUPABASE_URL", pass: /NEXT_PUBLIC_SUPABASE_URL=\S+/.test(content) });
    results.push({ check: "env:NEXT_PUBLIC_SUPABASE_ANON_KEY", pass: /NEXT_PUBLIC_SUPABASE_ANON_KEY=\S+/.test(content) });
} else {
    results.push({ check: "env:.env.local exists", pass: false });
}

const authService = readFileSync(join(root, "src/services/auth.service.ts"), "utf8");
results.push({ check: "auth:signInWithPassword", pass: authService.includes("signInWithPassword") });
results.push({ check: "auth:no magic link signIn", pass: !authService.includes("signInWithOtp") });

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
results.push({ check: "middleware:protects /tasks", pass: middleware.includes("ROUTES.tasks") });
results.push({ check: "middleware:supabase getUser", pass: middleware.includes("supabase.auth.getUser") });

const authStatus = readFileSync(join(root, "src/modules/auth/components/AuthStatus.tsx"), "utf8");
results.push({ check: "logout:signOut handler", pass: authStatus.includes("authService.signOut") && authStatus.includes("clearAuth") });

const authProvider = readFileSync(join(root, "src/modules/auth/components/AuthProvider.tsx"), "utf8");
results.push({ check: "session:onAuthStateChange", pass: authProvider.includes("onAuthStateChange") });

let httpPass = false;
try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch("http://127.0.0.1:3000/tasks", { redirect: "manual", signal: controller.signal });
    clearTimeout(timeout);
    const location = response.headers.get("location") ?? "";
    httpPass = (response.status === 307 || response.status === 308 || response.status === 302) && location.includes("/auth/sign-in");
    results.push({ check: "http:/tasks redirects unauthenticated", pass: httpPass, detail: `status=${response.status} location=${location}` });
} catch (error) {
    results.push({ check: "http:/tasks redirects unauthenticated", pass: false, detail: String(error) });
}

const failed = results.filter((item) => !item.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

if (failed.length > 0) {
    process.exit(1);
}

console.log("\nAll Sprint 8 local verification checks passed.");
