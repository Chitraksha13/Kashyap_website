# Nudge — MVP build spec

Nudge is a mobile-first web app for roommates to track shared bills, split them flexibly, and pay each other through Venmo, Cash App, or Zelle. The app sends automatic reminders so the person who paid never has to text roommates asking for money.

Keep everything as simple as possible. This is an MVP, not a production app.

## Tech stack

- Next.js (App Router) with React and TypeScript
- Tailwind CSS
- Supabase: PostgreSQL database and email magic-link auth
- Resend for reminder emails
- Vercel for hosting, with Vercel Cron for the daily reminder job
- GitHub for version control

Build it as a mobile-first responsive web app (installable to the home screen). No native iOS or Android app.

## Design system

Match these exactly. Define the colors as CSS variables (or Tailwind theme colors) and switch them with `prefers-color-scheme: dark`. Inspired by consumer payment apps, but not a copy of any of them. No gradients and no drop shadows; use thin borders instead.

### Colors

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| background | #F5F4F0 | #1A1A19 | Page behind the app |
| surface | #FFFFFF | #242422 | Main screen and cards |
| field | #F5F4F0 | #2E2E2B | Inputs, info boxes, segmented control track |
| border | rgba(0,0,0,0.12) | rgba(255,255,255,0.12) | Hairlines, outline buttons |
| text | #1F1E1C | #F1EFE8 | Primary text |
| text-secondary | #6B6A66 | #B4B2A9 | Supporting text |
| text-muted | #9A9893 | #888780 | Placeholders, timestamps |
| accent | #534AB7 | #7F77DD | Primary buttons, logo tile |
| on-accent | #FFFFFF | #FFFFFF | Text on accent |
| accent-tint | #EEEDFE | #3C3489 | Balance card, avatars |
| accent-tint-text | #3C3489 | #CECBF6 | Text on accent tint |
| success-tint / text | #EAF3DE / #27500A | #27500A / #C0DD97 | "Paid" pills, "adds up" check |
| warning-tint / text | #FAEEDA / #633806 | #633806 / #FAC775 | "Waiting" pills |

### Shape and type

- Primary buttons: full-width, fully rounded pill (border-radius 999px), accent fill, 10px vertical padding, weight 500
- Secondary buttons: same pill shape, transparent with a 1px border
- Cards and balance card: 16px radius. Inputs and info boxes: 12px radius, field background, no border
- Payment option rows (Venmo, Cash App, Zelle): 14px radius, 1px border, name on the left, action hint on the right
- Avatars: 30px circles with initials, accent tint background, accent tint text
- Status pills: small rounded pills using the success or warning tints
- Segmented control (Feed / Balances, Equal / Amounts / Percent): pill-shaped track in the field color; the selected segment is a surface-colored pill with a border
- Font: system sans-serif stack. Only two weights, 400 and 500. Sentence case everywhere
- Dollar amounts: large and weight 500 (about 26–30px on the balance card, new bill, and pay screens)
- Icons: one outline icon set (for example Tabler or Lucide), 16–20px
- Layout: designed for ~390px phone width; on larger screens, center the app in a phone-width column

## Screens

1. **Sign in**: email field, "Continue with email" sends a magic link
2. **Payment methods** (onboarding, also editable later): Venmo username, Cash App $cashtag, Zelle email or phone. At least one required
3. **Household setup**: create a household with a name, or join one via invite link (`/join/[code]`)
4. **Home**: household name, balance card (net balance, amount owed to you, amount you owe), toggle between Feed and Balances, "New bill" button
5. **New bill**: total amount, bill name, who paid, split mode (Equal, Amounts, Percent), member list with each share. Show a live check that shares add up to the total; block saving if they don't
6. **Pay a roommate**: amount and reason, buttons for Venmo, Cash App, and Zelle using the recipient's saved handles, then an "I've paid" button
7. **Bill detail**: each member's share and status (Waiting, Marked paid, Confirmed), last reminder sent, and a button for the bill payer to confirm a payment

## Data model (PostgreSQL)

- `profiles`: id (matches auth user), name, email, venmo_username, cashtag, zelle_handle, created_at
- `households`: id, name, invite_code, created_at
- `members`: household_id, profile_id, joined_at
- `bills`: id, household_id, name, total_amount, paid_by (profile_id), split_mode ('equal' | 'amounts' | 'percent'), created_at
- `bill_shares`: id, bill_id, profile_id, amount, status ('waiting' | 'marked_paid' | 'confirmed'), paid_method, marked_paid_at, confirmed_at, last_reminded_at

Store money as integer cents. Use Supabase row-level security so users only see households they belong to.

Balances are computed with SQL from `bill_shares` that are not yet confirmed. The payer's own share is never owed.

## Split rules

- Equal: divide the total by the number of selected members; give any leftover cent to the payer's share
- Amounts: user enters each share in dollars; must sum exactly to the total
- Percent: user enters percentages; must sum to 100; convert to cents and handle rounding so the total is exact

## Payment handoff

There is no payments API. Nudge opens the payment app prefilled and the users confirm manually.

- Venmo: open a prefilled payment link with recipient, amount, and note. Research and verify the current link format before implementing, and fall back to the recipient's Venmo profile if prefill fails
- Cash App: `https://cash.app/$CASHTAG/AMOUNT`
- Zelle: no link exists. Show the recipient's Zelle email or phone with a copy button and the exact amount
- Hide any payment button the recipient hasn't set up
- "I've paid" sets the share to `marked_paid`; the bill payer then confirms it, which sets it to `confirmed`

## Reminders

- When a bill is created, email each roommate who owes a share
- A daily cron job emails roommates whose shares are still `waiting` and haven't been reminded in 2 days
- The email includes the amount, the bill name, and a link straight to the pay screen

## Build phases

1. Project setup, Tailwind, Supabase connection, magic-link sign in, profiles and payment methods
2. Households: create, invite link, join
3. Bills: new bill screen with all three split modes and validation, bill_shares
4. Home screen: balance card, feed, balances view (SQL)
5. Pay screen and payment handoff, mark paid and confirm flow
6. Reminder emails with Resend and the daily cron job
7. Deploy to Vercel

## Out of scope for the MVP

Recurring bills, receipt scanning, in-app payments or payment verification, push notifications, multiple households per user, and editing bills after creation.
