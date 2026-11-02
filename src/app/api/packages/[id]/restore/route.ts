import { NextRequest, NextResponse } from "next/server";
import { restorePackageVersion } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/roles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "canRestorePackage")) {
    return NextResponse.json(
      { error: "Forbidden: Only Administrators may roll back versions." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const { versionNumber } = await req.json();

  if (!versionNumber) {
    return NextResponse.json({ error: "versionNumber is required" }, { status: 400 });
  }

  try {
    const pkg = await restorePackageVersion(id, Number(versionNumber), user.email);
    return NextResponse.json({
      success: true,
      package: pkg,
      message: `Restored snapshot from v${versionNumber} into new draft v${pkg.draftVersion?.versionNumber}. Historical versions preserved intact.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
