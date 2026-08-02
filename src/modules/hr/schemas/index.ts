import { z } from "zod";

export const departmentFormSchema = z.object({
    name: z.string().min(2, "Department name is required"),
    code: z.string().min(2, "Department code is required"),
    description: z.string(),
});

export const designationFormSchema = z.object({
    title: z.string().min(2, "Designation title is required"),
    level: z.string().min(1, "Level is required"),
    description: z.string(),
});

export const employeeFormSchema = z.object({
    employeeCode: z.string().min(2, "Employee code is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string(),
    departmentId: z.string().optional(),
    designationId: z.string().optional(),
    employmentType: z.string().min(1),
    hireDate: z.string().min(1),
    baseSalary: z.number().min(0),
});

export const hrTeamFormSchema = z.object({
    name: z.string().min(2, "Team name is required"),
    slug: z.string().min(2, "Team slug is required"),
    description: z.string(),
    departmentId: z.string().optional(),
});

export const leaveRequestFormSchema = z.object({
    employeeId: z.string().min(1, "Employee is required"),
    leaveTypeId: z.string().min(1, "Leave type is required"),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    reason: z.string(),
});

export const holidayFormSchema = z.object({
    name: z.string().min(2, "Holiday name is required"),
    holidayDate: z.string().min(1),
    region: z.string(),
});

export const jobOpeningFormSchema = z.object({
    title: z.string().min(2, "Job title is required"),
    departmentId: z.string().optional(),
    designationId: z.string().optional(),
    description: z.string(),
});

export const jobCandidateFormSchema = z.object({
    openingId: z.string().min(1, "Opening is required"),
    fullName: z.string().min(2, "Candidate name is required"),
    email: z.string().email("Valid email is required"),
    notes: z.string(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
export type DesignationFormValues = z.infer<typeof designationFormSchema>;
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
export type HrTeamFormValues = z.infer<typeof hrTeamFormSchema>;
export type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema>;
export type HolidayFormValues = z.infer<typeof holidayFormSchema>;
export type JobOpeningFormValues = z.infer<typeof jobOpeningFormSchema>;
export type JobCandidateFormValues = z.infer<typeof jobCandidateFormSchema>;
