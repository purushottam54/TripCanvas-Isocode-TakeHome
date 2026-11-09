"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageRecord } from "@/types/package";
import { UserRole } from "@/types/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Edit3,
  Copy,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  Loader2,
  FileText,
} from "lucide-react";

interface PackageListTableProps {
  packages: PackageRecord[];
  userRole?: UserRole;
}

export function PackageListTable({ packages, userRole }: PackageListTableProps) {
  const router = useRouter();
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const handleDuplicate = async (pkgId: string) => {
    if (!confirm(`Duplicate package ${pkgId} into a new draft?`)) return;
    setLoadingActionId(pkgId);
    try {
      const res = await fetch(`/api/packages/${pkgId}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to duplicate");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingActionId(null);
    }
  };

  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-[#D9E2D8] space-y-3">
        <FileText className="w-8 h-8 text-[#C58B63] mx-auto" />
        <h4 className="font-serif text-lg font-bold text-[#173F35]">
          No Packages Found
        </h4>
        <p className="text-xs text-[#252A27]/60">
          Try adjusting your search criteria or create a new package.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D9E2D8] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#173F35] text-[#F7F5EF] font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4">Destination & Days</th>
              <th className="py-3 px-4">Versions</th>
              <th className="py-3 px-4">Seasonal Pricing</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9E2D8]/60 text-[#252A27]">
            {packages.map((pkg) => {
              const active = pkg.publishedVersion || pkg.draftVersion;
              if (!active) return null;

              const isPublished = !!pkg.publishedVersionId;
              const hasDraft = !!pkg.draftVersionId;
              const prices = active.prices || [];

              return (
                <tr key={pkg.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                  {/* Title & ID */}
                  <td className="py-4 px-4">
                    <div className="font-mono text-[10px] text-[#C58B63] font-semibold">
                      {pkg.id}
                    </div>
                    <div className="font-bold text-sm text-[#173F35] mt-0.5">
                      {active.title}
                    </div>
                    <div className="text-[11px] text-[#252A27]/60">
                      slug: /{pkg.slug}
                    </div>
                  </td>

                  {/* Destination & Duration */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-[#173F35]">
                      {active.destination}
                    </div>
                    <div className="text-[11px] text-[#252A27]/70">
                      {active.durationDays} Days / {Math.max(1, active.durationDays - 1)} Nights · {active.hotelCategory}
                    </div>
                  </td>

                  {/* Versions */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      {pkg.publishedVersion && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded w-fit">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Live v{pkg.publishedVersion.versionNumber}
                        </span>
                      )}
                      {pkg.draftVersion && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded w-fit">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Draft v{pkg.draftVersion.versionNumber}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Seasonal Pricing */}
                  <td className="py-4 px-4">
                    {prices.length > 0 ? (
                      <div className="space-y-1">
                        {prices.map((p, idx) => (
                          <div key={idx} className="text-[11px] flex items-center gap-1.5">
                            <span className="font-medium text-[#173F35]">
                              {formatCurrency(p.pricePerPerson, p.currency)}
                            </span>
                            <span className="text-[10px] text-[#252A27]/60 truncate max-w-[140px]">
                              ({p.seasonName.split("(")[0].trim()})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#252A27]/50 italic">
                        No prices configured
                      </span>
                    )}
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4 px-4">
                    {isPublished ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Draft Only
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Live View */}
                      {isPublished && (
                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          title="View on public website"
                          className="p-1.5 text-[#252A27]/70 hover:text-[#173F35] hover:bg-[#ede8db]/50 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {/* Edit CMS */}
                      <Link
                        href={`/admin/packages/${pkg.id}/edit`}
                        title="Open CMS Editor"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#173F35] text-white rounded-lg hover:bg-[#14352d] font-semibold text-[11px] transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(pkg.id)}
                        disabled={loadingActionId === pkg.id}
                        title="Duplicate into draft"
                        className="p-1.5 text-[#252A27]/70 hover:text-[#C58B63] hover:bg-[#ede8db]/50 rounded-lg transition-colors"
                      >
                        {loadingActionId === pkg.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

