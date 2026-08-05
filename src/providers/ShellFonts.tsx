import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export function ShellFonts({ children }: { children: React.ReactNode }) {
    return <div className={`${geistSans.variable} ${geistMono.variable} min-h-full`}>{children}</div>;
}
