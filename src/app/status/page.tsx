import type { Metadata } from "next";
import { checkAuditChain } from "@/lib/audit";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "System status" };
export const dynamic = "force-dynamic";

type Status =
  | { state: "no-database" }
  | { state: "error" }
  | { state: "ok"; entries: number; intact: boolean; latest: { action: string; at: Date } | null };

async function getStatus(): Promise<Status> {
  const db = getDb();
  if (!db) return { state: "no-database" };
  try {
    const chain = await checkAuditChain(db);
    const last = await db.auditLog.findFirst({ orderBy: { id: "desc" }, select: { action: true, createdAt: true } });
    return {
      state: "ok",
      entries: chain.entries,
      intact: chain.intact,
      latest: last ? { action: last.action, at: last.createdAt } : null,
    };
  } catch {
    return { state: "error" };
  }
}

const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", dateStyle: "medium", timeStyle: "short" });

/** For the owner to check the database and audit log on a preview. Shows no personal data. */
export default async function StatusPage() {
  const s = await getStatus();
  const rows: [string, string, boolean][] =
    s.state === "ok"
      ? [
          ["Database", "Connected", true],
          ["Audit log entries", String(s.entries), true],
          ["Audit log chain", s.intact ? "Intact: no entry has been changed" : "BROKEN: an entry was changed", s.intact],
          ["Latest entry", s.latest ? `${s.latest.action} · ${time.format(s.latest.at)}` : "None", true],
        ]
      : [["Database", s.state === "no-database" ? "Not configured" : "Can't connect", false]];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 sm:px-8">
      <h1 className="font-display text-4xl font-black">System status.</h1>
      <dl className="divide-y divide-line rounded-2xl border border-line bg-card">
        {rows.map(([label, value, ok]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-muted">{label}</dt>
            <dd className={`text-right font-medium ${ok ? "text-ivory" : "text-urgent"}`}>
              <span aria-hidden="true">{ok ? "✓ " : "✗ "}</span>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
