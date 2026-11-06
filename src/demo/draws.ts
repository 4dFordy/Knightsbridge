/**
 * SAMPLE DRAWS: demo data for previews only (DEMO_MODE). Never shown in production.
 * Every number here is made up and every screen that shows it is labelled "demo".
 * Photos are the sample prize photos in public/prizes/.
 */
import { upcomingDrawNights } from "@/lib/drawNights";

export type Category = "watches" | "cars" | "cash" | "holidays" | "bags" | "luxury";

export const CATEGORY_LABELS: Record<Category, string> = {
  watches: "Watches",
  cars: "Cars",
  cash: "Cash",
  holidays: "Holidays",
  bags: "Bags",
  luxury: "Luxury",
};

export type DemoDraw = {
  slug: string;
  title: string;
  category: Category;
  image: string;
  /** Entry price in pence (£5–£30). */
  pricePence: number;
  /** What Innit pays for the prize, in pence (internal). */
  prizeCostPence: number;
  /** Retail value shown to players, in pence. */
  prizeValuePence: number;
  /** Cash alternative in pence, or null for cash prizes. */
  cashAlternativePence: number | null;
  /** Share of entries "sold" in the demo (made up). */
  demoSoldShare: number;
  /** Which upcoming draw night it closes on (0 = next). */
  drawNightIndex: number;
};

/** Cap multiple used for the demo: the 2.2× default (AGENTS.md rule 2). */
export const DEMO_CAP_MULTIPLE = 2.2;

const gbp = (pounds: number) => pounds * 100;

const SAMPLE: DemoDraw[] = [
  {
    slug: "lamborghini-revuelto",
    title: "Lamborghini Revuelto",
    category: "cars",
    image: "/prizes/lamborghini-revuelto.jpg",
    pricePence: gbp(30),
    prizeCostPence: gbp(400_000),
    prizeValuePence: gbp(450_000),
    cashAlternativePence: gbp(360_000),
    demoSoldShare: 0.62,
    drawNightIndex: 2,
  },
  {
    slug: "mercedes-amg-g63",
    title: "Mercedes-AMG G63",
    category: "cars",
    image: "/prizes/mercedes-amg-g63.jpg",
    pricePence: gbp(25),
    prizeCostPence: gbp(160_000),
    prizeValuePence: gbp(185_000),
    cashAlternativePence: gbp(150_000),
    demoSoldShare: 0.68,
    drawNightIndex: 1,
  },
  {
    slug: "rolex-daytona-panda",
    title: "Rolex Daytona Panda",
    category: "watches",
    image: "/prizes/rolex-daytona-panda.jpg",
    pricePence: gbp(15),
    prizeCostPence: gbp(28_000),
    prizeValuePence: gbp(32_000),
    cashAlternativePence: gbp(27_000),
    demoSoldShare: 0.45,
    drawNightIndex: 1,
  },
  {
    slug: "gbp-10000-cash",
    title: "£10,000 Cash",
    category: "cash",
    image: "/prizes/gbp-10000-cash.jpg",
    pricePence: gbp(10),
    prizeCostPence: gbp(10_000),
    prizeValuePence: gbp(10_000),
    cashAlternativePence: null,
    demoSoldShare: 0.91,
    drawNightIndex: 0,
  },
  {
    slug: "maldives-overwater-villa",
    title: "Maldives Overwater Villa",
    category: "holidays",
    image: "/prizes/maldives-overwater-villa.jpg",
    pricePence: gbp(10),
    prizeCostPence: gbp(18_000),
    prizeValuePence: gbp(20_000),
    cashAlternativePence: gbp(17_000),
    demoSoldShare: 0.3,
    drawNightIndex: 3,
  },
  {
    slug: "patek-philippe-nautilus-moonphase",
    title: "Patek Philippe Nautilus Moonphase",
    category: "watches",
    image: "/prizes/patek-philippe-nautilus-moonphase.jpg",
    pricePence: gbp(20),
    prizeCostPence: gbp(95_000),
    prizeValuePence: gbp(110_000),
    cashAlternativePence: gbp(90_000),
    demoSoldShare: 0.55,
    drawNightIndex: 2,
  },
  {
    slug: "gucci-gg-marmont",
    title: "Gucci GG Marmont",
    category: "bags",
    image: "/prizes/gucci-gg-marmont.jpg",
    pricePence: gbp(5),
    prizeCostPence: gbp(2_000),
    prizeValuePence: gbp(2_300),
    cashAlternativePence: gbp(1_900),
    demoSoldShare: 0.77,
    drawNightIndex: 0,
  },
];

export function maxEntries(d: Pick<DemoDraw, "prizeCostPence" | "pricePence">, capMultiple = DEMO_CAP_MULTIPLE) {
  return Math.floor((d.prizeCostPence * capMultiple) / d.pricePence);
}

export type DemoDrawView = DemoDraw & { maxEntries: number; sold: number; closesAt: Date };

/** The sample draws with entry caps, demo sold counts and close times worked out for `now`. */
export function demoDraws(now: Date = new Date()): DemoDrawView[] {
  const nights = upcomingDrawNights(now, 4);
  return SAMPLE.map((d) => {
    const cap = maxEntries(d);
    return { ...d, maxEntries: cap, sold: Math.round(cap * d.demoSoldShare), closesAt: nights[d.drawNightIndex]! };
  }).sort((a, b) => a.closesAt.getTime() - b.closesAt.getTime());
}

export function formatPounds(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pence / 100);
}
