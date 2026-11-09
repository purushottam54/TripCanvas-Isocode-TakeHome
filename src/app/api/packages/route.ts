import { NextRequest, NextResponse } from "next/server";
import { getPublishedPackages, getAllPackagesForAdmin, createPackage } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";
import { packageEditorSchema } from "@/lib/validation/package";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");

  if (scope === "admin") {
    const user = await getCurrentUser();
    if (!user || (!hasPermission(user.role, "canCreatePackage") && !hasPermission(user.role, "canViewEnquiries"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const all = await getAllPackagesForAdmin();
    return NextResponse.json({ packages: all });
  }

  const published = await getPublishedPackages();
  return NextResponse.json({ packages: published });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canCreatePackage")) {
    return NextResponse.json(
      { error: "Forbidden: You lack permission to create packages." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const validated = packageEditorSchema.parse(body);

    const created = await createPackage(validated, user.email);
    return NextResponse.json({ success: true, package: created }, { status: 201 });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

