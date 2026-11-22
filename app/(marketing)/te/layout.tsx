import { Noto_Sans_Telugu } from "next/font/google";
import { TeluguDocumentLanguage } from "@/src/modules/company-launch-kit/components/TeluguDocumentLanguage";

const notoTelugu = Noto_Sans_Telugu({
    subsets: ["telugu"],
    display: "swap",
    variable: "--font-noto-telugu",
});

export default function TeluguLayout({ children }: { children: React.ReactNode }) {
    return <div lang="te" className={`${notoTelugu.className} min-h-screen`}><TeluguDocumentLanguage />{children}</div>;
}
