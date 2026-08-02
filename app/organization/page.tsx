import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";
import { OrganizationPage } from "@/src/modules/organization";

export default function OrganizationRoutePage() {
    return (
        <ProtectedRoute>
            <OrganizationPage />
        </ProtectedRoute>
    );
}
