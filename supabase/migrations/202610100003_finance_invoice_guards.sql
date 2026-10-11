-- Finance invoice/payment guards (second line of defense behind service checks).
--
-- STATUS: PREPARED ONLY — NOT APPLIED to any database (local or remote).
-- Apply path: same as 202610100001 (non-production first, then db:verify).
-- BEFORE APPLYING: validate existing data — duplicate invoice numbers or
-- negative/overpaid rows will fail the statements below. Clean or reconcile
-- first; the finance module's manual payment-confirmation path is the honest
-- place to resolve overpayments (never silent adjustment).
--
-- CONTEXT: src/modules/finance/lib/transaction-guards.ts enforces these rules
-- in code (unique numbers per org, lifecycle transitions, payment <= balance).
-- This migration mirrors them at the database level.

-- Unique invoice numbers per organization (case-insensitive).
create unique index if not exists invoices_org_number_uidx
    on public.invoices (organization_id, lower(number));

-- Lifecycle allowlist mirrors isInvoiceTransitionAllowed (draft/sent/paid/overdue/void).
alter table public.invoices
    drop constraint if exists invoices_status_check;
alter table public.invoices
    add constraint invoices_status_check
    check (status in ('draft', 'sent', 'paid', 'overdue', 'void'));

-- Amounts are never negative and paid never exceeds the total.
alter table public.invoices
    drop constraint if exists invoices_amounts_check;
alter table public.invoices
    add constraint invoices_amounts_check
    check (subtotal >= 0 and tax_amount >= 0 and total >= 0 and amount_paid >= 0 and amount_paid <= total);

-- Manual payments are always positive.
alter table public.payments
    drop constraint if exists payments_amount_check;
alter table public.payments
    add constraint payments_amount_check
    check (amount > 0);
