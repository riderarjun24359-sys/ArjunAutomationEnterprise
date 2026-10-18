/**
 * Team data.
 *
 * IMPORTANT — WHY THIS FILE IS DELIBERATELY SMALL
 * -----------------------------------------------
 * A site that asks for $45,000–$200,000 cannot have zero named humans on it.
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
        bio: "",
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
