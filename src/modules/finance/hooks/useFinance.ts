"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { INVOICE_STATUS_FILTERS } from "@/src/modules/finance/constants";
import { financeService } from "@/src/modules/finance/services/finance.service";
import type {
    CreateEstimateInput,
    CreateExpenseInput,
    CreateInvoiceInput,
    CreatePaymentInput,
    CreateRecurringInvoiceInput,
    CreateTaxRateInput,
    Estimate,
    Expense,
    FinanceClientOption,
    FinanceDashboardStats,
    FinanceProjectOption,
    FinanceReportSummary,
    Invoice,
    InvoiceStatusFilter,
    Payment,
    RecurringInvoice,
    TaxRate,
} from "@/src/modules/finance/types";

export function useFinance() {
    const user = useAuthStore((state) => state.user);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
    const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
    const [clients, setClients] = useState<FinanceClientOption[]>([]);
    const [projects, setProjects] = useState<FinanceProjectOption[]>([]);
    const [stats, setStats] = useState<FinanceDashboardStats | null>(null);
    const [reports, setReports] = useState<FinanceReportSummary | null>(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>(INVOICE_STATUS_FILTERS.all);

    const fetchFinanceData = useCallback(async () => {
        if (!user) {
            return {
                invoiceList: [],
                estimateList: [],
                paymentList: [],
                expenseList: [],
                recurringList: [],
                taxRateList: [],
                clientList: [],
                projectList: [],
                dashboardStats: null,
                reportSummary: null,
            };
        }

        const [
            invoiceList,
            estimateList,
            paymentList,
            expenseList,
            recurringList,
            taxRateList,
            clientList,
            projectList,
            dashboardStats,
            reportSummary,
        ] = await Promise.all([
            financeService.getInvoices(user.id, user.email, user.fullName),
            financeService.getEstimates(user.id, user.email, user.fullName),
            financeService.getPayments(user.id, user.email, user.fullName),
            financeService.getExpenses(user.id, user.email, user.fullName),
            financeService.getRecurringInvoices(user.id, user.email, user.fullName),
            financeService.getTaxRates(user.id, user.email, user.fullName),
            financeService.getClientOptions(user.id, user.email, user.fullName),
            financeService.getProjectOptions(user.id, user.email, user.fullName),
            financeService.getDashboardStats(user.id, user.email, user.fullName),
            financeService.getReportSummary(user.id, user.email, user.fullName),
        ]);

        return {
            invoiceList,
            estimateList,
            paymentList,
            expenseList,
            recurringList,
            taxRateList,
            clientList,
            projectList,
            dashboardStats,
            reportSummary,
        };
    }, [user]);

    const loadData = useCallback(async () => {
        const data = await fetchFinanceData();
        setInvoices(data.invoiceList);
        setEstimates(data.estimateList);
        setPayments(data.paymentList);
        setExpenses(data.expenseList);
        setRecurringInvoices(data.recurringList);
        setTaxRates(data.taxRateList);
        setClients(data.clientList);
        setProjects(data.projectList);
        setStats(data.dashboardStats);
        setReports(data.reportSummary);
        setLoading(false);
    }, [fetchFinanceData]);

    useEffect(() => {
        let cancelled = false;

        void fetchFinanceData().then((data) => {
            if (cancelled) return;
            setInvoices(data.invoiceList);
            setEstimates(data.estimateList);
            setPayments(data.paymentList);
            setExpenses(data.expenseList);
            setRecurringInvoices(data.recurringList);
            setTaxRates(data.taxRateList);
            setClients(data.clientList);
            setProjects(data.projectList);
            setStats(data.dashboardStats);
            setReports(data.reportSummary);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [fetchFinanceData]);

    const selectInvoice = useCallback((id: string) => {
        setSelectedInvoiceId(id);
    }, []);

    const selectedInvoice = useMemo(() => {
        if (!selectedInvoiceId) return null;
        return invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null;
    }, [invoices, selectedInvoiceId]);

    const createInvoice = useCallback(async (input: CreateInvoiceInput) => {
        if (!user) throw new Error("Authentication required");
        const invoice = await financeService.createInvoice(user.id, user.email, input, user.fullName);
        await loadData();
        setSelectedInvoiceId(invoice.id);
        return invoice;
    }, [user, loadData]);

    const createEstimate = useCallback(async (input: CreateEstimateInput) => {
        if (!user) throw new Error("Authentication required");
        const estimate = await financeService.createEstimate(user.id, user.email, input, user.fullName);
        await loadData();
        return estimate;
    }, [user, loadData]);

    const convertEstimateToInvoice = useCallback(async (estimateId: string) => {
        if (!user) throw new Error("Authentication required");
        const invoice = await financeService.convertEstimateToInvoice(user.id, user.email, estimateId, user.fullName);
        await loadData();
        setSelectedInvoiceId(invoice.id);
        return invoice;
    }, [user, loadData]);

    const createPayment = useCallback(async (input: CreatePaymentInput) => {
        if (!user) throw new Error("Authentication required");
        const payment = await financeService.createPayment(user.id, user.email, input, user.fullName);
        await loadData();
        return payment;
    }, [user, loadData]);

    const createExpense = useCallback(async (input: CreateExpenseInput) => {
        if (!user) throw new Error("Authentication required");
        const expense = await financeService.createExpense(user.id, user.email, input, user.fullName);
        await loadData();
        return expense;
    }, [user, loadData]);

    const createRecurringInvoice = useCallback(async (input: CreateRecurringInvoiceInput) => {
        if (!user) throw new Error("Authentication required");
        const recurring = await financeService.createRecurringInvoice(user.id, user.email, input, user.fullName);
        await loadData();
        return recurring;
    }, [user, loadData]);

    const createTaxRate = useCallback(async (input: CreateTaxRateInput) => {
        if (!user) throw new Error("Authentication required");
        const taxRate = await financeService.createTaxRate(user.id, user.email, input, user.fullName);
        await loadData();
        return taxRate;
    }, [user, loadData]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((invoice) => {
            if (statusFilter !== INVOICE_STATUS_FILTERS.all && invoice.status !== statusFilter) return false;
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                invoice.number.toLowerCase().includes(query) ||
                invoice.clientName.toLowerCase().includes(query) ||
                (invoice.projectName ?? "").toLowerCase().includes(query)
            );
        });
    }, [invoices, statusFilter, searchQuery]);

    return {
        invoices: filteredInvoices,
        allInvoices: invoices,
        estimates,
        payments,
        expenses,
        recurringInvoices,
        taxRates,
        clients,
        projects,
        stats,
        reports,
        selectedInvoice,
        loading,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        selectInvoice,
        createInvoice,
        createEstimate,
        convertEstimateToInvoice,
        createPayment,
        createExpense,
        createRecurringInvoice,
        createTaxRate,
        refresh: loadData,
    };
}
