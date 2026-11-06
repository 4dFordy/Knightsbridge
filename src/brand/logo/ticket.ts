/**
 * The punched-ticket symbol, built from the logo specification (brand book A7).
 * All measurements are proportions of the ticket height H.
 */
export const TICKET = {
  widthRatio: 1.36, // W = 1.36 H
  cornerRadius: 0.16, // r = 0.16 H
  notchRadius: 0.14, // half-circle notch on each side, r = 0.14 H, centred vertically
  holeDiameter: 0.38, // punch hole Ø = 0.38 H
  holeCentreX: 0.67, // hole centre at 0.67 W
  perforationX: 0.34, // perforation line at 0.34 W
  dashWidth: 0.045, // dashes 0.045 H wide
  dashHeight: 0.085, // 0.085 H tall
  dashGap: 0.06, // 0.06 H apart
  perforationStart: 0.16, // dashes run from 16% ...
  perforationEnd: 0.84, // ... to 84% of the height
} as const;

export type Rect = { x: number; y: number; width: number; height: number };

export type TicketGeometry = {
  width: number;
  height: number;
  hole: { cx: number; cy: number; r: number };
  dashes: Rect[];
};

/** Exact positions of every part of a ticket of height `h` (SVG coordinates, y down). */
export function ticketGeometry(h: number): TicketGeometry {
  const t = TICKET;
  const width = t.widthRatio * h;
  const dashW = t.dashWidth * h;
  const dashH = t.dashHeight * h;
  const gap = t.dashGap * h;
  const span = (t.perforationEnd - t.perforationStart) * h;
  const count = Math.floor((span + gap) / (dashH + gap));
  const used = count * dashH + (count - 1) * gap;
  const firstY = t.perforationStart * h + (span - used) / 2;
  const dashes = Array.from({ length: count }, (_, i) => ({
    x: t.perforationX * width - dashW / 2,
    y: firstY + i * (dashH + gap),
    width: dashW,
    height: dashH,
  }));
  return {
    width,
    height: h,
    hole: { cx: t.holeCentreX * width, cy: h / 2, r: (t.holeDiameter * h) / 2 },
    dashes,
  };
}

const n = (v: number) => Number(v.toFixed(3));

/**
 * One SVG path for the whole ticket, drawn with fill-rule="evenodd" so the notches,
 * perforation dashes and punch hole are real cut-outs (the background shows through).
 */
export function ticketPath(h: number, offsetX = 0, offsetY = 0): string {
  const g = ticketGeometry(h);
  const W = g.width;
  const r = TICKET.cornerRadius * h;
  const nr = TICKET.notchRadius * h;
  const mid = h / 2;
  const X = (v: number) => n(v + offsetX);
  const Y = (v: number) => n(v + offsetY);

  const outline = [
    `M${X(r)} ${Y(0)}`,
    `H${X(W - r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${X(W)} ${Y(r)}`,
    `V${Y(mid - nr)}`,
    `A${n(nr)} ${n(nr)} 0 0 0 ${X(W)} ${Y(mid + nr)}`,
    `V${Y(h - r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${X(W - r)} ${Y(h)}`,
    `H${X(r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${X(0)} ${Y(h - r)}`,
    `V${Y(mid + nr)}`,
    `A${n(nr)} ${n(nr)} 0 0 0 ${X(0)} ${Y(mid - nr)}`,
    `V${Y(r)}`,
    `A${n(r)} ${n(r)} 0 0 1 ${X(r)} ${Y(0)}`,
    "Z",
  ].join("");

  const { cx, cy, r: hr } = g.hole;
  const hole = `M${X(cx - hr)} ${Y(cy)}A${n(hr)} ${n(hr)} 0 1 0 ${X(cx + hr)} ${Y(cy)}A${n(hr)} ${n(hr)} 0 1 0 ${X(cx - hr)} ${Y(cy)}Z`;

  const dashes = g.dashes
    .map((d) => {
      const rr = d.width / 2;
      return [
        `M${X(d.x)} ${Y(d.y + rr)}`,
        `A${n(rr)} ${n(rr)} 0 0 1 ${X(d.x + d.width)} ${Y(d.y + rr)}`,
        `V${Y(d.y + d.height - rr)}`,
        `A${n(rr)} ${n(rr)} 0 0 1 ${X(d.x)} ${Y(d.y + d.height - rr)}`,
        "Z",
      ].join("");
    })
    .join("");

  return outline + hole + dashes;
}
