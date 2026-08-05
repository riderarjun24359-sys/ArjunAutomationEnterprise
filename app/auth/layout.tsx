import { ShellFonts } from "@/src/providers/ShellFonts";
import { ShellProviders } from "@/src/providers/ShellProviders";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ShellFonts>
            <ShellProviders>{children}</ShellProviders>
        </ShellFonts>
    );
}
