# Owner to-do list

Everything Claude is waiting on the owner for. Claude updates this every session and shows the open items first.
**Never paste secrets in chat**: add them where the item says, then reply with the setting's *name* and "added".

Status key: **OPEN** (needed now) · **LATER** (needed when we reach that phase) · **DONE**

---

## Now (session 1)

| # | Item | Why | Asked | Status |
|---|---|---|---|---|
| 1 | Connect Vercel to the GitHub repo | Preview links on every pull request | 2026-11-06 | DONE: project `innit` in the bin-yousef team, London region, previews need a Vercel login |
| 2 | Review and merge pull requests #1 and #2 | Brief and app skeleton | 2026-11-06 | DONE |
| 3 | Logo files | Supplied as the logo specification in the brand book; the logo is built in code from it | 2026-11-06 | DONE. Optional: the designer's PNG logo pack, for comparison |
| 4 | Upload the reference screens (website: home, draw, checkout, winners; app: home, draw, "You're in", entries, live, limits; admin: dashboard, draw builder, protection) | The handover says they're in `docs/design/`; only two early home drafts are there | 2026-11-06 | OPEN |
| 5 | **Find a developer to review** money / personal-data / draw / admin changes (none yet) | Needed before merging task 1.4 onwards; see "Finding a reviewer" below | 2026-11-06 | OPEN. Note: pull request #5 (database and audit log) was merged before review; ask the developer to review it after the fact. |
| 6 | Answer questions Q1–Q2 below | Q1 is a rule conflict; Q2 affects the draw-night timetable | 2026-11-06 | DONE |

## Questions and rule conflicts (Claude flagged these)

| # | Question | Claude's recommendation | Asked | Status |
|---|---|---|---|---|
| **Q1** | **Postal entries after "Sold out".** Handover 2B says postal entries received before close are still added after the cap is reached. But the cap is locked and published, and the odds statement depends on it. Adding entries beyond the cap would break the published maximum and the odds. | Hold back a small **postal reserve** inside the cap (e.g. 2%). Paid sales show "Sold out" at cap minus reserve; postal entries use the reserve; the published maximum is never exceeded. Solicitor to confirm the reserve and the terms wording. | 2026-11-06 | **Owner (2026-11-06): \"specify online draw deadline\".** Claude's reading: no postal reserve; postal entries must arrive by the same deadline as online entries (the draw's close time), shown on every draw page; they count towards the cap, and once the cap is full no more entries of either kind are accepted. DONE: confirmed by owner 2026-11-06; solicitor to approve the terms wording. |
| **Q2** | **Close vs draw time.** Draws close at 20:00 and are drawn live at 20:00. The ledger must freeze and the drand round must arrive after close, so the reveal can't be at exactly 20:00. | Close at **20:00**; stream starts at 20:00 showing the freeze and entry-list hash; drand round due ~1 minute after close; two staff approve; winner revealed about **20:05**. | 2026-11-06 | DONE: agreed by owner 2026-11-06 |
| Q3 | **drand fallback** if the beacon is unavailable at draw time. | Fetch the committed round from several public drand mirrors. If the round is late, wait for it (published rounds can't change). If the drand network has halted and never produces that round, use the **first round produced after it**; the draw is delayed, never re-chosen. If drand is down for more than 48 hours, use a named backup beacon set out in the terms. Solicitor and independent reviewer to approve. | 2026-11-06 | LATER (phase 6) |
| Q4 | **Per-person entry limit per draw**: the most entries one person can have in a single draw (paid + postal). | You decide; the handover says postal and paid share the same limit, but no number is set. | 2026-11-06 | LATER (phase 3) |
| Q5 | **Launch-month mix at 5 draws a week** (April 2027): which categories, and do cars run? | You decide. | 2026-11-06 | LATER (phase 2) |
| Q6 | **Default monthly spend limit for new players**, and the **highest limit** a player can raise to. | You decide (with the solicitor, under the DCMS code). | 2026-11-06 | LATER (phase 4) |
| Q7 | **Brand book shows the endorsement line and K emblem**, which the handover now removes. | Fixed in the new brand book with the logo spec. | 2026-11-06 | DONE |
| Q8 | **Logo spec vs handover:** the handover said not to use `innit-horizontal/stacked/nav` files because they carried the endorsement line. The logo spec's versions don't, and it names `innit-nav` as the website header logo. | Use them as the spec says (done in task 1.2). | 2026-11-06 | DONE: confirmed by owner 2026-11-06 |

## Finding a reviewer (item 5)

You don't have a developer yet. Every task that touches money, personal data, the draw or the admin panel
(Phase 1 tasks 4–7, and phases 2–6 and 10) should be checked by one before you merge it. Options:
- A **freelance senior developer** for a few hours per phase, reviewing pull requests on GitHub
  (e.g. via a UK agency, Toptal, or a recommendation). Ask for experience with **Next.js, PostgreSQL and payments**.
- Your payment provider or accountant may know someone who has worked on UK prize-draw or e-commerce platforms.
- Before launch you'll also need an independent **security review / penetration test** (Phase 11).

Until then Claude keeps building, labels every pull request that needs review, and you can leave those unmerged.

## Phase 1: Foundation

| # | Item | Status |
|---|---|---|
| 1.1 | Test database: **Neon** (Postgres) added to the Vercel project | DONE 2026-11-06 |
| 1.2 | `DEMO_MODE=true` for **Preview** only in Vercel | DONE by Claude (task 1.3) |
| 1.3 | Your email address for the first **Owner** admin login, and an authenticator app on your phone (Google Authenticator, Microsoft Authenticator or 1Password) | LATER |
| 1.4 | Names, emails and roles (Operations, Finance, Compliance, Support) of team members who need admin logins. You'll invite them yourself from the panel | LATER |

## Phase 2: Admin, prizes and scheduling

| # | Item | Status |
|---|---|---|
| 2.1 | File storage for prize photos and certificates (Vercel Blob, added in Vercel → Storage; Claude will send steps) | LATER |
| 2.2 | The operations manager's email for go-live and sales alerts | LATER |

## Phase 3: Ticketing, checkout and ticket ledger

| # | Item | Status |
|---|---|---|
| 3.1 | **Payment gateway sandbox account** (e.g. Stripe, Adyen, Checkout.com). First **ask the provider in writing whether they accept UK prize draws with a free postal entry route**, and what rolling reserve they'd hold. Some treat this business type as restricted | LATER |
| 3.2 | Email sending account for receipts, alerts, **email address confirmation and "forgot password"** (e.g. Resend or Postmark) | LATER |
| 3.3 | Redis for entry holds (Upstash, via the Vercel Marketplace) | LATER |
| 3.4 | Accountant to confirm VAT treatment: 20% included in the entry price (1/6 of each sale) | LATER |

## Phase 4: Player protection

| # | Item | Status |
|---|---|---|
| 4.1 | **Age/ID verification provider sandbox** (e.g. Yoti, Onfido, GBG, Veriff) | LATER |
| 4.2 | Support services to signpost (e.g. GamCare, BeGambleAware, StepChange); solicitor approves wording | LATER |

## Phase 5: Free postal entries

| # | Item | Status |
|---|---|---|
| 5.1 | The postal address entries are sent to | LATER |
| 5.2 | Which staff log and which check postal entries (two-person sign-off) | LATER |

## Phase 6: Draw engine and sales alerts

| # | Item | Status |
|---|---|---|
| 6.1 | **Independent reviewer** for the draw method (`docs/DRAW_METHOD.md`). Claude will tell you what to ask them | LATER |
| 6.2 | Where sales alerts go besides email: **WhatsApp or Slack** (or neither) | LATER |
| 6.3 | Streaming setup for the live draw (YouTube / Instagram Live / TikTok Live) and who runs it | LATER |

## Phase 8: Sharing

| # | Item | Status |
|---|---|---|
| 8.1 | Meta (Facebook) developer account and **Meta App ID** for Instagram Stories sharing | LATER |
| 8.2 | TikTok for Developers account (Share Kit) | LATER |

## Phase 9: Native apps

| # | Item | Status |
|---|---|---|
| 9.1 | **Apple Developer Program** account as an organisation (needs a D-U-N-S number; can take ~2 weeks, so start early) | LATER |
| 9.2 | Apple **Merchant ID** and Apple Pay certificate (Claude will send steps) | LATER |
| 9.3 | **Google Play Console** account (organisation) | LATER |
| 9.4 | A Mac and your developer for iOS builds | LATER |
| 9.5 | Check Apple and Google rules on contests and sweepstakes, and that Apple Pay (not in-app purchase) is allowed for entries | LATER |

## Phase 10: Finance

| # | Item | Status |
|---|---|---|
| 10.1 | **Which accounting software** you use (Xero, QuickBooks, Sage, other) | LATER |
| 10.2 | Accountant to confirm the chart of accounts for the business ledger | LATER |

## Launch / brand

| # | Item | Status |
|---|---|---|
| L00 | **Separate live database.** Neon is currently connected to Preview *and* Production, so both share one test database. Before launch, your developer creates a separate production database (London region) and connects it to Production only. Builds never change the production database automatically. | LATER (developer) |
| L0 | Upgrade Vercel to the **Pro** plan before launch (the free Hobby plan is for non-commercial use only) | LATER |
| L1 | UK IPO trademark search: "Innit", the logo and the brand line | LATER |
| L2 | **Domains**: .co.uk and .com | LATER |
| L3 | Instagram and TikTok handles (18+, UK-targeted accounts) | LATER |
| L4 | Two launch ads tested with UK adults for two weeks before go-live | LATER |

## Solicitor wording (placeholders in the code until supplied)

Claude uses `[[SOLICITOR: ...]]` placeholders. Each one is listed here when added to the code.

| Placeholder | Where it appears | Status |
|---|---|---|
| `[[SOLICITOR: brand line approval]]` "Gotta be innit to win it." | Everywhere | LATER |
| `[[SOLICITOR: free entry wording]]` | Every draw page, footer, share images | LATER |
| `[[SOLICITOR: terms and draw rules]]` (incl. reserve winners, postal reserve, drand fallback) | Terms page, app | LATER |
| `[[SOLICITOR: odds statement]]` | Every draw page | LATER |
| `[[SOLICITOR: 18+ statement]]` | Sign-up, draw pages, ads | LATER |
| `[[SOLICITOR: privacy notice]]` | Sign-up, footer | LATER |
| `[[SOLICITOR: sign-up 18+ and Great Britain confirmation]]` | Tick box on the Get in (sign-up) form | LATER |
| `[[SOLICITOR: responsible play copy]]` | Limits, breaks, support pages | LATER |
| `[[SOLICITOR: share captions]]` | Export packs, customer sharing | LATER |
| `[[SOLICITOR: player message templates]]` (reminders, "new draws", sales-alert notifications) | Email and push | LATER |
| `[[SOLICITOR: app store official rules / Apple not a sponsor]]` | iOS and Android apps | LATER |
| `[[SOLICITOR: draw method statement review]]` | `docs/DRAW_METHOD.md`, proof page | LATER |
