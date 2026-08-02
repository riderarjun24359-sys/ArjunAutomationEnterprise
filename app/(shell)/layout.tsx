import { AppShell } from "@/src/components/layout/AppShell";
import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <AppShell>{children}</AppShell>
        </ProtectedRoute>
    );
}
