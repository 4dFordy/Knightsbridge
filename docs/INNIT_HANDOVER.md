# Handover to Claude Code: build the Innit platform

> Saved from the owner's message of 6 November 2026 (revision 2: replaces the first handover).
> Where this differs from anything else in the repository, **this handover wins**.

**Read all of this before doing anything.** This handover is your instruction from the owner. Where it differs
from anything already in the repository (`AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/`), **this handover wins**,
and your first job is to bring those files into line with it.

The repository is already connected to **GitHub** and **Vercel**. Every pull request gets a Vercel preview link.

---

## 0. How you work with me (most important section)

I am the owner, **not a developer**. You do the building. I help where only a person can. So:

1. **Ask me for what you need, in plain English.** Whenever you need something that only I can do (create an account, click something in a dashboard, add a setting, approve a plan, supply a fact or a decision), **stop and give me an "ACTION NEEDED" block** in exactly this format, then wait for my reply before carrying on:

   ```
   ACTION NEEDED (n of N): <short title>
   Why: <one sentence on why you need it>
   Where: <website or app, e.g. vercel.com → your project → Settings → Environment Variables>
   Steps:
     1. <click-by-click step>
     2. ...
   Reply with: <exactly what you want me to type back, e.g. "done", or the value's NAME but never a secret>
   ```

   - One action per block. Number them if there are several. Put them **at the start** of your message, not buried at the end.
   - Use the names of real buttons and menus. Never assume I know a technical term; explain it in a few words the first time.
   - If something can be done either by you or by me, **you do it**.

2. **Never ask me to paste secrets into chat** (passwords, API keys, card numbers, tokens). Instead, tell me where to add them myself (Vercel environment variables, or the Claude Code environment settings for **test** values) and what **name** to give them. Then I'll reply "added".

3. **Plan before you build.** At the start of every phase, show me a numbered plan of small tasks (each one I can check in about 30 minutes on the preview). Mark the tasks my developer must review. Wait for my "approved".

4. **After every task, give me:**
   - a plain-English summary of what changed;
   - **"How to check it"**: a short checklist I can follow on the Vercel preview link, on my phone and laptop;
   - **"What could go wrong"**, in one or two lines;
   - whether it needs **developer review** (anything touching money, personal data or the draw engine);
   - anything you need from me next, as ACTION NEEDED blocks.

5. **Keep a running checklist** in `docs/OWNER_TODO.md`, with everything you are waiting on me for, the date asked, and its status. Update it every session, and show me the open items at the start of each session.

6. **Be honest about limits.** If you're blocked, unsure, or something needs a human expert (solicitor, accountant, Apple/Google review, payment provider), say so plainly and tell me who to ask and what to ask them.

7. **Small, safe steps.** One task per pull request. Never push straight to `main`. Never change live/production settings. If tests fail, fix them before asking me to merge.

---

## 1. What we're building

**Innit**: an online prize-draw platform for adults (18+) in **Great Britain only**
(not Northern Ireland). People buy entries (£5–£30) to win luxury prizes: watches, cars, cash, holidays, designer bags and luxury items. Every draw has a **free postal entry route** with an equal chance. That is what makes it a legal prize draw rather than a lottery.

Three surfaces, one backend, plus the admin panel in section 2A:

- **Website** (Next.js on Vercel)
- **iPhone and Android apps** (same screens, Apple Pay / Google Pay)
- **Admin panel** (back office) for the team, with its own secure staff login: prize upload, draw builder, live ticket sales monitor, per-prize ticket ledger linked to the payment gateway, reconciliation, business ledger, player protection, postal entries, reports

Launch target: **1 April 2027**.

---

## 2. Current decisions (these override older files in the repo)

**Brand**

- One brand only: **Innit**. There is no "Option A / Knightsbridge Luxury Raffles" any more. Remove any two-brand switching or Option A/B references you find.
- Logo: lower-case Montserrat Black wordmark, gold dots on both i's, punched-ticket symbol. **No endorsement line.** Do not show "A part of Knightsbridge Luxury Group", the K emblem or any Knightsbridge branding anywhere in the product. Use the `innit-wordmark-*` files and the ticket symbol and app icon from `docs/brand/`. Do not use files that include the endorsement line (`innit-horizontal-*`, `innit-stacked-*`, `innit-nav-*`). Ask me if you need a logo version that doesn't exist. If the repo or reference screens show the endorsement or K emblem, ignore that part and flag it to me.
- Brand line: **"Gotta be innit to win it."** Campaign line: **"Be in it."**
- Voice: short, playful, British, straight about the chances ("You in?", "I'm in", "You're in.", "Not this time."). Never say: "change your life", "easy money", "guaranteed winner", or false urgency. Nothing that appeals to under-18s.
- Colours: navy `#262834`, night `#1E2029`, card `#30333F`, line `#3D404E`, champagne gold `#C9AE7C`, button gold `#D4BC8E`, pale gold `#E6D5AF`, ivory `#F7F3EA`, muted `#A3A6B2`, urgent `#F2A08C`. Gold-led look.
- Fonts: Montserrat (headlines, Black weight) and DM Sans (body, prices, countdowns).
- Reference screens are in `docs/design/` (website: home, draw, checkout, winners; app: home, draw, "You're in", entries, live, limits; back office: dashboard, draw builder, protection). Logos are in `docs/brand/`. Match them.

**Draw volume and mix**

- **Maximum 10 draws a week**, enforced by the back office as a configurable setting (default 10).
- Mix at 10 a week: 3 watches, 1.5 cars, 2.5 cash, 1 holiday, 1 bag, 1 luxury misc. Cars and cash alternate week to week (week A: 2 cars + 2 cash; week B: 1 car + 3 cash).
- Launch month (April 2027): 5 a week. From May 2027: 10 a week.
- If six-week average sell-through falls below 70%, the team runs 8 a week. This is an operations choice; the system only needs the setting.

**Draw rules (must be enforced in code)**

- Max entries = prize cost × cap multiple ÷ entry price. Cap multiple defaults to **2.2×** and can **never be below 2.0×**.
- Once published, a draw's price, cap, close time and prize are **locked**. No cancelling, extending or shrinking.
- Every draw shows: entry cap, odds, close time, free postal entry route, 18+, before any payment.
- Postal entries: logged in the back office with a **two-person check**, same draw, same odds, same per-person limit.
- Draws run live three nights a week (Tue, Thu, Sun 20:00). The seed is published before the draw, and the result page shows proof (seed, entry-list hash, replay).
- The winner is verified (age, identity, GB location, not suspended) before being announced.

**Player protection (DCMS Voluntary Code of Good Practice for Prize Draw Operators)**

- Age verification (18+) before the first entry. GB-only location checks.
- Monthly spend limit per player (player can set it, including £0). Lowering takes effect instantly; raising takes 24 hours.
- Credit cards capped at **£250 a month** per player. Wallets (Apple Pay / Google Pay) count towards all limits.
- Take a break (24 hours to 6 weeks) and self-suspend (6 months minimum, can't be undone early). No marketing to anyone on a break, suspended or at their limit.
- Protection queue in the back office with risk signals (e.g. spend up 3× in a week, limit raised twice in a month).

**Money**

- 20% VAT is treated as included in the entry price (HMRC's current position).
- Team commission: **7.5% of each draw's profit** (not of sales) goes into a monthly pool.
- Consignors (cars mainly from Knightsbridge Automotive): paid the agreed price plus **10% of the draw's net upside**.
- The back office calculates per-draw P&L: sales, VAT, card fees, marketing allocation, prize cost, consignor upside, delivery, commission, draw profit, breakeven sell-through.

**Payments and sharing**

- Apple Pay on every draw (web and iOS), Google Pay on Android and web, and cards with 3-D Secure. **Sandbox/test mode only** until I tell you otherwise.
- Sharing to Instagram Stories, posts, TikTok and WhatsApp, with images generated per format (1080×1920, 1080×1350/1080×1080, 1200×630 link preview). Sharing is never automatic and never rewarded.

**Demo data**

- `DEMO_MODE=true` on previews: sample draws, prize photos from `public/prizes/`, any fake activity clearly labelled "demo". Never fake live activity when demo mode is off.

---

## 2A. Admin panel and team login (required, build it alongside the site)

The team runs the whole business from a secure **admin panel** at `/admin`. It is separate from player accounts.

**Staff login and security**

- Separate staff accounts. **Two-factor authentication is mandatory.** No shared logins.
- Roles:
  - **Owner:** everything.
  - **Operations:** prizes and draws.
  - **Finance:** ledgers and payouts.
  - **Compliance:** protection and postal entries.
  - **Support:** read-only player view.
- Session timeout, and an **audit log** of every admin action (who, what, when, before and after). The audit log cannot be edited or deleted.
- I am the first Owner. Give me ACTION NEEDED steps to set up my login and 2FA. I'll invite the others from the panel.

**Prizes: upload and manage**

- Create a prize with:
  - title and description;
  - category, brand, model and reference;
  - photos (drag and drop, multiple, reordered by dragging);
  - prize cost and evidence of value;
  - cash alternative;
  - source (owned stock, or consigned, with the consignor and agreed price);
  - authentication certificate upload;
  - delivery notes.
- Turn a prize into a draw: entry price, cap multiple (2.2× default, minimum 2.0×), calculated max entries, open and close times, live draw slot.
- Pre-publish checklist (certificates, photos, solicitor wording, second sign-off). **Publish locks the draw.**

**Live ticket sales monitor**

- Dashboard showing every live draw:
  - entries sold against the cap, and percentage sold;
  - sales £ today and to date;
  - forecast at close;
  - time left;
  - paid vs free postal entries.
- It updates in real time from the payment gateway.
- Totals for today, this week and this month, against plan. The weekly count of draws is shown against the 10-a-week maximum.

**Prize-by-prize ticket ledger**

Each draw has its own ledger listing **every entry**:

- entry number;
- player ID (masked for Support);
- entry type (paid or postal);
- quantity;
- price;
- VAT;
- payment method (Apple Pay, Google Pay or card);
- **payment gateway transaction ID**;
- timestamp;
- status: paid, refunded, charged back or void.

Ledger rules:

- **Append-only:** a correction is a new reversing line, never an edit or delete.
- **Every paid entry must match a confirmed gateway payment**, received by signed webhook and re-checked against the gateway's API. Entries are only issued after payment is confirmed. They are never issued on a client-side success message.
- **Refunds and chargebacks** arrive by webhook and appear automatically.
- **Closing a draw freezes its ledger.** The entry list hash used for the draw proof is computed from this ledger.
- **Export** each ledger to CSV and PDF, with summary totals: gross sales, VAT, fees, net, entries paid and entries free.

**Payment gateway reconciliation**

- **Daily automatic reconciliation:** ledger totals against the gateway's settlement and payout reports, by draw and by day.
- **Mismatch alerts:** any mismatch (missing payment, duplicate, amount difference, chargeback) is flagged in a reconciliation queue for Finance to resolve.
- **Rolling reserve:** shows the amount the gateway is holding and when it is due back.

**Business ledger (the company's books)**

- A double-entry general ledger the platform posts to automatically from every event:
  - ticket sales;
  - VAT payable;
  - card and wallet fees;
  - prize purchases;
  - consignor payables (agreed price plus 10% of upside);
  - delivery costs;
  - marketing (entered by Finance);
  - the 7.5% commission pool;
  - rolling reserve held by the gateway;
  - refunds and chargebacks.
- **Reports:**
  - per-draw profit and loss;
  - monthly P&L;
  - VAT summary for the quarterly return;
  - consignor statements;
  - commission pool by month;
  - cash position.
- **Export** to CSV and Xero-compatible format for the accountant. Ask me which accounting software we use before building the export.
- **Month-end close** locks the period. Changes after close need Owner approval and are logged.

**Also in the admin panel**

- **Player protection queue.**
- **Postal entry logging:** two-person check.
- **Winner verification and prize delivery tracking.**
- **Player look-up:** support view, with limits, breaks and suspensions.

**Build order for admin**

- **Phase 1:** staff login with 2FA, roles and the audit log.
- **Phase 2:** prize upload and draw builder.
- **Phase 3:** live sales monitor, per-draw ticket ledger and gateway webhooks.
- **Phase 10:** reconciliation, business ledger and reports.

All admin work touches money or personal data, so it needs developer review.

---

## 2B. After a successful payment: tickets, tracker and countdown

The flow is the same on the website and in the app.

1. **Payment confirmed.** The gateway's signed webhook confirms it, never the browser alone. The system issues the entries and writes them to the prize-by-prize ledger (section 2A) in one transaction. Entry numbers must be unique, with no double-issuing if the webhook arrives twice.
2. **"You're in." screen.** It shows:
   - the draw;
   - the customer's entry numbers;
   - amount paid and payment method;
   - how much of their monthly limit is used;
   - the countdown to the draw;
   - buttons for **View my tickets** and **Share**.
3. **Live tracker on the draw page** (web and app) shows:
   - entries sold against the maximum, as a progress bar and percentage;
   - a **countdown timer** to close, synced to server time so it can't be faked by changing a device clock;
   - the live draw date and time.

   The sold count updates in **real time** for everyone viewing (server-sent events or websockets, with polling as a fallback). It counts only confirmed entries, and postal entries are included once logged.
4. **"My entries" tracker** (web and app): every draw the customer has entered, with their entry numbers, the live sold count, the countdown, and then the result and proof link once drawn.
5. **Confirmation:** an email receipt (VAT shown) and, if they've opted in, a push notification: "You're in. 3 entries in the Lamborghini Revuelto draw, drawn Tue 20:00."
6. **When the cap is reached:** the draw shows "Sold out", the buy button disappears, and postal entries received before close are still added.

In `DEMO_MODE` the tracker can run on sample data, clearly labelled "demo". With demo mode off it must only ever show real numbers.

---

## 2C. Sales pace alerts for Innit management

The system watches every live draw and **alerts the Innit team** when one is moving slowly, so they can act in time. It **suggests**; **a person decides**. Nothing goes to players without a team member approving it.

**Triggers.** Make the thresholds editable in admin. These are the defaults:

| Time before close | Alert if sold is below | Alert type |
|---|---|---|
| 72 hours | 40% | Early warning |
| 48 hours | 55% | Slow mover |
| 24 hours | 70% | Action needed |
| 6 hours | 85% | Final push |
| Any time | Forecast at close below breakeven sell-through (from the draw builder) | Loss risk |
| Any time | Selling much faster than forecast (likely to sell out early) | Good news / plan more stock |

**Where the alerts go.** The admin dashboard alert panel, plus email to the operations manager. Later, optionally, WhatsApp or Slack: ask me which before building it. Each alert shows:
- the draw;
- percentage sold and forecast at close;
- time left;
- the breakeven point;
- **suggested actions**.

**Suggested actions** (one click to prepare, a second person approves before sending):

- **Notify opted-in players.** Send a push notification or email from approved templates, for example "The Rolex Daytona draw closes tonight at 20:00. 18% of entries left." Only to players who have:
  - opted in to marketing;
  - not entered that draw (or entered it but chosen reminders);
  - are not on a break, suspended or at their limit.
- **Social prompt.** A ready-made story or post in the right size, created by the sharing tool in section 6 of the brief, for the content lead to post.
- **Partner prompt.** A note to ask Knightsbridge Automotive for a collab post (car draws).

**Hard rules**

- Never change a published draw's price, cap, close time or prize.
- Message wording must be true at the moment it's sent, and no fake urgency. Every message carries 18+ and the free-entry line.
- Frequency caps per player: at most 1 marketing push a day and 3 a week, configurable.
- Log every alert, decision, approver and message sent in the audit log.

---

## 2D. The random draw: how winners are picked and proved fair

Use a **commit-reveal** draw that anyone can verify and that nobody, including Innit staff, can influence.

**Before the draw (at least 1 hour before close)**

1. Generate a secret **server seed** with a cryptographically secure generator (Node `crypto.randomBytes(32)`). Store it encrypted. Only the draw engine can read it.
2. Publish the **seed commitment**, SHA-256(server seed), on the draw page and the proof page.
3. Pre-commit to an **external public randomness value** that doesn't exist yet: the **drand** public randomness beacon round due just after close. Publish the round number in advance. This means Innit can't choose a convenient outcome either.

**At close**

4. **Freeze the entries.** Lock the ticket ledger: paid entries plus valid postal entries, each with its entry number.
5. **Publish the entry-list hash:** SHA-256 of the ordered list of entry numbers, plus the total count.

**The draw (run live at 20:00, on stream)**

6. Wait until the pre-committed drand round is published, then fetch its randomness.
7. Compute `HMAC-SHA256(server seed, drand randomness + draw ID + entry-list hash)`.
8. Turn that number into a winning position from 1 to the total number of entries, using **rejection sampling** (no modulo bias), then map it to the entry number.
9. Pick **reserve winners in order** by repeating step 7 with a counter, in case the first winner fails verification or doesn't respond in time. This is defined in the terms.

**After the draw**

10. **Reveal the server seed** on the proof page.
11. Publish the **proof page**:
    - seed commitment, revealed seed and drand round;
    - entry-list hash and total entries;
    - the winning entry number (no personal details until the winner consents);
    - the replay video;
    - a **"verify it yourself"** tool, a small open-source script or in-browser checker that recomputes the result from the published values.
12. **Verify the winner:** age, identity, GB location, not suspended. The confirmation call happens before the public announcement.

**Controls**

- The draw can't run before close or with an unfrozen ledger. Running it needs **two staff approvals**. Each draw is run exactly once; a re-run is impossible without an Owner override, which is logged.
- **Automated tests** for:
  - uniformity, with a statistical test over many simulated draws;
  - reproducibility;
  - edge cases: one entry, a sold-out draw, postal-only winners.
- Write a one-page **method statement** in `docs/DRAW_METHOD.md` in plain English for the solicitor and the terms. Before launch, I'll get the method independently reviewed. Tell me when it's ready and what to ask the reviewer.
- If drand is unavailable at draw time, there's a documented fallback set out in the terms, for example the next available round. Tell me the fallback you propose.

---

## 2E. How a manager uploads, schedules and publishes a prize

Build this as one guided form in the admin panel, **New draw**, with a live preview of exactly how it will look on the website and in the app.

**What the manager enters**

| Field | Details |
|---|---|
| **Images** | Drag and drop several photos, reorder them, and pick the cover. JPG/PNG/WebP/HEIC accepted and auto-converted. The system makes web and app sizes and warns if an image is too small or blurry. |
| **Prize title, category and description** | Category is one of: watches, cars, cash, holidays, bags, luxury misc. |
| **Prize value** | The retail value shown to customers, with an evidence upload (invoice, valuation or dealer quote). |
| **Prize cost** | What Innit pays, or the agreed consignor price. It stays internal and drives the economics. |
| **Cash alternative value** | Shown on the draw page. Warn if it's outside 80–90% of the prize value. |
| **Entry price** | £5–£30. |
| **Number of tickets (maximum entries)** | The manager types a number, or presses "Use 2.2×" to fill it automatically. The form shows the resulting cap multiple and **blocks anything below 2.0× prize cost**. It also shows breakeven sell-through and profit at 70%, 80% and 100% sold. |
| **Opens (date and time)** | When the draw goes live on the website and app. |
| **Closes (date and time)** | The deadline. It must fall on a live draw night (Tue, Thu or Sun 20:00 by default; editable in settings). |
| **Live draw slot** | Filled in automatically from the close time. |
| **Source** | Owned stock, or consigned: pick the consignor, and the agreed price and 10% upside are recorded. |
| **Certificates and checks** | Authentication, value evidence, solicitor-approved wording, photos approved. |

**Statuses:** Draft → Ready for review → Approved (second person) → **Scheduled** → Live → Closed → Drawn → Delivered.

- A draft can be edited freely.
- **Scheduled** draws can still be edited until they go live; every edit is logged and needs re-approval.
- **At the moment it goes live, the draw locks:** price, ticket cap, close time and prize can't change. That's a legal requirement.

**Scheduling a month ahead**

- A **calendar view** of the next 4–8 weeks showing every scheduled draw by category, with open and close times and draw nights.
- The calendar **enforces the 10-draws-a-week maximum**, and shows the category mix against the target (3 watches, 1.5 cars, 2.5 cash, 1 holiday, 1 bag, 1 misc) so gaps are obvious.
- **It goes live automatically at the scheduled time** on the website and the app together (same API, same moment). It also queues the "new draws" email and push for opted-in players, and generates the share pack (below).
- If anything is missing at go-live time (an unapproved check, a broken image), the draw **doesn't go live**. Instead the operations manager gets an alert.
- **Duplicate draw:** reuse a past draw as a template, for example the same watch model next month.
- Before scheduling, the manager can **preview** the draw card, draw page and app screen exactly as customers will see them.

---

## 2F. Share images: team exports and customer sharing

**Back office: export pack for every draw (generated automatically when a draw is scheduled, downloadable as a zip)**

| Format | Size | Use |
|---|---|---|
| **16:9 landscape** | 1920×1080 | YouTube, X, website banners, WhatsApp link images, screens |
| **4:3** | 1440×1080 | Facebook and Instagram feed alternatives, presentations, WhatsApp |
| 9:16 vertical | 1080×1920 | Instagram Stories and Reels, TikTok, WhatsApp Status |
| 4:5 portrait | 1080×1350 | Instagram feed |
| 1:1 square | 1080×1080 | Instagram, Facebook, WhatsApp |
| Link preview | 1200×630 | Website and WhatsApp link previews |

- **Standard templates in the Innit brand**, one set per moment:
  - **New draw:** prize photo, title, entry price, "Gotta be innit to win it."
  - **Closing soon:** true countdown only.
  - **Sold out.**
  - **Live tonight.**
  - **Winner:** only with the winner's written consent.
- **Mandatory small print**, drawn automatically on every image: 18+ · Free postal entry · T&Cs. The text sits inside each platform's safe zones, so Instagram and TikTok buttons don't cover it.
- **Ready-made captions** for Instagram, TikTok and WhatsApp, written in the brand voice, with #ad added automatically for partner posts. The team can edit them before downloading.
- Managers can re-generate the images at any time. The figures on them (percentage sold, time left) are taken live when generated, and the image is time-stamped.

**Website and app: customer sharing**

- **After entering** ("You're in." screen and "My entries"), a **Share** button opens the phone's share sheet. Instagram Stories, TikTok and WhatsApp get the right size automatically. The image reads "I'm in", with the prize photo, the draw, the countdown and a link to the draw page.
  - It never shows how much the customer spent or their entry numbers.
- **If they win:** after verification, the winner sees a **"Share my win"** card, on an opt-in basis. It shows the prize, "Winner", the draw date and a link to the proof page. Their first name and town appear only if they choose.
- Sharing is **never rewarded** (no free entries or discounts for sharing) and never automatic.
- Shared links carry tracking parameters so the team can see which shares bring in new players, without sharing anyone's personal data.

---

## 3. What to do first (session 1)

1. **Read** `AGENTS.md`, `CLAUDE.md`, `README.md` and list `docs/`. Tell me in 10 bullet points what's there and what's out of date compared with section 2 above.
2. **Update the brief:** propose edits so `AGENTS.md` and `CLAUDE.md` match this handover (single Innit brand, 10-a-week maximum, the rules above). Make sure `CLAUDE.md` contains section 0 of this handover. Open it as a pull request for me to merge.
3. **Check the Vercel connection:** confirm that pull requests get a preview link. If not, give me ACTION NEEDED steps.
4. **Create `docs/OWNER_TODO.md`** with everything you will need from me over the whole build, grouped by phase. For example:
   - test database (Neon via the Vercel integration);
   - payment provider sandbox account;
   - age/ID verification provider sandbox;
   - Apple Developer account and Merchant ID;
   - Google Play Console;
   - domain;
   - solicitor-approved legal wording;
   - a developer for reviews;
   - which accounting software we use (for the ledger export);
   - where sales alerts should go besides email (WhatsApp or Slack);
   - the independent reviewer for the draw method;
   - the names and emails of the team who need admin logins, and their roles.
5. **Propose the plan for phase 1** and wait for my approval.

---

## 4. Build phases (one small, reviewed pull request per task)

1. **Foundation:** Next.js app, Innit theme and logo, player sign-up/log-in, **admin staff login with 2FA, roles and audit log**, database (Postgres via Prisma), automatic tests on every PR, `DEMO_MODE`.
2. **Admin: prize upload, scheduling and publishing (section 2E):** guided New draw form with images, prize value, cost, cash alternative, ticket count, open and close times; the 2.2× cap rule (min 2.0×); approval workflow; a month-ahead calendar enforcing the 10-a-week maximum and category mix; automatic go-live to web and app together; preview; locking at go-live.
3. **Ticketing, checkout and the ticket ledger:** sandbox cards, Apple Pay, Google Pay, signed payment webhooks, entries issued only on confirmed payment, the per-prize ticket ledger, the "You're in." screen, the real-time sold tracker with server-synced countdown (web and app), "My entries", the live sales monitor, VAT on receipts, receipt email (section 2B).
4. **Player protection:** age/ID checks, GB-only, spend limits including wallets, credit-card cap, breaks, self-suspension, protection queue.
5. **Free postal entries:** back-office logging with two-person sign-off.
6. **Draw engine and sales alerts:** commit-reveal random draw with drand (section 2D), proof page and verifier, reserve winners, live reveal, winner verification; sales pace alerts and approved player notifications (section 2C).
7. **Front end:** home, draw page, live draws, winners, my entries, matching `docs/design/`.
8. **Sharing (section 2F):** back-office export packs in 16:9, 4:3, 9:16, 4:5, 1:1 and link-preview sizes with standard Innit templates and captions for Instagram, TikTok and WhatsApp; customer "I'm in" and "Share my win" sharing on web and app.
9. **Native apps:** iOS and Android around the same screens, with Apple Pay and Google Pay. iOS builds need a Mac; tell me when we reach this so my developer can join.
10. **Finance: reconciliation and business ledger:** daily gateway reconciliation and mismatch queue, double-entry business ledger, per-draw and monthly P&L, VAT summary, consignor statements and payouts, 7.5% commission pool, cash report, accountant export.
11. **Launch hardening:** marketing consent, load test, security review (`/security-review`), and a list of every customer-facing page for the solicitor.

**Phases 3, 4, 5, 6 and 10 handle money, personal data or the draw.** Every change in them needs my developer's review before I merge. Remind me each time.

---

## 5. Safety rules (never break these)

- Test/sandbox keys only. Live keys are added by my developer directly in Vercel's **Production** settings, never through you.
- Never put secrets in code, commits, logs or chat.
- Legal wording (terms, draw rules, free-entry instructions, odds and age statements, share captions) comes from the solicitor. Use clearly marked placeholders like `[[SOLICITOR: free entry wording]]` until it arrives, and list them in `docs/OWNER_TODO.md`.
- Don't change production settings, DNS, billing or live payment configuration.
- Don't add tracking, marketing emails or push notifications without consent flows.
- If any instruction (including mine) would break the draw rules or player protection above, stop and flag it.

---

## 6. Your first reply to me

Start your first reply with any ACTION NEEDED blocks you already know you'll need for session 1. Then give your 10-point summary of the repository (step 1 in section 3) and your proposed edits to the brief (step 2).
