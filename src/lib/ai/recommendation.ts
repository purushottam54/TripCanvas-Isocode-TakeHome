import { PackageRecord } from "@/types/package";

export interface MatchCriteria {
  destination: string;
  duration?: string;
  budget?: number;
  requiredExperiences?: string[];
  travelMonth?: number; // 1 to 12
}

export interface PackageMatchResult {
  package: PackageRecord;
  score: number; // 0 to 100
  matchReasons: string[];
}

/**
 * Deterministic scoring algorithm for package recommendation.
 * Strictly operates on published package records from PostgreSQL.
 * Never fabricates packages, IDs, or prices.
 *
 * Scoring Breakdown (Max 100 points):
 * 1. Destination Match: up to 40 pts
 *    - Exact region match: 40 pts
 *    - Partial/neighboring match: 20 pts
 * 2. Duration Fit: up to 20 pts
 *    - Within 1 day: 20 pts
 *    - Within 2-3 days: 10 pts
 * 3. Budget Fit: up to 25 pts
 *    - Base adult package cost <= traveller budget: 25 pts
 *    - Within 15% budget margin: 15 pts
 * 4. Experience Keywords Match: up to 15 pts
 *    - Matches requested experiences (e.g. houseboat, tea, wildlife): 5 pts each (max 15 pts)
 */
export function matchPackagesForEnquiry(
  packages: PackageRecord[],
  criteria: MatchCriteria
): PackageMatchResult[] {
  // Filter only published packages with a valid published version
  const publishedPackages = packages.filter(
    (p) => p.publishedVersionId && p.publishedVersion && p.publishedVersion.status === "published"
  );

  if (publishedPackages.length === 0) {
    return [];
  }

  // Parse duration if provided as a string like "5-6 nights" or "6 days"
  let targetDays = 0;
  if (criteria.duration) {
    const numMatch = criteria.duration.match(/\d+/g);
    if (numMatch && numMatch.length > 0) {
      targetDays = parseInt(numMatch[numMatch.length - 1], 10);
    }
  }

  const results: PackageMatchResult[] = [];

  for (const pkg of publishedPackages) {
    const version = pkg.publishedVersion!;
    let score = 0;
    const reasons: string[] = [];

    // 1. DESTINATION MATCH (Max 40)
    const destQuery = criteria.destination.toLowerCase().trim();
    const pkgDest = version.destination.toLowerCase();
    const pkgTitle = version.title.toLowerCase();

    if (
      pkgDest.includes(destQuery) ||
      destQuery.includes("kerala") && pkgDest.includes("kerala") ||
      destQuery.includes("tamil nadu") && pkgDest.includes("tamil nadu")
    ) {
      score += 40;
      reasons.push(`Destination match: aligns with requested region '${criteria.destination}'`);
    } else if (
      destQuery.includes("south india") ||
      pkgDest.includes("south india") ||
      pkgTitle.includes(destQuery)
    ) {
      score += 25;
      reasons.push("Regional compatibility within South India travel corridors");
    }

    // 2. DURATION MATCH (Max 20)
    if (targetDays > 0) {
      const diff = Math.abs(version.durationDays - targetDays);
      if (diff <= 1) {
        score += 20;
        reasons.push(
          `Duration fit: package is ${version.durationDays} days (requested: ${criteria.duration})`
        );
      } else if (diff <= 3) {
        score += 10;
        reasons.push(
          `Flexible duration: package is ${version.durationDays} days (close to requested ${criteria.duration})`
        );
      }
    } else {
      score += 10;
    }

    // 3. BUDGET AFFORDABILITY (Max 25)
    const basePrice = version.prices?.[0]?.pricePerPerson || 0;
    const approxCoupleCost = basePrice * 2; // benchmark couple base

    if (criteria.budget && criteria.budget > 0) {
      if (approxCoupleCost <= criteria.budget) {
        score += 25;
        reasons.push(
          `Budget fit: couple base price ₹${approxCoupleCost.toLocaleString("en-IN")} is within budget ₹${criteria.budget.toLocaleString("en-IN")}`
        );
      } else if (approxCoupleCost <= criteria.budget * 1.15) {
        score += 15;
        reasons.push(
          `Slight budget variance: couple base price is ₹${approxCoupleCost.toLocaleString("en-IN")}`
        );
      } else {
        reasons.push(
          `Premium tier: package couple base price ₹${approxCoupleCost.toLocaleString("en-IN")} exceeds target budget`
        );
      }
    } else {
      score += 15;
    }

    // 4. EXPERIENCES MATCH (Max 15)
    if (criteria.requiredExperiences && criteria.requiredExperiences.length > 0) {
      let expScore = 0;
      const contentCorpus = `${version.title} ${version.overview} ${JSON.stringify(version.itinerary)}`.toLowerCase();

      for (const exp of criteria.requiredExperiences) {
        const expLower = exp.toLowerCase();
        if (contentCorpus.includes(expLower)) {
          expScore += 5;
          reasons.push(`Includes requested experience: ${exp}`);
        }
      }
      score += Math.min(15, expScore);
    }

    // Always append child pricing caution if applicable
    reasons.push("Child pricing requires consultant confirmation based on hotel extra-bed rules");

    if (score >= 30) {
      results.push({
        package: pkg,
        score: Math.min(100, Math.round(score)),
        matchReasons: reasons,
      });
    }
  }

  // Sort descending by score and return top 3 matches
  return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

