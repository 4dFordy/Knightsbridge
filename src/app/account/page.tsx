import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/auth";
import { currentPlayer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Your account" };
export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const player = await currentPlayer();
  if (!player) redirect("/sign-in");
  const { welcome } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10 sm:px-8">
      <h1 className="font-display text-4xl font-black">{welcome ? "You're in." : "Your account."}</h1>
      <p className="text-pale-gold">Hi {player.firstName}.</p>

      <dl className="divide-y divide-line rounded-2xl border border-line bg-card">
        <Row label="Name" value={`${player.firstName} ${player.lastName}`} />
        <Row label="Email" value={player.email} />
        <Row
          label="Age check"
          value={player.ageVerifiedAt ? "Verified 18+" : "Not done yet. You'll be asked before your first entry."}
        />
      </dl>

      <section className="space-y-2 rounded-2xl border border-line p-5">
        <h2 className="font-display text-xl font-black">Coming soon.</h2>
        <p className="text-sm text-muted">
          Your monthly spend limit, take a break, self-suspend, spending history and support links arrive in Phase 4.
        </p>
      </section>

      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center rounded-lg border border-line px-6 font-bold text-ivory hover:border-gold"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
