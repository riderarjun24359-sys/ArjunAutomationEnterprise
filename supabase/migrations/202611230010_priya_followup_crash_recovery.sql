-- Fail closed when a dispatcher worker disappears after claiming a follow-up.
-- The provider may already have accepted the call; automatically retrying could call a prospect twice.
create index if not exists ai_sales_followups_processing_updated_idx
    on public.ai_sales_followups (updated_at)
    where status = 'processing';

create or replace function public.claim_due_ai_sales_followups(
    p_organization_id uuid,
    p_limit integer default 10
)
returns table (
    followup_id uuid,
    organization_id uuid,
    lead_id uuid,
    consent_id uuid,
    phone_number text,
    purpose text,
    idempotency_key text,
    lead_name text,
    company_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
    if p_organization_id is null then
        raise exception 'organization_id is required';
    end if;

    -- A worker may have crashed after sending the provider request. Do not
    -- blindly retry: move stale claims to failed for founder/manual review.
    update public.ai_sales_followups
       set status = 'failed',
           last_error = 'Dispatcher interrupted after claim; provider outcome unknown. Manual review required before retry.',
           updated_at = now()
     where organization_id = p_organization_id
       and status = 'processing'
       and updated_at < now() - interval '15 minutes';

    if extract(dow from now() at time zone 'Asia/Kolkata') = 0
       or extract(hour from now() at time zone 'Asia/Kolkata') < 9
       or extract(hour from now() at time zone 'Asia/Kolkata') >= 19 then
        return;
    end if;

    return query
    with candidates as (
        select f.id
        from public.ai_sales_followups f
        join public.ai_voice_contact_consents c
          on c.id = f.consent_id
         and c.organization_id = f.organization_id
         and c.phone_number = (
             select l.phone from public.sales_leads l
             where l.id = f.lead_id and l.organization_id = f.organization_id
         )
         and c.purpose = f.purpose
         and c.revoked_at is null
         and c.granted_at <= now()
         and c.granted_at >= now() - interval '30 days'
        where f.organization_id = p_organization_id
          and f.status = 'pending'
          and f.attempt_count < 5
          and f.due_at <= now()
          and not exists (
              select 1 from public.ai_sales_suppressions s
              where s.organization_id = f.organization_id
                and s.phone_number = c.phone_number
          )
        order by f.due_at asc
        limit greatest(1, least(coalesce(p_limit, 10), 25))
        for update of f skip locked
    ),
    claimed as (
        update public.ai_sales_followups f
           set status = 'processing',
               attempt_count = f.attempt_count + 1,
               updated_at = now()
          from candidates x
         where f.id = x.id
        returning f.*
    )
    select f.id, f.organization_id, f.lead_id, f.consent_id,
           l.phone, f.purpose, f.idempotency_key,
           l.lead_name, l.company_name
      from claimed f
      join public.sales_leads l
        on l.id = f.lead_id
       and l.organization_id = f.organization_id
      join public.ai_voice_contact_consents c
        on c.id = f.consent_id
       and c.organization_id = f.organization_id
       and c.phone_number = l.phone;
end;
$$;

revoke all on function public.claim_due_ai_sales_followups(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_due_ai_sales_followups(uuid, integer) to service_role;
