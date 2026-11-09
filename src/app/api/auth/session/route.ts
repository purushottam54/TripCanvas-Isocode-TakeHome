import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, setStaffSession, clearStaffSession } from "@/lib/auth/session";
import { initialStaffProfiles } from "@/lib/db/seed-data";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user, isAuthenticated: !!user });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const profile = initialStaffProfiles.find((p) => p.email.toLowerCase() === email?.toLowerCase());

    if (!profile) {
      return NextResponse.json(
        { error: "Invalid credentials. Use a valid staff demo account." },
        { status: 401 }
      );
    }

    await setStaffSession(profile);
    return NextResponse.json({ success: true, user: profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearStaffSession();
  return NextResponse.json({ success: true });
}

