import { cookies } from "next/headers";
import { UserProfile, UserRole } from "@/types/auth";
import { initialStaffProfiles } from "@/lib/db/seed-data";

const SESSION_COOKIE = "tripcanvas_session";

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE)?.value;

  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession);
    const valid = initialStaffProfiles.find((p) => p.email === parsed.email);
    if (valid) {
      return valid;
    }
    return parsed as UserProfile;
  } catch {
    return null;
  }
}

export async function setStaffSession(profile: UserProfile): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(profile), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearStaffSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireStaffRole(allowedRoles?: UserRole[]): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Staff authentication required.");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error(`FORBIDDEN: User role '${user.role}' is not authorized for this resource.`);
  }

  return user;
}
