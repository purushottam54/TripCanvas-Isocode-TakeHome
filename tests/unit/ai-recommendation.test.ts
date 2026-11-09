import { describe, it, expect } from "vitest";
import { matchPackagesForEnquiry } from "@/lib/ai/recommendation";
import { extractEnquiryDetailsWithGemini } from "@/lib/ai/gemini";
import { PackageRecord } from "@/types/package";

describe("Deterministic Package Recommendations & AI Extraction", () => {
  const publishedPkg: PackageRecord = {
    id: "PKG-KL-07",
    slug: "munnar-thekkady-alleppey-houseboat",
    publishedVersionId: "v1",
    draftVersionId: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    publishedVersion: {
      id: "v1",
      packageId: "PKG-KL-07",
      versionNumber: 1,
      status: "published",
      title: "Munnar, Thekkady and Alleppey Houseboat",
      destination: "Kerala (Munnar, Thekkady, Alleppey)",
      durationDays: 6,
      hotelCategory: "4 star",
      overview: "Houseboat cruise and tea estates.",
      itinerary: [],
      inclusions: [],
      exclusions: [],
      photos: [],
      priceBasis: "per person on twin sharing basis",
      gstDisclosure: "5% GST applicable additionally",
      createdAt: "2026-01-01T00:00:00Z",
      prices: [
        {
          seasonName: "Peak",
          pricePerPerson: 32500,
          currency: "INR",
          childPriceNotes: "Child pricing requires confirmation.",
        },
      ],
    },
  };

  const draftOnlyPkg: PackageRecord = {
    id: "PKG-SI-12",
    slug: "madurai-rameswaram-kanyakumari",
    publishedVersionId: null,
    draftVersionId: "v1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    publishedVersion: null,
    draftVersion: {
      id: "v1",
      packageId: "PKG-SI-12",
      versionNumber: 1,
      status: "draft",
      title: "Madurai, Rameswaram and Kanyakumari",
      destination: "Tamil Nadu",
      durationDays: 5,
      hotelCategory: "3 star",
      overview: "Draft package only.",
      itinerary: [],
      inclusions: [],
      exclusions: [],
      photos: [],
      priceBasis: "per person",
      gstDisclosure: "5% GST",
      createdAt: "2026-01-01T00:00:00Z",
      prices: [{ seasonName: "Standard", pricePerPerson: 18750, currency: "INR", childPriceNotes: "TBD" }],
    },
  };

  it("Test 12: Recommendations only reference existing published packages (Draft packages excluded)", () => {
    const suggestions = matchPackagesForEnquiry([publishedPkg, draftOnlyPkg], {
      destination: "Kerala",
      duration: "6 days",
      budget: 120000,
      requiredExperiences: ["Houseboat"],
    });

    expect(suggestions.length).toBeGreaterThan(0);
    // Every recommended package must be published
    for (const match of suggestions) {
      expect(match.package.publishedVersionId).not.toBeNull();
      expect(match.package.publishedVersion?.status).toBe("published");
      expect(match.package.id).not.toBe("PKG-SI-12"); // draft package must NOT be recommended
    }
    expect(suggestions[0].package.id).toBe("PKG-KL-07");
    expect(suggestions[0].score).toBeGreaterThan(70);
  });

  it("Test 10: AI extraction failure/offline state does not lose enquiries or crash", async () => {
    const fallback = await extractEnquiryDetailsWithGemini(
      "Hi, 2 adults and 1 kid, Kerala 5-6 nights in December, budget around 1.2 lakh total, houseboat a must.",
      {
        destination: "Kerala",
        adultsCount: 2,
        childrenCount: 1,
        duration: "5-6 nights",
        budget: 120000,
      }
    );

    expect(fallback).toBeDefined();
    expect(fallback.destination).toBe("Kerala");
    expect(fallback.adultsCount).toBe(2);
    expect(fallback.childrenCount).toBe(1);
    expect(fallback.reviewNeeded).toBeDefined();
  });
});

