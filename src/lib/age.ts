/**
 * Age on a UK calendar date. Dates of birth are calendar dates (no time). Someone born on
 * 29 February turns a year older on 1 March in non-leap years, as in UK law. The database applies
 * the same rule (player_must_be_adult trigger).
 */
export const MINIMUM_AGE = 18;

export type CalendarDate = { year: number; month: number; day: number };

export function parseCalendarDate(iso: string): CalendarDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
  return { year, month, day };
}

/** Today's date in the UK. */
export function ukToday(now: Date = new Date()): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export function ageOn(dob: CalendarDate, on: CalendarDate): number {
  let age = on.year - dob.year;
  // Birthday not reached yet this year? (29 Feb birthdays count from 1 March in non-leap years.)
  if (on.month < dob.month || (on.month === dob.month && on.day < dob.day)) age -= 1;
  return age;
}

export function isAdult(dob: CalendarDate, now: Date = new Date()): boolean {
  return ageOn(dob, ukToday(now)) >= MINIMUM_AGE;
}

export function toDateOnly(d: CalendarDate): Date {
  return new Date(Date.UTC(d.year, d.month - 1, d.day));
}
