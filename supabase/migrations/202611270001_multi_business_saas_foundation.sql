-- Arjun Automation multi-business SaaS catalog and domain mapping.
-- Additive migration; tenant provisioning and privileged mutations stay server-only.
BEGIN;

CREATE TABLE IF NOT EXISTS public.saas_product_catalog (
  product_key text PRIMARY KEY,
  display_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT saas_product_catalog_key_check CHECK (
    product_key IN ('school','retail','clinic','business','automation')
  )
);

INSERT INTO public.saas_product_catalog (product_key, display_name, description)
VALUES
  ('school','School Management','Admissions, students, attendance, fees and parent communication'),
  ('retail','Retail & POS','Inventory, sales, billing and supplier management'),
  ('clinic','Clinic Management','Patients, appointments and follow-ups'),
  ('business','Business Management','CRM, jobs, invoices and customer operations'),
  ('automation','AI Automation','Workflow automation, messaging and AI agents')
ON CONFLICT (product_key) DO UPDATE
SET display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    updated_at = now();

CREATE TABLE IF NOT EXISTS public.organization_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_key text NOT NULL REFERENCES public.saas_product_catalog(product_key),
  status text NOT NULL DEFAULT 'active',
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  activated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, product_key),
  CONSTRAINT organization_products_status_check CHECK (status IN ('trial','active','suspended','cancelled'))
);

CREATE TABLE IF NOT EXISTS public.organization_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  hostname text NOT NULL UNIQUE,
  domain_type text NOT NULL DEFAULT 'subdomain',
  verification_status text NOT NULL DEFAULT 'pending',
  is_primary boolean NOT NULL DEFAULT false,
  verification_token text,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organization_domains_type_check CHECK (domain_type IN ('subdomain','custom')),
  CONSTRAINT organization_domains_status_check CHECK (verification_status IN ('pending','verified','failed','disabled')),
  CONSTRAINT organization_domains_hostname_check CHECK (
    hostname = lower(hostname) AND hostname !~ '[[:space:]]' AND length(hostname) <= 253
  )
);

CREATE INDEX IF NOT EXISTS organization_products_org_idx ON public.organization_products(organization_id);
CREATE INDEX IF NOT EXISTS organization_domains_org_idx ON public.organization_domains(organization_id);
CREATE INDEX IF NOT EXISTS organization_domains_verified_host_idx
  ON public.organization_domains(hostname) WHERE verification_status = 'verified';

ALTER TABLE public.saas_product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_domains ENABLE ROW LEVEL SECURITY;

-- Explicit browser-role grants: RLS policies below further restrict SELECT.
-- No anonymous access and no browser-side writes to these platform tables.
REVOKE ALL ON TABLE public.saas_product_catalog FROM anon, authenticated;
REVOKE ALL ON TABLE public.organization_products FROM anon, authenticated;
REVOKE ALL ON TABLE public.organization_domains FROM anon, authenticated;
GRANT SELECT ON TABLE public.saas_product_catalog TO authenticated;
GRANT SELECT ON TABLE public.organization_products TO authenticated;
GRANT SELECT ON TABLE public.organization_domains TO authenticated;

DROP POLICY IF EXISTS saas_product_catalog_read ON public.saas_product_catalog;
CREATE POLICY saas_product_catalog_read ON public.saas_product_catalog
  FOR SELECT TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS organization_products_member_read ON public.organization_products;
CREATE POLICY organization_products_member_read ON public.organization_products
  FOR SELECT TO authenticated USING (public.is_organization_member(organization_id));

DROP POLICY IF EXISTS organization_domains_member_read ON public.organization_domains;
CREATE POLICY organization_domains_member_read ON public.organization_domains
  FOR SELECT TO authenticated USING (public.is_organization_member(organization_id));

-- No browser mutation policies are intentionally created. Provisioning,
-- entitlements, and domain verification are handled by trusted server code.

COMMIT;
