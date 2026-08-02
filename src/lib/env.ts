import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_APP_NAME: z.string().default("Arjun Automation OS"),
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Next.js only inlines NEXT_PUBLIC_* vars when accessed directly on process.env.
const runtimeEnv = {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
};

const parsed = envSchema.safeParse(runtimeEnv);

export const env = parsed.success ? parsed.data : envSchema.parse({});

export const isServer = typeof window === "undefined";
