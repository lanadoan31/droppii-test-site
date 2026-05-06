# Droppii AI Seller Test

An interactive knowledge assessment for Droppii sellers, testing their ability to use AI responsibly when advising customers on health products and vitamins.

---

## What this app does

Sellers enter their name, then take an 8-question timed test (30 minutes) covering four topics:

- **Prompt writing** — how to write effective AI prompts for product research
- **Product research** — using AI to evaluate dosage claims and ingredient sourcing
- **Safe advisory** — how to give vitamin and supplement advice responsibly with AI assistance
- **AI ethics & limits** — understanding hallucination, data freshness, and when to escalate to a professional

Upon passing (≥ 70%), the seller receives a printable **Droppii AI Seller — Level 1** certificate.

---

## Screens

| Screen | Description |
|---|---|
| **Seller Entry** | Name and optional seller ID input |
| **Pre-test** | Instructions, rules, test stats, certificate preview |
| **Test** | One question per screen, countdown timer, progress tracker |
| **Result** | Score ring, per-topic breakdown, expandable answer review |
| **Certificate** | A4-landscape printable certificate with seal and signatures |

---

## Tech stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vite.dev) | Build tool and dev server |
| [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) | Typography (Google Fonts) |
| Plain CSS | Styling (design token system in `index.css`) |

No external UI libraries or CSS frameworks — the design system is fully custom to match Droppii brand guidelines.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (comes with Node.js)

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/droppii-test.git
cd droppii-test

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder — a fully self-contained static site you can deploy to any host (Netlify, Vercel, GitHub Pages, S3, etc.).

### Preview the production build locally

```bash
npm run preview
```

---

## Project structure

```
droppii-test/
├── public/               # Static assets (favicon, icons)
├── src/
│   ├── components/
│   │   ├── Brand.jsx     # Droppii logo + brand pattern components
│   │   ├── SellerEntry.jsx  # Name / ID entry screen
│   │   ├── PreTest.jsx   # Instructions and start screen
│   │   ├── Test.jsx      # Test-taking screen (all question types)
│   │   ├── Result.jsx    # Score, breakdown, answer review
│   │   └── Certificate.jsx  # Printable certificate
│   ├── data/
│   │   └── questions.js  # All 8 questions + test metadata
│   ├── App.jsx           # Root component, state machine, tweaks panel
│   ├── index.css         # Global styles + design tokens
│   └── main.jsx          # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Customisation

### Changing questions

Edit `src/data/questions.js`. Each question has a `type` field:

- `"single"` — single-choice (radio)
- `"multi"` — multiple correct answers (checkboxes)
- `"short"` — free-text answer (graded manually)
- `"scenario"` — customer message + single-choice reply

### Changing brand colours

Open the app in the browser and click the **Tweaks** button (bottom-right corner) to switch between brand presets or set custom colours live.

To change the defaults, edit `DEFAULT_TWEAKS` in `src/App.jsx`.

### Replacing the logo

The logo is a typographic recreation of the Droppii wordmark. To replace it with the real SVG, update the `DroppiiLogo` component in `src/components/Brand.jsx`.

---

## Deployment

The `dist/` folder is a static site with no server requirements.

**Netlify (drag-and-drop):** Run `npm run build`, then drag the `dist/` folder to [netlify.com/drop](https://netlify.com/drop).

**Vercel:** `npx vercel dist/`

**GitHub Pages:** Push the repo, go to Settings → Pages → deploy from the `gh-pages` branch, and run `npx gh-pages -d dist` to publish.

---

## License

Internal use — Droppii Co., Ltd.
