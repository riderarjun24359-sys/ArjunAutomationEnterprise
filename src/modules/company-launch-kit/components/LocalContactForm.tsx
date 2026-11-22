"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";

type Props = { whatsappNumber: string; telugu?: boolean };

const businessTypes = ["School", "College", "Shop or Supermarket", "Clinic", "Other"];

export function LocalContactForm({ whatsappNumber, telugu = false }: Props) {
    const searchParams = useSearchParams();
    const [businessType, setBusinessType] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
    const [error, setError] = useState("");
    const [whatsappUrl, setWhatsappUrl] = useState("");

    useEffect(() => {
        const type = searchParams.get("type")?.toLowerCase();
        if (type === "school") setBusinessType("School");
        else if (type === "college") setBusinessType("College");
        else if (type === "shop") setBusinessType("Shop or Supermarket");
        else if (type === "clinic") setBusinessType("Clinic");
    }, [searchParams]);

    const fieldClass = "mt-2 min-h-12 w-full rounded-[10px] border-[1.5px] border-[var(--border-strong)] bg-white px-4 py-3 text-base text-[var(--ink)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(67,56,202,.18)]";
    const labelClass = "block text-sm font-semibold text-[var(--ink)]";
    const t = (en: string, te: string) => telugu ? te : en;

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("sending");
        setError("");
        setWhatsappUrl("");
        const form = event.currentTarget;
        const data = new FormData(form);
        const payload = {
            name: String(data.get("name") ?? "").trim(),
            phone: String(data.get("phone") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            businessType,
            message: String(data.get("message") ?? "").trim(),
            consent: data.get("consent") === "on",
            website: String(data.get("website") ?? ""),
        };

        if (!/^[6-9]\d{9}$/.test(payload.phone)) {
            setStatus("error");
            setError(t("Enter a valid 10-digit Indian mobile number.", "సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ ఇవ్వండి."));
            return;
        }
        if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            setStatus("error");
            setError(t("Enter a valid email address.", "సరైన ఇమెయిల్ చిరునామా ఇవ్వండి."));
            return;
        }
        if (!payload.businessType || payload.message.length < 10 || payload.message.length > 1000 || !payload.consent) {
            setStatus("error");
            setError(t("Please complete all required fields. Your message must be 10 to 1,000 characters.", "అవసరమైన వివరాలన్నీ నింపండి. మీ సందేశం 10 నుంచి 1,000 అక్షరాల మధ్య ఉండాలి."));
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json() as { success?: boolean };
            if (!response.ok || !result.success) throw new Error("send_failed");
            window.location.assign("/thank-you");
        } catch {
            const text = [
                t("Hi, I could not send the enquiry form. Here are my details:", "నమస్కారం, ఫారం ద్వారా పంపలేకపోయాను. నా వివరాలు ఇవి:"),
                `${t("Name","పేరు")}: ${payload.name}`,
                `${t("Phone","ఫోన్")}: ${payload.phone}`,
                `${t("Email","ఇమెయిల్")}: ${payload.email || "-"}`,
                `${t("Business type","వ్యాపార రకం")}: ${payload.businessType}`,
                `${t("What I need","నాకు కావాల్సింది")}: ${payload.message}`,
            ].join("\n");
            setWhatsappUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`);
            setStatus("error");
            setError(t("Could not send your enquiry. Please message us on WhatsApp instead.", "మీ ఎంక్వైరీ పంపలేకపోయాం. దయచేసి WhatsApp లో మెసేజ్ చేయండి."));
        }
    }

    return (
        <form onSubmit={submit} className="space-y-5" noValidate>
            <div><label htmlFor="contact-name" className={labelClass}>{t("Name","పేరు")} *</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} className={fieldClass}/></div>
            <div><label htmlFor="contact-phone" className={labelClass}>{t("Phone","ఫోన్")} *</label><input id="contact-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required pattern="[6-9][0-9]{9}" maxLength={10} className={fieldClass} placeholder={t("10-digit mobile number","10 అంకెల మొబైల్ నంబర్")}/></div>
            <div><label htmlFor="contact-email" className={labelClass}>{t("Email (optional)","ఇమెయిల్ (తప్పనిసరి కాదు)")}</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} className={fieldClass}/></div>
            <div><label htmlFor="contact-business" className={labelClass}>{t("Business type","వ్యాపార రకం")} *</label><select id="contact-business" name="businessType" required value={businessType} onChange={event => setBusinessType(event.target.value)} className={fieldClass}><option value="">{t("Select one","ఎంచుకోండి")}</option>{businessTypes.map(value=><option key={value} value={value}>{telugu ? ({School:"స్కూల్",College:"కాలేజ్","Shop or Supermarket":"షాప్ లేదా సూపర్‌మార్కెట్",Clinic:"క్లినిక్",Other:"ఇతర"} as Record<string,string>)[value] : value}</option>)}</select></div>
            <div><label htmlFor="contact-message" className={labelClass}>{t("What do you need?","మీకు ఏం కావాలి?")} *</label><textarea id="contact-message" name="message" required minLength={10} maxLength={1000} rows={5} className={fieldClass} placeholder={t("Tell us what you need help with (10–1,000 characters).","మీకు ఏ సహాయం కావాలో వివరంగా చెప్పండి (10–1,000 అక్షరాలు).")}/></div>
            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off"/></div>
            <label className="flex items-start gap-3 text-sm leading-6 text-[var(--body)]"><input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"/><span>{t("I agree to be contacted about my enquiry.","నా ఎంక్వైరీ గురించి నన్ను సంప్రదించడానికి అంగీకరిస్తున్నాను.")} *</span></label>
            <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-wait disabled:opacity-60">{status === "sending" ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/> {t("Sending...","పంపిస్తున్నాం...")}</> : <><Send className="h-4 w-4"/>{t("Send enquiry","ఎంక్వైరీ పంపండి")}</>}</button>
            {error ? <p role="alert" className="text-sm font-medium text-[var(--error)]">{error}</p> : null}
            {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>{t("Message us on WhatsApp","WhatsApp లో మెసేజ్ చేయండి")}</a> : null}
        </form>
    );
}
