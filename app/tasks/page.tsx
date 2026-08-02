import { ProtectedRoute } from "@/src/modules/auth/components/ProtectedRoute";
import { TasksPage } from "@/src/modules/tasks";

export default function TasksRoutePage() {
    return (
        <ProtectedRoute>
            <TasksPage />
        </ProtectedRoute>
    );
}
