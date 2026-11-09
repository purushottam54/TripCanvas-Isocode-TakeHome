export type UserRole = "admin" | "editor" | "consultant" | "traveller";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

