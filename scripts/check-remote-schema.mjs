#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.");
    process.exit(1);
}

const requiredTables = [
    "organizations",
    "user_profiles",
    "clients",
    "projects",
    "tasks",
    "audit_logs",
    "tax_rates",
    "estimates",
    "invoices",
    "payments",
    "expenses",
    "recurring_invoices",
    "ai_agents",
    "workflows",
    "workflow_executions",
    "automation_logs",
    "analytics_dashboards",
    "analytics_metrics",
    "analytics_reports",
    "organization_settings",
    "teams",
    "api_keys",
    "backup_configs",
    "departments",
    "employees",
    "leave_requests",
    "payroll_cycles",
    "job_openings",
    "product_categories",
    "products",
    "warehouses",
    "purchase_orders",
    "assets",
    "support_tickets",
    "support_queues",
    "sales_opportunities",
    "sales_leads",
    "document_folders",
    "documents",
    "ai_providers",
    "ai_orchestration_agents",
    "knowledge_entries",
    "ba_engagements",
    "sa_engagements",
    "df_engagements",
    "qa_engagements",
    "dd_engagements",
];

const supabase = createClient(url, anonKey);
const results = [];

for (const table of requiredTables) {
    const { error } = await supabase.from(table).select("id").limit(1);
    results.push({ table, ok: !error, error: error?.message ?? null });
}

const missing = results.filter((result) => !result.ok);

if (missing.length > 0) {
    console.error("FAIL: Remote schema check failed.");
    for (const item of missing) {
        console.error(`- ${item.table}: ${item.error}`);
    }
    process.exit(1);
}

console.log("PASS: Remote Supabase schema is available for all core tables.");
