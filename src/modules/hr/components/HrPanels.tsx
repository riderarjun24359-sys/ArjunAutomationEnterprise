"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { CANDIDATE_STAGE_OPTIONS, DESIGNATION_LEVEL_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "@/src/modules/hr/constants";
import {
    departmentFormSchema,
    designationFormSchema,
    employeeFormSchema,
    holidayFormSchema,
    hrTeamFormSchema,
    jobCandidateFormSchema,
    jobOpeningFormSchema,
    leaveRequestFormSchema,
    type DepartmentFormValues,
    type DesignationFormValues,
    type EmployeeFormValues,
    type HolidayFormValues,
    type HrTeamFormValues,
    type JobCandidateFormValues,
    type JobOpeningFormValues,
    type LeaveRequestFormValues,
} from "@/src/modules/hr/schemas";
import type { useHr } from "@/src/modules/hr/hooks/useHr";

type HrData = ReturnType<typeof useHr>;

const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";

function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return (
        <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">
            {loading ? "Saving..." : label}
        </button>
    );
}

function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return (
        <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4 transition hover:border-[var(--dos-brand-primary)]">
            <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
            <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">{subtitle}</p>
            {meta ? <p className="mt-1 dos-text-caption text-[var(--dos-ai-accent)]">{meta}</p> : null}
        </div>
    );
}

export function HrOverviewPanel({ data }: { data: HrData }) {
    return (
        <div className="grid gap-8 xl:grid-cols-2">
            <section className="os-panel p-6">
                <header className="mb-6">
                    <h3 className="dos-text-h3">Workforce Summary</h3>
                    <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Current HR coverage across the organization</p>
                </header>
                <div className="grid gap-3 sm:grid-cols-2">
                    <ListCard title="Employees" subtitle={`${data.stats?.activeEmployees ?? 0} active of ${data.stats?.totalEmployees ?? 0}`} />
                    <ListCard title="Departments" subtitle={`${data.departments.length} departments`} />
                    <ListCard title="Open roles" subtitle={`${data.stats?.openPositions ?? 0} open positions`} />
                    <ListCard title="Holidays" subtitle={`${data.stats?.upcomingHolidays ?? 0} upcoming`} />
                </div>
            </section>
            
            <section className="os-panel p-6">
                <header className="mb-6">
                    <h3 className="dos-text-h3">Role-based HR access</h3>
                    <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Roles with HR permissions in this organization</p>
                </header>
                <div className="space-y-3">
                    {data.roleAccess.length === 0 ? (
                        <p className="dos-text-secondary p-4 text-center">No HR role grants</p>
                    ) : (
                        data.roleAccess.map((role) => (
                            <div key={role.roleName} className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-4">
                                <p className="font-semibold text-[var(--dos-text-primary)]">{role.roleName}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                        <span key={permission} className="rounded-full bg-[var(--dos-surface-tertiary)] px-3 py-1 dos-text-caption text-[var(--dos-text-secondary)]">{permission}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export function EmployeeDirectoryPanel({ data }: { data: HrData }) {
    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: { employeeCode: "", firstName: "", lastName: "", email: "", phone: "", employmentType: "full_time", hireDate: new Date().toISOString().slice(0, 10), baseSalary: 0 },
    });

    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="Employee directory" description="Active workforce records from Supabase" />
                <div className="mt-6 space-y-3">
                    {data.employees.length === 0 ? <EmptyState title="No employees" description="Add employees to build your directory." /> : data.employees.map((employee) => (
                        <ListCard key={employee.id} title={employee.fullName} subtitle={`${employee.employeeCode} • ${employee.email}`} meta={`${employee.departmentName ?? "Unassigned"} • ${employee.designationTitle ?? "No designation"} • ${employee.status}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add employee" description="Create a new employee record" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createEmployee(values))}>
                    <input {...form.register("employeeCode")} placeholder="Employee code" className={inputClass} />
                    <input {...form.register("firstName")} placeholder="First name" className={inputClass} />
                    <input {...form.register("lastName")} placeholder="Last name" className={inputClass} />
                    <input {...form.register("email")} placeholder="Email" className={inputClass} />
                    <input {...form.register("phone")} placeholder="Phone" className={inputClass} />
                    <select {...form.register("departmentId")} className={inputClass}><option value="">Select department</option>{data.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                    <select {...form.register("designationId")} className={inputClass}><option value="">Select designation</option>{data.designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}</select>
                    <select {...form.register("employmentType")} className={inputClass}>{EMPLOYMENT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    <input type="date" {...form.register("hireDate")} className={inputClass} />
                    <input type="number" {...form.register("baseSalary", { valueAsNumber: true })} placeholder="Base salary" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add employee" />
                </form>
            </Card>
        </div>
    );
}

export function DepartmentsPanel({ data }: { data: HrData }) {
    const form = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentFormSchema), defaultValues: { name: "", code: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Departments" description="Organizational departments and headcount" />
                <div className="mt-6 space-y-3">
                    {data.departments.length === 0 ? <EmptyState title="No departments" description="Create departments to organize employees." /> : data.departments.map((dept) => (
                        <ListCard key={dept.id} title={dept.name} subtitle={dept.description || dept.code} meta={`${dept.employeeCount} employees • Head: ${dept.headEmployeeName ?? "Unassigned"}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add department" description="Create a new department" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createDepartment(values))}>
                    <input {...form.register("name")} placeholder="Department name" className={inputClass} />
                    <input {...form.register("code")} placeholder="Department code" className={inputClass} />
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add department" />
                </form>
            </Card>
        </div>
    );
}

export function DesignationsPanel({ data }: { data: HrData }) {
    const form = useForm<DesignationFormValues>({ resolver: zodResolver(designationFormSchema), defaultValues: { title: "", level: "individual_contributor", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Designations" description="Job titles and levels" />
                <div className="mt-6 space-y-3">
                    {data.designations.length === 0 ? <EmptyState title="No designations" description="Create designations for employee roles." /> : data.designations.map((item) => (
                        <ListCard key={item.id} title={item.title} subtitle={item.description || item.level} meta={`${item.employeeCount} employees`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add designation" description="Create a new designation" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createDesignation(values))}>
                    <input {...form.register("title")} placeholder="Title" className={inputClass} />
                    <select {...form.register("level")} className={inputClass}>{DESIGNATION_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add designation" />
                </form>
            </Card>
        </div>
    );
}

export function HrTeamsPanel({ data }: { data: HrData }) {
    const form = useForm<HrTeamFormValues>({ resolver: zodResolver(hrTeamFormSchema), defaultValues: { name: "", slug: "", description: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="HR teams" description="Cross-functional and delivery teams" />
                <div className="mt-6 space-y-3">
                    {data.teams.length === 0 ? <EmptyState title="No teams" description="Create HR teams to group employees." /> : data.teams.map((team) => (
                        <ListCard key={team.id} title={team.name} subtitle={team.description} meta={`${team.memberCount} members • Lead: ${team.leadEmployeeName ?? "Unassigned"}`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add team" description="Create a new HR team" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createHrTeam(values))}>
                    <input {...form.register("name")} placeholder="Team name" className={inputClass} />
                    <input {...form.register("slug")} placeholder="team-slug" className={inputClass} />
                    <select {...form.register("departmentId")} className={inputClass}><option value="">Select department</option>{data.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                    <input {...form.register("description")} placeholder="Description" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add team" />
                </form>
            </Card>
        </div>
    );
}

export function AttendancePanel({ data }: { data: HrData }) {
    return (
        <Card hover>
            <SectionHeader title="Attendance" description="Daily attendance and check-in records" />
            <div className="mt-6 space-y-3">
                {data.attendance.length === 0 ? <EmptyState title="No attendance records" description="Attendance records will appear once tracked." /> : data.attendance.map((record) => (
                    <ListCard key={record.id} title={record.employeeName} subtitle={`${record.workDate} • ${record.status}`} meta={`Check-in: ${record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "—"} • Check-out: ${record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "—"}`} />
                ))}
            </div>
        </Card>
    );
}

export function LeavePanel({ data }: { data: HrData }) {
    const form = useForm<LeaveRequestFormValues>({ resolver: zodResolver(leaveRequestFormSchema), defaultValues: { employeeId: "", leaveTypeId: "", startDate: "", endDate: "", reason: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Leave management" description="Leave types and employee requests" />
                <div className="mt-6 space-y-3">
                    {data.leaveRequests.length === 0 ? <EmptyState title="No leave requests" description="Leave requests will appear here." /> : data.leaveRequests.map((request) => (
                        <div key={request.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <ListCard title={request.employeeName} subtitle={`${request.leaveTypeName} • ${request.startDate} to ${request.endDate}`} meta={request.reason} />
                            {request.status === "pending" ? (
                                <div className="mt-3 flex gap-2">
                                    <button type="button" onClick={() => data.updateLeaveRequestStatus(request.id, { status: "approved" })} className="rounded-full bg-emerald-600 px-3 py-1 text-xs text-white">Approve</button>
                                    <button type="button" onClick={() => data.updateLeaveRequestStatus(request.id, { status: "rejected" })} className="rounded-full border border-slate-300 px-3 py-1 text-xs">Reject</button>
                                </div>
                            ) : <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{request.status}</p>}
                        </div>
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Request leave" description="Submit a new leave request" />
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                    {data.leaveTypes.map((type) => <p key={type.id}>{type.name} ({type.code}) — {type.annualQuota} days {type.paid ? "paid" : "unpaid"}</p>)}
                </div>
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createLeaveRequest(values))}>
                    <select {...form.register("employeeId")} className={inputClass}><option value="">Select employee</option>{data.employees.map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}</select>
                    <select {...form.register("leaveTypeId")} className={inputClass}><option value="">Select leave type</option>{data.leaveTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                    <input type="date" {...form.register("startDate")} className={inputClass} />
                    <input type="date" {...form.register("endDate")} className={inputClass} />
                    <input {...form.register("reason")} placeholder="Reason" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Submit request" />
                </form>
            </Card>
        </div>
    );
}

export function HolidaysPanel({ data }: { data: HrData }) {
    const form = useForm<HolidayFormValues>({ resolver: zodResolver(holidayFormSchema), defaultValues: { name: "", holidayDate: "", region: "global" } });
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Holiday calendar" description="Organization-wide holidays" />
                <div className="mt-6 space-y-3">
                    {data.holidays.length === 0 ? <EmptyState title="No holidays" description="Add holidays to the calendar." /> : data.holidays.map((holiday) => (
                        <ListCard key={holiday.id} title={holiday.name} subtitle={holiday.holidayDate} meta={holiday.region} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Add holiday" description="Create a new holiday" />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => data.createHoliday(values))}>
                    <input {...form.register("name")} placeholder="Holiday name" className={inputClass} />
                    <input type="date" {...form.register("holidayDate")} className={inputClass} />
                    <input {...form.register("region")} placeholder="Region" className={inputClass} />
                    <SaveButton loading={form.formState.isSubmitting} label="Add holiday" />
                </form>
            </Card>
        </div>
    );
}

export function PayrollPanel({ data }: { data: HrData }) {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Payroll cycles" description="Payroll foundation and cycle status" />
                <div className="mt-6 space-y-3">
                    {data.payrollCycles.length === 0 ? <EmptyState title="No payroll cycles" description="Payroll cycles will appear once configured." /> : data.payrollCycles.map((cycle) => (
                        <ListCard key={cycle.id} title={cycle.name} subtitle={`${cycle.periodStart} to ${cycle.periodEnd}`} meta={`${cycle.status} • ${cycle.entryCount} entries • ₹${cycle.totalNetPay.toLocaleString()} net`} />
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Payroll entries" description="Employee compensation entries by cycle" />
                <div className="mt-6 space-y-3">
                    {data.payrollEntries.length === 0 ? <EmptyState title="No payroll entries" description="Entries appear when payroll is processed." /> : data.payrollEntries.map((entry) => (
                        <ListCard key={entry.id} title={entry.employeeName} subtitle={`Base ₹${entry.baseSalary.toLocaleString()} • Allowances ₹${entry.allowances.toLocaleString()} • Deductions ₹${entry.deductions.toLocaleString()}`} meta={`Net ₹${entry.netPay.toLocaleString()} • ${entry.status}`} />
                    ))}
                </div>
            </Card>
        </div>
    );
}

export function DocumentsPanel({ data }: { data: HrData }) {
    return (
        <Card hover>
            <SectionHeader title="Employee documents" description="Contracts, identity, and HR documents" />
            <div className="mt-6 space-y-3">
                {data.documents.length === 0 ? <EmptyState title="No documents" description="Employee documents will appear once uploaded." /> : data.documents.map((doc) => (
                    <ListCard key={doc.id} title={doc.title} subtitle={`${doc.employeeName} • ${doc.documentType}`} meta={doc.fileUrl} />
                ))}
            </div>
        </Card>
    );
}

export function PerformancePanel({ data }: { data: HrData }) {
    return (
        <Card hover>
            <SectionHeader title="Performance reviews" description="Review cycles, ratings, and feedback" />
            <div className="mt-6 space-y-3">
                {data.reviews.length === 0 ? <EmptyState title="No performance reviews" description="Reviews will appear once scheduled." /> : data.reviews.map((review) => (
                    <ListCard key={review.id} title={review.employeeName} subtitle={`${review.reviewPeriod} • Rating ${review.rating}`} meta={`Reviewer: ${review.reviewerName ?? "Unassigned"} • ${review.status}`} />
                ))}
            </div>
        </Card>
    );
}

export function RecruitmentPanel({ data }: { data: HrData }) {
    const openingForm = useForm<JobOpeningFormValues>({ resolver: zodResolver(jobOpeningFormSchema), defaultValues: { title: "", description: "" } });
    const candidateForm = useForm<JobCandidateFormValues>({ resolver: zodResolver(jobCandidateFormSchema), defaultValues: { openingId: "", fullName: "", email: "", notes: "" } });

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Recruitment pipeline" description="Open roles and candidate stages" />
                <div className="mt-6 space-y-3">
                    {data.openings.length === 0 ? <EmptyState title="No openings" description="Create job openings to start recruiting." /> : data.openings.map((opening) => (
                        <ListCard key={opening.id} title={opening.title} subtitle={opening.description} meta={`${opening.status} • ${opening.candidateCount} candidates • ${opening.departmentName ?? "Any dept"}`} />
                    ))}
                </div>
                <div className="mt-6 space-y-3">
                    {data.candidates.map((candidate) => (
                        <div key={candidate.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                            <ListCard title={candidate.fullName} subtitle={`${candidate.openingTitle} • ${candidate.email}`} meta={candidate.notes} />
                            <select value={candidate.stage} onChange={(event) => data.updateJobCandidateStage(candidate.id, { stage: event.target.value })} className={`${inputClass} mt-3`}>
                                {CANDIDATE_STAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </Card>
            <div className="grid gap-6">
                <Card hover>
                    <SectionHeader title="Add opening" description="Create a job opening" />
                    <form className="mt-6 grid gap-4" onSubmit={openingForm.handleSubmit(async (values) => data.createJobOpening(values))}>
                        <input {...openingForm.register("title")} placeholder="Job title" className={inputClass} />
                        <select {...openingForm.register("departmentId")} className={inputClass}><option value="">Department</option>{data.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                        <select {...openingForm.register("designationId")} className={inputClass}><option value="">Designation</option>{data.designations.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}</select>
                        <input {...openingForm.register("description")} placeholder="Description" className={inputClass} />
                        <SaveButton loading={openingForm.formState.isSubmitting} label="Add opening" />
                    </form>
                </Card>
                <Card hover>
                    <SectionHeader title="Add candidate" description="Add candidate to pipeline" />
                    <form className="mt-6 grid gap-4" onSubmit={candidateForm.handleSubmit(async (values) => data.createJobCandidate(values))}>
                        <select {...candidateForm.register("openingId")} className={inputClass}><option value="">Select opening</option>{data.openings.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select>
                        <input {...candidateForm.register("fullName")} placeholder="Full name" className={inputClass} />
                        <input {...candidateForm.register("email")} placeholder="Email" className={inputClass} />
                        <input {...candidateForm.register("notes")} placeholder="Notes" className={inputClass} />
                        <SaveButton loading={candidateForm.formState.isSubmitting} label="Add candidate" />
                    </form>
                </Card>
            </div>
        </div>
    );
}

export function LifecyclePanel({ data }: { data: HrData }) {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Onboarding" description="New hire onboarding plans and tasks" />
                <div className="mt-6 space-y-4">
                    {data.onboardingPlans.length === 0 ? <EmptyState title="No onboarding plans" description="Onboarding plans will appear for new hires." /> : data.onboardingPlans.map((plan) => (
                        <div key={plan.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                            <p className="font-medium">{plan.employeeName}</p>
                            <p className="text-sm text-slate-500">{plan.status} • Started {plan.startDate}</p>
                            <div className="mt-3 space-y-2">
                                {plan.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950">
                                        <span>{task.title}</span>
                                        <button type="button" onClick={() => data.updateOnboardingTask(task.id, { status: task.status === "completed" ? "pending" : "completed" })} className="text-emerald-600">{task.status}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Offboarding" description="Exit plans and completion tasks" />
                <div className="mt-6 space-y-4">
                    {data.offboardingPlans.length === 0 ? <EmptyState title="No offboarding plans" description="Offboarding plans will appear when scheduled." /> : data.offboardingPlans.map((plan) => (
                        <div key={plan.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                            <p className="font-medium">{plan.employeeName}</p>
                            <p className="text-sm text-slate-500">{plan.status} • Last day {plan.lastWorkingDate}</p>
                            <div className="mt-3 space-y-2">
                                {plan.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950">
                                        <span>{task.title}</span>
                                        <button type="button" onClick={() => data.updateOffboardingTask(task.id, { status: task.status === "completed" ? "pending" : "completed" })} className="text-emerald-600">{task.status}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

export function OrgChartPanel({ data }: { data: HrData }) {
    const roots = data.orgChart.filter((node) => !node.parentNodeId);
    const children = (parentId: string) => data.orgChart.filter((node) => node.parentNodeId === parentId);

    const renderNode = (node: (typeof data.orgChart)[number], depth = 0) => (
        <div key={node.id} style={{ marginLeft: depth * 20 }} className="space-y-2">
            <ListCard title={node.employeeName} subtitle={`${node.departmentName ?? "No dept"} • ${node.designationTitle ?? "No title"}`} />
            {children(node.id).map((child) => renderNode(child, depth + 1))}
        </div>
    );

    return (
        <Card hover>
            <SectionHeader title="Organization chart" description="Reporting structure and hierarchy" />
            <div className="mt-6 space-y-4">
                {data.orgChart.length === 0 ? <EmptyState title="No org chart nodes" description="Org chart nodes will appear once configured." /> : roots.map((node) => renderNode(node))}
            </div>
        </Card>
    );
}

export function HrReportsPanel({ data }: { data: HrData }) {
    const report = data.analytics;
    if (!report) return <EmptyState title="No analytics" description="HR analytics will appear once data is available." />;

    const sections = [
        { title: "Headcount by department", rows: report.headcountByDepartment.map((row) => `${row.department}: ${row.count}`) },
        { title: "Leave utilization", rows: report.leaveUtilization.map((row) => `${row.leaveType}: ${row.requests} requests`) },
        { title: "Attendance summary", rows: report.attendanceSummary.map((row) => `${row.status}: ${row.count}`) },
        { title: "Recruitment pipeline", rows: report.recruitmentPipeline.map((row) => `${row.stage}: ${row.count}`) },
        { title: "Performance distribution", rows: report.performanceDistribution.map((row) => `${row.ratingBand}: ${row.count}`) },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
                <Card key={section.title} hover>
                    <SectionHeader title={section.title} description="HR analytics snapshot" />
                    <div className="mt-6 space-y-2">
                        {section.rows.length === 0 ? <p className="text-sm text-slate-500">No data</p> : section.rows.map((row) => <p key={row} className="text-sm">{row}</p>)}
                    </div>
                </Card>
            ))}
        </div>
    );
}
