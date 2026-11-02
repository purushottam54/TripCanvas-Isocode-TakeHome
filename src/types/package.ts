export type PackageVersionStatus = "draft" | "published" | "archived";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  stay?: string;
  meals?: string;
}

export interface PackagePhoto {
  url: string;
  caption?: string;
  isHero?: boolean;
}

export interface RouteWaypoint {
  name: string;
  order: number;
}

export interface SeasonalPrice {
  id?: string;
  packageVersionId?: string;
  seasonName: string;
  startMonth?: number; // 1-12
  endMonth?: number;   // 1-12
  pricePerPerson: number;
  currency: string;
  childPriceNotes: string;
  description?: string;
}

export interface PackageVersion {
  id: string;
  packageId: string;
  versionNumber: number;
  status: PackageVersionStatus;
  title: string;
  destination: string;
  durationDays: number;
  hotelCategory: string; // e.g. '3 star', '4 star', '5 star'
  overview: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  photos: PackagePhoto[];
  routeMap?: RouteWaypoint[];
  seoTitle?: string;
  seoDescription?: string;
  priceBasis: string; // e.g. "per person on twin sharing basis"
  gstDisclosure: string; // e.g. "5% GST applicable additionally"
  createdBy?: string;
  createdAt?: string;
  publishedAt?: string;
  prices?: SeasonalPrice[];
}

export interface PackageRecord {
  id: string; // e.g. "PKG-KL-07"
  slug: string;
  publishedVersionId: string | null;
  draftVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  publishedVersion?: PackageVersion | null;
  draftVersion?: PackageVersion | null;
  versions?: PackageVersion[];
}
