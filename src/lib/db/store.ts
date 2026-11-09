import {
  initialPackages,
  initialEnquiries,
  initialAiExtractions,
  initialPackageSuggestions,
  initialEnquiryNotes,
  initialActivityLogs,
  initialRedirects,
  initialStaffProfiles,
} from "./seed-data";
import { PackageRecord, PackageVersion, SeasonalPrice } from "@/types/package";
import { EnquiryRecord, EnquiryNote, EnquiryMessage, EnquiryStatus } from "@/types/enquiry";
import { AiExtractionRecord, PackageSuggestionRecord, AiReplyDraftPayload } from "@/types/ai";
import { ActivityLogRecord, LegacyRedirectRecord } from "@/types/activity";
import { UserProfile } from "@/types/auth";
import { PackageEditorInput } from "@/lib/validation/package";
import { EnquiryFormInput } from "@/lib/validation/enquiry";
import { matchPackagesForEnquiry } from "@/lib/ai/recommendation";
import { extractEnquiryDetailsWithGemini } from "@/lib/ai/gemini";

// In-memory persistent state container for Next.js server lifecycle
declare global {
  // eslint-disable-next-line no-var
  var __tripcanvas_store: {
    packages: PackageRecord[];
    enquiries: EnquiryRecord[];
    aiExtractions: Record<string, AiExtractionRecord>;
    packageSuggestions: Record<string, PackageSuggestionRecord[]>;
    enquiryNotes: Record<string, EnquiryNote[]>;
    enquiryMessages: Record<string, EnquiryMessage[]>;
    activityLogs: ActivityLogRecord[];
    redirects: LegacyRedirectRecord[];
    profiles: UserProfile[];
  } | undefined;
}

if (!global.__tripcanvas_store) {
  // Deep clone initial data
  global.__tripcanvas_store = {
    packages: JSON.parse(JSON.stringify(initialPackages)),
    enquiries: JSON.parse(JSON.stringify(initialEnquiries)),
    aiExtractions: JSON.parse(JSON.stringify(initialAiExtractions)),
    packageSuggestions: JSON.parse(JSON.stringify(initialPackageSuggestions)),
    enquiryNotes: JSON.parse(JSON.stringify(initialEnquiryNotes)),
    enquiryMessages: {},
    activityLogs: JSON.parse(JSON.stringify(initialActivityLogs)),
    redirects: JSON.parse(JSON.stringify(initialRedirects)),
    profiles: JSON.parse(JSON.stringify(initialStaffProfiles)),
  };

  // Seed default acknowledgement message for sample enquiry 1
  global.__tripcanvas_store.enquiryMessages["enq-001"] = [
    {
      id: "msg-001",
      enquiryId: "enq-001",
      senderName: "System Automation",
      subject: "Acknowledgment: Your Kerala Holiday Enquiry [ENQ-2026-001]",
      body: "Namaskaram Rohan Sharma,\n\nThank you for reaching out to TripCanvas. We have received your enquiry for Kerala (5-6 nights, December). A Senior Tour Consultant has been assigned and will prepare a transparent proposal shortly.\n\nWarm regards,\nTripCanvas Team, Kochi",
      isAiDraft: false,
      isApproved: true,
      sentSimulatedAt: "2026-11-02T14:20:05Z",
      channel: "email",
      createdAt: "2026-11-02T14:20:05Z",
    },
  ];
}

const store = global.__tripcanvas_store;

// ====================================================================
// PACKAGES DATA ACCESS
// ====================================================================

export async function getPublishedPackages(): Promise<PackageRecord[]> {
  return store.packages
    .filter((pkg) => pkg.publishedVersionId && pkg.publishedVersion)
    .sort((a, b) => (a.publishedVersion?.title || "").localeCompare(b.publishedVersion?.title || ""));
}

export async function getPackageBySlug(slug: string): Promise<PackageRecord | null> {
  const pkg = store.packages.find((p) => p.slug === slug);
  if (!pkg) return null;
  return pkg;
}

export async function getPackageById(id: string): Promise<PackageRecord | null> {
  const pkg = store.packages.find((p) => p.id === id);
  if (!pkg) return null;
  return pkg;
}

export async function getAllPackagesForAdmin(): Promise<PackageRecord[]> {
  return store.packages;
}

/**
 * Creates a brand new package with an initial draft version (v1).
 */
export async function createPackage(
  input: PackageEditorInput,
  actorEmail = "admin@tripcanvas.internal"
): Promise<PackageRecord> {
  const existing = store.packages.find((p) => p.id === input.id || p.slug === input.slug);
  if (existing) {
    throw new Error(`A package with ID '${input.id}' or slug '${input.slug}' already exists.`);
  }

  const versionId = `ver-${input.id.toLowerCase()}-v1`;
  const draftVersion: PackageVersion = {
    id: versionId,
    packageId: input.id,
    versionNumber: 1,
    status: "draft",
    title: input.title,
    destination: input.destination,
    durationDays: input.durationDays,
    hotelCategory: input.hotelCategory,
    overview: input.overview,
    itinerary: input.itinerary,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    photos: input.photos,
    routeMap: [],
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    priceBasis: input.priceBasis,
    gstDisclosure: input.gstDisclosure,
    createdAt: new Date().toISOString(),
    prices: input.prices.map((p, idx) => ({
      id: `prc-${versionId}-${idx + 1}`,
      packageVersionId: versionId,
      ...p,
    })),
  };

  const newPackage: PackageRecord = {
    id: input.id,
    slug: input.slug,
    publishedVersionId: null,
    draftVersionId: versionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedVersion: null,
    draftVersion: draftVersion,
    versions: [draftVersion],
  };

  store.packages.unshift(newPackage);

  logActivity({
    actorEmail,
    action: "package.created",
    entityType: "package",
    entityId: newPackage.id,
    metadata: { version: 1, title: newPackage.draftVersion?.title, status: "draft" },
  });

  return newPackage;
}

/**
 * Updates the current draft version or creates a new draft version.
 */
export async function saveDraft(
  packageId: string,
  input: PackageEditorInput,
  actorEmail = "editor@tripcanvas.internal"
): Promise<PackageRecord> {
  const pkg = store.packages.find((p) => p.id === packageId);
  if (!pkg) {
    throw new Error(`Package with ID '${packageId}' not found.`);
  }

  // Calculate next version number if creating a new draft while published version exists
  const highestVersion = Math.max(
    0,
    pkg.publishedVersion?.versionNumber || 0,
    pkg.draftVersion?.versionNumber || 0,
    ...(pkg.versions?.map((v) => v.versionNumber) || [])
  );
  const versionNum = pkg.draftVersion ? pkg.draftVersion.versionNumber : highestVersion + 1;
  const versionId = pkg.draftVersion?.id || `ver-${pkg.id.toLowerCase()}-v${versionNum}`;

  const updatedDraft: PackageVersion = {
    id: versionId,
    packageId: pkg.id,
    versionNumber: versionNum,
    status: "draft",
    title: input.title,
    destination: input.destination,
    durationDays: input.durationDays,
    hotelCategory: input.hotelCategory,
    overview: input.overview,
    itinerary: input.itinerary,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    photos: input.photos,
    routeMap: pkg.draftVersion?.routeMap || [],
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    priceBasis: input.priceBasis,
    gstDisclosure: input.gstDisclosure,
    createdAt: pkg.draftVersion?.createdAt || new Date().toISOString(),
    prices: input.prices.map((p, idx) => ({
      id: p.id || `prc-${versionId}-${idx + 1}`,
      packageVersionId: versionId,
      ...p,
    })),
  };

  pkg.slug = input.slug;
  pkg.draftVersionId = versionId;
  pkg.draftVersion = updatedDraft;
  pkg.updatedAt = new Date().toISOString();

  logActivity({
    actorEmail,
    action: "package.edited",
    entityType: "package",
    entityId: pkg.id,
    metadata: { version: versionNum, title: updatedDraft.title },
  });

  return pkg;
}

/**
 * Publishing creates an immutable published version.
 * Updates the published-version pointer.
 * Preserves previous versions in history.
 */
export async function publishPackage(
  packageId: string,
  actorEmail = "admin@tripcanvas.internal"
): Promise<PackageRecord> {
  const pkg = store.packages.find((p) => p.id === packageId);
  if (!pkg) {
    throw new Error(`Package with ID '${packageId}' not found.`);
  }

  if (!pkg.draftVersion && !pkg.publishedVersion) {
    throw new Error("No draft or version found to publish.");
  }

  const versionToPublish = pkg.draftVersion || pkg.publishedVersion;
  if (!versionToPublish) {
    throw new Error("No content found to publish.");
  }

  // Finalize as immutable published version
  const publishedVersion: PackageVersion = {
    ...JSON.parse(JSON.stringify(versionToPublish)),
    status: "published",
    publishedAt: new Date().toISOString(),
  };

  // Archive previous published version into versions array if exists
  if (pkg.publishedVersion && pkg.publishedVersion.id !== publishedVersion.id) {
    if (!pkg.versions) pkg.versions = [];
    const archivedPrev: PackageVersion = {
      ...pkg.publishedVersion,
      status: "archived",
    };
    pkg.versions.push(archivedPrev);
  }

  pkg.publishedVersionId = publishedVersion.id;
  pkg.publishedVersion = publishedVersion;
  pkg.draftVersionId = null;
  pkg.draftVersion = null;
  pkg.updatedAt = new Date().toISOString();

  logActivity({
    actorEmail,
    action: "package.published",
    entityType: "package",
    entityId: pkg.id,
    metadata: {
      version: publishedVersion.versionNumber,
      title: publishedVersion.title,
    },
  });

  return pkg;
}

/**
 * Rollback restores an earlier version by creating a new version from the selected historical snapshot.
 * Never silently overwrites historical records!
 */
export async function restorePackageVersion(
  packageId: string,
  targetVersionNumber: number,
  actorEmail = "admin@tripcanvas.internal"
): Promise<PackageRecord> {
  const pkg = store.packages.find((p) => p.id === packageId);
  if (!pkg) throw new Error("Package not found");

  const allVersions: PackageVersion[] = [
    ...(pkg.publishedVersion ? [pkg.publishedVersion] : []),
    ...(pkg.draftVersion ? [pkg.draftVersion] : []),
    ...(pkg.versions || []),
  ];

  const historical = allVersions.find((v) => v.versionNumber === targetVersionNumber);
  if (!historical) {
    throw new Error(`Historical version v${targetVersionNumber} was not found.`);
  }

  const highestVersion = Math.max(0, ...allVersions.map((v) => v.versionNumber));
  const newVersionNum = highestVersion + 1;
  const newVersionId = `ver-${pkg.id.toLowerCase()}-v${newVersionNum}`;

  // Clone historical snapshot into brand new version
  const restoredVersion: PackageVersion = {
    ...JSON.parse(JSON.stringify(historical)),
    id: newVersionId,
    versionNumber: newVersionNum,
    status: "draft",
    createdAt: new Date().toISOString(),
    publishedAt: undefined,
  };

  pkg.draftVersionId = newVersionId;
  pkg.draftVersion = restoredVersion;
  pkg.updatedAt = new Date().toISOString();

  logActivity({
    actorEmail,
    action: "package.restored",
    entityType: "package",
    entityId: pkg.id,
    metadata: {
      restoredFromVersion: targetVersionNumber,
      createdNewVersion: newVersionNum,
    },
  });

  return pkg;
}

/**
 * Duplicates an existing package into a new draft package.
 */
export async function duplicatePackage(
  packageId: string,
  actorEmail = "editor@tripcanvas.internal"
): Promise<PackageRecord> {
  const source = store.packages.find((p) => p.id === packageId);
  if (!source) throw new Error("Source package not found");

  const baseVersion = source.publishedVersion || source.draftVersion;
  if (!baseVersion) throw new Error("No version content to duplicate");

  const randSuffix = Math.floor(10 + Math.random() * 90);
  const newId = `${source.id}-CPY${randSuffix}`;
  const newSlug = `${source.slug}-copy-${randSuffix}`;

  const editorInput: PackageEditorInput = {
    id: newId,
    slug: newSlug,
    title: `${baseVersion.title} (Copy)`,
    destination: baseVersion.destination,
    durationDays: baseVersion.durationDays,
    hotelCategory: baseVersion.hotelCategory,
    overview: baseVersion.overview,
    itinerary: JSON.parse(JSON.stringify(baseVersion.itinerary)),
    inclusions: [...baseVersion.inclusions],
    exclusions: [...baseVersion.exclusions],
    photos: JSON.parse(JSON.stringify(baseVersion.photos)),
    prices: JSON.parse(JSON.stringify(baseVersion.prices || [])),
    seoTitle: baseVersion.seoTitle,
    seoDescription: baseVersion.seoDescription,
    priceBasis: baseVersion.priceBasis,
    gstDisclosure: baseVersion.gstDisclosure,
  };

  return createPackage(editorInput, actorEmail);
}

// ====================================================================
// ENQUIRIES & AI WORKFLOW DATA ACCESS
// ====================================================================

export async function submitEnquiry(input: EnquiryFormInput): Promise<EnquiryRecord> {
  // Validate honeypot spam protection
  if (input.websiteUrl && input.websiteUrl.length > 0) {
    throw new Error("Spam submission detected.");
  }

  const count = store.enquiries.length + 1;
  const enquiryNumber = `ENQ-2026-${String(count).padStart(3, "0")}`;
  const enquiryId = `enq-${Date.now()}`;

  const record: EnquiryRecord = {
    id: enquiryId,
    enquiryNumber,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    packageId: input.packageId || null,
    packageSlug: input.packageSlug || null,
    destination: input.destination,
    travelStartDate: input.travelStartDate || null,
    travelDuration: input.travelDuration || null,
    adultsCount: input.adultsCount,
    childrenCount: input.childrenCount,
    budget: input.budget || null,
    currency: input.currency || "INR",
    specialRequirements: input.specialRequirements || null,
    whatsappConsent: input.whatsappConsent,
    status: "new",
    assignedConsultantId: "00000000-0000-0000-0000-000000000003",
    assignedConsultantName: "Deepa Kurian",
    responseDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    channel: "website",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.enquiries.unshift(record);

  // Auto-acknowledgment record (simulated confirmation)
  store.enquiryMessages[enquiryId] = [
    {
      id: `ack-${Date.now()}`,
      enquiryId,
      senderName: "System Automation",
      subject: `Enquiry Received: ${enquiryNumber}`,
      body: `Namaskaram ${input.fullName},\n\nWe have received your travel enquiry for ${input.destination}. Our travel consultant has been notified and will review your requirements to create a customized proposal.\n\nSummary:\n- Destination: ${input.destination}\n- Travellers: ${input.adultsCount} Adults${input.childrenCount > 0 ? `, ${input.childrenCount} Children` : ""}\n- Ref: ${enquiryNumber}\n\nWarm regards,\nTripCanvas Team, Kochi`,
      isAiDraft: false,
      isApproved: true,
      sentSimulatedAt: new Date().toISOString(),
      channel: "email",
      createdAt: new Date().toISOString(),
    },
  ];

  logActivity({
    actorEmail: "system",
    action: "enquiry.created",
    entityType: "enquiry",
    entityId: enquiryNumber,
    metadata: {
      customer: input.fullName,
      destination: input.destination,
      adults: input.adultsCount,
      children: input.childrenCount,
    },
  });

  // Run AI extraction and package matching
  try {
    const rawMessage = `${input.destination}. ${input.specialRequirements || ""}. Travellers: ${input.adultsCount} adults, ${input.childrenCount} kids. Duration: ${input.travelDuration || "not specified"}. Budget: ${input.budget ? `₹${input.budget}` : "flexible"}.`;
    
    const extractionResult = await extractEnquiryDetailsWithGemini(rawMessage, {
      destination: input.destination,
      adultsCount: input.adultsCount,
      childrenCount: input.childrenCount,
      duration: input.travelDuration || undefined,
      budget: input.budget || undefined,
      specialRequirements: input.specialRequirements || undefined,
    });

    const extractionRecord: AiExtractionRecord = {
      id: `ext-${Date.now()}`,
      enquiryId,
      originalMessage: rawMessage,
      destination: extractionResult.destination || input.destination,
      arrivalDateOrMonth: extractionResult.arrivalDateOrMonth || "Flexible",
      duration: extractionResult.duration || input.travelDuration || null,
      adultsCount: extractionResult.adultsCount ?? input.adultsCount,
      childrenCount: extractionResult.childrenCount ?? input.childrenCount,
      budget: extractionResult.budget ?? input.budget ?? null,
      currency: extractionResult.currency || "INR",
      requiredExperiences: extractionResult.requiredExperiences || [],
      specialRequirements: extractionResult.specialRequirements || input.specialRequirements || null,
      extractionStatus: extractionResult.status,
      reviewNeeded: extractionResult.reviewNeeded,
      confidenceScore: extractionResult.confidence,
      modelInfo: extractionResult.modelInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.aiExtractions[enquiryId] = extractionRecord;

    // Deterministic package recommendations strictly from published packages
    const published = await getPublishedPackages();
    const suggestions = matchPackagesForEnquiry(published, {
      destination: extractionRecord.destination || input.destination,
      duration: extractionRecord.duration || input.travelDuration || "",
      budget: extractionRecord.budget || input.budget || 0,
      requiredExperiences: extractionRecord.requiredExperiences,
    });

    store.packageSuggestions[enquiryId] = suggestions.map((s, idx) => ({
      id: `sug-${enquiryId}-${idx + 1}`,
      enquiryId,
      packageId: s.package.id,
      packageTitle: s.package.publishedVersion?.title || s.package.id,
      packageSlug: s.package.slug,
      durationDays: s.package.publishedVersion?.durationDays || 0,
      startingPrice: s.package.publishedVersion?.prices?.[0]?.pricePerPerson || 0,
      currency: s.package.publishedVersion?.prices?.[0]?.currency || "INR",
      score: s.score,
      matchReasons: s.matchReasons,
      createdAt: new Date().toISOString(),
    }));
  } catch (err: any) {
    console.error("Non-blocking AI extraction error:", err.message);
  }

  return record;
}

export async function getAllEnquiries(filter?: {
  status?: string;
  destination?: string;
  assignedConsultantId?: string;
}): Promise<EnquiryRecord[]> {
  let list = [...store.enquiries];
  if (filter?.status && filter.status !== "all") {
    list = list.filter((e) => e.status === filter.status);
  }
  if (filter?.destination && filter.destination !== "all") {
    list = list.filter((e) =>
      e.destination.toLowerCase().includes(filter.destination!.toLowerCase())
    );
  }
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getEnquiryById(id: string): Promise<{
  enquiry: EnquiryRecord | null;
  aiExtraction: AiExtractionRecord | null;
  suggestions: PackageSuggestionRecord[];
  notes: EnquiryNote[];
  messages: EnquiryMessage[];
}> {
  const enquiry = store.enquiries.find((e) => e.id === id || e.enquiryNumber === id) || null;
  if (!enquiry) {
    return {
      enquiry: null,
      aiExtraction: null,
      suggestions: [],
      notes: [],
      messages: [],
    };
  }

  const aiExtraction = store.aiExtractions[enquiry.id] || null;
  const suggestions = store.packageSuggestions[enquiry.id] || [];
  const notes = store.enquiryNotes[enquiry.id] || [];
  const messages = store.enquiryMessages[enquiry.id] || [];

  return { enquiry, aiExtraction, suggestions, notes, messages };
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
  assignedConsultantId?: string,
  actorEmail = "consultant@tripcanvas.internal"
): Promise<EnquiryRecord> {
  const enquiry = store.enquiries.find((e) => e.id === enquiryId);
  if (!enquiry) throw new Error("Enquiry not found");

  const prevStatus = enquiry.status;
  enquiry.status = status;
  if (assignedConsultantId) {
    enquiry.assignedConsultantId = assignedConsultantId;
    const profile = store.profiles.find((p) => p.id === assignedConsultantId);
    if (profile) enquiry.assignedConsultantName = profile.fullName;
  }
  enquiry.updatedAt = new Date().toISOString();

  logActivity({
    actorEmail,
    action: "enquiry.status_changed",
    entityType: "enquiry",
    entityId: enquiry.enquiryNumber,
    metadata: { previousStatus: prevStatus, newStatus: status },
  });

  return enquiry;
}

export async function addEnquiryNote(
  enquiryId: string,
  noteText: string,
  authorName = "Deepa Kurian",
  actorEmail = "consultant@tripcanvas.internal"
): Promise<EnquiryNote> {
  const enquiry = store.enquiries.find((e) => e.id === enquiryId);
  if (!enquiry) throw new Error("Enquiry not found");

  const newNote: EnquiryNote = {
    id: `note-${Date.now()}`,
    enquiryId,
    authorName,
    note: noteText,
    createdAt: new Date().toISOString(),
  };

  if (!store.enquiryNotes[enquiryId]) {
    store.enquiryNotes[enquiryId] = [];
  }
  store.enquiryNotes[enquiryId].unshift(newNote);

  logActivity({
    actorEmail,
    action: "enquiry.note_added",
    entityType: "enquiry",
    entityId: enquiry.enquiryNumber,
    metadata: { noteSnippet: noteText.slice(0, 50) },
  });

  return newNote;
}

export async function updateAiExtraction(
  enquiryId: string,
  fields: Partial<AiExtractionRecord>,
  actorEmail = "consultant@tripcanvas.internal"
): Promise<AiExtractionRecord> {
  let extraction = store.aiExtractions[enquiryId];
  if (!extraction) {
    extraction = {
      id: `ext-${Date.now()}`,
      enquiryId,
      originalMessage: "Manual entry",
      requiredExperiences: [],
      extractionStatus: "corrected",
      reviewNeeded: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.aiExtractions[enquiryId] = extraction;
  }

  Object.assign(extraction, fields, {
    extractionStatus: "corrected",
    reviewNeeded: false,
    updatedAt: new Date().toISOString(),
  });

  logActivity({
    actorEmail,
    action: "ai.extracted",
    entityType: "enquiry",
    entityId: enquiryId,
    metadata: { correctedByConsultant: true },
  });

  return extraction;
}

export async function saveAiReplyDraft(
  enquiryId: string,
  subject: string,
  body: string
): Promise<EnquiryMessage> {
  const message: EnquiryMessage = {
    id: `msg-${Date.now()}`,
    enquiryId,
    senderName: "AI Assistant (Draft)",
    subject,
    body,
    isAiDraft: true,
    isApproved: false,
    channel: "email",
    createdAt: new Date().toISOString(),
  };

  if (!store.enquiryMessages[enquiryId]) {
    store.enquiryMessages[enquiryId] = [];
  }
  store.enquiryMessages[enquiryId].push(message);

  logActivity({
    actorEmail: "ai-assistant",
    action: "reply.drafted",
    entityType: "enquiry",
    entityId: enquiryId,
    metadata: { subject },
  });

  return message;
}

export async function approveAndSendReply(
  enquiryId: string,
  messageId: string,
  approverName = "Deepa Kurian",
  actorEmail = "consultant@tripcanvas.internal"
): Promise<EnquiryMessage> {
  const msgs = store.enquiryMessages[enquiryId] || [];
  const msg = msgs.find((m) => m.id === messageId);
  if (!msg) throw new Error("Message not found");

  msg.isApproved = true;
  msg.approvedByName = approverName;
  msg.approvedAt = new Date().toISOString();
  msg.sentSimulatedAt = new Date().toISOString();

  // Mark enquiry as replied
  const enquiry = store.enquiries.find((e) => e.id === enquiryId);
  if (enquiry) {
    enquiry.status = "replied";
    enquiry.updatedAt = new Date().toISOString();
  }

  logActivity({
    actorEmail,
    action: "reply.approved",
    entityType: "enquiry",
    entityId: enquiry?.enquiryNumber || enquiryId,
    metadata: { approvedBy: approverName, simulatedChannel: msg.channel },
  });

  return msg;
}

// ====================================================================
// ACTIVITY LOGS & REDIRECTS
// ====================================================================

export function logActivity(entry: Omit<ActivityLogRecord, "id" | "createdAt">) {
  const log: ActivityLogRecord = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  store.activityLogs.unshift(log);
}

export async function getActivityLogs(limit = 100): Promise<ActivityLogRecord[]> {
  return store.activityLogs.slice(0, limit);
}

export async function getLegacyRedirects(): Promise<LegacyRedirectRecord[]> {
  return store.redirects;
}

export async function addLegacyRedirect(sourcePath: string, targetPath: string): Promise<LegacyRedirectRecord> {
  const existing = store.redirects.find((r) => r.sourcePath === sourcePath);
  if (existing) {
    existing.targetPath = targetPath;
    return existing;
  }
  const redirect: LegacyRedirectRecord = {
    id: `red-${Date.now()}`,
    sourcePath,
    targetPath,
    statusCode: 301,
    createdAt: new Date().toISOString(),
  };
  store.redirects.unshift(redirect);
  return redirect;
}

export async function getStaffProfiles(): Promise<UserProfile[]> {
  return store.profiles;
}

