# Vanta / Consultancy intelligence workspace

A polished static consultancy analytics workspace for organizing case studies, evidence, taxonomy, signals, and engagement pipeline activity.

## Run locally

No build step is required. Open `index.html` directly in a browser, or serve the directory with any static server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Included workflows

- Overview dashboard with engagement, evidence, impact, and decision-velocity metrics
- Evidence momentum chart and practice coverage view
- Case library with text search, status filters, confidence scores, labels, and impact values
- New case editor with structured fields for category, methods, tags, confidence, and working thesis
- Local persistence through `localStorage`, so new case records survive refreshes in the same browser
- JSON export for taking the case library into another system
- Taxonomy view for practice areas, research methods, and outcome tags
- Engagement pipeline, signal monitor, and workspace settings views
- Responsive layout for desktop and narrow screens

## Notes

This is intentionally frontend-only. The seeded data is in `app.js`, and saved records are stored under the `vanta-cases` local storage key. Fonts load from Google Fonts when online; the page remains usable if the font request is unavailable.