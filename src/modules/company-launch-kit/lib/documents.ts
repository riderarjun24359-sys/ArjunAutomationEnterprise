import { join } from "node:path";

const moduleRoot = join(process.cwd(), "src", "modules", "company-launch-kit");

export const LAUNCH_KIT_DOCUMENT_FILES = [
    "proposal",
    "quotation",
    "invoice",
    "client-agreement",
    "nda",
    "discovery-questionnaire",
    "meeting-notes-template",
] as const;

export const LAUNCH_KIT_EMAIL_FILES = [
    "welcome",
    "proposal",
    "follow-up",
    "project-kickoff",
    "weekly-update",
    "delivery-complete",
    "testimonial-request",
    "referral-request",
] as const;

export type LaunchKitDocumentSlug = (typeof LAUNCH_KIT_DOCUMENT_FILES)[number];
export type LaunchKitEmailSlug = (typeof LAUNCH_KIT_EMAIL_FILES)[number];

export function getDocumentPath(slug: LaunchKitDocumentSlug): string {
    return join(moduleRoot, "content", "documents", `${slug}.md`);
}

export function getEmailPath(slug: LaunchKitEmailSlug): string {
    return join(moduleRoot, "content", "emails", `${slug}.md`);
}

export function getDocumentDownloadUrl(slug: LaunchKitDocumentSlug): string {
    return `/api/launch-kit/documents/${slug}`;
}
