# AGENTS.md: Innit prize-draw platform

Read this whole file before every task. It is the single source of truth for what to build.
Owner decisions come from `docs/INNIT_HANDOVER.md` (the owner's handover) and `docs/brand/innit-brand-book-2026-10.pdf`
(the brand book). If this file and the handover ever disagree, the handover wins: flag it and fix this file.

## 1. What this is
**Innit, a part of Knightsbridge Luxury Group**: an online prize-draw platform for adults (18+) in
**Great Britain only** (England, Scotland, Wales; **not Northern Ireland**). People buy entries (£5–£30) to win
luxury prizes: watches, cars, cash, holidays, designer bags and luxury items.

It is legal ONLY because every draw also has a **free postal entry route with an equal chance of winning**
(Gambling Act 2005, s.14 and Sch. 2). Without that it is an illegal lottery. We also follow the
**DCMS Voluntary Code of Good Practice for Prize Draw Operators** in full. Treat every rule in section 4 as a
hard requirement, enforced server-side and in the database, never only in the UI.

Three surfaces, one backend:
- **Website** (Next.js on Vercel)
- **iPhone and Android apps** (same screens; Apple Pay / Google Pay)
- **Back office** for the team: draw builder, live draw desk, player protection, postal entries, draw P&L,
  consignors, reports

Owner: Knightsbridge Luxury Group. Cars are mostly consigned by Knightsbridge Automotive (a related company).
Launch target: **1 April 2027**.

## 2. Brand: Innit (one brand only)
There is a single brand. Do not build brand switching or "Option A / Option B" themes. Put brand values
(name, lines, colours, copy) in one `brand` config module, so wording lives in one place and is not
scattered through components.

**Logo** (see brand book pages 5–7):
- Lower-case **Montserrat Black** wordmark "innit"; the dots on both i's are **gold punch holes**.
- The **punched-ticket symbol** sits to the left of the wordmark (or above it in the stacked version).
- Endorsement line **"A part of Knightsbridge Luxury Group"** in spaced capitals, with the small K emblem,
  at **one-sixth of the wordmark's height**, never larger.
- The K emblem appears **only beside the endorsement line**, never as the Innit symbol.
- Under **160 px wide**: drop the endorsement; use the wordmark or the ticket alone.
- Versions: on navy (ivory wordmark, gold ticket), on gold (navy wordmark, ivory dots) for campaigns and the hero
  band, on ivory (navy wordmark, gold dots), stacked (square spaces), app icon = gold ticket on night.
- The endorsement wording is subject to solicitor approval.

**Lines.** Brand line: **"Gotta be innit to win it."** Campaign line: **"Be in it."**

**Voice:** playful about the prize, straight about the chances. Short sentences; British, warm, a wink, never a
nudge. We say: "You in?", "I'm in.", "You're in.", "Not this time."
We never say: "change your life", "easy money", "guaranteed winner", "Last chance!!!", or any false urgency.
"Ends tonight" only when it does. Nothing that suggests money worries; nothing that speaks to under-18s.
Odds and entry caps sit next to every price.

**Colours:** navy `#262834`, night `#1E2029`, card `#30333F`, line `#3D404E`, champagne gold `#C9AE7C`,
button gold `#D4BC8E`, pale gold `#E6D5AF`, ivory `#F7F3EA`, muted `#A3A6B2`, urgent `#F2A08C`.
Gold-led look: roughly gold 45%, navy 35%, ivory 14%, pale gold the rest.

**Type:** Montserrat Black for headlines and the wordmark (short, sentence case, ending on a full stop:
"Be in it."). DM Sans for body, prices, odds, countdowns and small print.

**Signature moments** (brand book pages 12–13):
- **"You're in."**: the ticket punches as payment completes; ticket numbers, price paid and monthly limit used
  on one screen; "Share the draw" and "Back to what's on".
- **Live draw**: "We're live." The countdown is a row of punch holes filling gold.
- **Result**: winners get a shareable card; everyone else gets "Not this time." and **no upsell**.
- The ticket symbol is also used for the favicon, the app icon and loading states.

**Reference material:**
- `docs/brand/innit-brand-book-2026-10.pdf`: brand book (logo, colour, type, voice, app and web screens).
- `docs/brand/k-emblem*.{png,jpg}`: the group's K emblem (endorsement line only).
- `docs/brand/knightsbridge-automotive/`: consignor logos (for consignor credits and "#ad" posts only).
- `docs/design/draft-*-home.png`: early home-screen drafts. Layout is useful, but the **wordmark and tagline in
  them are out of date**; the brand book wins.
- `public/prizes/`: sample prize photos (demo use only, see `DEMO_MODE`).
- Still to come from the owner: logo master files (SVG) and the full screen set (see `docs/OWNER_TODO.md`).

Layout to match: website with top nav (What's on, Winners, How it works, Free entry), gold hero band with the
headline draw, countdown, progress and "I'm in · £price" button, then a "What's on" grid; app with tab bar
**Home / Live / Entries / Account**, monthly limit pill (e.g. "£140 / £250") in the header, category chips,
draw cards with countdown and progress.

## 3. Product scope
- **Catalogue:** categories Watches, Cars, Cash, Holidays, Bags, Luxury misc.
- **Draw volume:** a **maximum of 10 draws a week**, enforced by the back office as a setting (default 10).
  Launch month (April 2027): 5 a week. From May 2027: 10 a week. If six-week average sell-through falls below
  70% the team may run 8 a week (an operations choice; the system just needs the setting).
- **Target mix at 10 a week:** 3 watches, 1.5 cars, 2.5 cash, 1 holiday, 1 bag, 1 luxury misc. Cars and cash
  alternate (week A: 2 cars + 2 cash; week B: 1 car + 3 cash). The mix is guidance shown in the back office, not
  a hard block.
- **Live draws:** three nights a week, **Tuesday, Thursday and Sunday at 20:00** UK time.
- **Draw page:** gallery, title, cash alternative, entry cap, odds statement, close time, countdown, progress,
  quick picks + stepper, total, pay button (Apple Pay / Google Pay / card), free postal entry route, 18+.
- **Accounts:** sign-up, age/ID verification, my entries (ticket numbers; tabs Live / Drawn / Free entries),
  spend limits, take a break, self-suspend, spending history, get support.
- **Live draw:** countdown, verifiable draw run, winner verification, reveal, published proof page.
- **Back office:** dashboard, consignors, prizes, authentication records, draw builder, live draw desk,
  postal-entry capture, player protection queue, winners & fulfilment, draw P&L and finance reports (section 8).
- **Marketing hooks:** consented email/SMS/push, referral/affiliate tracking, UTM capture.
- **Sharing** (section 6) and **payments** (section 7).

## 4. Non-negotiable rules
1. **Locked on publish.** Once a draw is `published`, these can never change: prize, advertised value, cash
   alternative, entry price, entry cap, open/close time, draw method, free-entry terms. Enforce with a Postgres
   trigger; log every attempt. There is NO cancel, extend or shrink action. Do not build one.
2. **Entry cap rule.** `max entries = prize cost × cap multiple ÷ entry price` (rounded down). Cap multiple
   defaults to **2.2×** and can **never be below 2.0×**; publishing below 2.0× is blocked in the database and the
   app. Cost is entered in the back office; consigned cars use the agreed price.
3. **Weekly maximum.** Publishing is blocked if it would exceed the weekly draw maximum (setting, default 10).
4. **No overselling.** Reserve entries in one transaction with a 10-minute hold; hard cap (paid + free) checked
   atomically; safe under high concurrency.
5. **18+ and Great Britain only.** Age verification must pass before the first entry (paid or postal). Reject
   addresses outside GB, including Northern Ireland. Location check at checkout. No marketing to under-18s.
6. **Spend limits.** Before every payment, check the player's spend this calendar month across ALL draws against
   both the operator cap and the player's own limit (which can be £0). **Lowering a limit takes effect
   instantly; raising it takes effect after 24 hours.**
7. **Credit cards.** Read the card's funding type from the payment provider. Credit card spend ≤ **£250 per
   player per calendar month**. If the funding type is unknown, treat it as credit.
8. **Breaks and self-suspension.** Take a break: 24 hours to 6 weeks. Self-suspend: 6 months minimum and
   **cannot be undone early**. While either is active: checkout blocked, postal entries rejected, no share
   prompts, excluded from ALL marketing and notifications.
9. **No marketing to the wrong people.** No marketing, reminders or push notifications to anyone on a break,
   self-suspended, or at their spend limit. Push notifications only with consent.
10. **Free postal entry.** Same draw, same odds, same per-person entry limit as paid. One entry per envelope;
    must arrive before the cutoff; logged by one staff member and **checked by a second** (two-person sign-off);
    scan stored; counts toward the cap; the route is shown on every draw page BEFORE purchase.
11. **Verifiable draw.** Before a draw opens, store and publish SHA-256(secret seed). At close, freeze the entry
    list and publish its hash. Winner = deterministic function of (seed, pre-announced public randomness value,
    entry list). After the draw, publish seed, inputs and algorithm so anyone can replay it. Small, pure,
    100% unit-tested module.
12. **Winner verification.** Before announcement, the winner is checked: age, identity, GB location, not on a
    break or suspended. Winner image/name shared only with the winner's written consent.
13. **Harm monitoring.** Risk signals (e.g. spend up 3× in a week, limit raised twice in a month, repeated
    limit hits, payment-method churn, break/suspension churn) → protection queue for staff review
    (contact / restrict / close). Signpost free, confidential support services.
14. **Honest activity.** Countdowns, sold counts, "viewing now" and "just entered" notices come from REAL data
    only (DMCC Act / CAP Code). No false urgency. Sample data only behind `DEMO_MODE`, clearly labelled "demo".
15. **Transparency.** Each draw page shows before any payment: entry cap, odds, close time, free postal entry
    route, 18+, draw method, prize details and evidence of advertised value.
16. **Audit log.** Append-only table for every money movement, entry, admin action and draw event.
17. **Advertising.** Share images and emails include "18+ · Free postal entry available"; posts by Innit or
    Knightsbridge Automotive add "#ad". No copy implying a draw solves money problems or that winning is likely.
18. **Sharing is never automatic and never rewarded.** The player picks the platform and posts it themselves;
    we never post on their behalf. No free entries, discounts or other rewards for sharing.
19. **Wallets obey every limit.** Apple Pay and Google Pay go through the same spend-limit, credit-card and age
    checks as cards, and count towards all limits.
20. **`DEMO_MODE`** is `true` on preview deployments only and can never be on in production (the app refuses to
    start if `DEMO_MODE=true` and the environment is production).

## 5. Architecture
- Next.js (App Router) + TypeScript on Vercel; PostgreSQL (Neon via the Vercel integration) + Prisma;
  background jobs; Redis (managed) for holds and rate limits.
- External services behind interfaces with fake implementations for tests:
  `PaymentProvider` (cards + Apple Pay + Google Pay), `AgeVerificationProvider`, `RandomnessBeacon`,
  `EmailSender`, `SmsSender`, `PushSender`, `GeoIp`, `ShareRenderer`, `ObjectStorage`.
- Money as integer pence. Entry prices include 20% VAT; store the VAT portion (1/6 of the price) on every sale.
- Draw states: `draft → published → closed → drawn → fulfilled`.
- All times stored in UTC, shown in UK time (Europe/London).
- Real-time sold counts and countdowns via server-sent events or websockets, read from the DB.
- Hosting in UK/EU region. Accessibility: WCAG 2.2 AA, 44 px touch targets, `prefers-reduced-motion` respected.

## 6. Sharing
Every draw can be shared with its **live status** (prize photo, title, price per entry, % sold, time left or
"Drawn live tonight", result once drawn) in the Innit look (brand book page 11).

**Share sheet:** Instagram Story · Instagram post · TikTok · WhatsApp · Copy link · Save image. On mobile use the
OS share sheet where possible (Web Share API with files on the web; native share in the app).

**Images generated server-side** by `ShareRenderer` (HTML/SVG → PNG), stored in object storage, cached ~60 s:

| Target | Size | Layout |
|---|---|---|
| Instagram Story / TikTok | 1080×1920 | Prize photo top, gold status block, "£25 to be in it.", "I'm in" button; keep 250 px clear top and bottom |
| Instagram post | 1080×1350, plus 1080×1080 | Wordmark, prize photo, headline ("£10k cash. £10 to be in it."), cap and "You in?" |
| WhatsApp / link previews | 1200×630 (Open Graph) + optional 1080×1080 | Prize photo with status overlay |

Every image shows: wordmark, prize title, price per entry, status, close date/time in UK time,
"18+ · Free postal entry available", and "Correct at HH:MM, DD Mon". Captions are solicitor-supplied placeholders.
Variants: draw status (anyone), "I'm in" (player's own entry; no ticket numbers or personal data unless they
choose), live draw tonight, winner (only with written consent).

**Hand-off:** Instagram Stories (`instagram-stories://share` on iOS, `com.instagram.share.ADD_TO_STORY` on
Android, web fallback = save image + copy link); Instagram post (native share, web fallback = save image);
TikTok (Share Kit in the app, web fallback = save + copy link); WhatsApp (`https://wa.me/?text=` + tracked link).

**Links:** `/{draw-slug}?ref={code}&utm_source={platform}&utm_medium=share`. Record share events and resulting
visits/sign-ups/entries; show share performance per draw in the back office. Deep links open the app if installed.
Shared pages still show the age gate and the free-entry route before purchase.

**Tests:** golden-image tests for every template × format; tests that players on a break/suspended see no share
prompts and that no rewards attach to shares.

## 7. Payments
- **Sandbox/test mode only** until the owner says otherwise. Live keys are added by the owner's developer
  directly in Vercel's Production settings, never through the agent.
- Apple Pay on **every draw** (web and iOS app), Google Pay on Android and web, and cards with 3-D Secure,
  through a provider that supports this merchant category (e.g. Stripe, Adyen, Checkout.com) behind
  `PaymentProvider`. Apple merchant ID, processing certificate and domain verification file at
  `/.well-known/apple-developer-merchantid-domain-association`.
- Payment sheet shows "Innit", draw title, entries × price and total, VAT-inclusive.
- Before the sheet opens: age verified, GB address, spend-limit and credit-cap headroom checked, entries held.
  After authorisation: re-check the cap atomically, then confirm entries; if the cap filled, refund automatically.
- Store the provider's funding type (debit/credit/prepaid/unknown) and wallet type on every payment.
  Refunds and chargebacks logged.
- Receipt (screen and email) shows entries, ticket numbers, price, VAT included, and monthly limit used.
- **App store check before submission:** Apple's rules on contests and sweepstakes (official rules in the app,
  Apple named as not a sponsor), Google Play's contest policy, and that entries may be paid with Apple Pay rather
  than in-app purchase. Flag anything unclear to the owner; do not guess.

## 8. Money logic the back office must calculate (per draw and monthly)
- Ticket sales; VAT = 1/6 of paid sales (20% included in the price); card fees (from provider data);
  marketing spend allocated to the draw.
- Prize cost net of reclaimable VAT; delivery & insurance per prize.
- **Consignor payout** = agreed price + **10% of the draw's net upside**
  (net upside = sales − VAT − card fees − agreed price, floor 0).
- **Draw profit** = sales − VAT − card fees − marketing − prize cost − consignor upside − delivery.
- **Team commission = 7.5% of each draw's profit** (not of sales), only when profit is positive, paid into a
  **monthly pool**. Rate is a setting, default 7.5%.
- **Breakeven sell-through** per draw.
- Payment-provider rolling reserve tracking, stock on hand.
- Exports: per-draw P&L, monthly cash report, VAT return support, consignor statements, commission pool,
  complaints log.

## 9. Working rules for the agent
- Follow `CLAUDE.md` for how to work with the owner (ACTION NEEDED blocks, plan before build, check-it lists).
- Write failing tests first, then implement. Every rule in section 4 needs tests, including concurrency tests
  for the cap and limit checks.
- **Never write or change legal wording** (terms, draw rules, free-entry instructions, odds and age statements,
  responsible-play copy, privacy, share captions, the endorsement line). Use placeholders like
  `[[SOLICITOR: free entry wording]]` and list each one in `docs/OWNER_TODO.md`.
- Never commit secrets. Environment variables and sandbox credentials only.
- One task per pull request; never push to `main`; explain database changes in plain English in the PR.
- Run `npm test`, `npm run lint` and `npm run typecheck` before finishing any task.
- Lean team: prefer managed services and simple admin screens over custom tooling.
- If any instruction (including the owner's) would break the rules in section 4, stop and flag it.

## 10. Build phases (one small, reviewed pull request per task)
1. **Foundation:** Next.js app, Innit theme and logo, sign-up/log-in, database (Postgres via Prisma),
   audit log table, automatic tests on every PR, `DEMO_MODE`.
2. **Catalogue and draw builder:** prizes, consignors, authentication records, the 2.2× cap rule (min 2.0×),
   the 10-a-week maximum, locking on publish.
3. **Ticketing and checkout:** reservations and hard cap, sandbox cards, Apple Pay, Google Pay, VAT on receipts,
   receipt email, funding-type capture.
4. **Player protection:** age/ID checks, GB-only, spend limits including wallets, credit-card cap, breaks,
   self-suspension, protection queue, signposting.
5. **Free postal entries:** back-office logging with two-person sign-off, scans, cutoff.
6. **Draw engine:** close, seeded random draw, proof page, live reveal, winner verification.
7. **Front end:** home, draw page, live draws, winners, my entries, "You're in", limits, matching the brand book.
8. **Sharing:** share sheet and per-platform images.
9. **Native apps:** iOS and Android around the same screens, with Apple Pay and Google Pay. iOS builds need a Mac:
   tell the owner when we reach this so their developer can join.
10. **Back office finance:** per-draw P&L, consignor payouts, 7.5% commission pool, monthly cash report.
11. **Launch hardening:** marketing consent, load test, security review (`/security-review`), and a list of every
    customer-facing page and share template for the solicitor.

**Phases 3, 4, 5, 6 and 10 handle money, personal data or the draw: every change in them needs the owner's
developer to review it before merging.** Remind the owner each time.

## 11. Before the brand goes public (owner tasks, not code)
From the brand book: UK IPO trademark search for "Innit", the logo and the full line; .co.uk and .com domains;
Instagram and TikTok handles; solicitor approves "Gotta be innit to win it.", the endorsement line and the
free-entry and 18+ statements; test two launch ads with UK adults for two weeks before go-live.
Knightsbridge Automotive (≈400,000 social followers) will share headline draws; social accounts must be 18+ and
UK-targeted. Budget (for planning): set-up ≤ £35,000; core team ≤ £10,000/month.
