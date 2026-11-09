import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { PackageEditorForm } from "@/components/admin/PackageEditorForm";
import { redirect } from "next/navigation";

export default async function NewPackagePage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canCreatePackage")) {
    redirect("/admin/packages");
  }

  return (
    <div className="p-6 sm:p-10">
      <PackageEditorForm isNew userRole={user.role} />
    </div>
  );
}

