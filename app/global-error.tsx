"use client";

/**
 * Root error boundary.
 *
 * WHY THIS EXISTS: identical reason to app/error.tsx — before this file, any
 * top-level server-render or client bootstrap failure rendered Next.js's raw
 * default interstitial ("This page couldn't load. Reload to try again, or go
 * back."), which looked broken to the visitors who hit it after a production
 * deploy. This fallback renders its own minimal styled shell (it replaces the
 * whole document), so it stays standalone even when the serving runtime is
 * what failed. Retry is user-initiated only — no reload loops.
 *
 * Keep this file free of app dependencies (including CSS imports): Next
 * renders it in place of <html>, and it may be served when nothing else loads.
 */

import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0f172a",
                    color: "#e2e8f0",
                    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
                    padding: "1.5rem",
                }}
            >
                <div
                    role="alert"
                    style={{
                        maxWidth: "36rem",
                        width: "100%",
                        borderRadius: "1rem",
                        background: "#1e293b",
                        border: "1px solid rgba(239,68,68,0.35)",
                        padding: "2.25rem 2rem",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        This page needed a moment and could not load
                    </p>
                    <p
                        style={{
                            marginTop: "0.8rem",
                            marginBottom: 0,
                            color: "#94a3b8",
                            fontSize: "0.92rem",
                            lineHeight: 1.6,
                        }}
                    >
                        Arjun Automation is up, but this page hit a temporary error.
                        Use the buttons below — the site remembers nothing on your
                        end and no data was lost.
                    </p>
                    <div
                        style={{
                            marginTop: "1.6rem",
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
                                padding: "0.6rem 1.2rem",
                                fontWeight: 600,
                                fontSize: "0.92rem",
                            }}
                        >
                            Try again
                        </button>
                        <Link
                            href="/"
                            style={{
                                display: "inline-block",
                                borderRadius: "0.6rem",
                                border: "1px solid #334155",
                                color: "#cbd5e1",
                                padding: "0.6rem 1.2rem",
                                fontWeight: 600,
                                fontSize: "0.92rem",
                                textDecoration: "none",
                            }}
                        >
                            Go to the home page
                        </Link>
                    </div>
                    {error.digest ? (
                        <p
                            style={{
                                marginTop: "1.4rem",
                                marginBottom: 0,
                                fontSize: "0.72rem",
                                color: "#64748b",
                            }}
                        >
                            Reference {error.digest} — share it with support if you
                            contact us about this page.
                        </p>
                    ) : null}
                </div>
            </body>
        </html>
    );
}
