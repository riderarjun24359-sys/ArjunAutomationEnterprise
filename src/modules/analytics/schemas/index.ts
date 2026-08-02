import { z } from "zod";

export const reportFormSchema = z.object({
    name: z.string().min(2, "Report name is required"),
    reportType: z.enum(["summary", "finance", "clients", "delivery", "automation"]),
    status: z.enum(["draft", "published", "archived"]).optional(),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
