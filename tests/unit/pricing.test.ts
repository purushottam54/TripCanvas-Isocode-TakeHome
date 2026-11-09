import { describe, it, expect } from "vitest";
import {
  getApplicableSeasonalPrice,
  calculateTransparentQuote,
} from "@/lib/pricing/calculator";
import { SeasonalPrice } from "@/types/package";

describe("Transparent Pricing Engine", () => {
  const samplePrices: SeasonalPrice[] = [
    {
      id: "p1",
      seasonName: "Peak Season (October–March)",
      startMonth: 10,
      endMonth: 3,
      pricePerPerson: 32500,
      currency: "INR",
      childPriceNotes: "Child pricing requires confirmation based on extra bed policy.",
    },
    {
      id: "p2",
      seasonName: "Monsoon Renewal (June–September)",
      startMonth: 6,
      endMonth: 9,
      pricePerPerson: 24900,
      currency: "INR",
      childPriceNotes: "Child pricing requires confirmation based on extra bed policy.",
    },
  ];

  it("Test 7: Seasonal prices are selected correctly for peak season month (December)", () => {
    const selected = getApplicableSeasonalPrice(samplePrices, 12);
    expect(selected).not.toBeNull();
    expect(selected?.seasonName).toContain("Peak Season");
    expect(selected?.pricePerPerson).toBe(32500);
  });

  it("Test 7: Seasonal prices are selected correctly for monsoon month (July)", () => {
    const selected = getApplicableSeasonalPrice(samplePrices, 7);
    expect(selected).not.toBeNull();
    expect(selected?.seasonName).toContain("Monsoon");
    expect(selected?.pricePerPerson).toBe(24900);
  });

  it("Test 11: Prices strictly calculated from database record; child disclaimer is displayed without invented numbers", () => {
    const quote = calculateTransparentQuote({
      seasonalPrice: samplePrices[0],
      adultsCount: 2,
      childrenCount: 1,
    });

    expect(quote.pricePerPerson).toBe(32500);
    expect(quote.totalAdultPrice).toBe(65000);
    expect(quote.estimatedGstAmount).toBe(3250); // 5% of 65000
    expect(quote.estimatedTotalWithGst).toBe(68250);
    expect(quote.childPricingNotes).toBe("Child pricing requires confirmation based on extra bed policy.");
    expect(quote.priceBasis).toBe("per person on twin sharing basis");
  });
});

