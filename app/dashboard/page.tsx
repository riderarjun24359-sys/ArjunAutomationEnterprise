import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";
import { DashboardShell } from "@/src/modules/dashboard";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardShell />
        </ProtectedRoute>
    );
}
