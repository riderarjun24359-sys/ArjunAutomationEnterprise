import Image from "next/image";
import { TEAM_CONTENT, TEAM_MEMBERS } from "@/src/modules/company-launch-kit/data/team";

/**
 * LinkedIn mark.
 *
 * Inlined rather than imported: the installed `lucide-react` build has dropped
 * brand glyphs, so `Linkedin` / `LinkedinIcon` are not exported and a named
 * import fails the build. An inline SVG has no such dependency.
 */
function LinkedInIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
        </svg>
    );
}

/**
 * Team section.
 *
 * WHY
 * ---
 * An audit of all 46 marketing pages found zero founder names, zero team
 * photos and zero LinkedIn links — on a site quoting $45,000–$200,000. Buyers
 * running vendor due diligence have no way to tell who they are committing to,
 * and anonymous vendors lose deals to identifiable ones.
 *
 * This section renders `TEAM_MEMBERS`. It is a Server Component with no
 * animation or client JS on purpose — it sits on the About page, which should
 * stay cheap to load.
 *
 * Nothing is invented: entries with an empty `bio` or `linkedin` simply render
 * fewer fields rather than fabricating a career history.
 */
export function TeamSection({ compact = false }: { compact?: boolean }) {
    if (TEAM_MEMBERS.length === 0) return null;

    return (
        <section
            className={compact ? "py-12" : "premium-section"}
            aria-labelledby="team-heading"
        >
            <div className="premium-container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 id="team-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {TEAM_CONTENT.title}
                    </h2>
                    <p className="mt-4 text-[var(--premium-fg-muted)]">{TEAM_CONTENT.subtitle}</p>
                </div>

                <ul className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
                    {TEAM_MEMBERS.map((member) => (
                        <li key={member.name} className="premium-glass rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <Image
                                    src={member.image}
                                    alt={member.imageAlt}
                                    width={72}
                                    height={72}
                                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="text-base font-semibold">{member.name}</p>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">{member.role}</p>

                                    {member.bio ? (
                                        /* Split on blank lines so a multi-paragraph
                                           bio renders as separate <p> elements.
                                           Rendering "\n\n" inside one <p> collapses
                                           to spaces in HTML and the paragraphs run
                                           together. Single newlines stay as-is. */
                                        member.bio
                                            .split(/\n\s*\n/)
                                            .filter((paragraph) => paragraph.trim().length > 0)
                                            .map((paragraph) => (
                                                <p
                                                    key={paragraph.slice(0, 40)}
                                                    className="mt-3 text-sm leading-relaxed text-[var(--premium-fg-muted)] first:mt-3"
                                                >
                                                    {paragraph.trim()}
                                                </p>
                                            ))
                                    ) : null}

                                    {member.linkedin ? (
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer me"
                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 dark:text-orange-400"
                                        >
                                            <LinkedInIcon className="h-4 w-4" />
                                            LinkedIn profile
                                            <span className="sr-only"> of {member.name} (opens in a new tab)</span>
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
