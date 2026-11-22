import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Privacy",
    description: "How Arjun Automation Enterprises handles details submitted through the website enquiry form.",
    path: "/privacy",
});

const retentionPeriod = process.env.NEXT_PUBLIC_ENQUIRY_RETENTION?.trim();

export default function PrivacyPage() {
    return <article className="premium-container max-w-3xl py-16 sm:py-20">
        <h1 className="text-4xl font-extrabold">Privacy</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: 22 November 2026</p>
        <section className="mt-8 space-y-4 leading-7">
            <h2 className="text-2xl font-bold">Details you send</h2>
            <p>The website enquiry form asks for your name, phone number, business type and message. Email is optional. It also records your consent to be contacted about that enquiry.</p>
            <h2 className="text-2xl font-bold">Where the enquiry goes</h2>
            <p>When you submit the form, the details are sent by email to sales@arjunautomations.com so the person handling enquiries at Arjun Automation Enterprises can reply. The email delivery provider processes the message to deliver it.</p>
            <h2 className="text-2xl font-bold">How we use the details</h2>
            <p>We use the details only to read, respond to and follow up on the enquiry you sent. We do not use the form to sign you up for unrelated marketing messages.</p>
            <h2 className="text-2xl font-bold">Abuse prevention</h2>
            <p>The server processes a network address to limit repeated form submissions. It uses a one-way hash as the rate-limit key.</p>
            {retentionPeriod ? <section><h2 className="text-2xl font-bold">How long we keep enquiry details</h2><p>{retentionPeriod}</p></section> : null}
            <h2 className="text-2xl font-bold">Your request</h2>
            <p>To ask about, correct or request deletion of an enquiry you sent, email sales@arjunautomations.com and include the phone number or email address you used in that enquiry.</p>
            <h2 className="text-2xl font-bold">Contact</h2>
            <p>Arjun Automation Enterprises · sales@arjunautomations.com · +91 73370 27357</p>
        </section>
    </article>;
}
