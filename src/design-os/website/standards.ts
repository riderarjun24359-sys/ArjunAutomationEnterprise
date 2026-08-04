/** Website section requirements and constants for marketing pages */
export const WEBSITE_SECTIONS = {
    hero: { minHeight: "80vh", requiredElements: ["headline", "subheadline", "cta", "visual"] },
    features: { minItems: 3, layout: "grid" },
    socialProof: { minItems: 2, types: ["logos", "testimonials", "metrics"] },
    cta: { requiredElements: ["headline", "primaryAction"] },
    footer: { requiredElements: ["links", "legal", "brand"] },
} as const;

export const WEBSITE_MOTION = {
    heroEntrance: "fadeUp",
    sectionReveal: "staggerContainer",
    pageTransition: "pageTransition",
} as const;

export const WEBSITE_TOKENS = {
    maxContentWidth: "1280px",
    sectionPadding: "96px",
    heroGradient: "var(--dos-brand-primary)",
} as const;
