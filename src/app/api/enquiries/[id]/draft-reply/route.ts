import { NextRequest, NextResponse } from "next/server";
import { getEnquiryById, saveAiReplyDraft, getPublishedPackages } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { generateEditorialReplyDraft } from "@/lib/ai/reply-drafting";
import { getApplicableSeasonalPrice } from "@/lib/pricing/calculator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewEnquiries")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const { packageId } = await req.json();

  const data = await getEnquiryById(id);
  if (!data.enquiry) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  const published = await getPublishedPackages();
  const selectedPackage = published.find(
    (p) => p.id === packageId || p.slug === data.enquiry?.packageSlug
  ) || published[0];

  if (!selectedPackage || !selectedPackage.publishedVersion) {
    return NextResponse.json(
      { error: "No published package available to draft reply from." },
      { status: 400 }
    );
  }

  const version = selectedPackage.publishedVersion;
  const seasonalPrice = getApplicableSeasonalPrice(version.prices || []);

  if (!seasonalPrice) {
    return NextResponse.json(
      { error: "Selected package has no published pricing." },
      { status: 400 }
    );
  }

  // Strictly use database prices
  const draft = await generateEditorialReplyDraft({
    enquiryId: id,
    customerName: data.enquiry.fullName,
    destination: version.destination,
    duration: `${version.durationDays} Days / ${version.durationDays - 1} Nights`,
    adultsCount: data.enquiry.adultsCount,
    childrenCount: data.enquiry.childrenCount,
    budget: data.enquiry.budget || undefined,
    selectedPackageTitle: version.title,
    selectedPackagePricePerPerson: seasonalPrice.pricePerPerson,
    currency: seasonalPrice.currency,
    priceBasis: version.priceBasis,
    gstDisclosure: version.gstDisclosure,
    seasonName: seasonalPrice.seasonName,
    childPricingNote: seasonalPrice.childPriceNotes,
    consultantName: user.fullName,
  });

  const savedMessage = await saveAiReplyDraft(id, draft.subject, draft.body);

  return NextResponse.json({ success: true, message: savedMessage });
}

