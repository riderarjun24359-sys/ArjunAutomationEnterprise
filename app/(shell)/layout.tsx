import { AppShell } from "@/src/components/layout/AppShell";
import { authServerService } from "@/src/services/auth.server";
import { requireAuth } from "@/src/modules/auth/lib/auth-guards";
import { ShellFonts } from "@/src/providers/ShellFonts";
import { ShellProviders } from "@/src/providers/ShellProviders";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
    const user = await authServerService.getUser();
    requireAuth(user);
    return (
        <ShellFonts>
            <ShellProviders>
                <AppShell>{children}</AppShell>
            </ShellProviders>
        </ShellFonts>
    );
}
