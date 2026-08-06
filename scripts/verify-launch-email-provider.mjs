/**
 * Verify email provider + transactional templates for launch.
 * Checks: welcome (sign-up), verify-email, password-reset, invite-teammate.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createConnection } from "node:net";
import { loadProjectEnv } from "./_load-env.mjs";

const root = process.cwd();
loadProjectEnv(root);

const templates = [
    ["sign-up/welcome", "src/modules/soft-launch/content/emails/welcome.md"],
    ["email-verification", "src/modules/soft-launch/content/emails/verify-email.md"],
    ["password-reset", "src/modules/soft-launch/content/emails/password-reset.md"],
    ["team-invite", "src/modules/soft-launch/content/emails/invite-teammate.md"],
];

const results = [];
function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

const resend = Boolean(process.env.RESEND_API_KEY?.trim());
const smtp =
    Boolean(process.env.SMTP_HOST?.trim()) && Boolean(process.env.SMTP_USER?.trim());
pass("provider:configured", resend || smtp, resend ? "resend" : smtp ? "smtp" : "unset");
pass(
    "provider:from",
    Boolean(process.env.SMTP_FROM?.trim() || process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM?.trim()),
);

for (const [id, file] of templates) {
    const path = join(root, file);
    const present = existsSync(path);
    const body = present ? readFileSync(path, "utf8") : "";
    pass(`template:${id}`, present && body.includes("Subject:"), present ? file : "missing");
}

async function probeSmtp() {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT || 587);
    if (!host) {
        pass("smtp:reachable", resend, resend ? "resend skips smtp probe" : "no SMTP_HOST");
        return;
    }
    await new Promise((resolve) => {
        const socket = createConnection({ host, port, timeout: 8000 }, () => {
            pass("smtp:reachable", true, `${host}:${port}`);
            socket.end();
            resolve();
        });
        socket.on("error", (err) => {
            pass("smtp:reachable", false, err.message.slice(0, 120));
            resolve();
        });
        socket.on("timeout", () => {
            pass("smtp:reachable", false, "timeout");
            socket.destroy();
            resolve();
        });
    });
}

await probeSmtp();

const failed = results.filter((r) => !r.pass);
console.log(`launch-email:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);
