insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a337', '11111111-1111-1111-1111-111111111111', 'Enterprise Dynamic Document Orchestrator', 'enterprise_dynamic_document_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["document_registry","template_engine","generation_engine","digital_signature","storage_engine","delivery_engine","document_analytics","document_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a537', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a337', 'northstar-document-engine-001', 'enterprise_dynamic_document_engine', 'document_hub', '006d006d-006d-006d-006d-006d006d0101', '{"objective":"Enterprise dynamic document engine for northstar operational documents"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Document Hub
insert into public.dde_document_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('006d006d-006d-006d-006d-006d006d0101', '11111111-1111-1111-1111-111111111111', 'northstar-document-engine', 'Northstar Document Engine Hub', 'production', 'active')
on conflict (id) do nothing;

-- M1 Document Registry
insert into public.dde_document_types (id, organization_id, hub_id, type_key, type_name, type_category, status)
values ('006e006e-006e-006e-006e-006e006e0201', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'type-invoice-0804', 'Invoice Document', 'financial', 'active')
on conflict (id) do nothing;

insert into public.dde_document_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)
values ('006f006f-006f-006f-006f-006f006f0301', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'cat-ops-0804', 'Operations', 'operational', 'active')
on conflict (id) do nothing;

insert into public.dde_document_templates (id, organization_id, hub_id, template_key, template_name, template_type, status)
values ('00700070-0070-0070-0070-007000700401', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'tpl-std-0804', 'Standard Invoice Template', 'standard', 'active')
on conflict (id) do nothing;

insert into public.dde_document_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)
values ('00710071-0071-0071-0071-007100710501', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'ver-1-0-0', '1.0.0', 'stable', 'active')
on conflict (id) do nothing;

-- M2 Template Engine
insert into public.dde_template_headers (id, organization_id, hub_id, header_key, header_name, header_content, status)
values ('00720072-0072-0072-0072-007200720601', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'hdr-logo-0804', 'Company Logo Header', 'Logo placeholder', 'active')
on conflict (id) do nothing;

insert into public.dde_template_footers (id, organization_id, hub_id, footer_key, footer_name, footer_content, status)
values ('00730073-0073-0073-0073-007300730701', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'ftr-legal-0804', 'Legal Footer', 'Terms and conditions', 'active')
on conflict (id) do nothing;

insert into public.dde_template_sections (id, organization_id, hub_id, section_key, section_name, section_type, status)
values ('00740074-0074-0074-0074-007400740801', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'sec-body-0804', 'Body Section', 'body', 'active')
on conflict (id) do nothing;

insert into public.dde_template_variables (id, organization_id, hub_id, variable_key, variable_name, variable_type, status)
values ('00750075-0075-0075-0075-007500750901', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'var-amount-0804', 'Amount Variable', 'number', 'active')
on conflict (id) do nothing;

-- M3 Generation Engine
insert into public.dde_pdf_generations (id, organization_id, hub_id, generation_key, generation_name, generation_status, status)
values ('00760076-0076-0076-0076-007600760a01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'gen-pdf-0804', 'Invoice PDF Generation #42', 'running', 'active')
on conflict (id) do nothing;

insert into public.dde_html_generations (id, organization_id, hub_id, generation_key, generation_name, generation_status, status)
values ('00770077-0077-0077-0077-007700770b01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'gen-html-0804', 'Invoice HTML Generation', 'completed', 'active')
on conflict (id) do nothing;

insert into public.dde_export_jobs (id, organization_id, hub_id, job_key, job_name, job_status, status)
values ('00780078-0078-0078-0078-007800780c01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'job-export-0804', 'Bulk Export Job', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dde_batch_generations (id, organization_id, hub_id, batch_key, batch_name, batch_status, status)
values ('00790079-0079-0079-0079-007900790d01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'batch-gen-0804', 'Monthly Batch Generation', 'running', 'active')
on conflict (id) do nothing;

-- M4 Digital Signature
insert into public.dde_electronic_signatures (id, organization_id, hub_id, signature_key, signature_name, signature_status, status)
values ('007a007a-007a-007a-007a-007a007a0e01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'sig-elect-0804', 'Electronic Signature', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dde_approval_signatures (id, organization_id, hub_id, signature_key, signature_name, signature_status, status)
values ('007b007b-007b-007b-007b-007b007b0f01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'sig-approve-0804', 'Manager Approval Signature', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dde_signature_verifications (id, organization_id, hub_id, verification_key, verification_status, verification_result, status)
values ('007c007c-007c-007c-007c-007c007c1001', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'ver-sig-0804', 'pending', '', 'active')
on conflict (id) do nothing;

insert into public.dde_signature_audit_entries (id, organization_id, hub_id, audit_key, audit_action, audit_summary, status)
values ('007d007d-007d-007d-007d-007d007d1101', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'aud-sig-0804', 'sign', 'Signature audit entry recorded', 'active')
on conflict (id) do nothing;

-- M5 Storage Engine
insert into public.dde_version_histories (id, organization_id, hub_id, history_key, history_version, history_summary, status)
values ('007e007e-007e-007e-007e-007e007e1201', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'hist-v1-0804', '1.0.0', 'Initial version recorded', 'active')
on conflict (id) do nothing;

insert into public.dde_retention_policies (id, organization_id, hub_id, policy_key, policy_name, retention_days, status)
values ('007f007f-007f-007f-007f-007f007f1301', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'pol-ret-0804', '7 Year Retention', 2555, 'active')
on conflict (id) do nothing;

insert into public.dde_archive_records (id, organization_id, hub_id, archive_key, archive_name, archive_status, status)
values ('00800080-0080-0080-0080-008000801401', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'arc-old-0804', 'Archived Invoice Batch', 'archived', 'active')
on conflict (id) do nothing;

insert into public.dde_sharing_policies (id, organization_id, hub_id, policy_key, policy_name, sharing_scope, status)
values ('00810081-0081-0081-0081-008100811501', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'pol-share-0804', 'Organization Sharing', 'organization', 'active')
on conflict (id) do nothing;

-- M6 Delivery Engine
insert into public.dde_email_deliveries (id, organization_id, hub_id, delivery_key, delivery_name, delivery_status, status)
values ('00820082-0082-0082-0082-008200821601', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'del-email-0804', 'Email Delivery', 'pending', 'active')
on conflict (id) do nothing;

insert into public.dde_download_deliveries (id, organization_id, hub_id, delivery_key, delivery_name, delivery_status, status)
values ('00830083-0083-0083-0083-008300831701', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'del-dl-0804', 'Download Delivery', 'ready', 'active')
on conflict (id) do nothing;

insert into public.dde_webhook_deliveries (id, organization_id, hub_id, delivery_key, delivery_name, delivery_status, status)
values ('00840084-0084-0084-0084-008400841801', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'del-hook-0804', 'Webhook Delivery', 'pending', 'active')
on conflict (id) do nothing;

-- M7 Document Analytics
insert into public.dde_generation_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00850085-0085-0085-0085-008500851901', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'anly-gen-0804', 'generation', 94.50, 'active')
on conflict (id) do nothing;

insert into public.dde_delivery_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00860086-0086-0086-0086-008600861a01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'anly-del-0804', 'delivery', 96.00, 'active')
on conflict (id) do nothing;

insert into public.dde_storage_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)
values ('00870087-0087-0087-0087-008700871b01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'anly-stor-0804', 'storage', 92.00, 'active')
on conflict (id) do nothing;

-- M8 Document Dashboard
insert into public.dde_document_metrics (id, organization_id, metrics_key, generated_count, download_count, delivery_success_rate, failure_count, signature_pending_count, storage_usage_mb, overall_document_score, status)
values ('00880088-0088-0088-0088-008800881c01', '11111111-1111-1111-1111-111111111111', 'doc-metrics-0804', 1250, 980, 97.50, 12, 8, 512.50, 94.75, 'active')
on conflict (id) do nothing;

insert into public.dde_document_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_signatures_count, delivery_queue_depth, framework_health_status, summary, status)
values ('00890089-0089-0089-0089-008900891d01', '11111111-1111-1111-1111-111111111111', 'doc-health-0804', 95.00, false, 8, 3, 'healthy', 'Dynamic document engine operational', 'healthy')
on conflict (id) do nothing;

insert into public.dde_pending_signatures (id, organization_id, hub_id, signature_key, signature_name, signature_status, status)
values ('00900090-0090-0090-0090-009000901e01', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'sig-pend-0804', 'Pending Client Signature', 'pending', 'open')
on conflict (id) do nothing;

insert into public.dde_document_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00910091-0091-0091-0091-009100912001', '11111111-1111-1111-1111-111111111111', '006d006d-006d-006d-006d-006d006d0101', 'fail-doc-0804', 'generation', 'DOC_TIMEOUT', 'Document generation timed out', 'open')
on conflict (id) do nothing;

insert into public.dde_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00920092-0092-0092-0092-009200922101', '11111111-1111-1111-1111-111111111111', 'document_hub', 'seed', 'Enterprise dynamic document engine seed data loaded', 'standard')
on conflict (id) do nothing;
