"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SCH_THEME, ADMISSION_STATUS_OPTIONS, EXAM_TYPE_OPTIONS, ATTENDANCE_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/school/constants";
import type { useSchool } from "@/src/modules/school/hooks/useSchool";
import {
    schoolHubsFormSchema,
    type schoolHubsFormValues,
    campusesFormSchema,
    type campusesFormValues,
    buildingsFormSchema,
    type buildingsFormValues,
    classroomsFormSchema,
    type classroomsFormValues,
    academicYearsFormSchema,
    type academicYearsFormValues,
    admissionsFormSchema,
    type admissionsFormValues,
    studentProfilesFormSchema,
    type studentProfilesFormValues,
    parentProfilesFormSchema,
    type parentProfilesFormValues,
    enrollmentsFormSchema,
    type enrollmentsFormValues,
    subjectsFormSchema,
    type subjectsFormValues,
    timetablesFormSchema,
    type timetablesFormValues,
    examinationsFormSchema,
    type examinationsFormValues,
    reportCardsFormSchema,
    type reportCardsFormValues,
    teachersFormSchema,
    type teachersFormValues,
    staffAttendanceFormSchema,
    type staffAttendanceFormValues,
    leaveRequestsFormSchema,
    type leaveRequestsFormValues,
    substituteTeachersFormSchema,
    type substituteTeachersFormValues,
    feeStructuresFormSchema,
    type feeStructuresFormValues,
    feeInvoicesFormSchema,
    type feeInvoicesFormValues,
    feePaymentsFormSchema,
    type feePaymentsFormValues,
    scholarshipsFormSchema,
    type scholarshipsFormValues,
    announcementsFormSchema,
    type announcementsFormValues,
    messagingFormSchema,
    type messagingFormValues,
    eventsFormSchema,
    type eventsFormValues,
    admissionsAnalyticsFormSchema,
    type admissionsAnalyticsFormValues,
    attendanceAnalyticsFormSchema,
    type attendanceAnalyticsFormValues,
    academicAnalyticsFormSchema,
    type academicAnalyticsFormValues,
    schoolMetricsFormSchema,
    type schoolMetricsFormValues,
    schoolHealthFormSchema,
    type schoolHealthFormValues,
    executiveKpisFormSchema,
    type executiveKpisFormValues,
    schoolFailuresFormSchema,
    type schoolFailuresFormValues,
} from "@/src/modules/school/schemas";

type SchoolData = ReturnType<typeof useSchool>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-blue-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-blue-600">{meta}</p> : null}</div>;
}
function SchoolHubSelect({ data, ...props }: { data: SchoolData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select school operating system</option>{data.schoolHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function SchoolOverviewPanel({ data }: { data: SchoolData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="School OS summary" description="System health, background jobs, event bus, feeInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="School Hubs" subtitle={`${data.stats?.totalSchoolHubs ?? 0} total`} meta={`${data.stats?.activeSchoolHubs ?? 0} active • ${data.stats?.campusCount ?? 0} dining areas`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.admissionCount ?? 0} menu categories`} meta={`${data.stats?.examinationCount ?? 0} examinations • ${data.stats?.openFeeInvoiceCount ?? 0} open feeInvoices`} />
                <ListCard title="Health" subtitle={`${(data.stats?.overallSchoolScore ?? 0).toFixed(1)} overall school score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first school operating system" />
            </div></Card>
            <Card hover><SectionHeader title="School operating system pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="School operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function SchoolHubsPanel({ data }: { data: SchoolData }) {
    const form = useForm<schoolHubsFormValues>({ resolver: zodResolver(schoolHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="School Hubs" description="Enterprise school operating system school hubs" /><div className="mt-6 space-y-3">
                {data.schoolHubs.length === 0 ? <EmptyState title="No school hubs" description="Create the first school hubs record." /> : data.schoolHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create school hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSchoolHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CampussPanel({ data }: { data: SchoolData }) {
    const form = useForm<campusesFormValues>({ resolver: zodResolver(campusesFormSchema), defaultValues: {"schoolHubId":"","campusKey":"","campusName":"","campusType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Campuses" description="Enterprise school operating system campuses" /><div className="mt-6 space-y-3">
                {data.campuses.length === 0 ? <EmptyState title="No campuses" description="Create the first campuses record." /> : data.campuses.map((item) => (
                    <ListCard key={item.id} title={String(item.campusName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.campusType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create campuses" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCampus(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("campusKey")} placeholder="campusKey" className={inputClass} />
                <input {...form.register("campusName")} placeholder="campusName" className={inputClass} />
                <input {...form.register("campusType")} placeholder="campusType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BuildingsPanel({ data }: { data: SchoolData }) {
    const form = useForm<buildingsFormValues>({ resolver: zodResolver(buildingsFormSchema), defaultValues: {"schoolHubId":"","buildingKey":"","buildingName":"","buildingType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Buildings" description="Enterprise school operating system buildings" /><div className="mt-6 space-y-3">
                {data.buildings.length === 0 ? <EmptyState title="No buildings" description="Create the first buildings record." /> : data.buildings.map((item) => (
                    <ListCard key={item.id} title={String(item.buildingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.buildingType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create buildings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBuilding(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("buildingKey")} placeholder="buildingKey" className={inputClass} />
                <input {...form.register("buildingName")} placeholder="buildingName" className={inputClass} />
                <input {...form.register("buildingType")} placeholder="buildingType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ClassroomsPanel({ data }: { data: SchoolData }) {
    const form = useForm<classroomsFormValues>({ resolver: zodResolver(classroomsFormSchema), defaultValues: {"schoolHubId":"","classroomKey":"","classroomName":"","classroomType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Classrooms" description="Enterprise school operating system classrooms" /><div className="mt-6 space-y-3">
                {data.classrooms.length === 0 ? <EmptyState title="No classrooms" description="Create the first classrooms record." /> : data.classrooms.map((item) => (
                    <ListCard key={item.id} title={String(item.classroomName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.classroomType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create classrooms" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createClassroom(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("classroomKey")} placeholder="classroomKey" className={inputClass} />
                <input {...form.register("classroomName")} placeholder="classroomName" className={inputClass} />
                <input {...form.register("classroomType")} placeholder="classroomType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AcademicYearsPanel({ data }: { data: SchoolData }) {
    const form = useForm<academicYearsFormValues>({ resolver: zodResolver(academicYearsFormSchema), defaultValues: {"schoolHubId":"","yearKey":"","yearName":"","yearStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Academic Years" description="Enterprise school operating system academic years" /><div className="mt-6 space-y-3">
                {data.academicYears.length === 0 ? <EmptyState title="No academic years" description="Create the first academic years record." /> : data.academicYears.map((item) => (
                    <ListCard key={item.id} title={String(item.yearName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.yearStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create academic years" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAcademicYear(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("yearKey")} placeholder="yearKey" className={inputClass} />
                <input {...form.register("yearName")} placeholder="yearName" className={inputClass} />
                <input {...form.register("yearStatus")} placeholder="yearStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdmissionsPanel({ data }: { data: SchoolData }) {
    const form = useForm<admissionsFormValues>({ resolver: zodResolver(admissionsFormSchema), defaultValues: {"schoolHubId":"","admissionKey":"","admissionName":"","admissionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Admissions" description="Enterprise school operating system admissions" /><div className="mt-6 space-y-3">
                {data.admissions.length === 0 ? <EmptyState title="No admissions" description="Create the first admissions record." /> : data.admissions.map((item) => (
                    <ListCard key={item.id} title={String(item.admissionName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.admissionStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create admissions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdmission(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("admissionKey")} placeholder="admissionKey" className={inputClass} />
                <input {...form.register("admissionName")} placeholder="admissionName" className={inputClass} />
                <select {...form.register("admissionStatus")} className={inputClass}>{ADMISSION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StudentProfilesPanel({ data }: { data: SchoolData }) {
    const form = useForm<studentProfilesFormValues>({ resolver: zodResolver(studentProfilesFormSchema), defaultValues: {"schoolHubId":"","profileKey":"","profileName":"","profileType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Student Profiles" description="Enterprise school operating system student profiles" /><div className="mt-6 space-y-3">
                {data.studentProfiles.length === 0 ? <EmptyState title="No student profiles" description="Create the first student profiles record." /> : data.studentProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.profileName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.profileType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create student profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStudentProfile(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("profileKey")} placeholder="profileKey" className={inputClass} />
                <input {...form.register("profileName")} placeholder="profileName" className={inputClass} />
                <input {...form.register("profileType")} placeholder="profileType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ParentProfilesPanel({ data }: { data: SchoolData }) {
    const form = useForm<parentProfilesFormValues>({ resolver: zodResolver(parentProfilesFormSchema), defaultValues: {"schoolHubId":"","parentKey":"","parentName":"","parentType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Parent Profiles" description="Enterprise school operating system parent profiles" /><div className="mt-6 space-y-3">
                {data.parentProfiles.length === 0 ? <EmptyState title="No parent profiles" description="Create the first parent profiles record." /> : data.parentProfiles.map((item) => (
                    <ListCard key={item.id} title={String(item.parentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.parentType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create parent profiles" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createParentProfile(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("parentKey")} placeholder="parentKey" className={inputClass} />
                <input {...form.register("parentName")} placeholder="parentName" className={inputClass} />
                <input {...form.register("parentType")} placeholder="parentType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EnrollmentsPanel({ data }: { data: SchoolData }) {
    const form = useForm<enrollmentsFormValues>({ resolver: zodResolver(enrollmentsFormSchema), defaultValues: {"schoolHubId":"","enrollmentKey":"","enrollmentName":"","enrollmentStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Enrollments" description="Enterprise school operating system enrollments" /><div className="mt-6 space-y-3">
                {data.enrollments.length === 0 ? <EmptyState title="No enrollments" description="Create the first enrollments record." /> : data.enrollments.map((item) => (
                    <ListCard key={item.id} title={String(item.enrollmentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.enrollmentStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create enrollments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEnrollment(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("enrollmentKey")} placeholder="enrollmentKey" className={inputClass} />
                <input {...form.register("enrollmentName")} placeholder="enrollmentName" className={inputClass} />
                <input {...form.register("enrollmentStatus")} placeholder="enrollmentStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubjectsPanel({ data }: { data: SchoolData }) {
    const form = useForm<subjectsFormValues>({ resolver: zodResolver(subjectsFormSchema), defaultValues: {"schoolHubId":"","subjectKey":"","subjectName":"","subjectType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Subjects" description="Enterprise school operating system subjects" /><div className="mt-6 space-y-3">
                {data.subjects.length === 0 ? <EmptyState title="No subjects" description="Create the first subjects record." /> : data.subjects.map((item) => (
                    <ListCard key={item.id} title={String(item.subjectName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.subjectType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create subjects" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubject(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("subjectKey")} placeholder="subjectKey" className={inputClass} />
                <input {...form.register("subjectName")} placeholder="subjectName" className={inputClass} />
                <input {...form.register("subjectType")} placeholder="subjectType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TimetablesPanel({ data }: { data: SchoolData }) {
    const form = useForm<timetablesFormValues>({ resolver: zodResolver(timetablesFormSchema), defaultValues: {"schoolHubId":"","timetableKey":"","timetableName":"","timetableType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Timetables" description="Enterprise school operating system timetables" /><div className="mt-6 space-y-3">
                {data.timetables.length === 0 ? <EmptyState title="No timetables" description="Create the first timetables record." /> : data.timetables.map((item) => (
                    <ListCard key={item.id} title={String(item.timetableName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.timetableType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create timetables" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTimetable(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("timetableKey")} placeholder="timetableKey" className={inputClass} />
                <input {...form.register("timetableName")} placeholder="timetableName" className={inputClass} />
                <input {...form.register("timetableType")} placeholder="timetableType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExaminationsPanel({ data }: { data: SchoolData }) {
    const form = useForm<examinationsFormValues>({ resolver: zodResolver(examinationsFormSchema), defaultValues: {"schoolHubId":"","examKey":"","examName":"","examType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Examinations" description="Enterprise school operating system examinations" /><div className="mt-6 space-y-3">
                {data.examinations.length === 0 ? <EmptyState title="No examinations" description="Create the first examinations record." /> : data.examinations.map((item) => (
                    <ListCard key={item.id} title={String(item.examName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.examType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create examinations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExamination(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("examKey")} placeholder="examKey" className={inputClass} />
                <input {...form.register("examName")} placeholder="examName" className={inputClass} />
                <select {...form.register("examType")} className={inputClass}>{EXAM_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReportCardsPanel({ data }: { data: SchoolData }) {
    const form = useForm<reportCardsFormValues>({ resolver: zodResolver(reportCardsFormSchema), defaultValues: {"schoolHubId":"","reportKey":"","reportName":"","reportGrade":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Report Cards" description="Enterprise school operating system report cards" /><div className="mt-6 space-y-3">
                {data.reportCards.length === 0 ? <EmptyState title="No report cards" description="Create the first report cards record." /> : data.reportCards.map((item) => (
                    <ListCard key={item.id} title={String(item.reportName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.reportGrade}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create report cards" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReportCard(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("reportKey")} placeholder="reportKey" className={inputClass} />
                <input {...form.register("reportName")} placeholder="reportName" className={inputClass} />
                <input {...form.register("reportGrade")} placeholder="reportGrade" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TeachersPanel({ data }: { data: SchoolData }) {
    const form = useForm<teachersFormValues>({ resolver: zodResolver(teachersFormSchema), defaultValues: {"schoolHubId":"","teacherKey":"","teacherName":"","teacherType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Teachers" description="Enterprise school operating system teachers" /><div className="mt-6 space-y-3">
                {data.teachers.length === 0 ? <EmptyState title="No teachers" description="Create the first teachers record." /> : data.teachers.map((item) => (
                    <ListCard key={item.id} title={String(item.teacherName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.teacherType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create teachers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTeacher(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("teacherKey")} placeholder="teacherKey" className={inputClass} />
                <input {...form.register("teacherName")} placeholder="teacherName" className={inputClass} />
                <input {...form.register("teacherType")} placeholder="teacherType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function StaffAttendancesPanel({ data }: { data: SchoolData }) {
    const form = useForm<staffAttendanceFormValues>({ resolver: zodResolver(staffAttendanceFormSchema), defaultValues: {"schoolHubId":"","attendanceKey":"","attendanceName":"","attendanceStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Staff Attendance" description="Enterprise school operating system staff attendance" /><div className="mt-6 space-y-3">
                {data.staffAttendance.length === 0 ? <EmptyState title="No staff attendance" description="Create the first staff attendance record." /> : data.staffAttendance.map((item) => (
                    <ListCard key={item.id} title={String(item.attendanceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.attendanceStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create staff attendance" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createStaffAttendance(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("attendanceKey")} placeholder="attendanceKey" className={inputClass} />
                <input {...form.register("attendanceName")} placeholder="attendanceName" className={inputClass} />
                <select {...form.register("attendanceStatus")} className={inputClass}>{ATTENDANCE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LeaveRequestsPanel({ data }: { data: SchoolData }) {
    const form = useForm<leaveRequestsFormValues>({ resolver: zodResolver(leaveRequestsFormSchema), defaultValues: {"schoolHubId":"","leaveKey":"","leaveName":"","leaveStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Leave Requests" description="Enterprise school operating system leave requests" /><div className="mt-6 space-y-3">
                {data.leaveRequests.length === 0 ? <EmptyState title="No leave requests" description="Create the first leave requests record." /> : data.leaveRequests.map((item) => (
                    <ListCard key={item.id} title={String(item.leaveName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.leaveStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create leave requests" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLeaveRequest(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("leaveKey")} placeholder="leaveKey" className={inputClass} />
                <input {...form.register("leaveName")} placeholder="leaveName" className={inputClass} />
                <input {...form.register("leaveStatus")} placeholder="leaveStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SubstituteTeachersPanel({ data }: { data: SchoolData }) {
    const form = useForm<substituteTeachersFormValues>({ resolver: zodResolver(substituteTeachersFormSchema), defaultValues: {"schoolHubId":"","substituteKey":"","substituteName":"","substituteStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Substitute Teachers" description="Enterprise school operating system substitute teachers" /><div className="mt-6 space-y-3">
                {data.substituteTeachers.length === 0 ? <EmptyState title="No substitute teachers" description="Create the first substitute teachers record." /> : data.substituteTeachers.map((item) => (
                    <ListCard key={item.id} title={String(item.substituteName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.substituteStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create substitute teachers" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSubstituteTeacher(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("substituteKey")} placeholder="substituteKey" className={inputClass} />
                <input {...form.register("substituteName")} placeholder="substituteName" className={inputClass} />
                <input {...form.register("substituteStatus")} placeholder="substituteStatus" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeeStructuresPanel({ data }: { data: SchoolData }) {
    const form = useForm<feeStructuresFormValues>({ resolver: zodResolver(feeStructuresFormSchema), defaultValues: {"schoolHubId":"","feeKey":"","feeName":"","feeType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Fee Structures" description="Enterprise school operating system fee structures" /><div className="mt-6 space-y-3">
                {data.feeStructures.length === 0 ? <EmptyState title="No fee structures" description="Create the first fee structures record." /> : data.feeStructures.map((item) => (
                    <ListCard key={item.id} title={String(item.feeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.feeType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create fee structures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeeStructure(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("feeKey")} placeholder="feeKey" className={inputClass} />
                <input {...form.register("feeName")} placeholder="feeName" className={inputClass} />
                <input {...form.register("feeType")} placeholder="feeType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeeInvoicesPanel({ data }: { data: SchoolData }) {
    const form = useForm<feeInvoicesFormValues>({ resolver: zodResolver(feeInvoicesFormSchema), defaultValues: {"schoolHubId":"","invoiceKey":"","invoiceName":"","invoiceAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Fee Invoices" description="Enterprise school operating system fee invoices" /><div className="mt-6 space-y-3">
                {data.feeInvoices.length === 0 ? <EmptyState title="No fee invoices" description="Create the first fee invoices record." /> : data.feeInvoices.map((item) => (
                    <ListCard key={item.id} title={String(item.invoiceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.invoiceAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create fee invoices" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeeInvoice(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("invoiceKey")} placeholder="invoiceKey" className={inputClass} />
                <input {...form.register("invoiceName")} placeholder="invoiceName" className={inputClass} />
                <input type="number" step="any" {...form.register("invoiceAmount", { valueAsNumber: true })} placeholder="invoiceAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function FeePaymentsPanel({ data }: { data: SchoolData }) {
    const form = useForm<feePaymentsFormValues>({ resolver: zodResolver(feePaymentsFormSchema), defaultValues: {"schoolHubId":"","paymentKey":"","paymentName":"","paymentAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Fee Payments" description="Enterprise school operating system fee payments" /><div className="mt-6 space-y-3">
                {data.feePayments.length === 0 ? <EmptyState title="No fee payments" description="Create the first fee payments record." /> : data.feePayments.map((item) => (
                    <ListCard key={item.id} title={String(item.paymentName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.paymentAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create fee payments" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createFeePayment(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("paymentKey")} placeholder="paymentKey" className={inputClass} />
                <input {...form.register("paymentName")} placeholder="paymentName" className={inputClass} />
                <input type="number" step="any" {...form.register("paymentAmount", { valueAsNumber: true })} placeholder="paymentAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ScholarshipsPanel({ data }: { data: SchoolData }) {
    const form = useForm<scholarshipsFormValues>({ resolver: zodResolver(scholarshipsFormSchema), defaultValues: {"schoolHubId":"","scholarshipKey":"","scholarshipName":"","scholarshipAmount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Scholarships" description="Enterprise school operating system scholarships" /><div className="mt-6 space-y-3">
                {data.scholarships.length === 0 ? <EmptyState title="No scholarships" description="Create the first scholarships record." /> : data.scholarships.map((item) => (
                    <ListCard key={item.id} title={String(item.scholarshipName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.scholarshipAmount}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create scholarships" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createScholarship(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("scholarshipKey")} placeholder="scholarshipKey" className={inputClass} />
                <input {...form.register("scholarshipName")} placeholder="scholarshipName" className={inputClass} />
                <input type="number" step="any" {...form.register("scholarshipAmount", { valueAsNumber: true })} placeholder="scholarshipAmount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AnnouncementsPanel({ data }: { data: SchoolData }) {
    const form = useForm<announcementsFormValues>({ resolver: zodResolver(announcementsFormSchema), defaultValues: {"schoolHubId":"","announcementKey":"","announcementTitle":"","announcementType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Announcements" description="Enterprise school operating system announcements" /><div className="mt-6 space-y-3">
                {data.announcements.length === 0 ? <EmptyState title="No announcements" description="Create the first announcements record." /> : data.announcements.map((item) => (
                    <ListCard key={item.id} title={String(item.announcementTitle)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.announcementType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create announcements" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAnnouncement(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("announcementKey")} placeholder="announcementKey" className={inputClass} />
                <input {...form.register("announcementTitle")} placeholder="announcementTitle" className={inputClass} />
                <input {...form.register("announcementType")} placeholder="announcementType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MessagingsPanel({ data }: { data: SchoolData }) {
    const form = useForm<messagingFormValues>({ resolver: zodResolver(messagingFormSchema), defaultValues: {"schoolHubId":"","messageKey":"","messageSubject":"","messageType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Messaging" description="Enterprise school operating system messaging" /><div className="mt-6 space-y-3">
                {data.messaging.length === 0 ? <EmptyState title="No messaging" description="Create the first messaging record." /> : data.messaging.map((item) => (
                    <ListCard key={item.id} title={String(item.messageSubject)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.messageType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create messaging" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMessaging(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("messageKey")} placeholder="messageKey" className={inputClass} />
                <input {...form.register("messageSubject")} placeholder="messageSubject" className={inputClass} />
                <input {...form.register("messageType")} placeholder="messageType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function EventsPanel({ data }: { data: SchoolData }) {
    const form = useForm<eventsFormValues>({ resolver: zodResolver(eventsFormSchema), defaultValues: {"schoolHubId":"","eventKey":"","eventName":"","eventType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Events" description="Enterprise school operating system events" /><div className="mt-6 space-y-3">
                {data.events.length === 0 ? <EmptyState title="No events" description="Create the first events record." /> : data.events.map((item) => (
                    <ListCard key={item.id} title={String(item.eventName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.eventType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create events" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEvent(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("eventKey")} placeholder="eventKey" className={inputClass} />
                <input {...form.register("eventName")} placeholder="eventName" className={inputClass} />
                <input {...form.register("eventType")} placeholder="eventType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdmissionsAnalyticssPanel({ data }: { data: SchoolData }) {
    const form = useForm<admissionsAnalyticsFormValues>({ resolver: zodResolver(admissionsAnalyticsFormSchema), defaultValues: {"schoolHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Admissions Analytics" description="Enterprise school operating system admissions analytics" /><div className="mt-6 space-y-3">
                {data.admissionsAnalytics.length === 0 ? <EmptyState title="No admissions analytics" description="Create the first admissions analytics record." /> : data.admissionsAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create admissions analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdmissionsAnalytics(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AttendanceAnalyticssPanel({ data }: { data: SchoolData }) {
    const form = useForm<attendanceAnalyticsFormValues>({ resolver: zodResolver(attendanceAnalyticsFormSchema), defaultValues: {"schoolHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Attendance Analytics" description="Enterprise school operating system attendance analytics" /><div className="mt-6 space-y-3">
                {data.attendanceAnalytics.length === 0 ? <EmptyState title="No attendance analytics" description="Create the first attendance analytics record." /> : data.attendanceAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create attendance analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAttendanceAnalytics(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AcademicAnalyticssPanel({ data }: { data: SchoolData }) {
    const form = useForm<academicAnalyticsFormValues>({ resolver: zodResolver(academicAnalyticsFormSchema), defaultValues: {"schoolHubId":"","analyticsKey":"","analyticsType":"","analyticsScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Academic Analytics" description="Enterprise school operating system academic analytics" /><div className="mt-6 space-y-3">
                {data.academicAnalytics.length === 0 ? <EmptyState title="No academic analytics" description="Create the first academic analytics record." /> : data.academicAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create academic analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAcademicAnalytics(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input {...form.register("analyticsType")} placeholder="analyticsType" className={inputClass} />
                <input type="number" step="any" {...form.register("analyticsScore", { valueAsNumber: true })} placeholder="analyticsScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SchoolMetricsPanel({ data }: { data: SchoolData }) {
    const form = useForm<schoolMetricsFormValues>({ resolver: zodResolver(schoolMetricsFormSchema), defaultValues: {"metricsKey":"","admissionsCount":0,"overallSchoolScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="School Metrics" description="Enterprise school operating system school metrics" /><div className="mt-6 space-y-3">
                {data.schoolMetrics.length === 0 ? <EmptyState title="No school metrics" description="Create the first school metrics record." /> : data.schoolMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallSchoolScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create school metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSchoolMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("admissionsCount", { valueAsNumber: true })} placeholder="admissionsCount" className={inputClass} />
                <input type="number" step="any" {...form.register("overallSchoolScore", { valueAsNumber: true })} placeholder="overallSchoolScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SchoolHealthsPanel({ data }: { data: SchoolData }) {
    const form = useForm<schoolHealthFormValues>({ resolver: zodResolver(schoolHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="School Health" description="Enterprise school operating system school health" /><div className="mt-6 space-y-3">
                {data.schoolHealth.length === 0 ? <EmptyState title="No school health" description="Create the first school health record." /> : data.schoolHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.overallScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create school health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSchoolHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExecutiveKpisPanel({ data }: { data: SchoolData }) {
    const form = useForm<executiveKpisFormValues>({ resolver: zodResolver(executiveKpisFormSchema), defaultValues: {"schoolHubId":"","kpiKey":"","kpiName":"","kpiScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Executive Kpis" description="Enterprise school operating system executive kpis" /><div className="mt-6 space-y-3">
                {data.executiveKpis.length === 0 ? <EmptyState title="No executive kpis" description="Create the first executive kpis record." /> : data.executiveKpis.map((item) => (
                    <ListCard key={item.id} title={String(item.kpiName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.kpiScore}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create executive kpis" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExecutiveKpi(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("kpiKey")} placeholder="kpiKey" className={inputClass} />
                <input {...form.register("kpiName")} placeholder="kpiName" className={inputClass} />
                <input type="number" step="any" {...form.register("kpiScore", { valueAsNumber: true })} placeholder="kpiScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SchoolFailuresPanel({ data }: { data: SchoolData }) {
    const form = useForm<schoolFailuresFormValues>({ resolver: zodResolver(schoolFailuresFormSchema), defaultValues: {"schoolHubId":"","failureKey":"","failureType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="School Failures" description="Enterprise school operating system school failures" /><div className="mt-6 space-y-3">
                {data.schoolFailures.length === 0 ? <EmptyState title="No school failures" description="Create the first school failures record." /> : data.schoolFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.failureType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create school failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSchoolFailure(v))}>
                <SchoolHubSelect data={data} {...form.register("schoolHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <input {...form.register("failureType")} placeholder="failureType" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SchoolAuditLogsPanel({ data }: { data: SchoolData }) {
    return (
        <Card hover><SectionHeader title="School OS audit history" description="Security-first audit trail for jobs, events, feeInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for school operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function SchoolSdkPanel({ data }: { data: SchoolData }) {
    return (
        <Card hover><SectionHeader title="Shared School OS SDK" description="Import from @/src/modules/school/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createSchoolClient()" subtitle="Factory for module-scoped School OS client with auth context" meta="Primary SDK for enterprise school operating system" />
            <ListCard title="sdkRegisterCampus()" subtitle="Register school operating system with AI orchestration" meta="moduleSource: enterprise_school_business_os" />
            <ListCard title="sdkConfigureAdmission()" subtitle="Configure admission with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunExamWorkflow()" subtitle="Run exam workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {SCH_THEME.primary} • Integration hubs loaded: {data.schoolHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createSchoolClient } from "@/src/modules/school/sdk";

const intg = createSchoolClient(userId, email, fullName);
await intg.registerCampus({ schoolHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configureAdmission({ schoolHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runExamWorkflow({ schoolHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
