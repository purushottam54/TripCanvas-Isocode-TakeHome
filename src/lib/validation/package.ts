import { z } from "zod";

export const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(2, "Day title is required"),
  description: z.string().min(10, "Day description is required"),
  stay: z.string().optional(),
  meals: z.string().optional(),
});

export const seasonalPriceInputSchema = z.object({
  id: z.string().optional(),
  seasonName: z.string().min(2, "Season name is required"),
  startMonth: z.number().int().min(1).max(12).optional(),
  endMonth: z.number().int().min(1).max(12).optional(),
  pricePerPerson: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().default("INR"),
  childPriceNotes: z
    .string()
    .default("Child pricing requires confirmation"),
  description: z.string().optional(),
});

export const packageEditorSchema = z.object({
  id: z.string().min(2, "Package ID is required (e.g. PKG-KL-08)"),
  slug: z.string().min(2, "Slug is required (e.g. munnar-retreat)"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  destination: z.string().min(2, "Destination is required"),
  durationDays: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  hotelCategory: z.string().min(2, "Hotel category is required"),
  overview: z.string().min(20, "Overview must be at least 20 characters"),
  itinerary: z.array(itineraryDaySchema).min(1, "At least 1 day itinerary is required"),
  inclusions: z.array(z.string()).min(1, "At least 1 inclusion is required"),
  exclusions: z.array(z.string()).default([]),
  photos: z
    .array(
      z.object({
        url: z.string().url("Valid photo URL is required"),
        caption: z.string().optional(),
        isHero: z.boolean().optional(),
      })
    )
    .min(1, "At least 1 photo is required"),
  prices: z
    .array(seasonalPriceInputSchema)
    .min(1, "At least 1 seasonal price is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  priceBasis: z.string().default("per person on twin sharing basis"),
  gstDisclosure: z.string().default("5% GST applicable additionally"),
});

export type PackageEditorInput = z.infer<typeof packageEditorSchema>;
