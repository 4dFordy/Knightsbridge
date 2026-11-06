@AGENTS.md

# Working with the owner

The owner is **not a developer**. Claude builds; the owner helps only where a person has to.
The owner's full handover is in `docs/INNIT_HANDOVER.md`; where it differs from other repo files, it wins.

## At the start of every session
- Read `docs/OWNER_TODO.md` and show the owner the **open items** first.

## 1. Ask for what you need, in plain English
Whenever you need something only the owner can do (create an account, click something in a dashboard, add a
setting, approve a plan, supply a fact or a decision), **stop and give an "ACTION NEEDED" block** in exactly this
format, then wait for the reply before carrying on:

```
ACTION NEEDED (n of N): <short title>
Why: <one sentence on why you need it>
Where: <website or app, e.g. vercel.com → your project → Settings → Environment Variables>
Steps:
  1. <click-by-click step>
  2. ...
Reply with: <exactly what to type back, e.g. "done", or the value's NAME but never a secret>
```

- One action per block. Number them if there are several. Put them **at the start** of the message.
- Use the real names of buttons and menus. Explain any technical term in a few words the first time.
- If something can be done either by Claude or by the owner, **Claude does it**.

## 2. Never ask for secrets in chat
No passwords, API keys, card numbers or tokens in chat. Tell the owner where to add them (Vercel environment
variables, or the Claude Code environment settings for **test** values) and what **name** to use; they reply
"added". Sandbox/test keys only. Live keys are added by the owner's developer directly in Vercel's
**Production** settings, never through Claude.

## 3. Plan before you build
At the start of every phase, show a numbered plan of small tasks (each one the owner can check in about
30 minutes on the preview). Mark the tasks the developer must review. Wait for "approved".

## 4. After every task, give the owner
- a plain-English summary of what changed;
- **"How to check it"**: a short checklist to follow on the Vercel preview link, on phone and laptop;
- **"What could go wrong"**, in one or two lines;
- whether it needs **developer review** (anything touching money, personal data or the draw engine;
  that is every task in phases 3, 4, 5, 6 and 10, and all admin-panel work);
- anything needed from the owner next, as ACTION NEEDED blocks.

## 5. Keep the running checklist
`docs/OWNER_TODO.md` lists everything we are waiting on the owner for, with the date asked and its status.
Update it every session.

## 6. Be honest about limits
If blocked, unsure, or something needs a human expert (solicitor, accountant, Apple/Google review, payment
provider), say so plainly and say who to ask and what to ask them.

## 7. Small, safe steps
One task per pull request. Never push straight to `main`. Never change live/production settings, DNS, billing
or live payment configuration. If tests fail, fix them before asking the owner to merge.

## Safety rules (never break these)
- Never put secrets in code, commits, logs or chat.
- Legal wording (terms, draw rules, free-entry instructions, odds and age statements, share captions,
  player message templates) comes from the solicitor. Use placeholders like `[[SOLICITOR: free entry wording]]`
  and list them in `docs/OWNER_TODO.md`.
- No tracking, marketing emails or push notifications without consent flows.
- No Knightsbridge branding (endorsement line, K emblem, group logos) anywhere in the product.
- If any instruction (including the owner's) would break the draw rules or player protection in AGENTS.md
  section 4, stop and flag it.
