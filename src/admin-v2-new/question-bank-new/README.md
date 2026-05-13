# Droppii — Question Bank screen handoff

> **For Cursor / Claude Code:** This bundle contains the **Question Bank screen only**, extracted from the larger Droppii Test Admin design. Re-implement in your project's existing codebase using its established framework, component library, routing, and state patterns. The HTML/JSX files here are **design references**, not production code.

---

## What this screen does

The Question Bank is where admins manage **reusable test questions**. Once a question exists in the bank, an admin can add it into any **draft** or **scheduled** test (not published or archived — those are locked to protect taker data).

Two flows from this screen:
1. **Browse + filter** existing questions
2. **Add one or many questions to one or many tests** (multi-select in both directions)

## Fidelity

**High-fidelity.** Colors, spacing, copy, status flows, and the modal are all committed. Recreate close to pixel-perfect.

---

## Screen layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │ Topbar (search · bell · help)                         │
├─────────┼───────────────────────────────────────────────────────┤
│         │ Page header                                           │
│         │  Question bank                  [Import CSV] [+ New]  │
│         │  Reusable questions you can drop into any test.       │
│         │                                                       │
│         │ Toolbar  [ search 🔍 ] [type ▼] [difficulty ▼]        │
│         │                                                       │
│         │ Bulk-action bar (only visible when rows ticked)       │
│         │  3 questions selected      [Clear] [+ Add to test]    │
│         │                                                       │
│         │ Table                                                 │
│         │  □ │ Question text          │ Type │ Diff │ Used │ +  │
│         │  □ │ "What is the max…"     │ MCQ  │ Easy │ 3   │ +  │
│         │  …                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Page header
- **Title** "Question bank"
- **Sub** "Reusable questions you can drop into any test."
- **Actions:** Secondary "Import CSV" · Primary "+ New question"

### Toolbar (single row)
- Search input (~320px wide), placeholder "Search questions..."
- "All types" select — multiple-choice / multi-select / true-false / short-answer / matching / fill-blank
- "All difficulties" select — Easy / Medium / Hard

> **Note:** Intentionally no Category filter — Difficulty already provides the scan signal. Category lives only on Tests.

### Bulk-action bar
Shown only when `selected.length > 0`. Tinted brand-orange row.
- Left: `{n}` `question(s) selected`
- Right: ghost `Clear` + primary `+ Add to test`

### Table columns
| Width | Column        | Notes |
| ----: | :-----------  | :---- |
| 36px  | ☐ checkbox    | Header toggles all visible rows |
| flex  | Question      | Body text, weight 500, line-height 1.4 |
| auto  | Type          | Colored badge — see token table below |
| auto  | Difficulty    | Colored badge — green/amber/red |
| auto  | Used in       | "{n} test(s)" |
| 140px | Per-row action| Secondary button "+ Add to test" |

Row hover: subtle background. When a row is ticked: 5% brand-orange tint.

### Type badge colors
| Type              | Color       |
| :--               | :--         |
| multiple-choice   | `#1F6FEB`   |
| multi-select      | `#9333EA`   |
| true-false        | `#2FA967`   |
| short-answer      | `#F26522`   |
| fill-blank        | `#B58A00`   |
| matching          | `#8B6F4E`   |

Badge style: `{color}22` background (13% opacity), `{color}` text.

### Difficulty badge
| Difficulty | Background | Text          |
| :--        | :--        | :--           |
| Easy       | `#E5F5EC`  | `#2FA967`     |
| Medium     | `#FFF6DD`  | `#B58A00`     |
| Hard       | `#FCE8E8`  | `#DC2A2A`     |

---

## Add-to-test modal (`AddToTestModal`)

Triggered from either the per-row "+ Add to test" button OR the bulk-action bar's "+ Add to test" button.

```
┌─────────────────────────────────────────────────────────┐
│  Add to test                                       [x]  │
│  Pick one or more draft or scheduled tests.            │
│  Adding {n} question(s).                                │
├─────────────────────────────────────────────────────────┤
│  [ search 🔍 ]                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☐  Customer Service Standards                   │   │
│  │    Draft · 30 questions · Intermediate ·        │   │
│  │    Service · Editable                           │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ ☐  Platform Policies Quiz                       │   │
│  │    Scheduled · 15 questions · Advanced ·        │   │
│  │    Compliance · Edit before window opens        │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ ☐  Live Stream Selling Basics            🔒     │   │
│  │    Published · 20 questions · Advanced ·        │   │
│  │    Marketing · Unpublish first to edit          │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ ☐  Returns & Refunds Procedure           🔒     │   │
│  │    Archived · 16 questions · Beginner ·         │   │
│  │    Service · Restore from archive to edit       │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  2 tests selected         [Cancel]  [+ Add to 2 tests]  │
└─────────────────────────────────────────────────────────┘
```

### Status rules (server enforces too)
| Test status | Selectable? | Visual                                                                            |
| :--         | :--         | :--                                                                               |
| `draft`     | ✅ yes      | Grey "Draft" status label, hint "Editable"                                        |
| `scheduled` | ✅ yes      | Orange "Scheduled" status label, hint "Edit before window opens"                  |
| `published` | 🔒 no       | Green "Published" label, 🔒 lock icon, row dimmed (opacity 0.55), `cursor: not-allowed`, hint "Unpublish first to edit" |
| `archived`  | 🔒 no       | Muted grey "Archived" label, 🔒 lock icon, dimmed row, hint "Restore from archive to edit" |

### Modal footer
- Left: live count `{n} test(s) selected` (or `No tests selected`)
- Right: ghost `Cancel` + primary `+ Add to {n} test(s)` (disabled when 0)

### On confirm
1. Server call: `POST /api/question-bank/add-to-tests` with `{ questionIds: [], testIds: [] }`. Server rejects if any test status ∉ `{draft, scheduled}` (HTTP 403).
2. Toast (bottom-center): `"{q} question(s) added to {t} test(s)"`
3. Close modal, clear question selection.

---

## Behavior summary

- Search/filter is client-side in the prototype; in production, paginate server-side.
- Multi-select: header checkbox toggles all *currently visible* rows.
- Adding a question into a test creates a **denormalized copy** in the test (the test's questions snapshot the bank state at add time). This means editing a bank question later doesn't retroactively modify already-published tests. Servers should implement this snapshot pattern.
- Bulk-action bar slides down only when ≥1 row is selected; "Clear" removes the selection.
- Toasts auto-dismiss after ~2.4s.

---

## State

```ts
type QuestionBankState = {
  search: string;
  type: 'all' | QuestionType;
  difficulty: 'all' | Difficulty;
  selected: string[];          // bank question ids
  pickerOpen: boolean;
  pickerQuestionIds: string[]; // question ids being added in the current modal
};

type AddToTestModalState = {
  search: string;
  chosen: string[];            // test ids
};
```

---

## Data model

```ts
type QuestionType =
  | 'multiple-choice' | 'multi-select' | 'true-false'
  | 'short-answer'    | 'fill-blank'   | 'matching';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type BankQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  options?: string[];
  correct?: number[];
  explanation?: string;
  usedInCount: number;         // derived
};

type TestStatus = 'draft' | 'published' | 'scheduled' | 'archived';
type TestForPicker = {
  id: string;
  title: string;
  status: TestStatus;
  questions: number;           // count
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
};
```

---

## API endpoints

```
GET    /api/question-bank?search=&type=&difficulty=&page=
POST   /api/question-bank
PATCH  /api/question-bank/:id
DELETE /api/question-bank/:id

POST   /api/question-bank/add-to-tests
       body: { questionIds: string[], testIds: string[] }
       server: rejects if any testIds.status ∉ {draft, scheduled} → 403
       returns: { added: number, skipped: { testId, reason }[] }

GET    /api/tests?status=&search=    # for the picker
```

---

## Design tokens used on this screen

```css
--brand-500:       #F26522
--brand-700:       #B8430A
--brand-100:       #FFE7D7
--brand-50:        #FFF3EA

--accent-green:    #2FA967
--accent-red:      #DC2A2A
--accent-blue:     #1F6FEB

--ink-900:         #0E0F12
--text:            #1A1B1F
--text-muted:      #6B7280
--border:          #E5E7EB
--surface:         #FFFFFF
--surface-2:       #F7F7F8

--shadow-md:       0 6px 16px -4px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)
```

**Typography:** Be Vietnam Pro (Google Fonts), weights 400/500/600/700.

---

## Files in this bundle

```
design/
  Question Bank.html   ← open this to see the working screen
  styles.css           ← full token system + component styles
  icons.jsx            ← inline-SVG icon set (replace with Lucide React in prod)
  data.jsx             ← MOCK { questionBank, tests, ... } — replace with real API
```

`Question Bank.html` is self-contained — it includes:
- The `QuestionBank` component
- The `AddToTestModal` component
- A minimal sidebar/topbar shell for context

---

## What NOT to port

- The Babel + `<script type="text/babel">` loading pattern — use a real bundler
- Inline mock data in `data.jsx`
- The `window.X = X` exports — use proper ES module imports
- Inline SVGs in `icons.jsx` — swap for Lucide React (`Plus`, `Search`, `Lock`, `Check`, `X`, `Filter`, `Upload`)

---

## Acceptance checklist

- [ ] Type-by-color badges match the table above exactly
- [ ] Difficulty badges match the table above exactly
- [ ] Header checkbox toggles all *currently filtered* rows (not all data)
- [ ] Bulk-action bar appears only when ≥1 row selected
- [ ] Per-row "+ Add to test" works independently of bulk selection
- [ ] Add-to-test modal lists ALL tests with status pills; only `draft` and `scheduled` are checkable
- [ ] Locked rows (`published`, `archived`) show 🔒 icon, are dimmed (0.55 opacity), and use `cursor: not-allowed`
- [ ] Server-side guard: `POST /api/question-bank/add-to-tests` returns 403 if any test is not editable
- [ ] On confirm: toast appears, modal closes, selection clears
- [ ] Added questions are **denormalized** into the test (snapshot pattern — editing the bank later doesn't change already-imported instances)
- [ ] Empty state: "No tests match '{search}'" when filter yields zero
- [ ] Keyboard nav through table rows and modal; focus trap inside modal; ARIA labels on icon-only buttons
