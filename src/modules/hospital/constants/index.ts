export const HSP_TABS = {
    overview: "overview",
    hospitalHubs: "hospitalHubs",
    campuses: "campuses",
    departments: "departments",
    wards: "wards",
    hospitalBeds: "hospitalBeds",
    patientRegistrations: "patientRegistrations",
    patientProfiles: "patientProfiles",
    medicalHistories: "medicalHistories",
    insurancePolicies: "insurancePolicies",
    appointments: "appointments",
    opdVisits: "opdVisits",
    ipdAdmissions: "ipdAdmissions",
    clinicalNotes: "clinicalNotes",
    pharmacyInventory: "pharmacyInventory",
    prescriptions: "prescriptions",
    labOrders: "labOrders",
    labResults: "labResults",
    hospitalBilling: "hospitalBilling",
    insuranceClaims: "insuranceClaims",
    hospitalInvoices: "hospitalInvoices",
    hospitalPayments: "hospitalPayments",
    patientNotifications: "patientNotifications",
    medicalReports: "medicalReports",
    patientFeedback: "patientFeedback",
    patientRegistrationsAnalytics: "patientRegistrationsAnalytics",
    occupancyAnalytics: "occupancyAnalytics",
    revenueAnalytics: "revenueAnalytics",
    hospitalMetrics: "hospitalMetrics",
    hospitalHealth: "hospitalHealth",
    executiveKpis: "executiveKpis",
    hospitalFailures: "hospitalFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const REGISTRATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "waitlisted", label: "Waitlisted" },
] as const;

export const APPOINTMENT_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const BED_STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
    { value: "reserved", label: "Reserved" },
] as const;

export const PRESCRIPTION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "dispensed", label: "Dispensed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const IPD_ADMISSION_STATUS_OPTIONS = [
    { value: "admitted", label: "Admitted" },
    { value: "discharged", label: "Discharged" },
    { value: "transferred", label: "Transferred" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const HSP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "waiting", label: "Waiting" },
    { value: "completed", label: "Completed" },
    { value: "available", label: "Available" },
] as const;

export const HSP_PERMISSIONS = ["hsp.view", "hsp.manage", "hsp.approve", "hsp.admin"] as const;


export const HSP_THEME = {
    primary: "cyan-600",
    primaryHover: "cyan-500",
    ring: "cyan-500/20",
    text: "text-cyan-600",
    textDark: "dark:text-cyan-400",
    bg: "bg-cyan-600",
    bgHover: "hover:bg-cyan-500",
} as const;
