# tahta-grade — visual grading for the tahta theme

The repo-internal dev loop for building `slidev-theme-tahta`. It exports every slide to
PNG (optionally across variants), runs automated checks, and builds a side-by-side HTML
report with a tab per variant. Not published — it ships in this repo and runs from it.

```bash
npm run grade                                   # grade the example deck across variants
node packages/grade/cli.mjs slides.md           # grade any deck as authored
node packages/grade/cli.mjs slides.md --serve   # + serve the report (0.0.0.0)
node packages/grade/cli.mjs slides.md --watch   # re-grade on save (inner loop)
```

The blank/broken, regression, and overflow/contrast checks work on any Slidev deck; the
`--variants` cycling and the structural lint are tahta-specific (the reason it lives here,
not on npm).

## What it checks

- **Blank / broken** (always, PNG-only): near-uniform canvas, zero-dimension, too-few-colors. Catches failed renders, collapsed layouts, all-black slides.
- **Visual regression** (`--baseline`, on by default if a baseline exists): pixel-diff each slide against an accepted baseline; flags drift > 0.5% and writes a diff image. `--update-baseline` to accept the current render.
- **Overflow & contrast** (`--checks`, opt-in): drives playwright-chromium to measure real DOM — content overflowing the slide frame (which a PNG can't show, since it's clipped) and large-text contrast ratio. Decorative elements (ghost numerals, glows, bleed art) are excluded from the overflow measure.

## Options

| flag | effect |
|---|---|
| `--variants a,b,c` | render each `themeConfig.variant` (patched in place, restored after) |
| `--baseline <dir>` | baseline dir for regression diff (default `.tahta/baseline`) |
| `--update-baseline` | accept current render as the baseline |
| `--checks` | overflow + contrast via playwright (needs `playwright-chromium`) |
| `--out <dir>` | output dir (default `.tahta/grade`) |
| `--serve [port]` · `--open` · `--watch` | serve / open / re-grade on change |
| `--timeout <ms>` | per-export timeout |

Exits non-zero when any slide is flagged — drop it in CI:

```yaml
- run: node packages/grade/cli.mjs slides.md --variants editorial,brutalist,soft,minimal --checks
```
