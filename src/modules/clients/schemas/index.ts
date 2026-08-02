import { z } from "zod";

export const clientFormSchema = z.object({
    name: z.string().min(2, "Client name is required"),
    status: z.enum(["lead", "active", "inactive", "at_risk"]),
    industry: z.enum(["saas", "manufacturing", "healthcare", "retail", "finance", "education"]),
    contactEmail: z.string().email("Enter a valid email"),
    manager: z.string().min(2, "Manager is required"),
    revenue: z.string().min(1, "Revenue is required"),
    phone: z.string().optional(),
    website: z.string().url("Enter a valid URL").or(z.literal("")),
    address: z.string().optional(),
    description: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
