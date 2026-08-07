export const GOV_THEME = {
    title: "Growth OS · AI Video Factory",
    subtitle:
        "Provider-agnostic video orchestration: scripts, storyboards, voice/audio, composition, project management, and QA — live multi-tenant with Founder/Admin approval.",
} as const;

/** Extensible provider slots — orchestration only; no single-model assumption. */
export const GOV_PROVIDER_SLOTS = [
    "script_generation",
    "voice_synthesis",
    "visual_assembly",
    "motion_graphics",
    "captioning",
    "transcoding",
] as const;

export const GOV_ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:5"] as const;

export const GOV_TABS = {
    scripts: "scripts",
    storyboard: "storyboard",
    audio: "audio",
    composition: "composition",
    projects: "projects",
    qa: "qa",
} as const;

export type GovTab = (typeof GOV_TABS)[keyof typeof GOV_TABS];

export const GOV_TAB_LIST: Array<{ id: GovTab; label: string }> = [
    { id: GOV_TABS.scripts, label: "AI Script Studio" },
    { id: GOV_TABS.storyboard, label: "Storyboard Engine" },
    { id: GOV_TABS.audio, label: "Voice & Audio Studio" },
    { id: GOV_TABS.composition, label: "Video Composition Engine" },
    { id: GOV_TABS.projects, label: "Video Project Manager" },
    { id: GOV_TABS.qa, label: "Quality Assurance Engine" },
];
