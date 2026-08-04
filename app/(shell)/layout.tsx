import { AppShell } from "@/src/components/layout/AppShell";
import { authServerService } from "@/src/services/auth.server";
import { requireAuth } from "@/src/modules/auth/lib/auth-guards";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
    const user = await authServerService.getUser();
    requireAuth(user);
    return <AppShell>{children}</AppShell>;
}
