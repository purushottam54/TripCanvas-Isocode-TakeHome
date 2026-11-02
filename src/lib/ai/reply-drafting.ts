import { GoogleGenAI } from "@google/genai";
import { AiReplyDraftPayload } from "@/types/ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateEditorialReplyDraft(
  payload: AiReplyDraftPayload
): Promise<{ subject: string; body: string }> {
  // Compute deterministic formatted values directly from published DB records
  const formattedPricePerPerson = `₹${payload.selectedPackagePricePerPerson.toLocaleString("en-IN")}`;
  const totalBaseAdults = payload.selectedPackagePricePerPerson * Math.max(1, payload.adultsCount);
  const formattedTotalAdults = `₹${totalBaseAdults.toLocaleString("en-IN")}`;
  const childPricingText =
    payload.childrenCount > 0
      ? "Child pricing requires confirmation (subject to hotel child policy & extra bed)."
      : "No child occupancy requested.";

  const fallbackSubject = `TripCanvas Proposal: ${payload.selectedPackageTitle} for ${payload.customerName}`;
  const fallbackBody = `Namaskaram ${payload.customerName},

Thank you for planning your holiday to ${payload.destination} with TripCanvas. We are pleased to present our curated itinerary proposal: "${payload.selectedPackageTitle}".

--- PROPOSAL SUMMARY ---
• Destination: ${payload.destination}
• Duration: ${payload.duration || "As per curated itinerary"}
• Travellers: ${payload.adultsCount} Adult(s)${payload.childrenCount > 0 ? `, ${payload.childrenCount} Child(ren)` : ""}
• Applicable Season: ${payload.seasonName}

--- TRANSPARENT PRICING BREAKDOWN ---
• Rate: ${formattedPricePerPerson} ${payload.priceBasis}
• Total Base Adult Cost (${payload.adultsCount} Adult(s)): ${formattedTotalAdults}
• Statutory Tax: ${payload.gstDisclosure}
• Child Pricing: ${childPricingText}

All accommodation is selected in certified 4-star properties with private chauffeured transfers throughout.

Please review this preliminary proposal. I am available to fine-tune the day-wise itinerary to your exact flight schedules and preferences.

Warm regards,

${payload.consultantName || "Senior Tour Consultant"}
TripCanvas | Handcrafted Kerala Holidays
Kochi, Kerala`;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    return {
      subject: fallbackSubject,
      body: fallbackBody,
    };
  }

  const prompt = `You are an editorial luxury travel consultant drafting an email reply for TripCanvas (Kochi, Kerala).
The customer has enquired about a trip. Use an elegant, warm, professional South Indian hospitality tone (opening with "Namaskaram").

STRICT RULE ON PRICING:
Do NOT calculate or modify prices. You MUST include these EXACT figures provided from our database:
- Selected Package: "${payload.selectedPackageTitle}"
- Rate: ${formattedPricePerPerson} ${payload.priceBasis}
- Total Base Adult Cost: ${formattedTotalAdults} for ${payload.adultsCount} Adult(s)
- GST Disclosure: "${payload.gstDisclosure}"
- Season: "${payload.seasonName}"
- Child Pricing Note: "${childPricingText}"

TRAVELLER DETAILS:
- Name: ${payload.customerName}
- Destination: ${payload.destination}
- Duration: ${payload.duration || "6 days"}
- Consultant Name: ${payload.consultantName}

Output a JSON object with two fields:
{
  "subject": "string",
  "body": "string"
}
Output JSON ONLY.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await Promise.race([
      ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: prompt,
      }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 7000)),
    ]);

    const text = response.text || "";
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (parsed.subject && parsed.body) {
      return {
        subject: parsed.subject,
        body: parsed.body,
      };
    }
    return { subject: fallbackSubject, body: fallbackBody };
  } catch (err: any) {
    console.warn("AI reply draft fallback:", err.message);
    return {
      subject: fallbackSubject,
      body: fallbackBody,
    };
  }
}
