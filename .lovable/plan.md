# Add all suggested features

This is a large scope (15+ features). I'll ship them in 5 phases so each phase is reviewable and the preview stays working between phases. Confirm and I'll start with Phase 1; subsequent phases run automatically unless you stop me.

## Phase 1 — Monetization expansion (fastest ROI)

- **Annual plan** ($60/yr) — add `quill_pro_yearly` price; show on `/upgrade` as toggle (Monthly / Yearly — save $12).
- **Tip jar** — one-time $3 / $5 / $10 prices; "Tip the author" button on `/read/$id`. Webhook records tips in new `tips`table; author sees totals on`/profile`.
- **Paid chapters** — per-chapter `is_paid` + `unlock_price_cents`; one-time purchase unlocks via new `chapter_unlocks` table; reader gate.

## Phase 2 — Engagement & retention

- **Reading streaks** — already have `current_streak` in `writing_goals`; add reader-side `reading_streaks` table, daily ping on `/read/$id` open.
- **Word-count goals + progress charts** — recharts line chart on `/goals` (last 30 days from new `daily_word_log` table; backfill via trigger on `chapters`).
- **Daily writing reminders** — opt-in toggle on `/profile`; email at chosen time via Lovable Email + pg_cron.
- **Achievements / badges** — `achievements` table, `user_achievements` join; auto-awarded by triggers (first 1k words, 7-day streak, first publish, etc.); badge wall on profile.

## Phase 3 — Social & discovery

- **Comments + reactions per chapter** — extend existing `comments` (currently manuscript-level) with optional `chapter_id`; add `reactions` table (emoji per chapter).
- **Follow authors + activity feed** — `follows` table; `/feed` route showing followed authors' new chapters/publishes.
- **Public author profiles** at `/u/$penName` — SSR'd, SEO meta, books grid, follow button.
- **Discover improvements** — trending (likes × recency), new releases, by genre tabs.

## Phase 4 — Writing tools (Pro-gated where noted)

- **AI cover generator** (Pro) — wire existing `generateCover` server fn into `/cover/$id` with prompt builder.
- **Character / worldbuilding notes** — `notes` table per manuscript; rich text panel in `/write/$id` sidebar.
- **Revision history** — snapshot `chapters.content` on each save (debounced) into `chapter_revisions`; restore UI.
- **Grammar checker** — Lovable AI `improve` mode already exists; add inline "Check grammar" button.
- **EPUB / PDF export** (Pro for EPUB) — `epub.ts` already exists; add PDF export via `pdf-lib`; buttons on `/publish/$id`.

## Phase 5 — Quality & growth + extra Pro gating

- **Email notifications** for new chapters from followed authors (Lovable Email + cron).
- **SEO landing pages** for published books — `/book/$slug` with full meta, JSON-LD `Book` schema, OG image from cover.
- **Onboarding flow** — 3-step modal on first login (pen name → genre interests → first goal).
- **Pro-gating expansion**: unlimited books (free = 3), AI cover, EPUB export, custom author URL slug, advanced analytics page (`/analytics`).

## Technical notes

- New tables (~10): `tips`, `chapter_unlocks`, `reading_streaks`, `daily_word_log`, `achievements`, `user_achievements`, `reactions`, `follows`, `notes`, `chapter_revisions`. All RLS-protected.
- Add `is_paid`, `unlock_price_cents` to `chapters`; `slug`, `is_featured` to `manuscripts`; `daily_reminder_at`, `email_notifications` to `profiles`.
- New Paddle products created via `payments--batch_create_product`: yearly plan, tip jar prices, paid-chapter price template.
- New routes: `/feed`, `/u/$penName`, `/book/$slug`, `/analytics`, `/onboarding`.
- Email: setup via `email_domain--setup_email_infra` + scaffold transactional templates for new-chapter and reminder.
- Webhook handler extended for one-time payments (tips, chapter unlocks).

## Risk / scope

This is roughly **2–3 hours of generation** and ~40 new/edited files. If you want to trim, tell me which phases to skip — common choices: skip Phase 4 grammar/notes (lowest urgency) or Phase 5 onboarding.

Approve to start with Phase 1.
