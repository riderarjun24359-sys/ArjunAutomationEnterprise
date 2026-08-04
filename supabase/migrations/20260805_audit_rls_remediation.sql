/**
 * Production remediation: org-scoped audit_logs RLS policies.
 * Apply: psql $SUPABASE_DB_URL -f supabase/migrations/20260805_audit_rls_remediation.sql
 */
drop policy if exists audit_logs_select on public.audit_logs;
drop policy if exists audit_logs_insert on public.audit_logs;
drop policy if exists audit_logs_update on public.audit_logs;
drop policy if exists audit_logs_delete on public.audit_logs;

create policy audit_logs_select on public.audit_logs
    for select using (
        organization_id is null
        or public.is_organization_member(organization_id)
    );

create policy audit_logs_insert on public.audit_logs
    for insert with check (
        organization_id is null
        or public.is_organization_member(organization_id)
    );

create policy audit_logs_update on public.audit_logs
    for update using (
        organization_id is null
        or public.is_organization_member(organization_id)
    );

create policy audit_logs_delete on public.audit_logs
    for delete using (
        organization_id is null
        or public.is_organization_member(organization_id)
    );
