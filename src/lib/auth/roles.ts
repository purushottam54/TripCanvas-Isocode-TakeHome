import { UserRole } from "@/types/auth";

export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canCreatePackage: true,
    canEditPackage: true,
    canPublishPackage: true,
    canDeletePackage: true,
    canRestorePackage: true,
    canViewEnquiries: true,
    canManageEnquiries: true,
    canAssignEnquiries: true,
    canEditAiExtraction: true,
    canApproveReply: true,
    canViewActivityLogs: true,
    canManageRedirects: true,
  },
  editor: {
    canManageUsers: false,
    canCreatePackage: true,
    canEditPackage: true,
    canPublishPackage: true,
    canDeletePackage: false,
    canRestorePackage: false,
    canViewEnquiries: false,
    canManageEnquiries: false,
    canAssignEnquiries: false,
    canEditAiExtraction: false,
    canApproveReply: false,
    canViewActivityLogs: true,
    canManageRedirects: true,
  },
  consultant: {
    canManageUsers: false,
    canCreatePackage: false,
    canEditPackage: false,
    canPublishPackage: false,
    canDeletePackage: false,
    canRestorePackage: false,
    canViewEnquiries: true,
    canManageEnquiries: true,
    canAssignEnquiries: true,
    canEditAiExtraction: true,
    canApproveReply: true,
    canViewActivityLogs: true,
    canManageRedirects: false,
  },
  traveller: {
    canManageUsers: false,
    canCreatePackage: false,
    canEditPackage: false,
    canPublishPackage: false,
    canDeletePackage: false,
    canRestorePackage: false,
    canViewEnquiries: false,
    canManageEnquiries: false,
    canAssignEnquiries: false,
    canEditAiExtraction: false,
    canApproveReply: false,
    canViewActivityLogs: false,
    canManageRedirects: false,
  },
} as const;

export function hasPermission(
  role: UserRole | undefined,
  permission: keyof typeof ROLE_PERMISSIONS.admin
): boolean {
  if (!role) return false;
  return !!ROLE_PERMISSIONS[role]?.[permission];
}

export function assertPermission(
  role: UserRole | undefined,
  permission: keyof typeof ROLE_PERMISSIONS.admin
): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: Role '${role || "anonymous"}' lacks '${permission}' permission.`);
  }
}
