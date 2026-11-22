import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "Thank You",
    description: "Your enquiry has been sent to Arjun Automation Enterprises.",
    path: "/thank-you",
    noIndex: true,
});

const whatsapp = whatsappLink("Hi, I have sent an enquiry through your website.");

export default function ThankYouPage() {
    return <div className="premium-container mx-auto max-w-2xl py-20 text-center sm:py-28">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--success)]"/>
        <h1 className="mt-6 text-4xl font-extrabold">Thank you. Your enquiry has been sent.</h1>
        <p className="mt-4 text-lg leading-8">We have received your details. You can also contact us directly if you need to add anything.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Back to home</Link>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}</div>
    </div>;
}
