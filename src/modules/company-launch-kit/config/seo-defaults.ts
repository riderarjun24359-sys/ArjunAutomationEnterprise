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
    siteName: "Arjun Automation Enterprises",
    siteUrl,
    defaultTitle: "Arjun Automation Enterprises | WhatsApp and School Management Software | Andhra Pradesh",
    defaultDescription:
        "WhatsApp fee reminders, attendance alerts, online orders and school management software for schools, shops and clinics in Prakasam and Hyderabad.",
    twitterHandle,
    locale: "en_IN",
} as const;
