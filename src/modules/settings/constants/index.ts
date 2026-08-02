export const SETTINGS_TABS = {
    overview: "overview",
    organization: "organization",
    team: "team",
    roles: "roles",
    branding: "branding",
    preferences: "preferences",
    security: "security",
    audit: "audit",
    integrations: "integrations",
    notifications: "notifications",
    backup: "backup",
} as const;

export const ROLE_OPTIONS = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "member", label: "Member" },
    { value: "viewer", label: "Viewer" },
] as const;

export const THEME_OPTIONS = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
] as const;

export const API_KEY_ENV_OPTIONS = [
    { value: "live", label: "Production" },
    { value: "test", label: "Test" },
    { value: "hook", label: "Webhook" },
] as const;
