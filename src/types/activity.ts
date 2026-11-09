export type ActivityAction =
  | "package.created"
  | "package.edited"
  | "package.published"
  | "package.restored"
  | "package.duplicated"
  | "package.archived"
  | "enquiry.created"
  | "enquiry.assigned"
  | "enquiry.status_changed"
  | "enquiry.note_added"
  | "ai.extracted"
  | "reply.drafted"
  | "reply.approved";

export interface ActivityLogRecord {
  id: string;
  actorId?: string | null;
  actorEmail: string;
  action: ActivityAction;
  entityType: "package" | "enquiry" | "user" | "version";
  entityId: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface LegacyRedirectRecord {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  createdAt: string;
}

