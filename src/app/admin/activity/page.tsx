import { getActivityLogs } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { formatDateTime } from "@/lib/utils";
import { History, Shield, CheckCircle2, RotateCcw, Plus, Edit2, Mail, Send } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewActivityLogs")) {
    redirect("/admin/packages");
  }

  const logs = await getActivityLogs(100);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "package.created":
        return <Plus className="w-3.5 h-3.5 text-blue-600" />;
      case "package.published":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "package.restored":
        return <RotateCcw className="w-3.5 h-3.5 text-purple-600" />;
      case "package.edited":
        return <Edit2 className="w-3.5 h-3.5 text-amber-600" />;
      case "enquiry.created":
        return <Mail className="w-3.5 h-3.5 text-[#C58B63]" />;
      case "reply.approved":
        return <Send className="w-3.5 h-3.5 text-emerald-700" />;
      default:
        return <History className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#D9E2D8]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B63]">
            Audit & Compliance
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#173F35] tracking-tight">
            Activity & Version History
          </h1>
          <p className="text-xs text-[#252A27]/70 mt-1">
            Immutable log of package publishing, rollbacks, and enquiry CRM status transitions.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 text-xs font-semibold text-[#173F35]">
          <Shield className="w-3.5 h-3.5 text-[#C58B63]" />
          <span>Staff Access Only</span>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-[#D9E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#173F35] text-[#F7F5EF] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity & Target</th>
                <th className="py-3 px-4">Metadata Payload</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2D8]/60 text-[#252A27]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                  {/* Action */}
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 font-bold text-[#173F35]">
                      {getActionIcon(log.action)}
                      <span>{log.action}</span>
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4 font-medium text-[#252A27]/80">
                    {log.actorEmail}
                  </td>

                  {/* Entity */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold text-[#C58B63]">
                      {log.entityId}
                    </span>
                    <span className="text-[10px] text-[#252A27]/60 block uppercase">
                      {log.entityType}
                    </span>
                  </td>

                  {/* Metadata */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] text-[#252A27]/70 bg-[#F7F5EF] p-1.5 rounded-lg max-w-sm truncate">
                      {JSON.stringify(log.metadata)}
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#252A27]/60">
                    {formatDateTime(log.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

