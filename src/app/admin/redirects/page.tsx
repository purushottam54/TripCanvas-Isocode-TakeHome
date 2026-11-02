import { getLegacyRedirects } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { formatDateTime } from "@/lib/utils";
import { CornerDownRight, Upload, Plus, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { RedirectManager } from "@/components/admin/RedirectManager";

export const dynamic = "force-dynamic";

export default async function AdminRedirectsPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canManageRedirects")) {
    redirect("/admin/packages");
  }

  const redirects = await getLegacyRedirects();

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#D9E2D8]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C58B63]">
            SEO Architecture
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#173F35] tracking-tight">
            Legacy URL Redirects
          </h1>
          <p className="text-xs text-[#252A27]/70 mt-1">
            Map legacy URL routes with HTTP 301 redirects to preserve SEO equity. Includes CSV bulk import.
          </p>
        </div>
      </div>

      <RedirectManager initialRedirects={redirects} />
    </div>
  );
}
