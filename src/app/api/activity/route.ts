import { NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canViewActivityLogs")) {
    return NextResponse.json({ error: "Unauthorized access to audit logs." }, { status: 403 });
  }

  const logs = await getActivityLogs();
  return NextResponse.json({ logs });
}

