/**
 * Shown on every page while DEMO_MODE is on, so sample draws and numbers can never be mistaken
 * for real ones (AGENTS.md rule 15).
 */
export function DemoBanner() {
  return (
    <div role="note" className="bg-urgent px-4 py-2 text-center text-sm font-bold text-night">
      DEMO PREVIEW · Sample draws and made-up numbers. Nothing here is real or on sale.
    </div>
  );
}
