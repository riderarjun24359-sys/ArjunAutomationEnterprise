import { formatDistanceToNow } from "date-fns";

export const formatRelativeTimestamp = (isoDate: string): string => {
    try {
        return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
    } catch {
        return isoDate;
    }
};

export const formatDateLabel = (isoDate?: string | null): string => {
    if (!isoDate) {
        return "—";
    }

    return isoDate.slice(0, 10);
};
