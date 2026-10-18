/**
 * Shared Open Graph / Twitter card renderer.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site previously pointed `og:image` and `twitter:image` at an SVG file.
 * X/Twitter, LinkedIn, Facebook and WhatsApp all refuse to render SVG share
 * images, so every link shared from this site produced a blank preview card.
 *
 * `ImageResponse` (Satori) only emits PNG and is served from a real route, so
 * using it fixes the format problem and lets each page carry its own headline
 * and stat instead of one identical `og-default` image for the whole site.
 *
 * CONSTRAINTS (Satori)
 * --------------------
 * Flexbox only — `display: grid` is unsupported. Only `ttf` / `otf` / `woff`
 * fonts can be loaded; `woff2` is rejected. Every element with more than one
 * child needs an explicit `display` value.
 */
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Brand palette, mirrored from the premium theme CSS variables. */
const COLORS = {
    bg: "#0a0a0b",
    surface: "#141416",
    border: "#2a2a2e",
    accent: "#ff6b35",
    accentSoft: "#ff8a5c",
    fg: "#fafafa",
    muted: "#a1a1aa",
} as const;

export interface OgImageOptions {
    /** Eyebrow label, e.g. "Case study" or "Pricing". */
    eyebrow?: string;
    /** Main headline. Keep under ~70 characters or it will wrap awkwardly. */
    title: string;
    /** Supporting line, optional. */
    subtitle?: string;
    /** Highlight stat, e.g. "80%". Rendered large in the accent colour. */
    stat?: string;
    /** Label that qualifies the stat, e.g. "reduction in reconciliation time". */
    statLabel?: string;
    /** Footer line, usually a route path. */
    footer?: string;
}

/**
 * Builds a 1200x630 share card. Returns a Response so it can be used directly
 * from an `opengraph-image.tsx` default export or a route handler.
 */
export function renderOgImage(options: OgImageOptions): Response {
    const { eyebrow, title, subtitle, stat, statLabel, footer } = options;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: COLORS.bg,
                    backgroundImage: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.bg} 55%)`,
                    padding: "72px 80px",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Brand row */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            backgroundColor: COLORS.accent,
                            color: COLORS.bg,
                            fontSize: 24,
                            fontWeight: 800,
                        }}
                    >
                        A
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginLeft: 16,
                            fontSize: 26,
                            fontWeight: 600,
                            color: COLORS.fg,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Arjun Automation
                    </div>
                    {eyebrow ? (
                        <div
                            style={{
                                display: "flex",
                                marginLeft: 24,
                                padding: "6px 16px",
                                borderRadius: 999,
                                border: `1px solid ${COLORS.border}`,
                                backgroundColor: COLORS.surface,
                                fontSize: 20,
                                color: COLORS.muted,
                            }}
                        >
                            {eyebrow}
                        </div>
                    ) : null}
                </div>

                {/* Headline + stat */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <div
                            style={{
                                display: "flex",
                                fontSize: title.length > 52 ? 56 : 68,
                                fontWeight: 800,
                                lineHeight: 1.08,
                                letterSpacing: "-0.03em",
                                color: COLORS.fg,
                            }}
                        >
                            {title}
                        </div>
                        {subtitle ? (
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: 24,
                                    fontSize: 28,
                                    lineHeight: 1.4,
                                    color: COLORS.muted,
                                }}
                            >
                                {subtitle}
                            </div>
                        ) : null}
                    </div>

                    {stat ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                minWidth: 260,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 116,
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    letterSpacing: "-0.04em",
                                    color: COLORS.accent,
                                }}
                            >
                                {stat}
                            </div>
                            {statLabel ? (
                                <div
                                    style={{
                                        display: "flex",
                                        marginTop: 14,
                                        fontSize: 22,
                                        lineHeight: 1.3,
                                        textAlign: "right",
                                        color: COLORS.muted,
                                    }}
                                >
                                    {statLabel}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {/* Footer rule */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: `1px solid ${COLORS.border}`,
                        paddingTop: 28,
                        fontSize: 24,
                        color: COLORS.muted,
                    }}
                >
                    <div style={{ display: "flex", color: COLORS.accentSoft }}>arjunautomations.com</div>
                    {footer ? <div style={{ display: "flex" }}>{footer}</div> : null}
                </div>
            </div>
        ),
        OG_SIZE,
    );
}

/** Pulls the leading percentage out of strings like "80% reduction in ...". */
export function extractStat(results: string[]): { stat: string; label: string } | null {
    for (const result of results) {
        const match = result.match(/^(\d+(?:[.,]\d+)?\s*%)\s+(.*)$/i);
        if (match) {
            return { stat: match[1], label: match[2].replace(/\.$/, "") };
        }
    }
    return null;
}
