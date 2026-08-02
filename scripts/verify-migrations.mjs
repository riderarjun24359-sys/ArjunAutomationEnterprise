#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const migrationsDir = join(root, "supabase", "migrations");

const requiredTables = [
    "organizations",
    "organization_members",
    "user_profiles",
    "roles",
    "permissions",
    "clients",
    "contacts",
    "companies",
    "projects",
    "project_members",
    "tasks",
    "task_comments",
    "task_labels",
    "notifications",
    "activity_logs",
    "audit_logs",
    "tax_rates",
    "estimates",
    "estimate_line_items",
    "invoices",
    "invoice_line_items",
    "payments",
    "expenses",
    "recurring_invoices",
    "ai_agents",
    "workflow_templates",
    "workflows",
    "workflow_triggers",
    "workflow_actions",
    "workflow_conditions",
    "workflow_schedules",
    "workflow_executions",
    "automation_logs",
    "analytics_dashboards",
    "analytics_widgets",
    "analytics_metrics",
    "analytics_reports",
    "organization_settings",
    "organization_branding",
    "organization_preferences",
    "organization_security_policies",
    "teams",
    "team_members",
    "organization_invitations",
    "user_preferences",
    "audit_config",
    "api_keys",
    "notification_preferences",
    "backup_configs",
    "backup_runs",
    "departments",
    "designations",
    "employees",
    "hr_teams",
    "hr_team_members",
    "attendance_records",
    "leave_types",
    "leave_requests",
    "holidays",
    "payroll_cycles",
    "payroll_entries",
    "employee_documents",
    "performance_reviews",
    "job_openings",
    "job_candidates",
    "onboarding_plans",
    "onboarding_tasks",
    "offboarding_plans",
    "offboarding_tasks",
    "org_chart_nodes",
    "product_categories",
    "products",
    "warehouses",
    "stock_levels",
    "suppliers",
    "stock_movements",
    "inventory_adjustments",
    "purchase_orders",
    "purchase_order_items",
    "assets",
    "product_barcodes",
    "low_stock_alerts",
    "stock_transfers",
    "stock_transfer_items",
    "goods_received_notes",
    "grn_items",
    "inventory_valuations",
    "inventory_audit_logs",
    "support_categories",
    "support_priorities",
    "support_slas",
    "support_queues",
    "support_tickets",
    "support_ticket_notes",
    "support_ticket_attachments",
    "support_knowledge_articles",
    "support_canned_responses",
    "support_escalation_rules",
    "support_satisfaction_ratings",
    "support_portal_settings",
    "support_audit_logs",
    "sales_pipelines",
    "sales_pipeline_stages",
    "sales_leads",
    "sales_opportunities",
    "sales_quotes",
    "sales_quote_items",
    "sales_forecasts",
    "sales_activities",
    "sales_meetings",
    "sales_call_logs",
    "sales_email_tracking",
    "sales_targets",
    "sales_commissions",
    "sales_win_loss_records",
    "sales_audit_logs",
];

const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

if (migrationFiles.length === 0) {
    console.error("FAIL: No migration files found.");
    process.exit(1);
}

const combinedSql = migrationFiles.map((file) => readFileSync(join(migrationsDir, file), "utf8")).join("\n");
const missingTables = requiredTables.filter((table) => !combinedSql.includes(`public.${table}`) && !combinedSql.includes(` ${table} (`));

if (missingTables.length > 0) {
    console.error(`FAIL: Missing tables in migrations: ${missingTables.join(", ")}`);
    process.exit(1);
}

for (const file of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    if (!sql.trim()) {
        console.error(`FAIL: Empty migration file ${file}`);
        process.exit(1);
    }
}

console.log(`PASS: ${migrationFiles.length} migration files validated.`);
console.log(`PASS: All ${requiredTables.length} required tables are present.`);
