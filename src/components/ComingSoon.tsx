/** Placeholder for pages built in later phases. */
export function ComingSoon({ title, phase, children }: { title: string; phase: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-12 sm:px-8">
      <h1 className="font-display text-4xl font-black">{title}</h1>
      <p className="text-muted">This page is built in {phase}.</p>
      {children}
    </div>
  );
}
