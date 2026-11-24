-- Remove unnecessary direct Data API privileges from the anonymous role.
-- RLS remains enabled; this is defense-in-depth and prevents anon from
-- reaching internal business tables at the SQL privilege layer.
--
-- Observed on production 2026-11-24:
-- ai_agents, invoices, payments, workflow_executions, workflows
-- each had SELECT/INSERT/UPDATE/DELETE granted to anon.
--
-- Deliberately does not change authenticated or service_role grants.

begin;

revoke all privileges on table
  public.ai_agents,
  public.invoices,
  public.payments,
  public.workflow_executions,
  public.workflows
from anon;

commit;

-- Post-migration verification (run separately after applying):
-- select table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
--   and grantee = 'anon'
--   and table_name in (
--     'ai_agents',
--     'invoices',
--     'payments',
--     'workflow_executions',
--     'workflows'
--   )
-- order by table_name, privilege_type;
-- Expected: zero rows.
--
-- Also verify authenticated/service_role grants and RLS policies remain
-- intact before enabling production traffic.
