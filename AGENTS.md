# AGENTS.md: Innit prize-draw platform

Read this whole file before every task. It is the single source of truth for what to build.
It is a working summary of the owner's handover, `docs/INNIT_HANDOVER.md`. **If the two ever disagree, the
handover wins**: flag the difference to the owner and fix this file. Section numbers like "H-2B" point to the
handover for the full detail.

## 1. What this is
**Innit**: an online prize-draw platform for adults (18+) in **Great Britain only** (England, Scotland,
Wales; **not Northern Ireland**). People buy entries (£5–£30) to win luxury prizes: watches, cars, cash,
holidays, designer bags and luxury items.

It is legal ONLY because every draw also has a **free postal entry route with an equal chance of winning**
(Gambling Act 2005, s.14 and Sch. 2). Without that it is an illegal lottery. We also follow the
**DCMS Voluntary Code of Good Practice for Prize Draw Operators** in full. Treat every rule in section 4 as a
hard requirement, enforced server-side and in the database, never only in the UI.

Three surfaces, one backend:
- **Website** (Next.js on Vercel)
- **iPhone and Android apps** (same screens; Apple Pay / Google Pay)
- **Admin panel** at `/admin` with its own staff login (section 5)

Launch target: **1 April 2027**.

## 2. Brand: Innit (one brand only)
- One brand. No brand switching, no "Option A / Option B". Keep brand values (name, lines, colours, copy) in one
  `brand` config module so wording lives in one place.
- **Logo:** lower-case Montserrat Black wordmark "innit", gold dots on both i's, punched-ticket symbol.
  **No endorsement line.** Never show "A part of Knightsbridge Luxury Group", the K emblem, or any Knightsbridge
  branding anywhere in the product (website, app, emails, share images).
- **Logo files and rules:** follow the **logo specification** (brand book appendix A1–A11,
  `docs/brand/innit-brand-book-with-logo-spec-2026-10.pdf`). The logo is built in code from that spec
  (`src/brand/logo/`) and served as SVG at `/logo/<file name>`; always use the `<Logo>` component, never redraw it.
  - Lockups: **horizontal** (default: large header, emails, share images), **stacked** (avatars, story end cards,
    splash), **wordmark** (where the ticket is already on screen), **nav** (website header and app top bar,
    120–160 px wide), **ticket** alone, **app icon** (gold ticket on navy, 46% of the width, square file).
  - Construction: ticket height 0.62× font size (horizontal), 0.70× (stacked), 0.66× (nav); gap 0.13× (0.07×
    vertical for stacked); ticket centred on the letters; wordmark letter-spacing −0.02em; dotless ı with
    separate round dots.
  - Colours by ground: navy (ivory wordmark, gold dots, gold ticket), gold (night wordmark, ivory dots, night
    ticket), ivory (navy wordmark, gold dots, navy ticket). Cut-outs are transparent, never filled.
  - Clear space = punch-hole diameter. Horizontal minimum 160 px wide; below that, the ticket alone
    (minimum 24 px tall). Never stretch, recolour, rotate, or place on a busy photo without a navy panel.
  - The handover said not to use `innit-horizontal-*`, `innit-stacked-*` and `innit-nav-*` because they carried
    the endorsement line. In the logo spec they no longer do, so they are used as the spec says.
- **Lines:** brand line **"Gotta be innit to win it."** Campaign line **"Be in it."**
- **Voice:** short, playful, British, straight about the chances: "You in?", "I'm in", "You're in.",
  "Not this time." Never: "change your life", "easy money", "guaranteed winner", "Last chance!!!", or false
  urgency. "Ends tonight" only when it does. Nothing that suggests money worries or appeals to under-18s.
  Odds and entry caps sit next to every price. Losing players get "Not this time." and no upsell.
- **Colours:** navy `#262834`, night `#1E2029`, card `#30333F`, line `#3D404E`, champagne gold `#C9AE7C`,
  button gold `#D4BC8E`, pale gold `#E6D5AF`, ivory `#F7F3EA`, muted `#A3A6B2`, urgent `#F2A08C`.
  Gold-led (roughly gold 45%, navy 35%, ivory 14%).
- **Type:** Montserrat Black for headlines and the wordmark (short, sentence case, ending on a full stop);
  DM Sans for body, prices, odds and countdowns.
- **Signature moments:** the ticket "punches" when payment completes ("You're in."); the live-draw countdown is a
  row of punch holes filling gold; the ticket is the favicon, app icon and loading state.
- **References:**
  - `docs/brand/innit-brand-book-with-logo-spec-2026-10.pdf`: brand book with the logo specification
    (no endorsement line or K emblem anywhere).
  - `docs/design/draft-*-home.png`: early home drafts. Layout only; their uppercase "INNIT", "by Knightsbridge
    Luxury Group" line, K emblem and old tagline are out of date.
  - `docs/design/`: the full reference screen set (website home, draw, checkout, winners; app home, draw,
    "You're in", entries, live, limits; admin dashboard, draw builder, protection) is still to be supplied.
  - `public/prizes/`: sample prize photos (demo use only).
- **Layout:** website top nav (What's on, Winners, How it works, Free entry), gold hero band with the headline
  draw and its prize photo filling the wide space beside the text on desktop; app tab bar **Home / Live / Entries / Account**, monthly-limit pill (e.g. "£140 / £250") in the header,
  category chips, draw cards with countdown and progress.

## 3. Product scope
- **Categories:** watches, cars, cash, holidays, bags, luxury misc.
- **Volume:** **maximum 10 draws a week** (setting, default 10). April 2027: 5 a week. From May 2027: 10 a week.
  The team may drop to 8 a week if six-week average sell-through is below 70% (operations choice; setting only).
- **Mix at 10 a week:** 3 watches, 1.5 cars, 2.5 cash, 1 holiday, 1 bag, 1 luxury misc. Cars and cash alternate
  (week A: 2 cars + 2 cash; week B: 1 car + 3 cash). Shown on the admin calendar as a target, not a hard block.
- **Live draws:** **Tue, Thu and Sun at 20:00** UK time (draw nights editable in settings), streamed.
- **Draw page:** gallery, title, prize value with evidence, cash alternative, entry cap, odds, close time,
  live tracker (section 6), quick picks + stepper, total, pay button, free postal entry route, 18+.
- **Player account:** sign-up, age/ID verification, "My entries", spend limit, take a break, self-suspend,
  spending history, get support.
- **Admin panel:** section 5.
- **Sharing:** section 8. **Payments:** section 7.

## 4. Non-negotiable rules
1. **Locked at go-live.** From the moment a draw goes live, its prize, advertised value, cash alternative,
   entry price, entry cap, open/close time, draw method and free-entry terms can never change. Enforce with a
   Postgres trigger; log every attempt. There is NO cancel, extend or shrink action. Do not build one.
2. **Entry cap.** `max entries = prize cost × cap multiple ÷ entry price`. Cap multiple defaults to **2.2×** and
   can **never be below 2.0×** of prize cost; blocked in the database and the app.
3. **Weekly maximum.** Scheduling or go-live is blocked if it would exceed the weekly maximum (default 10).
4. **No overselling.** Reserve entries in one transaction with a 10-minute hold; the hard cap (paid + postal) is
   checked atomically and is safe under high concurrency. (See open question Q1 in `docs/OWNER_TODO.md` on
   postal entries after "Sold out".)
5. **Entries only on confirmed payment.** Paid entries are issued only after the gateway's **signed webhook**
   confirms payment and it is re-checked with the gateway's API. Never on a browser success message. Issuing
   is idempotent: unique entry numbers, no double-issuing if a webhook arrives twice.
6. **18+ and Great Britain only.** Age verification passes before the first entry (paid or postal). Reject
   addresses outside GB, including Northern Ireland. Location check at checkout. No marketing to under-18s.
7. **Spend limits.** Before every payment, check this calendar month's spend across ALL draws against the
   operator cap and the player's own limit (which can be £0). **Lowering is instant; raising takes 24 hours.**
8. **Credit cards** ≤ **£250 per player per calendar month**. Read the funding type from the gateway; if
   unknown, treat as credit. **Wallets** (Apple Pay / Google Pay) go through every check and count towards all
   limits.
9. **Breaks and self-suspension.** Break: 24 hours to 6 weeks. Self-suspend: 6 months minimum, **cannot be
   undone early**. While active: checkout blocked, postal entries rejected, no share prompts, no marketing.
10. **Marketing.** Only with consent. Nobody on a break, suspended or at their limit receives marketing,
    reminders or pushes. Frequency cap per player: **1 marketing push a day, 3 a week** (configurable).
    Every message is true when sent, with no false urgency, and carries 18+ and the free-entry line.
    **No message goes to players without a second team member approving it.**
11. **Free postal entry.** Same draw, same odds, same per-person limit as paid. One entry per envelope; must
    arrive before close; logged by one staff member and **checked by a second**; scan stored; shown on every
    draw page BEFORE purchase.
12. **Verifiable draw** (section 9): commit-reveal with drand; two staff approvals to run; run exactly once.
13. **Winner verification** (age, identity, GB location, not suspended) and a confirmation call before any
    announcement. Winner name/image shared only with written consent.
14. **Harm monitoring.** Risk signals (e.g. spend up 3× in a week, limit raised twice in a month, repeated
    limit hits, payment-method churn) → protection queue (contact / restrict / close). Signpost support.
15. **Honest activity.** Sold counts, countdowns and alerts come from REAL data only (DMCC Act / CAP Code).
    Countdowns use server time. Sample data only behind `DEMO_MODE`, clearly labelled "demo".
16. **Transparency.** Before any payment each draw shows: entry cap, odds, close time, free postal entry
    route, 18+, draw method, prize details and evidence of value.
17. **Append-only records.** The audit log, each draw's ticket ledger and the business ledger can never be
    edited or deleted (database-enforced). Corrections are new reversing lines.
18. **Advertising.** Every share image carries "18+ · Free postal entry · T&Cs" inside safe zones; partner posts
    get "#ad". Never imply a draw solves money problems or that winning is likely.
19. **Sharing is never automatic and never rewarded.** Players pick the platform and post it themselves.
    Shares never show amounts spent or entry numbers.
20. **`DEMO_MODE`** is `true` on previews only; the app refuses to start with `DEMO_MODE=true` in production.

## 5. Admin panel (`/admin`) (H-2A, H-2E)
**Staff login:** separate from players; individual accounts only; **two-factor authentication mandatory**
(authenticator app); session timeout; every admin action in the audit log (who, what, when, before, after).
The owner is the first Owner and invites the rest from the panel.

| Role | Can |
|---|---|
| Owner | everything (incl. approving changes after month-end close, logged draw re-run override) |
| Operations | prizes, draws, calendar, alerts |
| Finance | ledgers, reconciliation, payouts, marketing costs |
| Compliance | protection queue, postal entries, winner verification |
| Support | read-only player look-up (player IDs masked in ledgers) |

**New draw form** (one guided form with live preview of the web card, draw page and app screen):
images (drag-drop, reorder, cover; JPG/PNG/WebP/HEIC auto-converted; web/app sizes; too-small/blurry warning);
title, category, brand/model/reference, description; **prize value** shown to players + evidence upload;
**prize cost** (internal; or agreed consignor price); **cash alternative** (warn outside 80–90% of value);
entry price £5–£30; **max entries** typed or "Use 2.2×", showing the cap multiple, blocking < 2.0×, and showing
breakeven sell-through and profit at 70/80/100% sold; opens; closes (must be a draw night, 20:00 by default);
live draw slot (automatic); source (owned or consigned + consignor + agreed price); checks (authentication,
value evidence, solicitor wording, photos approved); delivery notes.

**Statuses:** Draft → Ready for review → Approved (second person) → Scheduled → Live → Closed → Drawn →
Delivered. Drafts edit freely; scheduled edits are logged and need re-approval; **go-live locks the draw**.

**Calendar:** 4–8 weeks ahead, by category, with open/close times and draw nights; enforces the weekly maximum;
shows mix against target. **Automatic go-live** at the scheduled time on web and app together (same API), then
queues the "new draws" email/push for opted-in players and generates the share pack. If any check is missing at
go-live, it does **not** go live and Operations is alerted. **Duplicate draw** as a template.

**Live sales monitor:** every live draw: sold vs cap and %, sales £ today and to date, forecast at close, time
left, paid vs postal; real-time; totals today/week/month vs plan; draws this week vs the maximum.

**Per-draw ticket ledger:** one line per entry: entry number, player ID (masked for Support), paid/postal,
quantity, price, VAT, payment method, **gateway transaction ID**, timestamp, status (paid, refunded, charged
back, void). Append-only; refunds/chargebacks arrive by webhook; **closing a draw freezes its ledger** and the
draw proof's entry-list hash comes from it; export CSV and PDF with totals (gross, VAT, fees, net, paid, free).

**Reconciliation (phase 10):** daily, ledger vs gateway settlements/payouts by draw and day; mismatch queue
(missing, duplicate, amount difference, chargeback) for Finance; rolling reserve held and due-back dates.

**Business ledger (phase 10):** double-entry general ledger, posted automatically from every event (sales, VAT
payable, card/wallet fees, prize purchases, consignor payables, delivery, marketing entered by Finance, the
commission pool, rolling reserve, refunds, chargebacks). Reports: per-draw P&L, monthly P&L, VAT summary,
consignor statements, commission pool by month, cash position. Export CSV + the owner's accounting software
format (ask first). **Month-end close** locks the period; later changes need Owner approval and are logged.

**Also:** protection queue, postal entry logging (two-person), winner verification and delivery tracking,
player look-up (limits, breaks, suspensions), sales pace alerts (section 10), share export packs (section 8).

## 6. After payment: tickets, tracker, countdown (H-2B)
1. Signed webhook confirms payment → entries issued and written to the draw's ledger in **one transaction**.
2. **"You're in."** screen: draw, entry numbers, amount and method, monthly limit used, countdown,
   **View my tickets** and **Share**.
3. **Live tracker** on every draw page: sold vs max (bar + %), countdown to close **synced to server time**,
   live draw date/time. Updates in real time for all viewers (SSE/websockets, polling fallback). Counts only
   confirmed entries plus logged postal entries.
4. **My entries:** every draw entered, entry numbers, live sold count, countdown, then result and proof link.
5. **Receipt email** (VAT shown) and, if opted in, a push: "You're in. 3 entries in the … draw, drawn Tue 20:00."
6. **Cap reached:** "Sold out", buy button hidden. Postal handling: see Q1 in `docs/OWNER_TODO.md`.

## 7. Payments
- **Sandbox/test only** until the owner says otherwise. Live keys are added by the owner's developer in Vercel
  Production settings, never through the agent.
- Apple Pay on **every draw** (web + iOS), Google Pay (Android + web), cards with 3-D Secure, through a gateway
  that accepts this business type, behind a `PaymentProvider` interface. Apple domain verification file at
  `/.well-known/apple-developer-merchantid-domain-association`.
- Before the payment sheet opens: age verified, GB, spend and credit headroom checked, entries held. After the
  webhook: re-check the cap atomically, issue entries; if the cap filled, refund automatically.
- Store gateway transaction ID, funding type (debit/credit/prepaid/unknown) and wallet type on every payment.
- App store check before submission (Apple contests/sweepstakes rules, Google Play contest policy, Apple Pay vs
  in-app purchase). Flag anything unclear; do not guess.

## 8. Sharing (H-2F)
**Admin export pack** per draw, generated when scheduled, downloadable as a zip, re-generable any time (figures
taken live and time-stamped): 16:9 1920×1080 · 4:3 1440×1080 · 9:16 1080×1920 · 4:5 1080×1350 · 1:1 1080×1080 ·
link preview 1200×630. Templates per moment: **New draw**, **Closing soon** (true countdown only), **Sold out**,
**Live tonight**, **Winner** (written consent only). Small print "18+ · Free postal entry · T&Cs" on every image
inside platform safe zones. Editable ready-made captions for Instagram, TikTok and WhatsApp; "#ad" added
automatically on partner posts. Captions are solicitor placeholders until approved.

**Customer sharing:** "I'm in" image (prize photo, draw, countdown, link) from "You're in." and "My entries" via
the phone's share sheet, sized per platform; never shows spend or entry numbers. Winners get an opt-in
"Share my win" card after verification (prize, "Winner", draw date, proof link; first name and town only if they
choose). Links carry `ref` and UTM parameters, no personal data. Golden-image tests for every template × size.

## 9. The random draw (H-2D)
Commit-reveal that anyone can verify and no one, including staff, can influence. Plain-English method statement
in `docs/DRAW_METHOD.md` (for the solicitor, terms and an independent reviewer).
1. **At go-live** (and never later than 1 hour before close): generate a 32-byte server seed
   (`crypto.randomBytes`), store it encrypted (readable only by the draw engine), publish SHA-256(seed), and
   publish the **drand** round number due just after close.
2. **At close:** freeze the ledger (paid + valid postal entries); publish SHA-256 of the ordered entry-number
   list and the total count.
3. **Draw (live, 20:00 slot):** needs **two staff approvals**; wait for the committed drand round; compute
   `HMAC-SHA256(seed, drand randomness ‖ draw ID ‖ entry-list hash)`; map to a position 1..N by **rejection
   sampling** (no modulo bias); reserve winners in order by repeating with a counter.
4. **After:** reveal the seed; proof page with commitment, seed, drand round, entry-list hash, total, winning
   entry number (no personal details without consent), replay video, and a **"verify it yourself"** checker.
5. Can't run before close or with an unfrozen ledger; runs exactly once; re-run only by logged Owner override.
6. Pure, small module with tests for uniformity (statistical), reproducibility and edge cases (one entry,
   sold out, postal-only winner).
7. drand fallback: see Q3 in `docs/OWNER_TODO.md` (proposal awaiting owner and solicitor).

## 10. Sales pace alerts (H-2C)
The system suggests; a person decides. Defaults (editable): 72 h before close < 40% sold = early warning;
48 h < 55% = slow mover; 24 h < 70% = action needed; 6 h < 85% = final push; any time forecast below breakeven =
loss risk; selling much faster than forecast = good news / plan more stock. Alerts appear in the admin alert
panel and by email to the operations manager (WhatsApp/Slack later, ask first). Each shows the draw, % sold,
forecast, time left, breakeven and suggested actions: **notify opted-in players** (approved templates, eligible
players only, second-person approval), **social prompt** (from the export pack), **partner prompt** (car
draws). Never change a live draw. Log every alert, decision, approver and message.

## 11. Money
- Money as integer pence. Prices include 20% VAT; store VAT (1/6 of price) on every sale.
- **Consignor payout** = agreed price + **10% of net upside** (net upside = sales − VAT − card fees − agreed
  price, floor 0).
- **Draw profit** = sales − VAT − card fees − marketing − prize cost − consignor upside − delivery.
- **Commission pool:** 7.5% of each draw's profit (not sales), only when positive, pooled monthly; rate is a
  setting.
- Per-draw P&L shows sales, VAT, fees, marketing, prize cost, consignor upside, delivery, commission, profit and
  breakeven sell-through.

## 12. Architecture
- Next.js (App Router) + TypeScript on Vercel; PostgreSQL (Neon via Vercel) + Prisma; background/scheduled
  jobs (go-live, close, alerts, reconciliation); Redis (managed) for holds and rate limits.
- External services behind interfaces with fakes for tests: `PaymentProvider`, `AgeVerificationProvider`,
  `RandomnessBeacon` (drand), `EmailSender`, `PushSender`, `GeoIp`, `ShareRenderer`, `ObjectStorage`.
- Times stored in UTC, shown in UK time (Europe/London).
- Hosting in UK/EU region. WCAG 2.2 AA, 44 px touch targets, `prefers-reduced-motion` respected.

## 13. Working rules for the agent
- Follow `CLAUDE.md` for working with the owner (ACTION NEEDED blocks, plan before build, check-it lists).
- Write failing tests first. Every rule in section 4 needs tests, including concurrency tests.
- **Never write legal wording** (terms, draw rules, free-entry instructions, odds and age statements,
  responsible-play copy, privacy, share captions, message templates). Use `[[SOLICITOR: ...]]` placeholders and
  list each one in `docs/OWNER_TODO.md`.
- Never commit secrets. One task per pull request; never push to `main`; explain database changes in plain
  English in the PR. Run `npm test`, `npm run lint`, `npm run typecheck` before finishing.
- If any instruction (including the owner's) would break section 4, stop and flag it.

## 14. Build phases (one small, reviewed pull request per task)
1. **Foundation:** Next.js app, Innit theme and logo, player sign-up/log-in, **admin staff login with 2FA,
   roles and audit log**, database (Postgres via Prisma), automatic tests on every PR, `DEMO_MODE`.
2. **Admin: prize upload, scheduling and publishing** (section 5): New draw form, cap rule, approvals,
   calendar with weekly maximum and mix, automatic go-live, preview, locking at go-live.
3. **Ticketing, checkout and ticket ledger:** sandbox cards, Apple Pay, Google Pay, signed webhooks, ledger,
   "You're in.", real-time tracker with server-synced countdown, My entries, live sales monitor, receipts.
4. **Player protection:** age/ID, GB-only, limits incl. wallets, credit cap, breaks, self-suspension, queue.
5. **Free postal entries:** two-person logging.
6. **Draw engine and sales alerts:** commit-reveal draw with drand, proof page and verifier, reserve winners,
   live reveal, winner verification; sales pace alerts and approved player notifications.
7. **Front end:** home, draw page, live draws, winners, my entries, matching `docs/design/`.
8. **Sharing:** admin export packs and customer "I'm in" / "Share my win".
9. **Native apps:** iOS and Android; iOS needs a Mac, so tell the owner when we get here so their developer
   can join.
10. **Finance:** reconciliation, business ledger, P&L, VAT summary, consignor statements, commission pool,
    cash report, accountant export.
11. **Launch hardening:** marketing consent, load test, `/security-review`, list of every customer-facing page
    for the solicitor.

**Developer review before merging:** every task in phases 3, 4, 5, 6 and 10, and **all admin-panel work**
(it touches money or personal data). Remind the owner each time.

## 15. Planning constraints (not code)
Budget: set-up ≤ £35,000; core team ≤ £10,000/month. Knightsbridge Automotive (≈400,000 social followers)
will share headline car draws (with "#ad"); social accounts must be 18+ and UK-targeted.
