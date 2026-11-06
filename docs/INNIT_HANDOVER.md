# Handover to Claude Code: build the Innit platform

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

**Innit, a part of Knightsbridge Luxury Group**: an online prize-draw platform for adults (18+) in **Great Britain only**
(not Northern Ireland). People buy entries (£5–£30) to win luxury prizes: watches, cars, cash, holidays, designer bags and luxury items. Every draw has a **free postal entry route** with an equal chance. That is what makes it a legal prize draw rather than a lottery.

Three surfaces, one backend:

- **Website** (Next.js on Vercel)
- **iPhone and Android apps** (same screens, Apple Pay / Google Pay)
- **Back office** for the team: draw builder, live draw desk, player protection, postal entries, draw P&L, consignors, reports

Launch target: **1 April 2027**.

---

## 2. Current decisions (these override older files in the repo)

**Brand**

- One brand only: **Innit**. There is no "Option A / Knightsbridge Luxury Raffles" any more. Remove any two-brand switching or Option A/B references you find.
- Logo: lower-case Montserrat Black wordmark, gold dots on both i's, punched-ticket symbol. Endorsement line **"A part of Knightsbridge Luxury Group"** at one-sixth of the wordmark height, with the small K emblem.
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
   - a developer for reviews.
5. **Propose the plan for phase 1** and wait for my approval.

---

## 4. Build phases (one small, reviewed pull request per task)

1. **Foundation:** Next.js app, Innit theme and logo, sign-up/log-in, database (Postgres via Prisma), automatic tests on every PR, `DEMO_MODE`.
2. **Catalogue and draw builder:** prizes, consignors, the 2.2× cap rule (min 2.0×), the 10-a-week maximum, locking on publish.
3. **Ticketing and checkout:** sandbox cards, Apple Pay, Google Pay, VAT on receipts, receipt email.
4. **Player protection:** age/ID checks, GB-only, spend limits including wallets, credit-card cap, breaks, self-suspension, protection queue.
5. **Free postal entries:** back-office logging with two-person sign-off.
6. **Draw engine:** close, seeded random draw, proof page, live reveal, winner verification.
7. **Front end:** home, draw page, live draws, winners, my entries, matching `docs/design/`.
8. **Sharing:** share sheet and per-platform images.
9. **Native apps:** iOS and Android around the same screens, with Apple Pay and Google Pay. iOS builds need a Mac; tell me when we reach this so my developer can join.
10. **Back office finance:** per-draw P&L, consignor payouts, 7.5% commission pool, monthly cash report.
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
