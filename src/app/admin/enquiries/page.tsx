import Link from "next/link";
import { getAllEnquiries } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  Inbox,
  Search,
  Filter,
  Clock,
  ArrowRight,
  User,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface EnquiriesPageProps {
  searchParams: Promise<{
    status?: string;
    destination?: string;
    search?: string;
  }>;
}

export default async function AdminEnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const destinationFilter = params.destination || "all";
  const searchTerm = (params.search || "").toLowerCase().trim();

  let enquiries = await getAllEnquiries({
    status: statusFilter !== "all" ? statusFilter : undefined,
    destination: destinationFilter !== "all" ? destinationFilter : undefined,
  });

  if (searchTerm) {
    enquiries = enquiries.filter(
      (e) =>
        e.enquiryNumber.toLowerCase().includes(searchTerm) ||
        e.fullName.toLowerCase().includes(searchTerm) ||
        e.email.toLowerCase().includes(searchTerm) ||
        e.destination.toLowerCase().includes(searchTerm)
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "assigned":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "replied":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2D8]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B63]">
            Tour Desk CRM
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#173F35] tracking-tight">
            Enquiry Inbox
          </h1>
          <p className="text-xs text-[#252A27]/70 mt-1">
            Incoming traveller enquiries, AI requirement extraction, and quote workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#252A27]/60">
            Active Assigned Consultant: <strong>{user?.fullName}</strong>
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9E2D8] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form method="GET" className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#C58B63] absolute left-3 top-2.5" />
            <input
              type="text"
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search by customer, ref, or email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D9E2D8] focus:outline-none focus:ring-1 focus:ring-[#173F35]"
            />
          </div>

          <select
            name="status"
            defaultValue={statusFilter}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#D9E2D8] bg-white text-[#252A27]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>

          <select
            name="destination"
            defaultValue={destinationFilter}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#D9E2D8] bg-white text-[#252A27]"
          >
            <option value="all">All Regions</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu & South India</option>
          </select>

          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#173F35] text-white text-xs font-semibold rounded-xl hover:bg-[#14352d]"
          >
            Filter
          </button>
        </form>

        <div className="text-xs text-[#252A27]/60">
          Enquiries: <strong>{enquiries.length}</strong>
        </div>
      </div>

      {/* Enquiries CRM Table */}
      {enquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#D9E2D8] space-y-3">
          <Inbox className="w-10 h-10 text-[#C58B63] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#173F35]">
            No Enquiries Found
          </h3>
          <p className="text-xs text-[#252A27]/60">
            Submit an enquiry from the public website to test intake.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D9E2D8] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#173F35] text-[#F7F5EF] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ref & Customer</th>
                  <th className="py-3 px-4">Destination & Dates</th>
                  <th className="py-3 px-4">Travellers & Budget</th>
                  <th className="py-3 px-4">Assigned Consultant</th>
                  <th className="py-3 px-4">Status & SLA</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2D8]/60 text-[#252A27]">
                {enquiries.map((enq) => {
                  return (
                    <tr key={enq.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                      {/* Ref & Customer */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-[10px] text-[#C58B63] font-bold">
                          {enq.enquiryNumber}
                        </div>
                        <div className="font-bold text-sm text-[#173F35] mt-0.5">
                          {enq.fullName}
                        </div>
                        <div className="text-[11px] text-[#252A27]/60">
                          {enq.email} · {enq.phone}
                        </div>
                      </td>

                      {/* Destination & Dates */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#173F35]">
                          {enq.destination}
                        </div>
                        <div className="text-[11px] text-[#252A27]/70">
                          Start: {formatDate(enq.travelStartDate)} ({enq.travelDuration || "Flexible"})
                        </div>
                      </td>

                      {/* Travellers & Budget */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#173F35]">
                          {enq.adultsCount} Adult{enq.adultsCount > 1 ? "s" : ""}
                          {enq.childrenCount > 0 && `, ${enq.childrenCount} Child`}
                        </div>
                        <div className="text-[11px] text-[#252A27]/70 font-semibold">
                          Budget: {formatCurrency(enq.budget, enq.currency)}
                        </div>
                      </td>

                      {/* Assigned Consultant */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#173F35] font-medium">
                          <User className="w-3.5 h-3.5 text-[#C58B63]" />
                          <span>{enq.assignedConsultantName || "Unassigned"}</span>
                        </div>
                        <div className="text-[10px] text-[#252A27]/50 mt-0.5">
                          Channel: {enq.channel}
                        </div>
                      </td>

                      {/* Status & SLA */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border w-fit ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            {enq.status.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-[#252A27]/60 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C58B63]" />
                            {formatDateTime(enq.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Action Link */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#173F35] text-white rounded-lg hover:bg-[#14352d] font-semibold text-xs shadow-sm"
                        >
                          <span>Review & AI</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

