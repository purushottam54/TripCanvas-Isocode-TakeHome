import { notFound, redirect } from "next/navigation";
import { getPackageById } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { PackageEditorForm } from "@/components/admin/PackageEditorForm";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canEditPackage")) {
    redirect("/admin/packages");
  }

  const { id } = await params;
  const pkg = await getPackageById(id);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10">
      <PackageEditorForm initialPackage={pkg} userRole={user.role} />
    </div>
  );
}
