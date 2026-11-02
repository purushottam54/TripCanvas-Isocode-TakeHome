import { describe, it, expect } from "vitest";
import { hasPermission, assertPermission } from "@/lib/auth/roles";
import { UserRole } from "@/types/auth";

describe("Role-Based Authorization & Access Control", () => {
  it("Test 1: Public/Traveller user cannot access administrative operations", () => {
    const publicRole: UserRole = "traveller";
    expect(hasPermission(publicRole, "canCreatePackage")).toBe(false);
    expect(hasPermission(publicRole, "canPublishPackage")).toBe(false);
    expect(hasPermission(publicRole, "canViewEnquiries")).toBe(false);
    expect(hasPermission(publicRole, "canManageUsers")).toBe(false);
    expect(hasPermission(publicRole, "canViewActivityLogs")).toBe(false);

    expect(() => assertPermission(publicRole, "canCreatePackage")).toThrow(/Forbidden/);
  });

  it("Test 3: Editor cannot manage user roles or delete packages", () => {
    const editorRole: UserRole = "editor";
    expect(hasPermission(editorRole, "canCreatePackage")).toBe(true);
    expect(hasPermission(editorRole, "canEditPackage")).toBe(true);
    expect(hasPermission(editorRole, "canManageUsers")).toBe(false);
    expect(hasPermission(editorRole, "canDeletePackage")).toBe(false);
    expect(hasPermission(editorRole, "canRestorePackage")).toBe(false);

    expect(() => assertPermission(editorRole, "canManageUsers")).toThrow(/Forbidden/);
  });

  it("Test 13 & 14: Consultants can manage CRM enquiries, while public users cannot read private enquiries", () => {
    const consultantRole: UserRole = "consultant";
    const publicRole: UserRole = "traveller";

    // Consultant permissions
    expect(hasPermission(consultantRole, "canViewEnquiries")).toBe(true);
    expect(hasPermission(consultantRole, "canEditAiExtraction")).toBe(true);
    expect(hasPermission(consultantRole, "canApproveReply")).toBe(true);
    // Consultant cannot publish packages or manage users
    expect(hasPermission(consultantRole, "canPublishPackage")).toBe(false);
    expect(hasPermission(consultantRole, "canManageUsers")).toBe(false);

    // Public users cannot read enquiries
    expect(hasPermission(publicRole, "canViewEnquiries")).toBe(false);
    expect(() => assertPermission(publicRole, "canViewEnquiries")).toThrow(/Forbidden/);
  });

  it("Admin role possesses complete management permissions", () => {
    const adminRole: UserRole = "admin";
    expect(hasPermission(adminRole, "canManageUsers")).toBe(true);
    expect(hasPermission(adminRole, "canPublishPackage")).toBe(true);
    expect(hasPermission(adminRole, "canRestorePackage")).toBe(true);
    expect(hasPermission(adminRole, "canViewEnquiries")).toBe(true);
    expect(hasPermission(adminRole, "canViewActivityLogs")).toBe(true);
  });
});
