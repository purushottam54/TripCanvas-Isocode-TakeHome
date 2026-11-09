export type ExtractionStatus = "success" | "failed" | "corrected" | "pending";

export interface AiExtractionRecord {
  id: string;
  enquiryId: string;
  originalMessage: string;
  destination?: string | null;
  arrivalDateOrMonth?: string | null;
  duration?: string | null;
  adultsCount?: number | null;
  childrenCount?: number | null;
  budget?: number | null;
  currency?: string | null;
  requiredExperiences: string[];
  specialRequirements?: string | null;
  extractionStatus: ExtractionStatus;
  reviewNeeded: boolean;
  confidenceScore?: number | null;
  modelInfo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PackageSuggestionRecord {
  id: string;
  enquiryId: string;
  packageId: string;
  packageTitle: string;
  packageSlug: string;
  durationDays: number;
  startingPrice: number;
  currency: string;
  score: number; // 0 - 100
  matchReasons: string[];
  createdAt: string;
}

export interface AiReplyDraftPayload {
  enquiryId: string;
  customerName: string;
  destination: string;
  travelDateOrMonth?: string;
  duration?: string;
  adultsCount: number;
  childrenCount: number;
  budget?: number;
  selectedPackageTitle: string;
  selectedPackagePricePerPerson: number;
  currency: string;
  priceBasis: string;
  gstDisclosure: string;
  seasonName: string;
  childPricingNote: string;
  consultantName: string;
}

