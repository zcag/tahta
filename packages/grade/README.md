# tahta — visual grading for Slidev

The local-dev companion to `slidev-theme-tahta` (works with any Slidev deck). It exports every slide to PNG, runs automated checks, and builds a side-by-side HTML report with a tab per variant.

```bash
npx @zcag/tahta-grade slides.md                  # grade as authored
npx @zcag/tahta-grade slides.md --serve 4180     # + serve the report (0.0.0.0)
npx @zcag/tahta-grade slides.md --watch          # re-grade on save (inner loop)
```

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
- run: npx @zcag/tahta-grade slides.md --variants editorial,brutalist,soft,minimal --checks
```
