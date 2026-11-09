import { describe, it, expect } from "vitest";
import {
  createPackage,
  saveDraft,
  publishPackage,
  restorePackageVersion,
  getPackageById,
  getPublishedPackages,
} from "@/lib/db/store";
import { PackageEditorInput } from "@/lib/validation/package";

describe("Versioned CMS & Immutable Publishing Engine", () => {
  const packageInput: PackageEditorInput = {
    id: "PKG-TEST-01",
    slug: "test-kerala-tour",
    title: "Test Kerala Tour Version 1",
    destination: "Kerala",
    durationDays: 5,
    hotelCategory: "4 star",
    overview: "Original v1 overview for testing versioning integrity.",
    itinerary: [
      {
        day: 1,
        title: "Day 1 Arrival",
        description: "Arrival in Cochin.",
      },
    ],
    inclusions: ["Chauffeur car", "Breakfast"],
    exclusions: ["Airfare"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        caption: "Test photo",
      },
    ],
    prices: [
      {
        seasonName: "Standard",
        pricePerPerson: 25000,
        currency: "INR",
        childPriceNotes: "Child pricing requires confirmation.",
      },
    ],
    priceBasis: "per person on twin sharing basis",
    gstDisclosure: "5% GST applicable additionally",
  };

  it("Test 2: Admin can create a package (creates package with v1 draft)", async () => {
    const created = await createPackage(packageInput, "admin@tripcanvas.internal");
    expect(created.id).toBe("PKG-TEST-01");
    expect(created.draftVersionId).toBeDefined();
    expect(created.draftVersion?.versionNumber).toBe(1);
    expect(created.publishedVersionId).toBeNull(); // not yet published
  });

  it("Test 5: Publishing creates an immutable version and updates pointer", async () => {
    const published = await publishPackage("PKG-TEST-01", "admin@tripcanvas.internal");
    expect(published.publishedVersionId).toBeDefined();
    expect(published.publishedVersion?.status).toBe("published");
    expect(published.publishedVersion?.versionNumber).toBe(1);
    expect(published.draftVersionId).toBeNull(); // draft is finalized
  });

  it("Test 4: Draft changes do not affect public published content", async () => {
    // Edit draft to Version 2
    const editedInput: PackageEditorInput = {
      ...packageInput,
      title: "Test Kerala Tour MODIFIED DRAFT V2",
      overview: "This is a modified draft overview.",
    };

    const pkgWithDraft = await saveDraft("PKG-TEST-01", editedInput, "editor@tripcanvas.internal");
    expect(pkgWithDraft.draftVersion?.title).toBe("Test Kerala Tour MODIFIED DRAFT V2");
    expect(pkgWithDraft.draftVersion?.versionNumber).toBe(2);

    // Verify published live version remains unchanged
    expect(pkgWithDraft.publishedVersion?.title).toBe("Test Kerala Tour Version 1");
    expect(pkgWithDraft.publishedVersion?.versionNumber).toBe(1);

    // Verify public query only sees published content
    const publicList = await getPublishedPackages();
    const publicItem = publicList.find((p) => p.id === "PKG-TEST-01");
    expect(publicItem?.publishedVersion?.title).toBe("Test Kerala Tour Version 1");
  });

  it("Test 6: Rollback creates a new version from selected historical snapshot without overwriting history", async () => {
    // Publish v2
    await publishPackage("PKG-TEST-01", "admin@tripcanvas.internal");

    // Restore v1 snapshot
    const restored = await restorePackageVersion("PKG-TEST-01", 1, "admin@tripcanvas.internal");

    // Must create v3 snapshot based on v1 content
    expect(restored.draftVersion).not.toBeNull();
    expect(restored.draftVersion?.versionNumber).toBe(3);
    expect(restored.draftVersion?.title).toBe("Test Kerala Tour Version 1");

    // Historical records are preserved
    expect(restored.versions?.some((v) => v.versionNumber === 1)).toBe(true);
  });
});

