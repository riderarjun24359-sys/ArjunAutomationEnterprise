import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Cookie Policy",
    description: "Arjun Automation cookie policy — how we use cookies and similar technologies on our website.",
    path: "/cookies",
});

export default function CookiesPage() {
    return (
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
            <h1 className="text-3xl font-semibold text-indigo-950">Cookie Policy</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: March 1, 2026</p>

            <section className="mt-8 space-y-6 text-slate-600">
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">What Are Cookies</h2>
                    <p className="mt-2 leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help us provide a better experience and understand how visitors use our site.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">Cookies We Use</h2>
                    <ul className="mt-2 list-disc pl-6 space-y-2">
                        <li><strong>Essential cookies</strong> — Required for site functionality and security</li>
                        <li><strong>Analytics cookies</strong> — Google Analytics (when NEXT_PUBLIC_GA4_ID is configured) to understand site usage</li>
                        <li><strong>Marketing cookies</strong> — Meta Pixel and LinkedIn Insight Tag (when configured) for campaign measurement</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">Managing Cookies</h2>
                    <p className="mt-2 leading-relaxed">You can control cookies through your browser settings. Disabling cookies may affect site functionality. Analytics and marketing cookies are only loaded when the corresponding environment variables are configured.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-indigo-950">Contact</h2>
                    <p className="mt-2 leading-relaxed">Questions about cookies: sales@arjunautomations.com</p>
                </div>
            </section>
        </article>
    );
}

