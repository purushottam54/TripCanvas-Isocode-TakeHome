import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

export const aiExtractionSchema = z.object({
  destination: z.string().nullable().optional(),
  arrivalDateOrMonth: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  adultsCount: z.number().nullable().optional(),
  childrenCount: z.number().nullable().optional(),
  budget: z.number().nullable().optional(),
  currency: z.string().default("INR"),
  requiredExperiences: z.array(z.string()).default([]),
  specialRequirements: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export type AiExtractionResult = z.infer<typeof aiExtractionSchema> & {
  status: "success" | "failed" | "corrected" | "pending";
  reviewNeeded: boolean;
  modelInfo: string;
};

/**
 * Server-side extraction service using official @google/genai SDK.
 * Never runs on client, never crashes app if AI is unavailable.
 */
export async function extractEnquiryDetailsWithGemini(
  rawText: string,
  fallbackDefaults?: {
    destination?: string;
    adultsCount?: number;
    childrenCount?: number;
    duration?: string;
    budget?: number;
    specialRequirements?: string;
  }
): Promise<AiExtractionResult> {
  const modelName = "gemini-flash-lite-latest";

  // If API key is not configured, gracefully fallback without error
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    return {
      destination: fallbackDefaults?.destination || "Kerala",
      arrivalDateOrMonth: "Flexible",
      duration: fallbackDefaults?.duration || "5-6 days",
      adultsCount: fallbackDefaults?.adultsCount ?? 2,
      childrenCount: fallbackDefaults?.childrenCount ?? 0,
      budget: fallbackDefaults?.budget ?? null,
      currency: "INR",
      requiredExperiences: fallbackDefaults?.specialRequirements?.toLowerCase().includes("houseboat")
        ? ["Houseboat"]
        : [],
      specialRequirements: fallbackDefaults?.specialRequirements || null,
      status: "pending",
      reviewNeeded: true,
      confidence: 0.7,
      modelInfo: "offline-rule-fallback",
    };
  }

  const prompt = `You are an expert travel consultant intake assistant for TripCanvas (Kerala & South India luxury travel).
Extract structured travel parameters from the traveller's enquiry message below.

TRAVELLER MESSAGE:
"${rawText}"

Return ONLY a valid JSON object with the following fields:
- destination: string (e.g. "Kerala", "Munnar", "Tamil Nadu", or null)
- arrivalDateOrMonth: string (e.g. "December", "15 Dec 2026", or null)
- duration: string (e.g. "5-6 nights", "6 days", or null)
- adultsCount: integer (number of adults, default 2 if ambiguous)
- childrenCount: integer (number of children/kids, default 0)
- budget: number in INR (total amount in INR as a clean number without commas or currency symbol. For example: "1.2 lakh" -> 120000, "50k" -> 50000. If unspecified, return null)
- currency: string ("INR")
- requiredExperiences: array of strings (e.g. ["Houseboat", "Tea Plantations", "Wildlife Safari", "Temple Tour"])
- specialRequirements: string (any dietary, mobility, room, or vehicle preference)
- confidence: number between 0.50 and 0.99 indicating extraction certainty

JSON FORMAT ONLY, NO MARKDOWN, NO COMMENTARY:`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Call with a strict 8-second timeout race to prevent hanging requests
    const response = await Promise.race([
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
      }),
      new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini extraction timeout")), 8000)
      ),
    ]);

    const outputText = response.text || "";
    // Clean potential markdown fencing ```json ... ```
    const cleanedJson = outputText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);
    const validated = aiExtractionSchema.parse(parsed);

    return {
      destination: validated.destination || fallbackDefaults?.destination || "Kerala",
      arrivalDateOrMonth: validated.arrivalDateOrMonth || "Flexible",
      duration: validated.duration || fallbackDefaults?.duration || "5-6 days",
      adultsCount: validated.adultsCount ?? fallbackDefaults?.adultsCount ?? 2,
      childrenCount: validated.childrenCount ?? fallbackDefaults?.childrenCount ?? 0,
      budget: validated.budget ?? fallbackDefaults?.budget ?? null,
      currency: validated.currency || "INR",
      requiredExperiences: validated.requiredExperiences || [],
      specialRequirements: validated.specialRequirements || fallbackDefaults?.specialRequirements || null,
      status: "success",
      reviewNeeded: (validated.confidence || 0.9) < 0.8,
      confidence: validated.confidence || 0.92,
      modelInfo: modelName,
    };
  } catch (error: any) {
    console.warn("Gemini extraction failed, using safe fallback:", error.message);
    return {
      destination: fallbackDefaults?.destination || "Kerala",
      arrivalDateOrMonth: "Flexible",
      duration: fallbackDefaults?.duration || null,
      adultsCount: fallbackDefaults?.adultsCount ?? 2,
      childrenCount: fallbackDefaults?.childrenCount ?? 0,
      budget: fallbackDefaults?.budget ?? null,
      currency: "INR",
      requiredExperiences: fallbackDefaults?.specialRequirements?.toLowerCase().includes("houseboat")
        ? ["Houseboat"]
        : [],
      specialRequirements: fallbackDefaults?.specialRequirements || rawText,
      status: "failed",
      reviewNeeded: true,
      confidence: 0.5,
      modelInfo: `fallback-error: ${error.message?.slice(0, 40)}`,
    };
  }
}

