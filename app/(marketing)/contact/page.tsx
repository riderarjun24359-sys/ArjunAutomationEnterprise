import type { Metadata } from "next";
import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Contact",
    description: "Contact Arjun Automation for sales, partnerships, and customer success. We respond within one business day.",
    path: "/contact",
});

export default function ContactPage() {
    return (
        <>
            <section className="bg-indigo-50 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl font-semibold tracking-tight text-indigo-950">Contact Us</h1>
                    <p className="mt-4 max-w-3xl text-lg text-slate-600">
                        Schedule a discovery call or send us a message. Our team responds within one business day.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="text-xl font-semibold text-indigo-950">Get in touch</h2>
                        <dl className="mt-6 space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-indigo-700">Sales & Partnerships</dt>
                                <dd className="mt-1 text-slate-600">sales@arjunautomation.com</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-indigo-700">Customer Success</dt>
                                <dd className="mt-1 text-slate-600">success@arjunautomation.com</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-indigo-700">Support (Managed Clients)</dt>
                                <dd className="mt-1 text-slate-600">support@arjunautomation.com</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-indigo-700">Office Hours</dt>
                                <dd className="mt-1 text-slate-600">Monday – Friday, 9:00 AM – 6:00 PM IST</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <LeadForm source="contact-page" />
                    </div>
                </div>
            </section>
        </>
    );
}
