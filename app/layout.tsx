import type { Metadata } from "next";
import { appConfig } from "@/src/config/app";
import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
