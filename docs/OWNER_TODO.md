# Owner to-do list

Everything Claude is waiting on the owner for. Claude updates this every session and shows the open items first.
**Never paste secrets in chat**: add them where the item says, then reply with the setting's *name* and "added".

Status key: **OPEN** (needed now) · **LATER** (needed when we reach that phase) · **DONE**

---

## Now (session 1)

| # | Item | Why | Asked | Status |
|---|---|---|---|---|
| 1 | Check Vercel is connected to the GitHub repo | No preview link has appeared on pull request #1 | 2026-11-06 | OPEN |
| 2 | Review and merge pull request #1 ("Update the brief") | Makes the repo match your handover | 2026-11-06 | OPEN |
| 3 | Upload the logo files: `innit-wordmark-*`, the ticket symbol and the app icon | The handover says they're in `docs/brand/`, but they aren't in the repo yet | 2026-11-06 | OPEN |
| 4 | Upload the reference screens (website: home, draw, checkout, winners; app: home, draw, "You're in", entries, live, limits; admin: dashboard, draw builder, protection) | The handover says they're in `docs/design/`; only two early home drafts are there | 2026-11-06 | OPEN |
| 5 | Name and GitHub username of the developer who reviews money / personal-data / draw / admin changes | Required before merging those tasks | 2026-11-06 | OPEN |
| 6 | Answer questions Q1–Q2 below | Q1 is a rule conflict; Q2 affects the draw-night timetable | 2026-11-06 | OPEN |

## Questions and rule conflicts (Claude flagged these)

| # | Question | Claude's recommendation | Asked | Status |
|---|---|---|---|---|
| **Q1** | **Postal entries after "Sold out".** Handover 2B says postal entries received before close are still added after the cap is reached. But the cap is locked and published, and the odds statement depends on it. Adding entries beyond the cap would break the published maximum and the odds. | Hold back a small **postal reserve** inside the cap (e.g. 2%). Paid sales show "Sold out" at cap minus reserve; postal entries use the reserve; the published maximum is never exceeded. Solicitor to confirm the reserve and the terms wording. | 2026-11-06 | OPEN |
| **Q2** | **Close vs draw time.** Draws close at 20:00 and are drawn live at 20:00. The ledger must freeze and the drand round must arrive after close, so the reveal can't be at exactly 20:00. | Close at **20:00**; stream starts at 20:00 showing the freeze and entry-list hash; drand round due ~1 minute after close; two staff approve; winner revealed about **20:05**. | 2026-11-06 | OPEN |
| Q3 | **drand fallback** if the beacon is unavailable at draw time. | Fetch the committed round from several public drand mirrors. If the round is late, wait for it (published rounds can't change). If the drand network has halted and never produces that round, use the **first round produced after it**; the draw is delayed, never re-chosen. If drand is down for more than 48 hours, use a named backup beacon set out in the terms. Solicitor and independent reviewer to approve. | 2026-11-06 | LATER (phase 6) |
| Q4 | **Per-person entry limit per draw**: the most entries one person can have in a single draw (paid + postal). | You decide; the handover says postal and paid share the same limit, but no number is set. | 2026-11-06 | LATER (phase 3) |
| Q5 | **Launch-month mix at 5 draws a week** (April 2027): which categories, and do cars run? | You decide. | 2026-11-06 | LATER (phase 2) |
| Q6 | **Default monthly spend limit for new players**, and the **highest limit** a player can raise to. | You decide (with the solicitor, under the DCMS code). | 2026-11-06 | LATER (phase 4) |
| Q7 | **Brand book shows the endorsement line and K emblem**, which the handover now removes. | Brand book updated by your designer when convenient; Claude ignores those parts meanwhile. | 2026-11-06 | LATER |

## Phase 1: Foundation

| # | Item | Status |
|---|---|---|
| 1.1 | Test database: add **Neon** (Postgres) to the Vercel project via Vercel → Storage (Claude will send click-by-click steps) | LATER |
| 1.2 | Set `DEMO_MODE=true` for **Preview** only in Vercel → Settings → Environment Variables (Claude will send steps) | LATER |
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
| 3.2 | Email sending account for receipts and alerts (e.g. Resend or Postmark) | LATER |
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
| `[[SOLICITOR: responsible play copy]]` | Limits, breaks, support pages | LATER |
| `[[SOLICITOR: share captions]]` | Export packs, customer sharing | LATER |
| `[[SOLICITOR: player message templates]]` (reminders, "new draws", sales-alert notifications) | Email and push | LATER |
| `[[SOLICITOR: app store official rules / Apple not a sponsor]]` | iOS and Android apps | LATER |
| `[[SOLICITOR: draw method statement review]]` | `docs/DRAW_METHOD.md`, proof page | LATER |
