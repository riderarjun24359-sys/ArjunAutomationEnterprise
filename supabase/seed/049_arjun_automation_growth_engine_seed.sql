insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a349', '11111111-1111-1111-1111-111111111111', 'Arjun Automation Growth Engine Orchestrator', 'arjun_automation_growth_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand","content","media","content_engine","founder_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a549', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a349', 'northstar-growth-engine-001', 'arjun_automation_growth_engine', 'growth_hub', '00790079-0079-0079-0079-007900790101', '{"objective":"Unified Arjun Automation growth engine"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.aage_growth_hubs (id, organization_id, hub_key, hub_name, environment, growth_tier, status)
values ('00790079-0079-0079-0079-007900790101', '11111111-1111-1111-1111-111111111111', 'northstar-growth-engine', 'Northstar Growth Engine Hub', 'production', 'growth', 'active')
on conflict (id) do nothing;

insert into public.aage_brand_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_status, status)
values ('04900100-0490-0490-0490-049001000101', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'brand-profile-0909', 'Brand Profile', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_brand_voice (id, organization_id, hub_id, voice_key, voice_name, voice_tone, status)
values ('04910101-0491-0491-0491-049101010201', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'brand-voice-0909', 'Brand Voice', 'professional', 'active')
on conflict (id) do nothing;

insert into public.aage_core_messaging (id, organization_id, hub_id, messaging_key, messaging_title, messaging_status, status)
values ('04920102-0492-0492-0492-049201020301', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'core-msg-0909', 'Core Messaging', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_brand_guidelines (id, organization_id, hub_id, guideline_key, guideline_name, guideline_status, status)
values ('04930103-0493-0493-0493-049301030401', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'brand-guide-0909', 'Brand Guidelines', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_logo_library (id, organization_id, hub_id, logo_key, logo_name, logo_format, status)
values ('04940104-0494-0494-0494-049401040501', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'logo-0909', 'Primary Logo', 'svg', 'active')
on conflict (id) do nothing;

insert into public.aage_color_systems (id, organization_id, hub_id, color_key, color_name, primary_hex, status)
values ('04950105-0495-0495-0495-049501050601', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'color-0909', 'Brand Colors', '#db2777', 'active')
on conflict (id) do nothing;

insert into public.aage_youtube_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04960106-0496-0496-0496-049601060701', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'yt-template-0909', 'YouTube Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_social_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04970107-0497-0497-0497-049701070801', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'social-template-0909', 'Social Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_blog_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04980108-0498-0498-0498-049801080901', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'blog-template-0909', 'Blog Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_website_article_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04990109-0499-0499-0499-049901090a01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'web-template-0909', 'Website Article Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_email_campaign_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('049a010a-049a-049a-049a-049a010a0b01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'email-template-0909', 'Email Campaign Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_case_study_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('049b010b-049b-049b-049b-049b010b0c01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'case-template-0909', 'Case Study Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_image_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049c010c-049c-049c-049c-049c010c0d01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'image-0909', 'Hero Image', 'hero', 'active')
on conflict (id) do nothing;

insert into public.aage_video_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049d010d-049d-049d-049d-049d010d0e01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'video-0909', 'Promo Video', 'promo', 'active')
on conflict (id) do nothing;

insert into public.aage_icon_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049e010e-049e-049e-049e-049e010e0f01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'icon-0909', 'Feature Icon', 'feature', 'active')
on conflict (id) do nothing;

insert into public.aage_voice_profiles (id, organization_id, hub_id, profile_key, profile_name, voice_type, status)
values ('049f010f-049f-049f-049f-049f010f1001', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'voice-0909', 'Narrator Voice', 'narrator', 'active')
on conflict (id) do nothing;

insert into public.aage_music_assets (id, organization_id, hub_id, asset_key, asset_name, genre, status)
values ('04a00110-04a0-04a0-04a0-04a001101101', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'music-0909', 'Brand Music', 'corporate', 'active')
on conflict (id) do nothing;

insert into public.aage_thumbnail_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04a10111-04a1-04a1-04a1-04a101111201', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'thumb-template-0909', 'Thumbnail Template', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_idea_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a20112-04a2-04a2-04a2-04a201121301', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'idea-gen-0909', 'Idea Generator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_script_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a30113-04a3-04a3-04a3-04a301131401', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'script-gen-0909', 'Script Generator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_caption_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a40114-04a4-04a4-04a4-04a401141501', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'caption-gen-0909', 'Caption Generator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_blog_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a50115-04a5-04a5-04a5-04a501151601', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'blog-gen-0909', 'Blog Generator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_seo_assistants (id, organization_id, hub_id, assistant_key, assistant_name, assistant_status, status)
values ('04a60116-04a6-04a6-04a6-04a601161701', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'seo-0909', 'SEO Assistant', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_cta_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a70117-04a7-04a7-04a7-04a701171801', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'cta-gen-0909', 'CTA Generator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_growth_metrics (id, organization_id, metrics_key, marketing_overview_score, content_calendar_count, draft_queue_count, approval_queue_count, publishing_queue_count, brand_health_score, overall_growth_score, status)
values ('04a80118-04a8-04a8-04a8-04a801181901', '11111111-1111-1111-1111-111111111111', 'aage-metrics-0909', 88.50, 12, 5, 3, 2, 92.00, 89.75, 'active')
on conflict (id) do nothing;

insert into public.aage_growth_health (id, organization_id, health_key, overall_score, brand_status, content_status, media_status, engine_status, summary, status)
values ('04a90119-04a9-04a9-04a9-04a901191a01', '11111111-1111-1111-1111-111111111111', 'aage-health-0909', 90.00, 'healthy', 'healthy', 'healthy', 'healthy', 'Arjun Automation growth engine operational', 'healthy')
on conflict (id) do nothing;

insert into public.aage_content_calendar (id, organization_id, hub_id, calendar_key, calendar_name, calendar_status, status)
values ('04aa011a-04aa-04aa-04aa-04aa011a1b01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'calendar-0909', 'Content Calendar', 'active', 'active')
on conflict (id) do nothing;

insert into public.aage_draft_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ab011b-04ab-04ab-04ab-04ab011b1c01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'draft-0909', 'Draft Content', 'draft', 'active')
on conflict (id) do nothing;

insert into public.aage_approval_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ac011c-04ac-04ac-04ac-04ac011c1d01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'approval-0909', 'Pending Approval', 'pending', 'active')
on conflict (id) do nothing;

insert into public.aage_publishing_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ad011d-04ad-04ad-04ad-04ad011d1d01', '11111111-1111-1111-1111-111111111111', '00790079-0079-0079-0079-007900790101', 'publish-0909', 'Scheduled Publish', 'scheduled', 'active')
on conflict (id) do nothing;

insert into public.aage_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('04ae011e-04ae-04ae-04ae-04ae011e1e01', '11111111-1111-1111-1111-111111111111', 'growth_hub', 'seed', 'Arjun Automation growth engine seed data loaded', 'standard')
on conflict (id) do nothing;
