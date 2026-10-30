/**
 * Team data.
 *
 * IMPORTANT — WHY THIS FILE IS DELIBERATELY SMALL
 * -----------------------------------------------
 * A site that asks for Contact for INR Pricing cannot have zero named humans on it.
 * Buyers running vendor due diligence need to know who they are committing to.
 *
 * However, we do not invent people. Every field below is either verified from
 * the repository (`public/brand/founder/*.jpeg`, brand identity files) or left
 * blank for the founder to complete. `bio` and `linkedin` render only once
 * populated — an empty bio string means the card shows the role and nothing
 * more, rather than inventing a career history for someone who may not have
 * said it.
 *
 * TO COMPLETE: fill in `name`, `role`, `bio` and `linkedin`. Add further people
 * to the array — the component maps over whatever is here.
 */

export interface TeamMember {
    /** Full name as it should appear publicly. */
    name: string;
    /** Job title. */
    role: string;
    /** One-to-two sentence bio. Leave empty until written. */
    bio: string;
    /** Path to a photo in /public. */
    image: string;
    /** Alternative text describing the photo. */
    imageAlt: string;
    /** Full LinkedIn profile URL. Empty renders no link. */
    linkedin: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Arjun",
        role: "Founder",

        /**
         * BIO — WRITTEN FROM VERIFIABLE FACTS ONLY
         * ---------------------------------------
         * This bio deliberately claims nothing about prior employers, years of
         * experience, education or certifications, because none of that is
         * recorded anywhere in this repository. Inventing a career history for a
         * real person and publishing it on a commercial site is not a
         * placeholder problem, it is a false-statement problem.
         *
         * Every claim below is checkable against the business itself:
         *  - what the company does           -> services / industries / pricing
         *  - the problem it addresses        -> the homepage hero
         *  - how it is delivered             -> pricing philosophy, delivery model
         *  - founder-led, no account manager -> true of how this business runs
         *
         * TO ENRICH: replace this with your real background. Buyers weighing a
         * five-figure engagement respond to specifics — what you built before,
         * what you have shipped, which industries you know first-hand. Set
         * `linkedin` below and it renders as a profile link.
         */
        bio: "Arjun founded Arjun Automation to close a specific gap: most businesses already have the tools, but the work still falls through the spaces between them — an enquiry nobody follows up, a payment nobody chases, a figure retyped three times by hand.\n\nHe works on client systems directly rather than through an account manager, and takes on a limited number of engagements at a time, so the person who builds your system is the person who maintains it.",
        image: "/brand/founder/founder-primary.jpeg",
        imageAlt: "Arjun, founder of Arjun Automation",
        linkedin: process.env.NEXT_PUBLIC_FOUNDER_LINKEDIN?.trim() ?? "",
    },
];

export const TEAM_CONTENT = {
    title: "Who you will work with",
    subtitle:
        "You are buying our time, so it is fair to know whose time it is. We are a small team that takes on a limited number of engagements at a time — you work directly with the people building your system, not an account manager.",
} as const;
