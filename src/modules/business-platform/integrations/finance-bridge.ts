import { financeService } from "@/src/modules/finance/services/finance.service";
import type { Invoice, Payment } from "@/src/modules/finance/types";

export async function fetchInvoices(authUserId: string, email: string, fullName?: string | null): Promise<Invoice[]> {
    return financeService.getInvoices(authUserId, email, fullName);
}

export async function fetchPayments(authUserId: string, email: string, fullName?: string | null): Promise<Payment[]> {
    return financeService.getPayments(authUserId, email, fullName);
}

export async function fetchFinanceStats(authUserId: string, email: string, fullName?: string | null) {
    return financeService.getDashboardStats(authUserId, email, fullName);
}
