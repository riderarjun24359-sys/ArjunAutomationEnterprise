function envString(key: string): string | null {
    const raw = process.env[key]?.trim();
    return raw ? raw : null;
}

function toE164(input: string | null): string | null {
    if (!input) return null;
    const digits = input.replace(/[^\d+]/g, "");
    return /^\+\d{8,15}$/.test(digits) ? digits : null;
}

export interface CompanyAddress {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    countryCode: string;
}

const DEFAULT_PHONE = "+91 73370 27357";
const rawPhone = envString("NEXT_PUBLIC_COMPANY_PHONE") ?? DEFAULT_PHONE;
const phoneE164 = toE164(rawPhone);

export const COMPANY_PROFILE = {
    legalName: "Arjun Automation Enterprises",
    tradingName: "Arjun Automation",
    tagline: "Custom software, AI automation and business systems.",
    emails: {
        sales: envString("NEXT_PUBLIC_COMPANY_EMAIL") ?? "sales@arjunautomations.com",
        success: "",
        support: "",
        careers: "",
    },
    phoneDisplay: "+91 73370 27357",
    phoneE164: "+917337027357",
    whatsappNumber: "917337027357",
    address: {
        street: "",
        city: "",
        region: "",
        postalCode: "",
        country: "India",
        countryCode: "IN",
    } as CompanyAddress,
    gstin: null,
    cin: null,
    officeHours: "",
    responseSla: "",
    social: {
        linkedin: envString("NEXT_PUBLIC_SOCIAL_LINKEDIN"),
        github: envString("NEXT_PUBLIC_SOCIAL_GITHUB"),
        x: envString("NEXT_PUBLIC_SOCIAL_X"),
        youtube: envString("NEXT_PUBLIC_SOCIAL_YOUTUBE"),
    },
} as const;

export const HAS_PHONE = true;
export const HAS_ADDRESS = false;
export const HAS_FULL_ADDRESS = false;

export function formatAddress(): string | null {
    return null;
}

export function schemaAddress(): Record<string, string> | null {
    return null;
}

export function schemaSameAs(): string[] {
    return Object.values(COMPANY_PROFILE.social).filter((value): value is string => Boolean(value));
}

export function whatsappLink(message: string): string {
    return `https://wa.me/917337027357?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
    "Hi, I found Arjun Automation Enterprises online. I would like to know more about your services.";
