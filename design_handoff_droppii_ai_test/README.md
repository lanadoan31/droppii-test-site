# Handoff: Droppii Seller AI Knowledge Test Platform

## Overview

A web platform with two surfaces:

1. **Seller Test Site** (`Seller AI Test.html`) — where Droppii sellers (Vietnamese, ~52,000 users) log in, take a timed AI-knowledge certification test, and receive results + a certificate.
2. **Admin Portal** (`Admin Portal.html`) — where internal admins build tests, manage a question bank, manage sellers, view analytics, and publish/schedule tests.

The two surfaces share a data layer (currently `localStorage` via `droppii-sync.js`) — when an admin publishes a test, sellers see it on their login screen.

All UI is **in Vietnamese**. The brand is **Droppii** — primary blue `#0F4C9C` (Droppii Business branch) with an orange accent `#EE5A22`.

## About the Design Files

The files in this bundle are **design references created in HTML/JSX with React via in-browser Babel**. They are prototypes showing intended look, layout, copy, interactions, and data flow — **not production code to copy directly**.

Your task is to **recreate these designs in the target codebase's environment**. If no codebase exists yet, choose an appropriate stack — recommended: **Next.js + TypeScript + Tailwind CSS + shadcn/ui** for the web app, with a **Postgres + Prisma** backend for the shared data layer that `droppii-sync.js` mocks.

The HTML prototypes use a Figma-style design canvas (`design-canvas.jsx`) to present multiple screens side-by-side. **Do not ship the canvas** — each artboard is one route in the real app.

## Fidelity

**High-fidelity (hifi)**. Final colors, typography, spacing, copy, and interactions are intentional. Recreate pixel-perfectly using the codebase's libraries. Any place where a value isn't specified below, read it from `brand.css`.

## Tech Stack (Prototype → Production)

| Prototype | Production recommendation |
|---|---|
| In-browser React + Babel | Next.js 14+ (App Router) + React 18 + TypeScript |
| Plain CSS in `brand.css` | Tailwind CSS with brand tokens in `tailwind.config.ts` |
| `localStorage` via `droppii-sync.js` | Postgres + Prisma; tRPC or REST; auth via NextAuth/Clerk |
| Inline `<style>` JSX objects | shadcn/ui primitives + Tailwind utilities |
| Be Vietnam Pro (Google Fonts) | Same — `next/font` import |

## Routing

### Seller site
| Route | Screen | File |
|---|---|---|
| `/login` | Seller login + test selector | `direction-a-login.jsx` (use Direction A — clean corporate) |
| `/test/[testId]` | In-progress test | `direction-a-test.jsx` |
| `/test/[testId]/result` | Result + certificate | `direction-a-result.jsx` |

> Direction B files are an alternative visual exploration — **ship Direction A**. Keep B files for reference only.

### Admin portal
| Route | Screen | Component |
|---|---|---|
| `/admin` | Dashboard | `AdmDashboard` (`admin-dashboard.jsx`) |
| `/admin/tests` | Test list | `AdmTestList` (`admin-tests.jsx`) |
| `/admin/tests/new` | Create-test wizard (4 steps) | `AdmTestCreate` (`admin-tests.jsx`) |
| `/admin/tests/[id]/edit` | Test editor | `AdmTestEditor` (`admin-tests.jsx`) |
| `/admin/questions` | Question bank | `AdmQuestionBank` (`admin-screens.jsx`) |
| `/admin/questions/new` | Question editor | `AdmQuestionEditor` (`admin-extra.jsx`) |
| `/admin/sellers` | Seller list | `AdmSellers` (`admin-screens.jsx`) |
| `/admin/sellers/[id]` | Seller detail (5 tabs) | `AdmSellerDetail` (`admin-extra.jsx`) |
| `/admin/analytics` | Analytics & results | `AdmAnalytics` (`admin-screens.jsx`) |
| `/admin/reports` | Reports & exports | `AdmReports` (`admin-screens.jsx`) |

## Design Tokens

Source of truth: **`brand.css`**. Key values:

### Colors
```
--droppii-blue-700:   #0F4C9C   /* primary */
--droppii-blue-50:    #EBF1F9
--droppii-blue-100:   #D1DEF0
--droppii-orange-600: #EE5A22   /* accent (logo dot, Direction B) */
--ink-900:            #0F172A
--ink-700:            #334155
--ink-500:            #64748B
--ink-200:            #E2E8F0
--ink-100:            #F1F5F9
--ink-50:             #F8FAFC
--paper:              #F0EEE9   /* warm canvas */
--success-700:        #15803D
--success-500:        #22C55E
--success-100:        #DCFCE7
--warning-500:        #F59E0B
--danger-700:         #B91C1C
--danger-100:         #FEE2E2
```

### Typography
- **Family**: Be Vietnam Pro (Google Fonts) — weights 400/500/600/700
- **Display H1**: 32–40px / 700 / -0.02em / line-height 1.1
- **H2**: 18–22px / 600–700 / -0.01em
- **Body**: 13–14px / 400–500 / 1.55
- **Small / meta**: 11–12px / 500 / `var(--ink-500)`
- **Numbers**: `font-variant-numeric: tabular-nums` everywhere (KPIs, scores, counters)
- **Mono (codes)**: `ui-monospace, Menlo, monospace` — used for test IDs (DRP-AI-2026)

### Spacing & shape
- Radii: `--r-sm: 8px`, `--r-md: 12px`, `--r-lg: 16px`
- Card: white bg, 1px solid `--ink-200`, 12px radius, no shadow (or very subtle `0 1px 2px rgba(0,0,0,.04)`)
- Sidebar width: **232px**
- Input height: 38–44px
- Button heights: sm 30, md 36–38, lg 44

### Buttons
- `dr-btn-primary`: bg `--droppii-blue-700`, text white, hover darken 8%
- `dr-btn-secondary`: bg white, 1px border `--ink-200`, text `--ink-900`
- `dr-btn-ghost`: transparent, text `--ink-700`, hover bg `--ink-100`

## Data Model

The prototype uses `droppii-sync.js` as a localStorage shim. In production, model these tables:

```ts
// Test
{ id: string (PK, e.g. "DRP-AI-2026"), name, status: "draft"|"published"|"archived",
  type: "scheduled"|"required"|"open", duration_min, pass_score, questions_total,
  published_at, updated_at, cohort?, description?, settings: {
    shuffle_questions, shuffle_options, allow_back, show_progress,
    require_fullscreen, show_answers_after, certificate_mode: "auto"|"manual"
  }
}
// Question
{ id, type: "single"|"multi"|"scenario"|"short", topic, difficulty, time_sec,
  points, stem, options: [{text, correct}], explanation, tags[], used_in_tests[]
}
// Seller
{ id (e.g. "DRP-58294"), name, email, phone, region, joined_at, status,
  manager_id, badges[]
}
// Attempt
{ id, seller_id, test_id, started_at, finished_at, duration_sec, score_pct,
  passed, answers: [{question_id, selected[], correct, time_sec}]
}
// Certificate
{ id, seller_id, test_id, attempt_id, issued_at, expires_at, badge_name }
```

## Key Interactions

### Seller flow
1. Login → POST `/api/auth/login` → fetch published tests → select test → POST `/api/attempts` (creates attempt) → redirect `/test/[id]`
2. Test page: question-by-question, timer (top right, persisted to attempt every 5s), shuffled if `settings.shuffle_*`, "back" disabled if not allowed, autosave on each answer
3. Submit → POST `/api/attempts/[id]/submit` → server scores → redirect to `/result`
4. Result: confetti if passed, score breakdown by topic, downloadable certificate (PDF)

### Admin flow
1. **Create test wizard** (4 steps): general info → settings (toggles for shuffle/fullscreen/etc) → add questions (empty state with 3 paths: new / from bank / Excel import) → review & publish
2. **Test list** publish/archive buttons mutate `status` and broadcast — sellers see new tests on next page load (or via WebSocket if real-time)
3. **Question editor**: type-aware form. For `single`, radio toggle for correct; for `multi`, checkbox; for `short`, AI-graded with sample answer & keywords
4. **Seller detail**: 5 tabs (Overview, Attempt history, Certificates, Activity, Settings). Currently only Overview is designed — other tabs follow same layout pattern.
5. **Analytics**: score histogram, cohort comparison, regional × topic heatmap, per-question difficulty, drop-off funnel

## State Management

Use TanStack Query (or RSC + Server Actions in Next 14). Key queries:
- `useTests({status?})`, `useTest(id)`, `useQuestion(id)`
- `useSellers({region?, status?, search?})`, `useSeller(id)`, `useAttempts(sellerId)`
- `useDashboardStats()`, `useTestAnalytics(testId)`

Mutations: `publishTest`, `archiveTest`, `createTest`, `createQuestion`, `inviteSeller`, `submitAttempt`, `issueCertificate`.

## Auth & Roles

The prototype has no auth screens for admin (intentional — out of scope). For production:
- **Seller**: phone or seller-ID + OTP (Vietnamese market norm)
- **Admin**: email + password + 2FA, with roles: `super_admin`, `regional_manager` (scoped to one region), `content_editor` (test/question CUD only)

## Localization

All copy is **Vietnamese**. Keys live in the prototypes — extract to `vi.json`. Plan for `en.json` later (some sellers may speak English). Number/date formats use `vi-VN` locale.

## What's NOT Designed (Build with Defaults)

These were called out to the user as gaps; build with sensible defaults:

- Admin login screen
- Modals (delete confirm, invite seller, publish confirm) — use shadcn `<AlertDialog>`
- Toast notifications — use shadcn `<Sonner>`
- Loading states — skeleton screens matching card shape
- Error states — inline error + retry button
- Empty states for: question bank (0 questions), sellers list (0 invited)
- Schedule/cohort setup screen (test type "Lịch cố định" was selected but UI isn't drawn — needs date pickers for open/close + cohort assignment)
- Single-attempt detail page (admin clicks an attempt → sees seller's answers question-by-question with right/wrong)
- Notification & invite email templates
- Settings / Org config (passing-score defaults, certificate template, branding)
- Mobile admin (admin is desktop-only — confirm with PM)

## Files in this bundle

### Entry HTML files (open these to view designs)
- `Admin Portal.html` — admin canvas with all 10 admin screens
- `Seller AI Test.html` — seller canvas with 6 seller screens (3 desktop × 2 directions, plus 2 mobile)

### Brand & shared
- `brand.css` — design tokens, button styles, input styles, chip/pill styles
- `assets/droppii-logo-mark.svg`, `assets/droppii-logo-biz.svg` — logo (uses `currentColor`)

### Data layer (prototype mock — replace with API)
- `droppii-sync.js` — shared `localStorage` bridge between admin & seller (publish/archive/results)
- `quiz-data.js` — sample questions including the seed clinical scenario
- `admin-data.js` — sample tests, sellers, KPIs, analytics

### Admin components (JSX)
- `admin-shell.jsx` — sidebar nav, header, status pills, layout shell
- `admin-dashboard.jsx` — KPIs, pass-rate trend chart, active tests, activity feed
- `admin-tests.jsx` — test list, 4-step create wizard, full test editor
- `admin-screens.jsx` — question bank, sellers list, analytics, reports
- `admin-extra.jsx` — **question editor + seller detail** (latest additions)

### Seller components (JSX)
- `direction-a-*.jsx` — **PRIMARY** clean corporate exam direction (login/test/result)
- `direction-b-*.jsx` — alternative warm/coaching direction (reference only)

### Prototype-only (do not ship)
- `design-canvas.jsx` — Figma-style canvas wrapper used to present screens side-by-side
- `tweaks-panel.jsx` — runtime tweak controls used to A/B variations during design review

## Notes for the Developer

1. The prototype uses **inline style objects** everywhere for speed. Convert to Tailwind classes + brand tokens. The token names already match good Tailwind conventions (e.g., `bg-ink-50`, `text-droppii-blue-700`).
2. Every long form field, table column header, and helper string in the JSX **is the final Vietnamese copy** — don't lorem-ipsum it; lift it as-is into your i18n file.
3. Numbers in tables/KPIs use Vietnamese formatting: `52,481` → `52.481` (period as thousands separator). Use `Intl.NumberFormat('vi-VN')`.
4. The `data-screen-label` attributes on artboards are prototype scaffolding — strip them.
5. The Tweaks panel and DesignCanvas are **prototype-only** — a real app has neither.
