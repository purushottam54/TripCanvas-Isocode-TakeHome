import { z } from "zod";

export const enquiryFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^[+0-9\s\-()]+$/, "Phone number contains invalid characters"),
  packageId: z.string().optional().nullable(),
  packageSlug: z.string().optional().nullable(),
  destination: z
    .string()
    .trim()
    .min(2, "Please specify a destination or region"),
  travelStartDate: z.string().optional().nullable(),
  travelDuration: z.string().optional().nullable(),
  adultsCount: z.coerce
    .number()
    .int()
    .min(1, "At least 1 adult is required")
    .max(30, "Maximum 30 adults per enquiry"),
  childrenCount: z.coerce
    .number()
    .int()
    .min(0, "Children count cannot be negative")
    .max(20, "Maximum 20 children per enquiry")
    .default(0),
  budget: z.coerce
    .number()
    .min(0, "Budget cannot be negative")
    .optional()
    .nullable(),
  currency: z.string().default("INR"),
  specialRequirements: z.string().max(2000).optional().nullable(),
  whatsappConsent: z.boolean().default(false),
  // Honeypot field for spam prevention - must be left empty
  websiteUrl: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type EnquiryFormInput = z.infer<typeof enquiryFormSchema>;

