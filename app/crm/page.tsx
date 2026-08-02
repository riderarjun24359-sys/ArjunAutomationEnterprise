import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";
import { CrmPage } from "@/src/modules/crm";

export default function CrmRoutePage() {
  return (
    <ProtectedRoute>
      <CrmPage />
    </ProtectedRoute>
  );
}
