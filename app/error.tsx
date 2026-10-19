"use client";

/**
 * Route-segment error boundary (app-level).
 *
 * WHY THIS EXISTS: the site ships no error boundaries, so any transient
 * client error (e.g. a chunk invalidated by a concurrent production deploy)
 * surfaces as Next.js's raw default interstitial — the unbranded
 * "This page couldn't load. Reload to try again, or go back." screen visitors
 * reported in Oct 2026. This page replaces that default with branded, useful
 * recovery UI and never enters an automatic reload loop: retry is explicit
 * and user-initiated.
 *
 * Deliberately dependency-light (no framer-motion / no imported design-system
 * components): the fallback must render even when parts of the runtime are
 * the thing that failed. Brand colours are inlined so it does not rely on
 * third-party stylesheet loading either.
 */

import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const isLoadFailure =
        /ChunkLoadError|dynamically imported module|Loading chunk/i.test(error.message) ||
        error.name === "ChunkLoadError";

    return (
        <div
            role="alert"
            style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "34rem",
                    borderRadius: "1rem",
                    border: "1px solid rgba(239,68,68,0.35)",
                    background: "rgba(254,226,226,0.55)",
                    padding: "2rem",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: "#7f1d1d",
                    }}
                >
                    This page had a momentary problem
                </p>
                <p
                    style={{
                        marginTop: "0.75rem",
                        marginBottom: 0,
                        color: "#991b1b",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                    }}
                >
                    {isLoadFailure
                        ? "A part of the page did not finish loading, usually fixed by reloading once."
                        : "It was not saved on your end and nothing was lost. Try again, or continue from the home page."}
                </p>
                <div
                    style={{
                        marginTop: "1.4rem",
                        display: "flex",
                        gap: "0.75rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <button
                        type="button"
                        onClick={reset}
                        style={{
                            cursor: "pointer",
                            borderRadius: "0.6rem",
                            border: "none",
                            background: "#ff6a00",
                            color: "#fff",
                            padding: "0.55rem 1.1rem",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                        }}
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        style={{
                            display: "inline-block",
                            borderRadius: "0.6rem",
                            border: "1px solid #d4d4d8",
                            color: "#3f3f46",
                            padding: "0.55rem 1.1rem",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            textDecoration: "none",
                        }}
                    >
                        Back to home
                    </Link>
                </div>
                {error.digest ? (
                    <p
                        style={{
                            marginTop: "1.2rem",
                            marginBottom: 0,
                            fontSize: "0.72rem",
                            color: "#a1a1aa",
                        }}
                    >
                        Reference {error.digest}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
