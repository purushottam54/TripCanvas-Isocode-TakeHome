import { describe, it, expect } from "vitest";
import { enquiryFormSchema } from "@/lib/validation/enquiry";
import { submitEnquiry } from "@/lib/db/store";

describe("Enquiry Form Validation & Spam Protection", () => {
  it("Test 8: Invalid enquiries are rejected when mandatory fields are missing", () => {
    const invalidInputs = [
      {
        fullName: "", // missing
        email: "invalid-email",
        phone: "123", // too short
        destination: "",
        adultsCount: 0, // at least 1 required
      },
      {
        fullName: "Rohan",
        email: "rohan@example.com",
        phone: "+919876543210",
        destination: "Kerala",
        adultsCount: 2,
        websiteUrl: "http://spam-bot.com", // honeypot triggered
      },
    ];

    const result1 = enquiryFormSchema.safeParse(invalidInputs[0]);
    expect(result1.success).toBe(false);

    const result2 = enquiryFormSchema.safeParse(invalidInputs[1]);
    expect(result2.success).toBe(false);
  });

  it("Test 9: Valid enquiries are validated and saved", async () => {
    const validInput = {
      fullName: "Ananya Iyer",
      email: "ananya.iyer.test@example.com",
      phone: "+91 98111 22334",
      destination: "Kerala (Alleppey)",
      adultsCount: 2,
      childrenCount: 0,
      budget: 80000,
      currency: "INR",
      specialRequirements: "Houseboat cruise required.",
      whatsappConsent: true,
      websiteUrl: "",
    };

    const parseResult = enquiryFormSchema.safeParse(validInput);
    expect(parseResult.success).toBe(true);

    const saved = await submitEnquiry(parseResult.data!);
    expect(saved.id).toBeDefined();
    expect(saved.enquiryNumber).toMatch(/^ENQ-2026-\d{3}$/);
    expect(saved.fullName).toBe("Ananya Iyer");
    expect(saved.status).toBe("new");
  });
});
