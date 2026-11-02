"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LegacyRedirectRecord } from "@/types/activity";
import { CornerDownRight, Upload, Plus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface RedirectManagerProps {
  initialRedirects: LegacyRedirectRecord[];
}

export function RedirectManager({ initialRedirects }: RedirectManagerProps) {
  const router = useRouter();
  const [sourcePath, setSourcePath] = useState("");
  const [targetPath, setTargetPath] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePath || !targetPath) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePath, targetPath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add redirect");

      setMessage(`Redirect for '${sourcePath}' added successfully.`);
      setSourcePath("");
      setTargetPath("");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: csvContent,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import CSV");

      setMessage(data.message);
      setCsvContent("");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Creation and CSV Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Single Redirect */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9E2D8] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#173F35] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#C58B63]" />
            Add Individual Redirect
          </h3>
          <form onSubmit={handleAddSingle} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#173F35] mb-1">
                Old / Legacy Source URL Path
              </label>
              <input
                type="text"
                required
                value={sourcePath}
                onChange={(e) => setSourcePath(e.target.value)}
                placeholder="/tours/kerala-old.html"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#173F35] mb-1">
                New Target URL Path
              </label>
              <input
                type="text"
                required
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                placeholder="/packages/munnar-thekkady-alleppey-houseboat"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#173F35] text-white font-semibold rounded-xl hover:bg-[#14352d] disabled:opacity-50"
            >
              Add 301 Redirect
            </button>
          </form>
        </div>

        {/* Bulk CSV Import */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9E2D8] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#173F35] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#C58B63]" />
            Bulk CSV Import
          </h3>
          <form onSubmit={handleCsvImport} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#173F35] mb-1">
                Paste CSV Lines (Format: source_path, target_path)
              </label>
              <textarea
                rows={4}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="/tours/old-route-1.html, /packages/munnar-thekkady-alleppey-houseboat&#10;/tours/old-route-2.html, /packages/wayanad-rainforest-and-wildlife"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E2D8] font-mono text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !csvContent.trim()}
              className="px-4 py-2 bg-[#252A27] text-white font-semibold rounded-xl hover:bg-black disabled:opacity-50"
            >
              Import CSV Redirects
            </button>
          </form>
        </div>
      </div>

      {/* Redirects Table */}
      <div className="bg-white rounded-2xl border border-[#D9E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#173F35] text-[#F7F5EF] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Legacy Source URL</th>
                <th className="py-3 px-4">New Canonical Target</th>
                <th className="py-3 px-4">Status Code</th>
                <th className="py-3 px-4 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2D8]/60 text-[#252A27]">
              {initialRedirects.map((red) => (
                <tr key={red.id} className="hover:bg-[#F7F5EF]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-red-700">
                    {red.sourcePath}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-emerald-800">
                    {red.targetPath}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#173F35]">
                    {red.statusCode} (Permanent)
                  </td>
                  <td className="py-3 px-4 text-right text-[#252A27]/60">
                    {formatDateTime(red.createdAt)}
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
