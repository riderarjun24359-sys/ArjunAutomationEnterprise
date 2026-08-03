"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { HSP_THEME, REGISTRATION_STATUS_OPTIONS, APPOINTMENT_STATUS_OPTIONS, BED_STATUS_OPTIONS, IPD_ADMISSION_STATUS_OPTIONS, PRESCRIPTION_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/hospital/constants";
import type { useHospital } from "@/src/modules/hospital/hooks/useHospital";
import {
    hospitalHubsFormSchema,
    type hospitalHubsFormValues,
    campusesFormSchema,
    type campusesFormValues,
    departmentsFormSchema,
    type departmentsFormValues,
    wardsFormSchema,
    type wardsFormValues,
    hospitalBedsFormSchema,
    type hospitalBedsFormValues,
    patientRegistrationsFormSchema,
    type patientRegistrationsFormValues,
    patientProfilesFormSchema,
    type patientProfilesFormValues,
    medicalHistoriesFormSchema,
    type medicalHistoriesFormValues,
    insurancePoliciesFormSchema,
    type insurancePoliciesFormValues,
    appointmentsFormSchema,
    type appointmentsFormValues,
    opdVisitsFormSchema,
    type opdVisitsFormValues,
    ipdAdmissionsFormSchema,
    type ipdAdmissionsFormValues,
    clinicalNotesFormSchema,
    type clinicalNotesFormValues,
    pharmacyInventoryFormSchema,
    type pharmacyInventoryFormValues,
    prescriptionsFormSchema,
    type prescriptionsFormValues,
    labOrdersFormSchema,
    type labOrdersFormValues,
    labResultsFormSchema,
    type labResultsFormValues,
    hospitalBillingFormSchema,
    type hospitalBillingFormValues,
    insuranceClaimsFormSchema,
    type insuranceClaimsFormValues,
    hospitalInvoicesFormSchema,
    type hospitalInvoicesFormValues,
    hospitalPaymentsFormSchema,
    type hospitalPaymentsFormValues,
    patientNotificationsFormSchema,
    type patientNotificationsFormValues,
    medicalReportsFormSchema,
    type medicalReportsFormValues,
    patientFeedbackFormSchema,
    type patientFeedbackFormValues,
    patientRegistrationsAnalyticsFormSchema,
    type patientRegistrationsAnalyticsFormValues,
    occupancyAnalyticsFormSchema,
    type occupancyAnalyticsFormValues,
    revenueAnalyticsFormSchema,
    type revenueAnalyticsFormValues,
    hospitalMetricsFormSchema,
    type hospitalMetricsFormValues,
    hospitalHealthFormSchema,
    type hospitalHealthFormValues,
    executiveKpisFormSchema,
    type executiveKpisFormValues,
    hospitalFailuresFormSchema,
    type hospitalFailuresFormValues,
} from "@/src/modules/hospital/schemas";

type HospitalData = ReturnType<typeof useHospital>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-cyan-600">{meta}</p> : null}</div>;
}
function HospitalHubSelect({ data, ...props }: { data: HospitalData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select hospital operating system</option>{data.hospitalHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function HospitalOverviewPanel({ data }: { data: HospitalData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Hospital OS summary" description="System health, background jobs, event bus, hospitalInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Hospital Hubs" subtitle={`${data.stats?.totalHospitalHubs ?? 0} total`} meta={`${data.stats?.activeHospitalHubs ?? 0} active • ${data.stats?.campusCount ?? 0} dining areas`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.patientRegistrationCount ?? 0} menu categories`} meta={`${data.stats?.appointmentCount ?? 0} appointments • ${data.stats?.openHospitalInvoiceCount ?? 0} open hospitalInvoices`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallHospitalScore ?? 0).toFixed(1)} overall hospital score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first hospital operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Hospital operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Hospital operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function HospitalHubsPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalHubsFormValues>({ resolver: zodResolver(hospitalHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Hubs" description="Enterprise hospital operating system hospital hubs" /><div className="mt-6 space-y-3">
                {data.hospitalHubs.length === 0 ? <EmptyState title="No hospital hubs" description="Create the first hospital hubs record." /> : data.hospitalHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampussPanel({ data }: { data: HospitalData }) {
    const form = useForm<campusesFormValues>({ resolver: zodResolver(campusesFormSchema), defaultValues: {"hospitalHubId":"","campusKey":"","campusName":"","campusType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campuses" description="Enterprise hospital operating system campuses" /><div className="mt-6 space-y-3">
                {data.campuses.length === 0 ? <EmptyState title="No campuses" description="Create the first campuses record." /> : data.campuses.map((item) => (
                    <ListCard key={item.id} title={String(item.campusName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.campusType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campuses" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampus(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("campusKey")} placeholder="campusKey" className={inputClass} />
                <input {...form.register("campusName")} placeholder="campusName" className={inputClass} />
                <input {...form.register("campusType")} placeholder="campusType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DepartmentsPanel({ data }: { data: HospitalData }) {
    const form = useForm<departmentsFormValues>({ resolver: zodResolver(departmentsFormSchema), defaultValues: {"hospitalHubId":"","departmentKey":"","departmentName":"","departmentType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Departments" description="Enterprise hospital operating system departments" /><div className="mt-6 space-y-3">
                {data.departments.length === 0 ? <EmptyState title="No departments" description="Create the first departments record." /> : data.departments.map((item) => (
                    <ListCard key={item.id} title={String(item.departmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.departmentType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create departments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDepartment(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("departmentKey")} placeholder="departmentKey" className={inputClass} />
                <input {...form.register("departmentName")} placeholder="departmentName" className={inputClass} />
                <input {...form.register("departmentType")} placeholder="departmentType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WardsPanel({ data }: { data: HospitalData }) {
    const form = useForm<wardsFormValues>({ resolver: zodResolver(wardsFormSchema), defaultValues: {"hospitalHubId":"","wardKey":"","wardName":"","wardType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Wards" description="Enterprise hospital operating system wards" /><div className="mt-6 space-y-3">
                {data.wards.length === 0 ? <EmptyState title="No wards" description="Create the first wards record." /> : data.wards.map((item) => (
                    <ListCard key={item.id} title={String(item.wardName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.wardType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create wards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWard(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("wardKey")} placeholder="wardKey" className={inputClass} />
                <input {...form.register("wardName")} placeholder="wardName" className={inputClass} />
                <input {...form.register("wardType")} placeholder="wardType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalBedsPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalBedsFormValues>({ resolver: zodResolver(hospitalBedsFormSchema), defaultValues: {"hospitalHubId":"","bedKey":"","bedNumber":"","bedStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Beds" description="Enterprise hospital operating system hospital beds" /><div className="mt-6 space-y-3">
                {data.hospitalBeds.length === 0 ? <EmptyState title="No hospital beds" description="Create the first hospital beds record." /> : data.hospitalBeds.map((item) => (
                    <ListCard key={item.id} title={String(item.bedNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.bedStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital beds" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalBed(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("bedKey")} placeholder="bedKey" className={inputClass} />
                <input {...form.register("bedNumber")} placeholder="bedNumber" className={inputClass} />
                <select {...form.register("bedStatus")} className={inputClass}>{BED_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PatientRegistrationsPanel({ data }: { data: HospitalData }) {
    const form = useForm<patientRegistrationsFormValues>({ resolver: zodResolver(patientRegistrationsFormSchema), defaultValues: {"hospitalHubId":"","registrationKey":"","registrationName":"","registrationStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Patient Registrations" description="Enterprise hospital operating system patient registrations" /><div className="mt-6 space-y-3">
                {data.patientRegistrations.length === 0 ? <EmptyState title="No patient registrations" description="Create the first patient registrations record." /> : data.patientRegistrations.map((item) => (
                    <ListCard key={item.id} title={String(item.registrationName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.registrationStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create patient registrations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPatientRegistration(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("registrationKey")} placeholder="registrationKey" className={inputClass} />
                <input {...form.register("registrationName")} placeholder="registrationName" className={inputClass} />
                <select {...form.register("registrationStatus")} className={inputClass}>{REGISTRATION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PatientProfilesPanel({ data }: { data: HospitalData }) {
    const form = useForm<patientProfilesFormValues>({ resolver: zodResolver(patientProfilesFormSchema), defaultValues: {"hospitalHubId":"","profileKey":"","profileName":"","profileType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Patient Profiles" description="Enterprise hospital operating system patient profiles" /><div className="mt-6 space-y-3">
                {data.patientProfiles.length === 0 ? <EmptyState title="No patient profiles" description="Create the first patient profiles record." /> : data.patientProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create patient profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPatientProfile(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("profileType")} placeholder="profileType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MedicalHistorysPanel({ data }: { data: HospitalData }) {
    const form = useForm<medicalHistoriesFormValues>({ resolver: zodResolver(medicalHistoriesFormSchema), defaultValues: {"hospitalHubId":"","historyKey":"","historyName":"","historyType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Medical Histories" description="Enterprise hospital operating system medical histories" /><div className="mt-6 space-y-3">
                {data.medicalHistories.length === 0 ? <EmptyState title="No medical histories" description="Create the first medical histories record." /> : data.medicalHistories.map((item) => (
                    <ListCard key={item.id} title={String(item.historyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.historyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create medical histories" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMedicalHistory(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("historyKey")} placeholder="historyKey" className={inputClass} />
                <input {...form.register("historyName")} placeholder="historyName" className={inputClass} />
                <input {...form.register("historyType")} placeholder="historyType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InsurancePolicysPanel({ data }: { data: HospitalData }) {
    const form = useForm<insurancePoliciesFormValues>({ resolver: zodResolver(insurancePoliciesFormSchema), defaultValues: {"hospitalHubId":"","policyKey":"","policyName":"","policyType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Insurance Policies" description="Enterprise hospital operating system insurance policies" /><div className="mt-6 space-y-3">
                {data.insurancePolicies.length === 0 ? <EmptyState title="No insurance policies" description="Create the first insurance policies record." /> : data.insurancePolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.policyType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create insurance policies" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInsurancePolicy(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("policyKey")} placeholder="policyKey" className={inputClass} />
                <input {...form.register("policyName")} placeholder="policyName" className={inputClass} />
                <input {...form.register("policyType")} placeholder="policyType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AppointmentsPanel({ data }: { data: HospitalData }) {
    const form = useForm<appointmentsFormValues>({ resolver: zodResolver(appointmentsFormSchema), defaultValues: {"hospitalHubId":"","appointmentKey":"","appointmentName":"","appointmentStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Appointments" description="Enterprise hospital operating system appointments" /><div className="mt-6 space-y-3">
                {data.appointments.length === 0 ? <EmptyState title="No appointments" description="Create the first appointments record." /> : data.appointments.map((item) => (
                    <ListCard key={item.id} title={String(item.appointmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.appointmentStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create appointments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAppointment(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("appointmentKey")} placeholder="appointmentKey" className={inputClass} />
                <input {...form.register("appointmentName")} placeholder="appointmentName" className={inputClass} />
                <select {...form.register("appointmentStatus")} className={inputClass}>{APPOINTMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OpdVisitsPanel({ data }: { data: HospitalData }) {
    const form = useForm<opdVisitsFormValues>({ resolver: zodResolver(opdVisitsFormSchema), defaultValues: {"hospitalHubId":"","visitKey":"","visitName":"","visitStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Opd Visits" description="Enterprise hospital operating system opd visits" /><div className="mt-6 space-y-3">
                {data.opdVisits.length === 0 ? <EmptyState title="No opd visits" description="Create the first opd visits record." /> : data.opdVisits.map((item) => (
                    <ListCard key={item.id} title={String(item.visitName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.visitStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create opd visits" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOpdVisit(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("visitKey")} placeholder="visitKey" className={inputClass} />
                <input {...form.register("visitName")} placeholder="visitName" className={inputClass} />
                <input {...form.register("visitStatus")} placeholder="visitStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IpdAdmissionsPanel({ data }: { data: HospitalData }) {
    const form = useForm<ipdAdmissionsFormValues>({ resolver: zodResolver(ipdAdmissionsFormSchema), defaultValues: {"hospitalHubId":"","admissionKey":"","admissionName":"","admissionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Ipd Admissions" description="Enterprise hospital operating system ipd admissions" /><div className="mt-6 space-y-3">
                {data.ipdAdmissions.length === 0 ? <EmptyState title="No ipd admissions" description="Create the first ipd admissions record." /> : data.ipdAdmissions.map((item) => (
                    <ListCard key={item.id} title={String(item.admissionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.admissionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ipd admissions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIpdAdmission(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("admissionKey")} placeholder="admissionKey" className={inputClass} />
                <input {...form.register("admissionName")} placeholder="admissionName" className={inputClass} />
                <select {...form.register("admissionStatus")} className={inputClass}>{IPD_ADMISSION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ClinicalNotesPanel({ data }: { data: HospitalData }) {
    const form = useForm<clinicalNotesFormValues>({ resolver: zodResolver(clinicalNotesFormSchema), defaultValues: {"hospitalHubId":"","noteKey":"","noteName":"","noteType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Clinical Notes" description="Enterprise hospital operating system clinical notes" /><div className="mt-6 space-y-3">
                {data.clinicalNotes.length === 0 ? <EmptyState title="No clinical notes" description="Create the first clinical notes record." /> : data.clinicalNotes.map((item) => (
                    <ListCard key={item.id} title={String(item.noteName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.noteType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create clinical notes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createClinicalNote(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("noteKey")} placeholder="noteKey" className={inputClass} />
                <input {...form.register("noteName")} placeholder="noteName" className={inputClass} />
                <input {...form.register("noteType")} placeholder="noteType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PharmacyInventorysPanel({ data }: { data: HospitalData }) {
    const form = useForm<pharmacyInventoryFormValues>({ resolver: zodResolver(pharmacyInventoryFormSchema), defaultValues: {"hospitalHubId":"","inventoryKey":"","inventoryName":"","inventoryType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Pharmacy Inventory" description="Enterprise hospital operating system pharmacy inventory" /><div className="mt-6 space-y-3">
                {data.pharmacyInventory.length === 0 ? <EmptyState title="No pharmacy inventory" description="Create the first pharmacy inventory record." /> : data.pharmacyInventory.map((item) => (
                    <ListCard key={item.id} title={String(item.inventoryName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.inventoryType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create pharmacy inventory" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPharmacyInventory(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("inventoryKey")} placeholder="inventoryKey" className={inputClass} />
                <input {...form.register("inventoryName")} placeholder="inventoryName" className={inputClass} />
                <input {...form.register("inventoryType")} placeholder="inventoryType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PrescriptionsPanel({ data }: { data: HospitalData }) {
    const form = useForm<prescriptionsFormValues>({ resolver: zodResolver(prescriptionsFormSchema), defaultValues: {"hospitalHubId":"","prescriptionKey":"","prescriptionName":"","prescriptionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Prescriptions" description="Enterprise hospital operating system prescriptions" /><div className="mt-6 space-y-3">
                {data.prescriptions.length === 0 ? <EmptyState title="No prescriptions" description="Create the first prescriptions record." /> : data.prescriptions.map((item) => (
                    <ListCard key={item.id} title={String(item.prescriptionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.prescriptionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create prescriptions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPrescription(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("prescriptionKey")} placeholder="prescriptionKey" className={inputClass} />
                <input {...form.register("prescriptionName")} placeholder="prescriptionName" className={inputClass} />
                <select {...form.register("prescriptionStatus")} className={inputClass}>{PRESCRIPTION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LabOrdersPanel({ data }: { data: HospitalData }) {
    const form = useForm<labOrdersFormValues>({ resolver: zodResolver(labOrdersFormSchema), defaultValues: {"hospitalHubId":"","orderKey":"","orderName":"","orderStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lab Orders" description="Enterprise hospital operating system lab orders" /><div className="mt-6 space-y-3">
                {data.labOrders.length === 0 ? <EmptyState title="No lab orders" description="Create the first lab orders record." /> : data.labOrders.map((item) => (
                    <ListCard key={item.id} title={String(item.orderName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.orderStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lab orders" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLabOrder(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("orderKey")} placeholder="orderKey" className={inputClass} />
                <input {...form.register("orderName")} placeholder="orderName" className={inputClass} />
                <input {...form.register("orderStatus")} placeholder="orderStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LabResultsPanel({ data }: { data: HospitalData }) {
    const form = useForm<labResultsFormValues>({ resolver: zodResolver(labResultsFormSchema), defaultValues: {"hospitalHubId":"","resultKey":"","resultName":"","resultStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Lab Results" description="Enterprise hospital operating system lab results" /><div className="mt-6 space-y-3">
                {data.labResults.length === 0 ? <EmptyState title="No lab results" description="Create the first lab results record." /> : data.labResults.map((item) => (
                    <ListCard key={item.id} title={String(item.resultName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.resultStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create lab results" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLabResult(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("resultKey")} placeholder="resultKey" className={inputClass} />
                <input {...form.register("resultName")} placeholder="resultName" className={inputClass} />
                <input {...form.register("resultStatus")} placeholder="resultStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalBillingsPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalBillingFormValues>({ resolver: zodResolver(hospitalBillingFormSchema), defaultValues: {"hospitalHubId":"","billingKey":"","billingName":"","billingAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Billing" description="Enterprise hospital operating system hospital billing" /><div className="mt-6 space-y-3">
                {data.hospitalBilling.length === 0 ? <EmptyState title="No hospital billing" description="Create the first hospital billing record." /> : data.hospitalBilling.map((item) => (
                    <ListCard key={item.id} title={String(item.billingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.billingAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital billing" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalBilling(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("billingKey")} placeholder="billingKey" className={inputClass} />
                <input {...form.register("billingName")} placeholder="billingName" className={inputClass} />
                <input type="number" step="any" {...form.register("billingAmount", { valueAsNumber: true })} placeholder="billingAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InsuranceClaimsPanel({ data }: { data: HospitalData }) {
    const form = useForm<insuranceClaimsFormValues>({ resolver: zodResolver(insuranceClaimsFormSchema), defaultValues: {"hospitalHubId":"","claimKey":"","claimName":"","claimStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Insurance Claims" description="Enterprise hospital operating system insurance claims" /><div className="mt-6 space-y-3">
                {data.insuranceClaims.length === 0 ? <EmptyState title="No insurance claims" description="Create the first insurance claims record." /> : data.insuranceClaims.map((item) => (
                    <ListCard key={item.id} title={String(item.claimName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.claimStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create insurance claims" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInsuranceClaim(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("claimKey")} placeholder="claimKey" className={inputClass} />
                <input {...form.register("claimName")} placeholder="claimName" className={inputClass} />
                <input {...form.register("claimStatus")} placeholder="claimStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalInvoicesPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalInvoicesFormValues>({ resolver: zodResolver(hospitalInvoicesFormSchema), defaultValues: {"hospitalHubId":"","invoiceKey":"","invoiceName":"","invoiceAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Invoices" description="Enterprise hospital operating system hospital invoices" /><div className="mt-6 space-y-3">
                {data.hospitalInvoices.length === 0 ? <EmptyState title="No hospital invoices" description="Create the first hospital invoices record." /> : data.hospitalInvoices.map((item) => (
                    <ListCard key={item.id} title={String(item.invoiceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.invoiceAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital invoices" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalInvoice(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("invoiceKey")} placeholder="invoiceKey" className={inputClass} />
                <input {...form.register("invoiceName")} placeholder="invoiceName" className={inputClass} />
                <input type="number" step="any" {...form.register("invoiceAmount", { valueAsNumber: true })} placeholder="invoiceAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalPaymentsPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalPaymentsFormValues>({ resolver: zodResolver(hospitalPaymentsFormSchema), defaultValues: {"hospitalHubId":"","paymentKey":"","paymentName":"","paymentAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Payments" description="Enterprise hospital operating system hospital payments" /><div className="mt-6 space-y-3">
                {data.hospitalPayments.length === 0 ? <EmptyState title="No hospital payments" description="Create the first hospital payments record." /> : data.hospitalPayments.map((item) => (
                    <ListCard key={item.id} title={String(item.paymentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.paymentAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital payments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalPayment(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("paymentKey")} placeholder="paymentKey" className={inputClass} />
                <input {...form.register("paymentName")} placeholder="paymentName" className={inputClass} />
                <input type="number" step="any" {...form.register("paymentAmount", { valueAsNumber: true })} placeholder="paymentAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PatientNotificationsPanel({ data }: { data: HospitalData }) {
    const form = useForm<patientNotificationsFormValues>({ resolver: zodResolver(patientNotificationsFormSchema), defaultValues: {"hospitalHubId":"","notificationKey":"","notificationTitle":"","notificationType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Patient Notifications" description="Enterprise hospital operating system patient notifications" /><div className="mt-6 space-y-3">
                {data.patientNotifications.length === 0 ? <EmptyState title="No patient notifications" description="Create the first patient notifications record." /> : data.patientNotifications.map((item) => (
                    <ListCard key={item.id} title={String(item.notificationTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.notificationType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create patient notifications" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPatientNotification(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("notificationKey")} placeholder="notificationKey" className={inputClass} />
                <input {...form.register("notificationTitle")} placeholder="notificationTitle" className={inputClass} />
                <input {...form.register("notificationType")} placeholder="notificationType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MedicalReportsPanel({ data }: { data: HospitalData }) {
    const form = useForm<medicalReportsFormValues>({ resolver: zodResolver(medicalReportsFormSchema), defaultValues: {"hospitalHubId":"","reportKey":"","reportName":"","reportType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Medical Reports" description="Enterprise hospital operating system medical reports" /><div className="mt-6 space-y-3">
                {data.medicalReports.length === 0 ? <EmptyState title="No medical reports" description="Create the first medical reports record." /> : data.medicalReports.map((item) => (
                    <ListCard key={item.id} title={String(item.reportName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reportType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create medical reports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMedicalReport(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportName")} placeholder="reportName" className={inputClass} />
                <input {...form.register("reportType")} placeholder="reportType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PatientFeedbacksPanel({ data }: { data: HospitalData }) {
    const form = useForm<patientFeedbackFormValues>({ resolver: zodResolver(patientFeedbackFormSchema), defaultValues: {"hospitalHubId":"","feedbackKey":"","feedbackName":"","feedbackScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Patient Feedback" description="Enterprise hospital operating system patient feedback" /><div className="mt-6 space-y-3">
                {data.patientFeedback.length === 0 ? <EmptyState title="No patient feedback" description="Create the first patient feedback record." /> : data.patientFeedback.map((item) => (
                    <ListCard key={item.id} title={String(item.feedbackName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.feedbackScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create patient feedback" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPatientFeedback(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("feedbackKey")} placeholder="feedbackKey" className={inputClass} />
                <input {...form.register("feedbackName")} placeholder="feedbackName" className={inputClass} />
                <input type="number" step="any" {...form.register("feedbackScore", { valueAsNumber: true })} placeholder="feedbackScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdmissionsAnalyticssPanel({ data }: { data: HospitalData }) {
    const form = useForm<patientRegistrationsAnalyticsFormValues>({ resolver: zodResolver(patientRegistrationsAnalyticsFormSchema), defaultValues: {"hospitalHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Patient Registrations Analytics" description="Enterprise hospital operating system patient registrations analytics" /><div className="mt-6 space-y-3">
                {data.patientRegistrationsAnalytics.length === 0 ? <EmptyState title="No patient registrations analytics" description="Create the first patient registrations analytics record." /> : data.patientRegistrationsAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create patient registrations analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdmissionsAnalytics(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OccupancyAnalyticssPanel({ data }: { data: HospitalData }) {
    const form = useForm<occupancyAnalyticsFormValues>({ resolver: zodResolver(occupancyAnalyticsFormSchema), defaultValues: {"hospitalHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Occupancy Analytics" description="Enterprise hospital operating system occupancy analytics" /><div className="mt-6 space-y-3">
                {data.occupancyAnalytics.length === 0 ? <EmptyState title="No occupancy analytics" description="Create the first occupancy analytics record." /> : data.occupancyAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create occupancy analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOccupancyAnalytics(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RevenueAnalyticssPanel({ data }: { data: HospitalData }) {
    const form = useForm<revenueAnalyticsFormValues>({ resolver: zodResolver(revenueAnalyticsFormSchema), defaultValues: {"hospitalHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Revenue Analytics" description="Enterprise hospital operating system revenue analytics" /><div className="mt-6 space-y-3">
                {data.revenueAnalytics.length === 0 ? <EmptyState title="No revenue analytics" description="Create the first revenue analytics record." /> : data.revenueAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create revenue analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRevenueAnalytics(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalMetricsPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalMetricsFormValues>({ resolver: zodResolver(hospitalMetricsFormSchema), defaultValues: {"metricsKey":"","patientRegistrationsCount":0,"overallHospitalScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Metrics" description="Enterprise hospital operating system hospital metrics" /><div className="mt-6 space-y-3">
                {data.hospitalMetrics.length === 0 ? <EmptyState title="No hospital metrics" description="Create the first hospital metrics record." /> : data.hospitalMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallHospitalScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("patientRegistrationsCount", { valueAsNumber: true })} placeholder="patientRegistrationsCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallHospitalScore", { valueAsNumber: true })} placeholder="overallHospitalScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalHealthsPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalHealthFormValues>({ resolver: zodResolver(hospitalHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Health" description="Enterprise hospital operating system hospital health" /><div className="mt-6 space-y-3">
                {data.hospitalHealth.length === 0 ? <EmptyState title="No hospital health" description="Create the first hospital health record." /> : data.hospitalHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveKpisPanel({ data }: { data: HospitalData }) {
    const form = useForm<executiveKpisFormValues>({ resolver: zodResolver(executiveKpisFormSchema), defaultValues: {"hospitalHubId":"","kpiKey":"","kpiName":"","kpiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Kpis" description="Enterprise hospital operating system executive kpis" /><div className="mt-6 space-y-3">
                {data.executiveKpis.length === 0 ? <EmptyState title="No executive kpis" description="Create the first executive kpis record." /> : data.executiveKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveKpi(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiScore", { valueAsNumber: true })} placeholder="kpiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalFailuresPanel({ data }: { data: HospitalData }) {
    const form = useForm<hospitalFailuresFormValues>({ resolver: zodResolver(hospitalFailuresFormSchema), defaultValues: {"hospitalHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Hospital Failures" description="Enterprise hospital operating system hospital failures" /><div className="mt-6 space-y-3">
                {data.hospitalFailures.length === 0 ? <EmptyState title="No hospital failures" description="Create the first hospital failures record." /> : data.hospitalFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create hospital failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createHospitalFailure(v))}>
                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function HospitalAuditLogsPanel({ data }: { data: HospitalData }) {
    return (
        <Card hover><SectionHeader title="Hospital OS audit history" description="Security-first audit trail for jobs, events, hospitalInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for hospital operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function HospitalSdkPanel({ data }: { data: HospitalData }) {
    return (
        <Card hover><SectionHeader title="Shared Hospital OS SDK" description="Import from @/src/modules/hospital/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createHospitalClient()" subtitle="Factory for module-scoped Hospital OS client with auth context" meta="Primary SDK for enterprise hospital operating system" />
            <ListCard title="sdkRegisterCampus()" subtitle="Register hospital operating system with AI orchestration" meta="moduleSource: enterprise_hospital_business_os" />
            <ListCard title="sdkConfigurePatientRegistration()" subtitle="Configure patient registration with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunAppointmentWorkflow()" subtitle="Run appointment workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {HSP_THEME.primary} • Integration hubs loaded: {data.hospitalHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createHospitalClient } from "@/src/modules/hospital/sdk";

const intg = createHospitalClient(userId, email, fullName);
await intg.registerCampus({ hospitalHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configurePatientRegistration({ hospitalHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runAppointmentWorkflow({ hospitalHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
