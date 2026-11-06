/** Live draw nights (AGENTS.md section 3): Tuesday, Thursday and Sunday at 20:00 UK time. */
export const DRAW_NIGHTS = [2, 4, 0] as const; // getDay(): Sun = 0, Tue = 2, Thu = 4
export const DRAW_HOUR_UK = 20;

const TZ = "Europe/London";

function londonParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
  };
}

/** The UTC instant of 20:00 UK time on a given UK calendar date (handles GMT and BST). */
export function ukDrawTime(year: number, month: number, day: number): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, DRAW_HOUR_UK));
  const offsetHours = londonParts(guess).hour - DRAW_HOUR_UK; // 0 in winter, 1 in summer
  return new Date(guess.getTime() - offsetHours * 3_600_000);
}

/** The next `count` draw nights strictly after `now`. */
export function upcomingDrawNights(now: Date, count: number): Date[] {
  const out: Date[] = [];
  const start = londonParts(now);
  for (let i = 0; out.length < count && i < 31; i++) {
    const day = new Date(Date.UTC(start.year, start.month - 1, start.day + i, 12));
    const p = londonParts(day);
    if (!(DRAW_NIGHTS as readonly number[]).includes(p.weekday)) continue;
    const at = ukDrawTime(p.year, p.month, p.day);
    if (at > now) out.push(at);
  }
  return out;
}

/** "Tue 20:00" style label in UK time. */
export function drawNightLabel(at: Date): string {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit" });
  return f.format(at).replace(",", "");
}
