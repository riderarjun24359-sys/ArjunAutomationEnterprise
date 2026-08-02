import { EmptyState as SharedEmptyState } from "@/src/components/ui/EmptyState";

interface TaskEmptyStateProps {
    title?: string;
    description?: string;
}

export function EmptyState({
    title = "No tasks found",
    description = "Create a new task or adjust your filters to see results.",
}: TaskEmptyStateProps) {
    return <SharedEmptyState title={title} description={description} />;
}
