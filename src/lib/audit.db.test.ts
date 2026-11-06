// @vitest-environment node
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { checkAuditChain, recordAudit } from "./audit";
import { createDb, type Db } from "./db";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("audit log (real database)", () => {
  let db: Db;
  let pg: Client;

  beforeAll(async () => {
    db = createDb(url!);
    pg = new Client({ connectionString: url });
    await pg.connect();
  });

  afterAll(async () => {
    await db.$disconnect();
    await pg.end();
  });

  it("appends entries with the database's own id, time and hash chain", async () => {
    const before = Date.now();
    const a = await recordAudit(db, { actorType: "SYSTEM", actorId: "test", action: "test.first" });
    const b = await recordAudit(db, {
      actorType: "STAFF",
      actorId: "staff_1",
      action: "test.changed",
      entityType: "draw",
      entityId: "d1",
      before: { price: 1000 },
      after: { price: 1500 },
    });
    expect(b.id > a.id).toBe(true);
    expect(b.prevHash).toBe(a.hash);
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.createdAt.getTime()).toBeGreaterThanOrEqual(before - 5_000);
    expect(await checkAuditChain(db)).toMatchObject({ intact: true });
  });

  it("refuses to update an entry", async () => {
    const e = await recordAudit(db, { actorType: "SYSTEM", action: "test.no_update" });
    await expect(pg.query("UPDATE audit_log SET action = 'test.edited' WHERE id = $1", [e.id])).rejects.toThrow(
      /append-only: UPDATE/,
    );
    await expect(db.auditLog.update({ where: { id: e.id }, data: { action: "test.edited" } })).rejects.toThrow();
  });

  it("refuses to delete or truncate", async () => {
    const e = await recordAudit(db, { actorType: "SYSTEM", action: "test.no_delete" });
    await expect(pg.query("DELETE FROM audit_log WHERE id = $1", [e.id])).rejects.toThrow(/append-only: DELETE/);
    await expect(pg.query("TRUNCATE audit_log")).rejects.toThrow(/append-only: TRUNCATE/);
  });

  it("ignores any id, time or hash the app tries to set", async () => {
    const forged = await db.auditLog.create({
      data: {
        id: 1n,
        createdAt: new Date("2000-01-01T00:00:00Z"),
        actorType: "SYSTEM",
        action: "test.forged",
        prevHash: "x",
        hash: "y",
      },
    });
    expect(forged.id).not.toBe(1n);
    expect(forged.createdAt.getFullYear()).toBeGreaterThan(2000);
    expect(forged.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(await checkAuditChain(db)).toMatchObject({ intact: true });
  });

  it("detects an entry changed behind the database's back", async () => {
    const e = await recordAudit(db, { actorType: "SYSTEM", action: "test.tamper" });
    await pg.query("BEGIN");
    try {
      // Only the table owner can do this; it simulates someone switching the protection off.
      await pg.query("ALTER TABLE audit_log DISABLE TRIGGER audit_log_no_update_or_delete");
      await pg.query("UPDATE audit_log SET actor_id = 'someone-else' WHERE id = $1", [e.id]);
      const { rows } = await pg.query("SELECT audit_log_first_broken_id() AS id");
      expect(String(rows[0].id)).toBe(String(e.id));
    } finally {
      await pg.query("ROLLBACK");
    }
    expect(await checkAuditChain(db)).toMatchObject({ intact: true });
  });

  it("keeps the chain intact when many entries are written at once", async () => {
    const written = await Promise.all(
      Array.from({ length: 40 }, (_, i) => recordAudit(db, { actorType: "SYSTEM", action: `test.parallel_${i}` })),
    );
    expect(new Set(written.map((w) => w.id)).size).toBe(40);
    expect(await checkAuditChain(db)).toMatchObject({ intact: true });
  });

  it("only accepts dotted action names", async () => {
    await expect(recordAudit(db, { actorType: "SYSTEM", action: "Bad Action" })).rejects.toThrow(/thing\.happened/);
  });
});
