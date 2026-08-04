export const MARKETING_ROUTES = {
    home: "/",
    about: "/about",
    services: "/services",
    industries: "/industries",
    solutions: "/solutions",
    portfolio: "/portfolio",
    portfolioItem: (slug: string) => `/portfolio/${slug}`,
    caseStudies: "/case-studies",
    blog: "/blog",
    blogPost: (slug: string) => `/blog/${slug}`,
    careers: "/careers",
    contact: "/contact",
    privacy: "/privacy",
    terms: "/terms",
    cookies: "/cookies",
    thankYou: "/thank-you",
    launchAutomation: "/launch/automation",
    launchCrm: "/launch/crm",
} as const;

export const LAUNCH_KIT_DOCUMENTS = {
    proposal: "proposal",
    quotation: "quotation",
    invoice: "invoice",
    clientAgreement: "client-agreement",
    nda: "nda",
    discoveryQuestionnaire: "discovery-questionnaire",
    meetingNotes: "meeting-notes-template",
} as const;

export const LAUNCH_KIT_EMAILS = {
    welcome: "welcome",
    proposal: "proposal",
    followUp: "follow-up",
    projectKickoff: "project-kickoff",
    weeklyUpdate: "weekly-update",
    deliveryComplete: "delivery-complete",
    testimonialRequest: "testimonial-request",
    referralRequest: "referral-request",
} as const;
