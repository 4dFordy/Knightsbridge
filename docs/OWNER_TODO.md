# Owner to-do list

Everything Claude is waiting on the owner for. Claude updates this every session and shows the open items first.
**Never paste secrets in chat**: add them where the item says, then reply with the setting's *name* and "added".

Status key: **OPEN** (needed now) · **LATER** (needed when we reach that phase) · **DONE**

---

## Now (session 1)

| # | Item | Why | Asked | Status |
|---|---|---|---|---|
| 1 | Review and merge the "Update the brief" pull request | Makes the repo match your handover and brand book | 2026-11-06 | OPEN |
| 2 | Confirm Vercel is connected to the GitHub repo (preview link on the PR) | Every task is checked on a preview link | 2026-11-06 | OPEN |
| 3 | Logo master files (SVG, or high-res PNG): horizontal, stacked, ticket symbol, on navy / gold / ivory | The repo only has the brand book PDF; Claude can redraw a stand-in, but the designer's files should be used | 2026-11-06 | OPEN |
| 4 | The full screen set (website draw, checkout, winners; app live; back office dashboard, draw builder, protection) | The handover says these are in `docs/design/`, but only two early home drafts are there. The brand book says the full set is in the business plan | 2026-11-06 | OPEN |
| 5 | Name of the developer who will review money / personal-data / draw changes, and their GitHub username | Phases 3, 4, 5, 6 and 10 need their review before you merge | 2026-11-06 | OPEN |

## Decisions Claude needs from you

| # | Question | Why it matters | Asked | Status |
|---|---|---|---|---|
| D1 | **Per-person entry limit per draw**: is there a maximum number of entries one person can buy in a single draw? If yes, how many? | The handover says postal entries have "the same per-person limit" as paid; the number isn't set anywhere | 2026-11-06 | OPEN |
| D2 | **Launch-month mix at 5 draws a week** (April 2027): which categories? Do cars run in April? | The mix is only defined for 10 a week | 2026-11-06 | LATER (phase 2) |
| D3 | **Default monthly spend limit for new players, and the operator's maximum** a player can raise their limit to | Rule: every payment is checked against the operator cap and the player's own limit | 2026-11-06 | LATER (phase 4) |
| D4 | **How long ahead of the close the postal entry must arrive** (the postal cutoff) | Needed for postal entry logging | 2026-11-06 | LATER (phase 5) |

## Phase 1: Foundation

| # | Item | Status |
|---|---|---|
| 1.1 | Test database: add **Neon** (Postgres) to the Vercel project through Vercel's Storage / Marketplace tab (Claude will give click-by-click steps) | LATER |
| 1.2 | Set `DEMO_MODE=true` for **Preview** only in Vercel → Settings → Environment Variables (Claude will give steps) | LATER |

## Phase 3: Ticketing and checkout

| # | Item | Status |
|---|---|---|
| 3.1 | **Payment provider sandbox account** (e.g. Stripe, Adyen, Checkout.com). Before signing up, **ask the provider in writing whether they accept UK prize draws / competitions with a free entry route**. Some list them as restricted | LATER |
| 3.2 | Email sending account for receipts (e.g. Resend or Postmark, free tier) | LATER |
| 3.3 | Redis for entry holds (Upstash, added through the Vercel Marketplace) | LATER |
| 3.4 | Accountant to confirm VAT treatment: 20% included in the entry price (1/6 of each sale) | LATER |

## Phase 4: Player protection

| # | Item | Status |
|---|---|---|
| 4.1 | **Age/ID verification provider sandbox** (e.g. Yoti, Onfido, GBG, Veriff) | LATER |
| 4.2 | List of support services to signpost (e.g. GamCare, BeGambleAware, StepChange); solicitor to approve wording | LATER |

## Phase 5: Free postal entries

| # | Item | Status |
|---|---|---|
| 5.1 | The postal address entries are sent to | LATER |
| 5.2 | Names of staff who will log and check postal entries (two-person sign-off) | LATER |

## Phase 8: Sharing

| # | Item | Status |
|---|---|---|
| 8.1 | Meta (Facebook) developer account and **Meta App ID** for Instagram Stories sharing | LATER |
| 8.2 | TikTok for Developers account (Share Kit) | LATER |

## Phase 9: Native apps

| # | Item | Status |
|---|---|---|
| 9.1 | **Apple Developer Program** account as an organisation (needs a D-U-N-S number, which can take ~2 weeks, so start early) | LATER |
| 9.2 | Apple **Merchant ID** and Apple Pay certificate (Claude will give steps) | LATER |
| 9.3 | **Google Play Console** account (organisation) | LATER |
| 9.4 | A Mac and your developer for iOS builds | LATER |
| 9.5 | Check of Apple and Google rules on contests and sweepstakes, and that Apple Pay (not in-app purchase) is allowed for entries | LATER |

## Launch / brand (from the brand book)

| # | Item | Status |
|---|---|---|
| L1 | UK IPO trademark search: "Innit", the logo and the full line | LATER |
| L2 | **Domains**: innit .co.uk and .com (or chosen names) | LATER |
| L3 | Instagram and TikTok handles (18+, UK-targeted accounts) | LATER |
| L4 | Two launch ads tested with UK adults for two weeks before go-live | LATER |

## Solicitor wording (placeholders in the code until supplied)

Claude uses `[[SOLICITOR: ...]]` placeholders. Each one appears here when it's added to the code.

| Placeholder | Where it appears | Status |
|---|---|---|
| `[[SOLICITOR: brand line approval]]` "Gotta be innit to win it." | Everywhere | LATER |
| `[[SOLICITOR: endorsement line]]` "A part of Knightsbridge Luxury Group" | Logo | LATER |
| `[[SOLICITOR: free entry wording]]` | Every draw page, footer | LATER |
| `[[SOLICITOR: terms and draw rules]]` | Terms page, app | LATER |
| `[[SOLICITOR: odds statement]]` | Every draw page | LATER |
| `[[SOLICITOR: 18+ statement]]` | Sign-up, draw pages, ads | LATER |
| `[[SOLICITOR: privacy notice]]` | Sign-up, footer | LATER |
| `[[SOLICITOR: responsible play copy]]` | Limits, breaks, support pages | LATER |
| `[[SOLICITOR: share captions]]` | Share images and messages | LATER |
| `[[SOLICITOR: app store official rules / Apple not a sponsor]]` | iOS and Android apps | LATER |
