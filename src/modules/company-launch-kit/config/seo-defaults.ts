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
    defaultTitle: "Arjun Automation — Run Your Business on One Platform",
    defaultDescription:
        "Arjun Automation helps growing organizations replace fragmented tools with a unified operating system — CRM, projects, finance, and industry workflows in one secure platform.",
    defaultKeywords: [
        "enterprise automation",
        "business operating system",
        "CRM platform",
        "project management",
        "business solutions",
        "enterprise software",
        "workflow automation",
        "industry OS",
    ],
    twitterHandle,
    locale: "en_US",
} as const;
