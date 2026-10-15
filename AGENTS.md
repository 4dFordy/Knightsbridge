# AGENTS.md: Knightsbridge Luxury Raffles / Innit prize-draw platform

Read this whole file before every task. It is the single source of truth for what to build.

## 1. What this is
An online prize-draw platform for adults (18+) in **Great Britain only**, selling entries to draws for
luxury prizes: watches, cars, cash, holidays, designer bags and luxury miscellaneous items.
Ticket prices £5–£30. Responsive website plus a mobile app (start as a PWA; native wrappers later).

It is legal ONLY because every draw also has a **free postal entry route with an equal chance of winning**
(Gambling Act 2005, s.14 and Sch. 2). Without that it is an illegal lottery. We also follow the
**DCMS Voluntary Code of Good Practice for Prize Draw Operators** in full. Treat every rule in section 4 as a
hard requirement, enforced server-side and in the database, never only in the UI.

Owner: Knightsbridge Luxury Group. Cars are mostly consigned by Knightsbridge Automotive (a related company).

## 2. Brands (one codebase, two themes)
The brand is not final. Build a **brand config** so either can ship from the same code:

| | Option A | Option B |
|---|---|---|
| Name | Knightsbridge Luxury Raffles | Innit by Knightsbridge Luxury Group |
| Wordmark | K emblem + "KNIGHTSBRIDGE / LUXURY RAFFLES" | K emblem + "INNIT" (heavy) + "BY KNIGHTSBRIDGE LUXURY GROUP" |
| Tagline | none | "You've got to be in it to win it." |
| Voice | calm, factual, premium | short, playful, British ("You in?", "I'm in", "Be in it") |
| Hero | navy | champagne-gold band |

Shared tokens (both brands): navy `#262834`, night `#1E2029`, card `#30333F`, line `#3D404E`,
champagne gold `#C9AE7C`, button gold `#D4BC8E`, pale gold `#E6D5AF`, ivory `#F7F3EA`, muted text `#A3A6B2`,
urgent `#F2A08C`. Fonts: Montserrat (display, wordmarks), DM Sans (body, numbers).
All brand copy (names, taglines, button labels, CTA text) comes from the brand config, never hard-coded.

Reference designs are in `docs/design/` (website and app home for each brand). Logos and the K emblem
are in `docs/brand/`; sample prize photos are in `public/prizes/` (demo use only, see rule on DEMO_MODE).
Screens not drawn there (draw detail, my entries, live draw) follow the same palette and components.
Match their layout: hero headline draw with countdown, live draws grid with countdown badge, progress bar,
price per entry, "Enter now" CTA; app with tab bar Home / Live / Entries / Account.

## 3. Product scope
- **Catalogue:** categories Watches, Cars, Cash, Holidays, Bags, Luxury misc. Target mix at steady state:
  20 draws/week = 6 watches, 3 cars, 5 cash, 2 holidays, 2 bags, 2 misc. Launch at 6/week with no cars.
- **Draw page:** gallery, title, cash alternative, max entries, odds statement, countdown, progress,
  quick picks (1/5/10/25) + stepper, total, enter button, free postal entry instructions (legal text placeholder).
- **Accounts:** sign-up, age/ID verification, my entries (ticket numbers), spend limits, take a break.
- **Live draw:** countdown to draw, verifiable draw run, winner reveal, published proof page.
- **Back office:** consignors, prizes, authentication records, draw builder, postal-entry capture,
  harm-monitoring queue, winners & fulfilment, finance reports (section 6).
- **Marketing hooks:** consented email/SMS, referral/affiliate tracking, UTM capture.
- **Sharing (core feature, section 6):** a Share button on every draw card, draw page, entry confirmation and
  live-draw screen, producing ready-made images for Instagram Stories, Instagram posts, TikTok and WhatsApp.
- **Payments:** card, **Apple Pay on every draw** (web and iOS app), Google Pay on Android/Chrome (section 7).

## 4. Non-negotiable rules
1. **Immutability.** Once a draw is `published`, these can never change: prize, advertised value, cash alternative,
   ticket price, max tickets, open/close time, draw method, free-entry terms. Enforce with a Postgres trigger;
   log every attempt. There is NO cancel, extend or shrink action for low sales. Do not build one.
2. **Ticket cap rule.** Draw builder must set `max_tickets × ticket_price ≈ 2.2 × prize cost` and must block
   publishing below **2.0×** (cost entered in admin; consigned cars use agreed price).
3. **No overselling.** Reserve tickets in one transaction with a 10-minute hold; hard cap (paid + free) checked
   atomically; safe under high concurrency.
4. **18+ and Great Britain only.** Age verification must pass before any purchase or accepted postal entry.
   Reject addresses outside GB (Northern Ireland excluded unless config enables it). Geo-check at checkout.
   No marketing to under-18s.
5. **Spend limits.** Before every payment, check the player's spend this calendar month across ALL draws
   against both the operator cap and the player's own limit (which can be £0).
6. **Credit cards.** Read card funding type from the payment provider. Credit card spend ≤ £250 per player per
   calendar month; credit cards never accepted on instant-win draws.
7. **Suspension and pause.** Suspension ≥ 6 months; player-chosen pause (e.g. 7 days). While active: checkout
   blocked, postal entries rejected, excluded from ALL marketing.
8. **Free postal entry.** Same chance as paid. One entry per envelope; must arrive before cutoff; captured by one
   staff member and verified by a second; scan stored; counts toward the cap; shown on every draw page
   BEFORE purchase.
9. **Verifiable draw.** Before a draw opens, store and publish SHA-256(secret seed). At close, freeze the entry
   list and publish its hash. Winner = deterministic function of (seed, pre-announced public randomness value,
   entry list). After the draw publish seed, inputs and algorithm. Small, pure, 100% unit-tested module.
10. **Harm monitoring.** Rules flag repeated limit hits, spend spikes, payment-method churn, suspension churn
    → staff review queue (contact / restrict / close). Signpost support services.
11. **Honest live activity.** Countdowns, sold counts, "viewing now" and "just entered" notices must come from
    REAL data only. No simulated activity in production (DMCC Act / CAP Code). Seeded demo data only behind a
    `DEMO_MODE` flag that can never be on in production.
12. **Transparency.** Each draw page shows before purchase: max tickets, odds statement, close time, free-entry
    instructions, draw method, prize details and evidence of advertised value.
13. **Audit log.** Append-only table for every money movement, entry, admin action and draw event.
14. **Advertising.** Share images and emails include "18+ · Free postal entry available"; posts by the brand or
    Knightsbridge Automotive add "#ad". No copy implying a draw solves money problems or that winning is likely.
15. **Sharing is never automatic and never bought.** The user picks the platform and posts it themselves; we
    never post on their behalf. No free entries, discounts or other rewards for sharing unless the solicitor
    approves the scheme first (rewarded shares become adverts that must be labelled). Suspended or paused players
    get no share prompts.
16. **Wallet payments obey every limit.** Apple Pay and Google Pay go through the same spend-limit, credit-card
    and age checks as cards. Read the underlying card's funding type from the provider; if it is unknown, treat it
    as credit.

## 5. Architecture
- Next.js (App Router) + TypeScript, PostgreSQL + Prisma, background job queue, Redis for holds/rate limits.
- External services behind interfaces with fake implementations for tests:
  `PaymentProvider` (cards + Apple Pay + Google Pay), `AgeVerificationProvider`, `RandomnessBeacon`,
  `EmailSender`, `SmsSender`, `GeoIp`, `ShareRenderer`, `ObjectStorage`.
- Money as integer pence. Prices are VAT-inclusive; store the VAT portion (1/6) on every sale.
- Draw states: `draft → published → closed → drawn → fulfilled`.
- Real-time sold counts and countdowns via server-sent events or websockets, read from the DB.
- Hosting in UK/EU region. Accessibility: WCAG 2.2 AA, 44px touch targets, prefers-reduced-motion respected.

## 6. Sharing: a working feature, not a mock-up
Every draw can be shared with its **live status** (prize photo, title, price per entry, % sold, time left or
"Drawn live tonight", result once drawn), in the active brand's look.

**Share sheet.** Tapping Share opens: Instagram Story · Instagram post · TikTok · WhatsApp · Copy link · Save image.
On mobile use the OS share sheet where possible (Web Share API with files on the web; native share in the app).

**Platform-formatted images, generated server-side** by `ShareRenderer` from brand templates (HTML/SVG → PNG,
e.g. Satori or headless Chromium), stored in object storage, CDN-cached for 60 seconds:

| Target | Size | Layout |
|---|---|---|
| Instagram Story / TikTok | 1080×1920 (9:16) | Full-bleed prize photo, wordmark top, big status block (% sold bar, time left), price, "Link in bio / tap the link sticker" safe zones: keep 250 px clear top and bottom |
| Instagram post | 1080×1350 (4:5), plus 1080×1080 option | Prize photo, title, status strip, wordmark |
| WhatsApp | 1200×630 link preview (Open Graph image) + optional 1080×1080 image | Prize photo with status overlay |
| Link previews (all) | 1200×630 OG/Twitter card on every draw URL | Same as WhatsApp |

Each image always shows: brand wordmark, prize title, price per entry, status, close date/time in UK time,
"18+ · Free postal entry available". Option B adds the tagline "You've got to be in it to win it."
Variants: **draw status** (anyone), **"I'm in"** (the player's own entry, no ticket numbers or personal data
unless they choose to show them), **live draw tonight**, **winner** (only with the winner's written consent).

**Platform hand-off.**
- Instagram Stories: iOS `instagram-stories://share` with the image on the pasteboard and our Meta App ID;
  Android intent `com.instagram.share.ADD_TO_STORY`; web fallback = save image + copy link with instructions.
- Instagram post: native share of the image to Instagram (feed); web fallback = save image.
- TikTok: TikTok Share Kit in the native app (image post, or a short MP4 slideshow generated from the
  same template, 9:16, ≤15 s); web fallback = save image/video + copy link.
- WhatsApp: `https://wa.me/?text=` with the brand message + tracked link; the OG image renders the preview;
  in the app, share the 1080×1080 image with the text.
- Copy link and Save image always available.

**Links and tracking.** Every share link is `/{draw-slug}?ref={code}&utm_source={platform}&utm_medium=share`.
Record share events (draw, platform, variant, user) and visits/sign-ups/entries from each link; show share
performance per draw in the back office. Deep links open the draw in the app if installed (Universal Links /
App Links), else the website. Shared pages still show the age gate and the free-entry route before purchase.

**Freshness.** Status in an image is a snapshot: show "Correct at HH:MM, DD Mon" in small type, re-render on each
share, and set short cache lifetimes on OG images (version the URL with the sold-count bucket).

**Tests.** Golden-image tests for every template × brand × format; tests that suspended players see no share
prompts and that no rewards attach to shares.

## 7. Payments: Apple Pay on every draw
- Apple Pay available at checkout for **every draw**, on Safari/web (Apple Pay on the Web via the payment
  provider) and in the iOS app (PassKit). Google Pay alongside it on Android and Chrome.
- Use a payment provider that supports Apple Pay for this merchant category (e.g. Stripe, Adyen, Checkout.com),
  behind `PaymentProvider`. Set up the Apple merchant ID, payment processing certificate, and domain
  verification file at `/.well-known/apple-developer-merchantid-domain-association` for each brand domain.
- Payment sheet shows the merchant/brand name, draw title, entries × price and total; VAT-inclusive.
- Before the sheet opens: age verified, GB address, spend limit and credit cap headroom checked, tickets held.
  After authorisation: re-check the cap atomically, then confirm tickets; if the cap filled, refund automatically.
- Strong Customer Authentication (3-D Secure) handled by the provider; refunds and chargebacks logged.
- Store the provider's funding type (debit/credit/prepaid/unknown) and wallet type on every payment.
- **App store check before submission:** confirm the app meets Apple App Store Review Guidelines on contests and
  sweepstakes (official rules in the app, Apple named as not a sponsor) and Google Play's contest policy, and that
  draw entries may be paid with Apple Pay rather than in-app purchase. Flag anything unclear to the owner; do not
  guess.

## 8. Finance logic the back office must calculate (per draw and monthly)
- Ticket sales; VAT = 1/6 of paid sales; card fees (from provider data); marketing spend allocated to draw.
- Prize cost net of reclaimable VAT; consignor payout = agreed price + **10% of net upside**
  (net upside = sales − VAT − card fees − agreed price, floor 0).
- Delivery & insurance per prize.
- **Team commission = 7.5% of each draw's profit** (profit after prize, VAT, fees, marketing, consignor share,
  delivery), only when positive; rate configurable 5–10%. Commission report per draw and per month.
- Payment-provider rolling reserve tracking (default 5% held 6 months), stock on hand, underwriting reserve.
- Exports: per-draw P&L, monthly cash forecast vs actual, VAT return support, consignor statements,
  complaints log.

## 9. Working rules for the agent
- Write failing tests first, then implement. Every rule in section 4 needs tests, including concurrency tests
  for the cap and limit checks.
- Never write or change legal wording (T&Cs, draw rules, free-entry text, responsible-play copy, privacy).
  Use placeholders like `{{LEGAL:free_entry_terms}}`; the solicitor supplies the text.
- Never commit secrets. Environment variables and sandbox credentials only.
- One phase or feature per task; explain schema migrations in the PR description.
- Run `npm test`, `npm run lint` and `npm run typecheck` before finishing any task.
- Lean team: prefer managed services and simple admin screens over custom tooling.

## 10. Build phases (one reviewed PR each)
1. Foundation: repo, CI, auth, accounts, audit log, brand config + theme tokens (both brands).
2. Catalogue & draw builder: consignors, prizes, authentication records, cap rule, immutability trigger.
3. Ticketing & checkout: reservations, hard cap, payment adapter (sandbox) with cards, **Apple Pay** and
   Google Pay, receipts, VAT split, funding-type capture.
4. Player protection: age/ID checks, GB-only, spend & credit limits (incl. wallets), suspension/pause, harm flags,
   signposting.
5. Free postal entries: two-person capture, scans, cutoff.
6. Draw engine & live draw: seed commitment, close job, winner selection, proof page, live reveal UI.
7. Front end: homepage, draw page, live draws grid, my entries, app shell (PWA) matching reference designs;
   real-time counts; motion with reduced-motion fallback.
8. **Sharing:** `ShareRenderer` templates for all formats × both brands, share sheet, platform hand-offs,
   OG images, tracked links, deep links, share analytics, golden-image tests.
9. Native apps: iOS (PassKit Apple Pay, Instagram Stories and TikTok Share Kit hand-off, Universal Links) and
   Android (Google Pay, share intents, App Links); store-policy check.
10. Back office & finance: per-draw P&L, consignor payouts, team commission, reserves, share performance,
    monthly cash report.
11. Marketing & launch hardening: email/SMS consent, referrals, load test, pen test, legal review of every
    live page and every share template.

## 11. Launch constraints (for planning, not code)
Set-up budget ≤ £35,000; core team ≤ £10,000/month. Launch target 1 April 2027 at 6 draws/week.
Knightsbridge Automotive (≈400,000 social followers) will share headline draws; social accounts must be
18+ and UK-targeted.
