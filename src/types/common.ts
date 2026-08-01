export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface ApiErrorResponse {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
}
