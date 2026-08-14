"use client";

import { LAUNCH_KIT_THEME } from "@/src/modules/company-launch-kit/constants";

export interface SocialPostTemplateProps {
    headline?: string;
    body?: string;
    cta?: string;
}

export function SocialPostTemplate({
    headline = "Enterprise automation. Without the enterprise wait.",
    body = "Arjun Automation OS unifies CRM, AI workers, and industry packs into one secure platform. AI-generated first version within hours.",
    cta = "Learn more at arjunautomations.com",
}: SocialPostTemplateProps) {
    return (
        <div className="mx-auto max-w-md" aria-label="Social post preview">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Social Post Preview</p>
            <div className={`rounded-2xl border ${LAUNCH_KIT_THEME.border} overflow-hidden shadow-lg`}>
                <div className={`${LAUNCH_KIT_THEME.bg} px-6 py-8 text-white`}>
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-xs font-bold">AA</span>
                        <span className="text-sm font-medium">Arjun Automation</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-snug">{headline}</h3>
                </div>
                <div className="bg-white px-6 py-5">
                    <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                    <p className={`mt-4 text-sm font-medium ${LAUNCH_KIT_THEME.text}`}>{cta}</p>
                </div>
            </div>
        </div>
    );
}

