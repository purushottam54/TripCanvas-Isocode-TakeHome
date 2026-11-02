"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PackageRecord, PackageVersion, ItineraryDay, SeasonalPrice } from "@/types/package";
import { UserRole } from "@/types/auth";
import {
  Save,
  Send,
  Eye,
  History,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  Sparkles,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PackageEditorFormProps {
  initialPackage?: PackageRecord | null;
  isNew?: boolean;
  userRole?: UserRole;
}

export function PackageEditorForm({
  initialPackage,
  isNew = false,
  userRole = "admin",
}: PackageEditorFormProps) {
  const router = useRouter();

  // If editing, use draftVersion if present, else fallback to publishedVersion
  const baseVersion = initialPackage?.draftVersion || initialPackage?.publishedVersion;

  const [formData, setFormData] = useState({
    id: initialPackage?.id || "",
    slug: initialPackage?.slug || "",
    title: baseVersion?.title || "",
    destination: baseVersion?.destination || "Kerala",
    durationDays: baseVersion?.durationDays || 6,
    hotelCategory: baseVersion?.hotelCategory || "4 star",
    overview: baseVersion?.overview || "",
    seoTitle: baseVersion?.seoTitle || "",
    seoDescription: baseVersion?.seoDescription || "",
    priceBasis: baseVersion?.priceBasis || "per person on twin sharing basis",
    gstDisclosure: baseVersion?.gstDisclosure || "5% GST applicable additionally",
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    baseVersion?.itinerary
      ? JSON.parse(JSON.stringify(baseVersion.itinerary))
      : [
          {
            day: 1,
            title: "Cochin Arrival & Scenic Transfer",
            description: "Private chauffeur pickup and scenic drive to hotel.",
            stay: "4-Star Hotel",
            meals: "Dinner",
          },
        ]
  );

  const [inclusions, setInclusions] = useState<string[]>(
    baseVersion?.inclusions ? [...baseVersion.inclusions] : ["Private chauffeur-driven AC sedan"]
  );

  const [exclusions, setExclusions] = useState<string[]>(
    baseVersion?.exclusions ? [...baseVersion.exclusions] : ["Airfare / train fare", "5% GST"]
  );

  const [photos, setPhotos] = useState<Array<{ url: string; caption?: string; isHero?: boolean }>>(
    baseVersion?.photos
      ? JSON.parse(JSON.stringify(baseVersion.photos))
      : [
          {
            url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
            caption: "Alleppey backwaters",
            isHero: true,
          },
        ]
  );

  const [prices, setPrices] = useState<SeasonalPrice[]>(
    baseVersion?.prices
      ? JSON.parse(JSON.stringify(baseVersion.prices))
      : [
          {
            seasonName: "Peak Season (Oct–Mar)",
            startMonth: 10,
            endMonth: 3,
            pricePerPerson: 32500,
            currency: "INR",
            childPriceNotes: "Child pricing requires confirmation.",
            description: "Optimal weather across Kerala.",
          },
        ]
  );

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Auto-generate slug from title for new packages
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isNew && !prev.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : prev.slug,
    }));
  };

  // Itinerary helpers
  const addDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        day: nextDay,
        title: `Day ${nextDay} Itinerary`,
        description: "Day description...",
        stay: `${formData.hotelCategory} Resort`,
        meals: "Breakfast",
      },
    ]);
  };

  const removeDay = (idx: number) => {
    const updated = itinerary
      .filter((_, i) => i !== idx)
      .map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(updated);
  };

  // Pricing helpers
  const addPrice = () => {
    setPrices([
      ...prices,
      {
        seasonName: "Standard Season",
        startMonth: 1,
        endMonth: 12,
        pricePerPerson: 25000,
        currency: "INR",
        childPriceNotes: "Child pricing requires confirmation.",
        description: "",
      },
    ]);
  };

  const removePrice = (idx: number) => {
    setPrices(prices.filter((_, i) => i !== idx));
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...formData,
        durationDays: Number(formData.durationDays),
        itinerary,
        inclusions,
        exclusions,
        photos,
        prices,
      };

      const url = isNew ? "/api/packages" : `/api/packages/${initialPackage?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save draft");

      setSuccessMessage(
        isNew
          ? "Package created successfully with v1 draft."
          : `Draft updated successfully (Version v${data.package.draftVersion?.versionNumber || 1}).`
      );

      if (isNew) {
        router.push(`/admin/packages/${data.package.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Publish Version
  const handlePublish = async () => {
    if (!initialPackage?.id) return;
    if (!confirm("Are you sure you want to publish this package? The current draft will become the live immutable public version.")) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // First save draft to make sure latest changes are written
      const payload = {
        ...formData,
        durationDays: Number(formData.durationDays),
        itinerary,
        inclusions,
        exclusions,
        photos,
        prices,
      };

      await fetch(`/api/packages/${initialPackage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Now publish
      const res = await fetch(`/api/packages/${initialPackage.id}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish package");

      setSuccessMessage(data.message || "Package published successfully!");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Restore Rollback
  const handleRestoreVersion = async (versionNum: number) => {
    if (!initialPackage?.id) return;
    if (!confirm(`Restore package snapshot from v${versionNum}? A new version will be created without modifying history.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/packages/${initialPackage.id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionNumber: versionNum }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rollback");

      setSuccessMessage(data.message);
      setShowHistoryModal(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const allVersions: PackageVersion[] = [
    ...(initialPackage?.publishedVersion ? [initialPackage.publishedVersion] : []),
    ...(initialPackage?.draftVersion ? [initialPackage.draftVersion] : []),
    ...(initialPackage?.versions || []),
  ].filter((v, idx, arr) => arr.findIndex((x) => x.versionNumber === v.versionNumber) === idx);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2D8]">
        <div>
          <Link
            href="/admin/packages"
            className="text-xs text-[#252A27]/60 hover:text-[#173F35] flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Packages List
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">
              {isNew ? "Create New Package" : `Edit: ${formData.title || formData.id}`}
            </h1>
            {!isNew && (
              <span className="font-mono text-xs px-2.5 py-1 bg-[#F7F5EF] border border-[#D9E2D8] rounded-md font-semibold text-[#173F35]">
                {formData.id}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isNew && (
            <>
              {/* Preview Button */}
              <Link
                href={`/admin/packages/${initialPackage?.id}/preview`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl border border-[#D9E2D8] bg-white text-xs font-semibold text-[#173F35] hover:bg-[#F7F5EF] flex items-center gap-1.5 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-[#C58B63]" />
                <span>Preview Draft</span>
              </Link>

              {/* Version History Button */}
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="px-3.5 py-2 rounded-xl border border-[#D9E2D8] bg-white text-xs font-semibold text-[#173F35] hover:bg-[#F7F5EF] flex items-center gap-1.5 shadow-sm"
              >
                <History className="w-3.5 h-3.5 text-[#C58B63]" />
                <span>History ({allVersions.length})</span>
              </button>
            </>
          )}

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#252A27] text-[#F7F5EF] text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          {/* Publish Button */}
          {!isNew && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#173F35] text-[#F7F5EF] text-xs font-semibold hover:bg-[#14352d] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5 text-[#C58B63]" />
              <span>Publish Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-[#173F35] border-b border-[#D9E2D8]/60 pb-3">
          1. Basic Information & Slug
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              Package ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!isNew}
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="e.g. PKG-KL-09"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E2D8] font-mono text-xs focus:ring-1 focus:ring-[#173F35]"
            />
            <p className="text-[10px] text-[#252A27]/50 mt-1">
              Stable system identifier (e.g. PKG-KL-07)
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-[#F7F5EF] border border-r-0 border-[#D9E2D8] rounded-l-xl text-[#252A27]/60 font-mono text-xs">
                /packages/
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="munnar-retreat"
                className="w-full px-3.5 py-2 rounded-r-xl border border-[#D9E2D8] font-mono text-xs focus:ring-1 focus:ring-[#173F35]"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              Package Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Munnar, Thekkady and Alleppey Houseboat"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E2D8] text-sm font-serif font-bold text-[#173F35] focus:ring-1 focus:ring-[#173F35]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: Destination, Duration, Hotel Category, Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-[#173F35] border-b border-[#D9E2D8]/60 pb-3">
          2. Destination, Classification & Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              Destination Region <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g. Kerala (Munnar, Thekkady, Alleppey)"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E2D8] focus:ring-1 focus:ring-[#173F35]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              Total Duration (Days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              required
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E2D8] focus:ring-1 focus:ring-[#173F35]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              Hotel Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.hotelCategory}
              onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E2D8] bg-white text-[#252A27] focus:ring-1 focus:ring-[#173F35]"
            >
              <option value="3 star">3 Star Comfort</option>
              <option value="4 star">4 Star Luxury</option>
              <option value="5 star">5 Star Premium Heritage</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block font-semibold text-[#173F35] uppercase tracking-wider mb-1">
              Editorial Overview <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              placeholder="Provide a lyrical, evocative editorial summary of this travel route..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E2D8] text-xs leading-relaxed focus:ring-1 focus:ring-[#173F35]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Day-Wise Itinerary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#D9E2D8]/60 pb-3">
          <h2 className="font-serif text-lg font-bold text-[#173F35]">
            3. Day-Wise Itinerary ({itinerary.length} Days)
          </h2>
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#173F35] text-white text-xs font-semibold hover:bg-[#14352d]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day</span>
          </button>
        </div>

        <div className="space-y-4">
          {itinerary.map((day, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8]/80 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#173F35]">
                  Day {day.day}
                </span>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(idx)}
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                    title="Remove Day"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={day.title}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[idx].title = e.target.value;
                  setItinerary(updated);
                }}
                placeholder="Day Title (e.g. Munnar Tea Estates)"
                className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white font-medium"
              />

              <textarea
                rows={2}
                value={day.description}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[idx].description = e.target.value;
                  setItinerary(updated);
                }}
                placeholder="Detailed sightseeing, activities, and movement..."
                className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white leading-relaxed"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={day.stay || ""}
                  onChange={(e) => {
                    const updated = [...itinerary];
                    updated[idx].stay = e.target.value;
                    setItinerary(updated);
                  }}
                  placeholder="Overnight Stay (e.g. 4-Star Hill Resort, Munnar)"
                  className="px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white"
                />
                <input
                  type="text"
                  value={day.meals || ""}
                  onChange={(e) => {
                    const updated = [...itinerary];
                    updated[idx].meals = e.target.value;
                    setItinerary(updated);
                  }}
                  placeholder="Included Meals (e.g. Breakfast, Dinner)"
                  className="px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Seasonal Pricing Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#D9E2D8]/60 pb-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#173F35]">
              4. Seasonal Pricing Records
            </h2>
            <p className="text-[11px] text-[#252A27]/60">
              Preserved per version. Prices shown to travellers match these records deterministically.
            </p>
          </div>
          <button
            type="button"
            onClick={addPrice}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#173F35] text-white text-xs font-semibold hover:bg-[#14352d]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Season Rate</span>
          </button>
        </div>

        <div className="space-y-4">
          {prices.map((price, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#D9E2D8]/80 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#173F35]">
                  Season Tier {idx + 1}
                </span>
                {prices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrice(idx)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-[#173F35] mb-1">
                    Season Name
                  </label>
                  <input
                    type="text"
                    value={price.seasonName}
                    onChange={(e) => {
                      const updated = [...prices];
                      updated[idx].seasonName = e.target.value;
                      setPrices(updated);
                    }}
                    placeholder="e.g. Peak Season (Oct–Mar)"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#173F35] mb-1">
                    Price Per Person (INR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price.pricePerPerson}
                    onChange={(e) => {
                      const updated = [...prices];
                      updated[idx].pricePerPerson = Number(e.target.value);
                      setPrices(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white font-bold text-[#173F35]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#173F35] mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={price.currency}
                    onChange={(e) => {
                      const updated = [...prices];
                      updated[idx].currency = e.target.value;
                      setPrices(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#173F35] mb-1">
                    Child Pricing Policy Note
                  </label>
                  <input
                    type="text"
                    value={price.childPriceNotes}
                    onChange={(e) => {
                      const updated = [...prices];
                      updated[idx].childPriceNotes = e.target.value;
                      setPrices(updated);
                    }}
                    placeholder="Child pricing requires confirmation."
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#173F35] mb-1">
                    Season Description
                  </label>
                  <input
                    type="text"
                    value={price.description || ""}
                    onChange={(e) => {
                      const updated = [...prices];
                      updated[idx].description = e.target.value;
                      setPrices(updated);
                    }}
                    placeholder="e.g. Lush monsoon waterfalls and quiet backwaters"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D9E2D8] bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Inclusions, Exclusions, Photos, Disclosures */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E2D8] shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-[#173F35] border-b border-[#D9E2D8]/60 pb-3">
          5. Inclusions, Disclosures & Photos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-semibold text-[#173F35] mb-1">
              Inclusions (1 per line)
            </label>
            <textarea
              rows={4}
              value={inclusions.join("\n")}
              onChange={(e) => setInclusions(e.target.value.split("\n").filter((x) => x.trim()))}
              className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173F35] mb-1">
              Exclusions (1 per line)
            </label>
            <textarea
              rows={4}
              value={exclusions.join("\n")}
              onChange={(e) => setExclusions(e.target.value.split("\n").filter((x) => x.trim()))}
              className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173F35] mb-1">
              Price Basis Disclosure
            </label>
            <input
              type="text"
              value={formData.priceBasis}
              onChange={(e) => setFormData({ ...formData, priceBasis: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173F35] mb-1">
              GST Disclosure
            </label>
            <input
              type="text"
              value={formData.gstDisclosure}
              onChange={(e) => setFormData({ ...formData, gstDisclosure: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8]"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-3 pt-2 text-xs">
          <label className="block font-semibold text-[#173F35]">
            Photography URLs (Unsplash or verified CDN)
          </label>
          {photos.map((p, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="url"
                value={p.url}
                onChange={(e) => {
                  const updated = [...photos];
                  updated[idx].url = e.target.value;
                  setPhotos(updated);
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#D9E2D8]"
              />
              <input
                type="text"
                placeholder="Caption"
                value={p.caption || ""}
                onChange={(e) => {
                  const updated = [...photos];
                  updated[idx].caption = e.target.value;
                  setPhotos(updated);
                }}
                className="w-48 px-3 py-1.5 rounded-xl border border-[#D9E2D8]"
              />
              <button
                type="button"
                onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                className="text-red-500 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setPhotos([
                ...photos,
                {
                  url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
                  caption: "Munnar Hills",
                },
              ])
            }
            className="text-xs text-[#173F35] font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Another Photo
          </button>
        </div>
      </div>

      {/* VERSION HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9E2D8] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#173F35]">
                  Version History & Rollback
                </h3>
                <p className="text-xs text-[#252A27]/60">
                  Select a historical snapshot to roll back. Rollback creates a new version without mutating historical records.
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {allVersions.map((v) => (
                <div
                  key={v.versionNumber}
                  className="p-4 rounded-2xl border border-[#D9E2D8] bg-[#F7F5EF] flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#173F35]">
                        Version v{v.versionNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          v.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <p className="font-serif text-[#173F35] font-semibold">
                      {v.title}
                    </p>
                    <p className="text-[11px] text-[#252A27]/60">
                      {v.durationDays} Days · {v.destination} · {v.prices?.length || 0} price tiers
                    </p>
                    <p className="text-[10px] text-[#252A27]/50 font-mono">
                      Recorded: {formatDate(v.createdAt)}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(v.versionNumber)}
                      className="px-3.5 py-2 rounded-xl bg-[#173F35] text-[#F7F5EF] text-xs font-semibold hover:bg-[#14352d] flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#C58B63]" />
                      <span>Rollback to v{v.versionNumber}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
