const configuredSiteUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
const siteUrl = configuredSiteUrl || (process.env.NODE_ENV === "production" ? "https://www.arjunautomations.com" : "http://localhost:3000");

const xProfile = process.env.NEXT_PUBLIC_SOCIAL_X?.trim();
const twitterHandle = xProfile
    ? xProfile.startsWith("@")
        ? xProfile
        : (() => {
              try {
                  const url = new URL(xProfile);
                  const handle = url.pathname.split("/").filter(Boolean)[0];
                  return handle ? `@${handle}` : undefined;
              } catch {
                  return undefined;
              }
          })()
    : undefined;

export const LAUNCH_KIT_SEO = {
    siteName: "Arjun Automation",
    siteUrl,
    defaultTitle: "Arjun Automation — AI Automation for Business Operations",
    defaultDescription:
        "Arjun Automation connects the tools growing organizations already run into one AI-automated workflow — CRM, projects, finance, and industry workflows on a single secure platform.",
    defaultKeywords: [
        "AI automation",
        "enterprise automation",
        "business operating system",
        "workflow automation",
        "CRM platform",
        "process automation",
        "industry OS",
        "enterprise software",
    ],
    twitterHandle,
    locale: "en_US",
} as const;
