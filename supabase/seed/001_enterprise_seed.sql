insert into public.organizations (id, name, slug, status, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'Acme Enterprise', 'acme-enterprise', 'active', '{"industry":"software"}'::jsonb)
on conflict (id) do nothing;

insert into public.user_profiles (id, auth_user_id, email, full_name, locale, metadata)
values
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'admin@acme.example', 'System Admin', 'en', '{"role":"super_admin"}'::jsonb)
on conflict (id) do nothing;

insert into public.organization_members (organization_id, user_id, role_name, is_active)
values
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'super_admin', true)
on conflict (organization_id, user_id) do nothing;

insert into public.permission_definitions (key, description)
values
  ('dashboard.view', 'View dashboard'),
  ('projects.manage', 'Manage projects'),
  ('clients.manage', 'Manage clients')
on conflict (key) do nothing;

insert into public.role_permissions (role_name, permission_key, action)
values
  ('super_admin', 'dashboard.view', 'manage'),
  ('super_admin', 'projects.manage', 'manage'),
  ('super_admin', 'clients.manage', 'manage')
on conflict (role_name, permission_key, action) do nothing;
