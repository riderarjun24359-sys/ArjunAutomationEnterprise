import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";
import { ProjectsPage } from "@/src/modules/projects";

export default function ProjectsRoutePage() {
  return (
    <ProtectedRoute>
      <ProjectsPage />
    </ProtectedRoute>
  );
}
