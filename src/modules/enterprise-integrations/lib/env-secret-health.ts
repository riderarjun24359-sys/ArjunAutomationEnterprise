/**
 * Environment secret presence checks — never expose secret values.
 */
import { EI_ENV_SECRET_KEYS, type EiEnvSecretKey } from "../constants";

export interface EnvSecretHealthRow {
    key: EiEnvSecretKey;
    configured: boolean;
    category: "ai" | "payment" | "email" | "platform";
}

function categoryFor(key: EiEnvSecretKey): EnvSecretHealthRow["category"] {
    if (key.startsWith("OPENAI")) return "ai";
    if (key.startsWith("STRIPE") || key.startsWith("RAZORPAY")) return "payment";
    if (key.startsWith("SMTP")) return "email";
    return "platform";
}

export function readEnvSecretHealth(): EnvSecretHealthRow[] {
    return EI_ENV_SECRET_KEYS.map((key) => {
        const raw = process.env[key];
        return {
            key,
            configured: typeof raw === "string" && raw.trim().length > 0,
            category: categoryFor(key),
        };
    });
}
