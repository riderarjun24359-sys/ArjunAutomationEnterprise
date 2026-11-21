import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arjun Automation Enterprises | WhatsApp & School Management Software | Andhra Pradesh",
  description: "WhatsApp fee reminders, attendance alerts, online orders and school management software for schools, shops and clinics in Prakasam and Hyderabad.",
  applicationName: "Arjun Automation Enterprises",
  openGraph: {
    title: "Arjun Automation Enterprises | WhatsApp & School Management Software | Andhra Pradesh",
    description: "WhatsApp fee reminders, attendance alerts, online orders and school management software for schools, shops and clinics in Prakasam and Hyderabad.",
    siteName: "Arjun Automation Enterprises",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arjun Automation Enterprises | WhatsApp & School Management Software | Andhra Pradesh",
    description: "WhatsApp fee reminders, attendance alerts, online orders and school management software for schools, shops and clinics in Prakasam and Hyderabad.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1930",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
