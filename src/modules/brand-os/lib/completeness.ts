export const BRAND_BOOK_REQUIRED_SECTIONS = [
    "Company Story",
    "Mission",
    "Vision",
    "Core Values",
    "Brand Promise",
    "Positioning Statement",
    "UVP",
    "Target Audience",
    "Industries Served",
    "Customer Personas",
    "Brand Personality",
    "Tone of Voice",
    "Writing Guidelines",
    "Messaging Framework",
    "Elevator Pitch",
    "Tagline Options",
    "Brand Do's",
    "Brand Don'ts",
] as const;

export type BrandBookSection = (typeof BRAND_BOOK_REQUIRED_SECTIONS)[number];

export interface BrandBookCompletenessResult {
    complete: boolean;
    present: BrandBookSection[];
    missing: BrandBookSection[];
    totalRequired: number;
    totalPresent: number;
}

export function verifyBrandBookCompleteness(content: string): BrandBookCompletenessResult {
    const present: BrandBookSection[] = [];
    const missing: BrandBookSection[] = [];

    for (const section of BRAND_BOOK_REQUIRED_SECTIONS) {
        const pattern = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im");
        if (pattern.test(content)) {
            present.push(section);
        } else {
            missing.push(section);
        }
    }

    return {
        complete: missing.length === 0,
        present,
        missing,
        totalRequired: BRAND_BOOK_REQUIRED_SECTIONS.length,
        totalPresent: present.length,
    };
}
