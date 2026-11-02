import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminRootPage() {
  const user = await getCurrentUser();
  if (user?.role === "consultant") {
    redirect("/admin/enquiries");
  }
  redirect("/admin/packages");
}
