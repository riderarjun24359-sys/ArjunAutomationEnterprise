insert into public.document_folders (id, organization_id, parent_folder_id, name, slug, description)
values
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', '11111111-1111-1111-1111-111111111111', null, 'Company Documents', 'company', 'Root folder for company-wide documents'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f102', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'Legal', 'legal', 'Contracts, agreements, and legal documents'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f103', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'Finance', 'finance', 'Invoices, reports, and financial records'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f104', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'Projects', 'projects', 'Project deliverables and documentation')
on conflict (id) do nothing;

insert into public.documents (id, organization_id, folder_id, title, file_name, file_url, mime_type, file_size, status, current_version, client_id, project_id, sales_opportunity_id)
values
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f102', 'Northstar Master Service Agreement', 'northstar-msa-v3.pdf', 'https://storage.example.com/docs/northstar-msa-v3.pdf', 'application/pdf', 524288, 'active', 3, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401'),
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f103', 'Q2 2026 Financial Report', 'q2-2026-financial-report.xlsx', 'https://storage.example.com/docs/q2-2026-financial-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1048576, 'active', 1, null, null, null),
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f104', 'Northstar Expansion SOW', 'northstar-sow-v1.docx', 'https://storage.example.com/docs/northstar-sow-v1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 262144, 'active', 1, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', null)
on conflict (id) do nothing;

insert into public.document_tags (id, organization_id, name, color)
values
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f301', '11111111-1111-1111-1111-111111111111', 'Contract', '#3b82f6'),
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f302', '11111111-1111-1111-1111-111111111111', 'Financial', '#22c55e'),
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f303', '11111111-1111-1111-1111-111111111111', 'Confidential', '#ef4444')
on conflict (id) do nothing;

insert into public.document_tag_links (id, document_id, tag_id)
values
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f401', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f301'),
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f402', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f303'),
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f403', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f302')
on conflict (id) do nothing;

insert into public.document_versions (id, organization_id, document_id, version_number, file_url, file_size, change_summary)
values
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f501', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 1, 'https://storage.example.com/docs/northstar-msa-v1.pdf', 480000, 'Initial draft'),
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f502', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 2, 'https://storage.example.com/docs/northstar-msa-v2.pdf', 510000, 'Legal review updates'),
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f503', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 3, 'https://storage.example.com/docs/northstar-msa-v3.pdf', 524288, 'Final signed version')
on conflict (id) do nothing;

insert into public.document_approvals (id, organization_id, document_id, approver_id, status, comments, decided_at)
values
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f601', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'approved', 'Legal terms reviewed and approved', '2026-07-25 10:00:00+00'),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f602', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'pending', 'Awaiting project manager review', null)
on conflict (id) do nothing;

insert into public.document_esign_preparations (id, organization_id, document_id, signer_name, signer_email, status, sent_at)
values
  ('f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f7f701', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'Mina Park', 'ops@northstarlabs.com', 'sent', '2026-07-28 14:00:00+00')
on conflict (id) do nothing;

insert into public.document_shares (id, organization_id, document_id, share_token, recipient_email, permission_level, expires_at, is_active)
values
  ('f8f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f801', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'share-northstar-msa-2026', 'ops@northstarlabs.com', 'view', '2026-12-31 23:59:59+00', true),
  ('f8f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f802', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', 'share-northstar-sow-2026', 'mina@northstarlabs.com', 'comment', '2026-09-30 23:59:59+00', true)
on conflict (id) do nothing;

insert into public.document_access_grants (id, organization_id, document_id, folder_id, grantee_type, grantee_id, permission_level)
values
  ('f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f901', '11111111-1111-1111-1111-111111111111', null, 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f102', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'edit'),
  ('f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f902', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', null, 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'view')
on conflict (id) do nothing;

insert into public.document_templates (id, organization_id, name, category, description, template_content, status)
values
  ('fafafafa-fafa-fafa-fafa-fafafafafa01', '11111111-1111-1111-1111-111111111111', 'Master Service Agreement', 'legal', 'Standard MSA template for enterprise clients', 'This Master Service Agreement is entered into between {{company_name}} and {{client_name}}...', 'active'),
  ('fafafafa-fafa-fafa-fafa-fafafafafa02', '11111111-1111-1111-1111-111111111111', 'Statement of Work', 'projects', 'Project SOW template with deliverables section', 'Statement of Work for {{project_name}}. Deliverables: {{deliverables_list}}...', 'active')
on conflict (id) do nothing;

insert into public.document_previews (id, organization_id, document_id, preview_type, preview_url, page_count)
values
  ('fbfbfbfb-fbfb-fbfb-fbfb-fbfbfbfbfb01', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'thumbnail', 'https://storage.example.com/previews/northstar-msa-thumb.png', 12),
  ('fbfbfbfb-fbfb-fbfb-fbfb-fbfbfbfbfb02', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', 'thumbnail', 'https://storage.example.com/previews/q2-report-thumb.png', 8)
on conflict (id) do nothing;

insert into public.document_search_index (id, organization_id, document_id, search_text)
values
  ('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfc01', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'Northstar Master Service Agreement MSA contract legal terms enterprise'),
  ('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfc02', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', 'Q2 2026 Financial Report revenue expenses balance sheet'),
  ('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfc03', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', 'Northstar Expansion SOW statement of work deliverables scope')
on conflict (id) do nothing;

insert into public.document_retention_policies (id, organization_id, name, retention_days, action_on_expiry, applies_to_category, is_active)
values
  ('fdfdfdfd-fdfd-fdfd-fdfd-fdfdfdfdfd01', '11111111-1111-1111-1111-111111111111', 'Legal Documents — 7 Year Retention', 2555, 'archive', 'legal', true),
  ('fdfdfdfd-fdfd-fdfd-fdfd-fdfdfdfdfd02', '11111111-1111-1111-1111-111111111111', 'Financial Records — 5 Year Retention', 1825, 'archive', 'finance', true)
on conflict (id) do nothing;

insert into public.document_archives (id, organization_id, document_id, archived_at, restore_available)
values
  ('fefefefe-fefe-fefe-fefe-fefefefefe01', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', '2026-01-15 00:00:00+00', false)
on conflict (id) do nothing;

insert into public.document_activity_logs (id, organization_id, document_id, activity_type, summary)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff91', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'upload', 'Document uploaded: Northstar Master Service Agreement'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff92', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'version', 'Version 3 uploaded with legal review changes'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff93', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'share', 'Document shared with ops@northstarlabs.com'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff94', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'approval', 'Document approved by legal team')
on conflict (id) do nothing;

insert into public.document_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff95', '11111111-1111-1111-1111-111111111111', 'document', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'create', 'Document Northstar Master Service Agreement created'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff96', '11111111-1111-1111-1111-111111111111', 'folder', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'create', 'Root folder Company Documents created')
on conflict (id) do nothing;
