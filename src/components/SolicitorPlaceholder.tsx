/**
 * Marks wording the solicitor must supply (AGENTS.md section 13).
 * Renders the placeholder visibly so it can't be mistaken for approved text.
 * Every `id` used must also be listed in docs/OWNER_TODO.md.
 */
export function SolicitorPlaceholder({ id }: { id: string }) {
  return (
    <span
      data-solicitor-placeholder={id}
      className="rounded border border-dashed border-urgent px-1 font-mono text-xs text-urgent"
    >
      {`[[SOLICITOR: ${id}]]`}
    </span>
  );
}
