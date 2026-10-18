/**
 * Central business identity + contact record.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Contact details were previously hardcoded as bare email strings across the
 * header, footer, contact page, structured data and legal pages — which meant
 * there was no phone number, no registered address and no GSTIN anywhere on the
 * site, and no single place to change any of it.
 *
 * HOW TO USE
 * ----------
 * Fill in the real values below (or set the matching environment variables in
 * `.env.local`). Everything else in the codebase reads from here:
 *
 *   - header / footer / contact page render the phone + address
 *   - the WhatsApp float button only mounts once `phoneE164` is a real number
 *   - Organization JSON-LD emits `telephone` / `address` / `sameAs`
 *   - footer prints the legal entity + GSTIN
 *
 * FIELDS LEFT AS `null` ARE DELIBERATELY NOT RENDERED. We never invent a
 * GSTIN, phone number or registered address — a fabricated tax identifier is a
 * legal problem, and a wrong number on a live site costs real enquiries.
 * Fill these in and the corresponding UI appears automatically.
 */

function envString(key: string): string | null {
    const raw = process.env[key]?.trim();
    return raw ? raw : null;
}

/** Strips spaces/dashes and keeps a leading `+`, e.g. "+91 98765 43210" -> "+919876543210". */
function toE164(input: string | null): string | null {
    if (!input) return null;
    const digits = input.replace(/[^\d+]/g, "");
    if (!/^\+\d{8,15}$/.test(digits)) return null;
    return digits;
}

export interface CompanyAddress {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    countryCode: string;
}

/**
 * Phone and city are committed here rather than left to `.env.local` on
 * purpose: `.env*` is gitignored, so values set only there would be missing
 * from every build that does not happen to have the file — including Vercel.
 * A business's public phone number and city are not secrets; they belong in
 * version control so they ship with the code. Environment variables still win
 * if you need to override them per-environment.
 */
const DEFAULT_PHONE = "+91 73370 27357";

const rawPhone =
    envString("NEXT_PUBLIC_COMPANY_PHONE") ?? envString("NEXT_PUBLIC_CONTACT_PHONE") ?? DEFAULT_PHONE;

export const COMPANY_PROFILE = {
    /**
     * Legal entity name — must match your registration documents exactly, since
     * it appears on the Terms page as the contracting party and in schema.org.
     *
     * `ArjunAutomations` is written as one word. `tradingName` below stays
     * "Arjun Automation" because that is the spaced form used in headings and
     * logo lockups; the two are intentionally different.
     */
    legalName: envString("NEXT_PUBLIC_COMPANY_LEGAL_NAME") ?? "ArjunAutomations",
    /** Short trading name used in headings and logo lockups. */
    tradingName: "Arjun Automation",
    tagline: "Enterprise automation, delivered as a working system.",

    emails: {
        sales: "sales@arjunautomations.com",
        success: "success@arjunautomations.com",
        support: "support@arjunautomations.com",
        careers: "careers@arjunautomations.com",
    },

    /** Human-readable phone, exactly as it should be printed on the page. */
    phoneDisplay: rawPhone,
    /** Digits-only international format for tel: links. */
    phoneE164: toE164(rawPhone),
    /** Same number, digits-only, for wa.me deep links. */
    whatsappNumber: toE164(rawPhone)?.replace("+", "") ?? null,

    /**
     * Registered office.
     *
     * `street` holds the locality, `city` the city it sits in — Balanagar is a
     * locality within Secunderabad, not a city in its own right, so putting it
     * in `street` keeps the JSON-LD `PostalAddress` structured correctly rather
     * than emitting an address line that does not exist.
     *
     * A registered address must match your incorporation documents. If this is
     * a working address rather than the registered one, override it with
     * NEXT_PUBLIC_COMPANY_ADDRESS_STREET and friends.
     */
    address: {
        street: envString("NEXT_PUBLIC_COMPANY_ADDRESS_STREET") ?? "Balanagar",
        city: envString("NEXT_PUBLIC_COMPANY_CITY") ?? "Secunderabad",
        region: envString("NEXT_PUBLIC_COMPANY_REGION") ?? "Telangana",
        postalCode: envString("NEXT_PUBLIC_COMPANY_POSTAL_CODE") ?? "500042",
        country: envString("NEXT_PUBLIC_COMPANY_COUNTRY") ?? "India",
        countryCode: envString("NEXT_PUBLIC_COMPANY_COUNTRY_CODE") ?? "IN",
    } as CompanyAddress,

    /**
     * GSTIN — pending registration.
     *
     * Left null until you receive it, so nothing renders today. Set
     * NEXT_PUBLIC_COMPANY_GSTIN and it appears in the footer, the contact page,
     * both legal pages and schema.org `taxID` with no code change.
     *
     * IMPORTANT: a GSTIN is a legal tax identifier. It must be the real one
     * from your registration — never a placeholder or a sample value. Showing
     * a wrong GSTIN on a live site is a compliance problem, not a cosmetic one.
     */
    gstin: envString("NEXT_PUBLIC_COMPANY_GSTIN"),
    cin: envString("NEXT_PUBLIC_COMPANY_CIN"),

    officeHours: "Monday – Friday, 9:00 AM – 6:00 PM IST",
    responseSla: "We aim to respond to qualified enquiries within one business day.",

    /** External profiles. Used for footer links and Organization `sameAs`. */
    social: {
        linkedin: envString("NEXT_PUBLIC_SOCIAL_LINKEDIN"),
        github: envString("NEXT_PUBLIC_SOCIAL_GITHUB"),
        x: envString("NEXT_PUBLIC_SOCIAL_X"),
        youtube: envString("NEXT_PUBLIC_SOCIAL_YOUTUBE"),
    },
} as const;

/** True once a real, well-formed phone number has been configured. */
export const HAS_PHONE = Boolean(COMPANY_PROFILE.phoneE164);

/**
 * True once we know at least a city — enough to render "Hyderabad, Telangana,
 * India" in the footer and contact page.
 *
 * NOTE: previously this required street AND postalCode, which meant a
 * city-only address rendered nothing at all. A business that knows its city
 * can legitimately publish that much; only the street line and PIN are held
 * back until they are real.
 */
export const HAS_ADDRESS = Boolean(COMPANY_PROFILE.address.city || COMPANY_PROFILE.address.street);

/**
 * True once the FULL postal address exists (street + city + PIN). Used where
 * a complete registered office is legally required.
 */
export const HAS_FULL_ADDRESS = Boolean(
    COMPANY_PROFILE.address.street && COMPANY_PROFILE.address.city && COMPANY_PROFILE.address.postalCode,
);

/**
 * Postal address as a single display string, omitting any part we do not have.
 * Returns null when nothing is configured.
 */
export function formatAddress(): string | null {
    if (!HAS_ADDRESS) return null;
    return [
        COMPANY_PROFILE.address.street,
        COMPANY_PROFILE.address.city,
        COMPANY_PROFILE.address.region,
        COMPANY_PROFILE.address.postalCode,
        COMPANY_PROFILE.address.country,
    ]
        .filter(Boolean)
        .join(", ");
}

/**
 * Postal address for JSON-LD. Emits only the fields we actually have, so
 * Google never receives an empty `streetAddress` alongside a valid city.
 */
export function schemaAddress(): Record<string, string> | null {
    if (!HAS_ADDRESS) return null;
    const { street, city, region, postalCode, countryCode } = COMPANY_PROFILE.address;
    return {
        "@type": "PostalAddress",
        ...(street ? { streetAddress: street } : {}),
        ...(city ? { addressLocality: city } : {}),
        ...(region ? { addressRegion: region } : {}),
        ...(postalCode ? { postalCode } : {}),
        addressCountry: countryCode,
    };
}

/** `sameAs` array for schema.org — empty until profiles are configured. */
export function schemaSameAs(): string[] {
    return Object.values(COMPANY_PROFILE.social).filter((value): value is string => Boolean(value));
}

/** wa.me deep link with a pre-filled message, or null when no number is configured. */
export function whatsappLink(message: string): string | null {
    const number = COMPANY_PROFILE.whatsappNumber;
    if (!number) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
    "Hi, I found Arjun Automation online. I'd like to discuss automating operations for my business.";
