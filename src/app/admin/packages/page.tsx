import Link from "next/link";
import { getAllPackagesForAdmin } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Plus,
  Compass,
  Search,
  ExternalLink,
  Edit3,
  Copy,
  Clock,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { PackageListTable } from "@/components/admin/PackageListTable";

export const dynamic = "force-dynamic";

interface AdminPackagesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AdminPackagesPage({ searchParams }: AdminPackagesPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const searchTerm = (params.search || "").toLowerCase().trim();
  const statusFilter = params.status || "all";

  const allPackages = await getAllPackagesForAdmin();

  // Filter
  const filtered = allPackages.filter((pkg) => {
    const v = pkg.publishedVersion || pkg.draftVersion;
    if (!v) return false;

    if (searchTerm) {
      const match = `${pkg.id} ${pkg.slug} ${v.title} ${v.destination}`.toLowerCase();
      if (!match.includes(searchTerm)) return false;
    }

    if (statusFilter === "published" && !pkg.publishedVersionId) return false;
    if (statusFilter === "draft" && !pkg.draftVersionId) return false;

    return true;
  });

  const canCreate = hasPermission(user?.role, "canCreatePackage");

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2D8]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B63]">
            Content Management System
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#173F35] tracking-tight">
            Holiday Packages
          </h1>
          <p className="text-xs text-[#252A27]/70 mt-1">
            Manage packages, immutable version histories, and seasonal pricing matrices.
          </p>
        </div>

        {canCreate && (
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173F35] text-[#F7F5EF] text-xs font-semibold hover:bg-[#14352d] transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Package</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9E2D8] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <form method="GET" className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#C58B63] absolute left-3 top-2.5" />
            <input
              type="text"
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search by ID, title, or destination..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            />
          </div>

          <select
            name="status"
            defaultValue={statusFilter}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#D9E2D8] bg-white text-[#252A27] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Live</option>
            <option value="draft">Draft Versions</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 bg-[#173F35] text-white text-xs font-medium rounded-xl hover:bg-[#14352d]"
          >
            Filter
          </button>
        </form>

        <div className="text-xs text-[#252A27]/60">
          Total Packages: <strong>{filtered.length}</strong>
        </div>
      </div>

      {/* Package List Table with Interactive Actions */}
      <PackageListTable packages={filtered} userRole={user?.role} />
    </div>
  );
}
