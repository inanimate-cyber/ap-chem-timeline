# Why Might Chemistry Feel So Hard?

An interactive timeline that lets students see the same set of chemical
discoveries two ways: in the order history produced them, and in the order
AP Chemistry introduces them. Built to accompany an educational YouTube
channel. The app makes no argument about which order is "right" — it invites
curiosity about both.

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
```

## How it works

- **One dataset, two layouts.** Every discovery's position is precomputed for
  both views ([src/lib/layout.ts](src/lib/layout.ts)); the primary button just
  switches which target each point eases toward (1.8 s CSS transition with
  faint motion trails).
- **Historical mode:** x = year, y = AP topic.
- **Curriculum mode:** x = Unit 1–9 bands (chronological within each band),
  y = AP topic. Observations beneath the chart (median years per unit, spans,
  etc.) are computed from the dataset at render time, never hardcoded
  ([src/lib/stats.ts](src/lib/stats.ts)).

## Data model

The dataset lives at
[src/data/ap-chemistry/discoveries.json](src/data/ap-chemistry/discoveries.json).
Each discovery appears exactly once:

```jsonc
{
  "id": "lewis-structures",
  "year": 1916,
  "title": "Lewis Structures",
  "scientists": ["Gilbert N. Lewis"],
  "description": "Short historical significance…",
  "unit": 2,                          // primary AP unit
  "topic": "Lewis Theory & Molecular Geometry", // must match units.ts
  "additionalUnits": [8],             // optional: other units it appears under
  "additionalTopics": ["…"],          // optional: other topics it appears under
  "keywords": ["covalent bond", "octet"],
  "approximateYear": false,
  "landmark": true                    // renders a permanent label (~10–20 total)
}
```

Unit names, colors, and the y-axis topic order are defined in
[src/data/ap-chemistry/units.ts](src/data/ap-chemistry/units.ts). Unit colors
are exposed as CSS variables (`--unit-1` … `--unit-9`) in
[globals.css](src/app/globals.css) so dark mode can adjust hues.

> **Note:** the current dataset was researched and written as a seed. When the
> Notion export of the full dataset is available, consolidate it into this same
> file: merge duplicate discoveries (the same event listed under several AP
> topics) into one entry, keeping the primary unit/topic and recording the rest
> in `additionalUnits` / `additionalTopics`.

## Adding a subject

The visualization is subject-agnostic. To add General Chemistry, AP Biology,
etc.:

1. Create `src/data/<subject>/units.ts` and `discoveries.json`.
2. Register a `SubjectData` object in [src/data/subjects.ts](src/data/subjects.ts)
   and flip its listing to `available: true`.
3. Render `<TimelineExplorer subject={…} />` on a route.

## Deployment & feedback

The site deploys to GitHub Pages on every push to `main`
([deploy workflow](.github/workflows/deploy.yml)) as a static export
(`output: "export"` in [next.config.ts](next.config.ts)).

Because hosting is static, the feedback modal is a placeholder that logs
submissions to the browser console
([FeedbackWidget.tsx](src/components/FeedbackWidget.tsx)). To collect real
feedback, point `submit` at a form service (Formspree, Google Forms) or host
on a platform with server routes (e.g. Vercel) and restore an API route.
