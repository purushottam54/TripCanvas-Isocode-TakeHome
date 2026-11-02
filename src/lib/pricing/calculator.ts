import { SeasonalPrice } from "@/types/package";

export interface PriceCalculationResult {
  pricePerPerson: number;
  totalAdultPrice: number;
  currency: string;
  seasonName: string;
  priceBasis: string;
  gstDisclosure: string;
  childPricingNotes: string;
  adultsCount: number;
  childrenCount: number;
  estimatedGstAmount: number; // 5% GST
  estimatedTotalWithGst: number;
}

/**
 * Deterministically retrieves the applicable seasonal price from published prices.
 * Never invents prices or applies unverified discounts.
 */
export function getApplicableSeasonalPrice(
  prices: SeasonalPrice[],
  travelMonth?: number
): SeasonalPrice | null {
  if (!prices || prices.length === 0) return null;

  if (travelMonth && travelMonth >= 1 && travelMonth <= 12) {
    // Check if any season matches the specific month range
    const matched = prices.find((p) => {
      if (p.startMonth === undefined || p.endMonth === undefined) return false;
      if (p.startMonth <= p.endMonth) {
        return travelMonth >= p.startMonth && travelMonth <= p.endMonth;
      } else {
        // Crosses calendar year, e.g. Oct (10) to March (3)
        return travelMonth >= p.startMonth || travelMonth <= p.endMonth;
      }
    });
    if (matched) return matched;
  }

  // Default to the first available published seasonal rate
  return prices[0];
}

/**
 * Calculates transparent pricing breakdown strictly from published DB records.
 */
export function calculateTransparentQuote({
  seasonalPrice,
  adultsCount = 2,
  childrenCount = 0,
  priceBasis = "per person on twin sharing basis",
  gstDisclosure = "5% GST applicable additionally",
}: {
  seasonalPrice: SeasonalPrice;
  adultsCount: number;
  childrenCount: number;
  priceBasis?: string;
  gstDisclosure?: string;
}): PriceCalculationResult {
  const pricePerPerson = Number(seasonalPrice.pricePerPerson);
  const totalAdultPrice = pricePerPerson * Math.max(1, adultsCount);
  const estimatedGstAmount = Math.round(totalAdultPrice * 0.05);
  const estimatedTotalWithGst = totalAdultPrice + estimatedGstAmount;

  return {
    pricePerPerson,
    totalAdultPrice,
    currency: seasonalPrice.currency || "INR",
    seasonName: seasonalPrice.seasonName,
    priceBasis,
    gstDisclosure,
    childPricingNotes:
      childrenCount > 0
        ? seasonalPrice.childPriceNotes || "Child pricing requires confirmation."
        : "No child travelers indicated.",
    adultsCount,
    childrenCount,
    estimatedGstAmount,
    estimatedTotalWithGst,
  };
}
