import type { Db } from "@/lib/db";
import type { AuditActorType, Prisma } from "@/generated/prisma/client";

/** A database client or an open transaction: audit entries are written in the same transaction as the change. */
type Writer = Pick<Db, "auditLog">;

export type AuditEntry = {
  actorType: AuditActorType;
  actorId?: string | null;
  /** Dotted name of what happened, e.g. "staff.login", "draw.published". */
  action: string;
  entityType?: string;
  entityId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  meta?: Prisma.InputJsonValue;
};

const ACTION = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

/**
 * Appends one entry to the audit log (AGENTS.md rule 17). The database sets the id, time and hashes;
 * the row can never be changed afterwards.
 */
export async function recordAudit(db: Writer, entry: AuditEntry) {
  if (!ACTION.test(entry.action)) {
    throw new Error(`Audit action must look like "thing.happened", got "${entry.action}"`);
  }
  return db.auditLog.create({
    data: {
      actorType: entry.actorType,
      actorId: entry.actorId ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      before: entry.before,
      after: entry.after,
      meta: entry.meta,
    },
  });
}

export type ChainCheck = { intact: true; entries: number } | { intact: false; entries: number; firstBrokenId: bigint };

/** Recomputes every row's hash and link. Any edit made behind the database's back shows up here. */
export async function checkAuditChain(db: Pick<Db, "$queryRaw" | "auditLog">): Promise<ChainCheck> {
  const [row] = await db.$queryRaw<{ id: bigint | null }[]>`SELECT audit_log_first_broken_id() AS id`;
  const entries = await db.auditLog.count();
  return row?.id == null ? { intact: true, entries } : { intact: false, entries, firstBrokenId: row.id };
}
