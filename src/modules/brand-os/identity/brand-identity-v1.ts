/**
 * Arjun Automation — Brand Identity System v1.0
 * Strategy, visual tokens, logo specs. No business logic.
 */

export const BRAND_IDENTITY_V1 = {
    version: "1.0.0",
    codename: "Precision Orbit",
    legalName: "Arjun Automation",
    shortName: "Arjun",
    tagline: "Enterprise automation, orchestrated.",
    symbolName: "Orbit Mark",
    domain: "www.arjunautomation.com",
} as const;

/** Original enterprise palette — ink navy + signal teal (not violet-default). */
export const BRAND_V1_COLORS = {
    ink: "#0A1628",
    harbor: "#0E4D5C",
    signal: "#0F766E",
    signalBright: "#14B8A6",
    mist: "#F1F5F9",
    cloud: "#F8FAFC",
    steel: "#64748B",
    graphite: "#1E293B",
    white: "#FFFFFF",
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
    info: "#0284C7",
} as const;

export const BRAND_V1_STRATEGY = {
    mission:
        "Give every organization an enterprise operating system — AI-native, secure by default, and fast to value — so teams run strategy while automation runs the work.",
    vision:
        "A durable standard for how modern companies operate: one platform, clear outcomes, continuous intelligence.",
    values: [
        { name: "Outcome over output", detail: "Measure client results, not activity volume." },
        { name: "Platform thinking", detail: "Configure once; scale across industries without bespoke debt." },
        { name: "Security first", detail: "Tenant isolation, auditability, and governance are baseline." },
        { name: "Radical clarity", detail: "Plain language, transparent commercial terms, honest timelines." },
        { name: "Partnership", detail: "Success is measured after go-live, not at handoff." },
    ],
    voice: {
        traits: ["Precise", "Calm", "Confident", "Human", "Evidence-led"],
        do: [
            "Lead with outcomes and operating clarity",
            "Use concrete nouns: tenants, workflows, SLAs, MRR",
            "Prefer short sentences in product and sales copy",
        ],
        dont: [
            "Hype words without proof (revolutionary, disrupt, magic)",
            "Anthropomorphize AI beyond useful metaphor",
            "Crowded marketing layouts or emoji-led enterprise claims",
        ],
    },
    personality: ["Intelligent", "Premium", "Trustworthy", "Timeless", "Operational", "Minimal"],
} as const;

export const BRAND_V1_TYPOGRAPHY = {
    display: { family: "Geist Sans", fallback: "ui-sans-serif, system-ui, sans-serif", weight: 600 },
    body: { family: "Geist Sans", fallback: "ui-sans-serif, system-ui, sans-serif", weight: 400 },
    mono: { family: "Geist Mono", fallback: "ui-monospace, monospace", weight: 400 },
    scale: {
        display: "3rem / 1.1",
        h1: "1.875rem / 1.2",
        h2: "1.5rem / 1.25",
        h3: "1.25rem / 1.3",
        body: "1rem / 1.55",
        small: "0.875rem / 1.5",
        label: "0.75rem / 1.4 · 0.18em tracking",
    },
} as const;

export const BRAND_V1_SPACING = {
    unitPx: 4,
    scale: [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96],
    gridColumns: 12,
    contentMaxWidth: "72rem",
} as const;

export const BRAND_V1_LOGO = {
    clearSpace: "Equal to the height of the Orbit Mark cap",
    minDigitalPx: { horizontal: 128, stacked: 96, monogram: 24 },
    minPrintMm: { horizontal: 35, monogram: 8 },
    variants: [
        "primary-horizontal-light",
        "primary-horizontal-dark",
        "primary-stacked-light",
        "primary-stacked-dark",
        "secondary-horizontal",
        "monogram-light",
        "monogram-dark",
        "app-icon",
        "favicon",
    ],
} as const;

export const BRAND_V1_ILLUSTRATION = {
    style: "Geometric systems diagrams — arcs, nodes, and soft depth. No skeuomorphism. Limited palette (ink, harbor, signal, mist).",
    lineWeight: "1.5–2.5px at 24px icon size",
    cornerRadius: "consistent with brand radius md–xl",
} as const;
