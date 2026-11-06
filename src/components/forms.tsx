/** Shared form pieces: large touch targets, labels always visible, errors read out by screen readers. */
export function Field({
  name,
  label,
  type = "text",
  autoComplete,
  defaultValue,
  error,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
}) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-bold text-ivory">
        {label}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`block min-h-12 w-full rounded-lg border bg-night px-3 text-base text-ivory placeholder:text-muted focus:border-gold ${
          error ? "border-urgent" : "border-line"
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-urgent bg-urgent/10 px-4 py-3 text-sm text-urgent">
      {message}
    </p>
  );
}

export function SubmitButton({ children, pending }: { children: React.ReactNode; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-button-gold px-6 font-bold text-night hover:bg-pale-gold disabled:opacity-60"
    >
      {pending ? "One moment…" : children}
    </button>
  );
}

/** Date of birth as three boxes (Day, Month, Year), the pattern GOV.UK uses: quicker than a date picker. */
export function DateOfBirth({ values, error }: { values: Record<string, string>; error?: string }) {
  const box = (name: string, label: string, width: string, autoComplete: string, maxLength: number) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-xs text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={maxLength}
        autoComplete={autoComplete}
        defaultValue={values[name]}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "dateOfBirth-error" : undefined}
        className={`block min-h-12 ${width} rounded-lg border bg-night px-3 text-base text-ivory focus:border-gold ${
          error ? "border-urgent" : "border-line"
        }`}
      />
    </div>
  );
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-bold text-ivory">Date of birth</legend>
      <p className="text-xs text-muted">For example, 27 3 1990</p>
      <div className="flex gap-3">
        {box("dobDay", "Day", "w-16", "bday-day", 2)}
        {box("dobMonth", "Month", "w-16", "bday-month", 2)}
        {box("dobYear", "Year", "w-24", "bday-year", 4)}
      </div>
      {error && (
        <p id="dateOfBirth-error" className="text-sm text-urgent">
          {error}
        </p>
      )}
    </fieldset>
  );
}
