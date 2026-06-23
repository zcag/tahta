import katex from 'katex'

// Render $inline$ and $$block$$ math inside a string to KaTeX HTML, leaving the
// rest (incl. our <span class="accent2"> / <em> markup) untouched. Used by the few
// layouts that inject frontmatter text via v-html (e.g. define) — slide BODIES get
// math from Slidev's own markdown pipeline and don't need this. KaTeX CSS is loaded
// by Slidev whenever the deck contains `$` (frontmatter counts), so the output is styled.
const render = (t, display) => {
  try { return katex.renderToString(t.trim(), { displayMode: display, throwOnError: false, output: 'html' }) }
  catch { return t }
}

export function tex (s) {
  if (typeof s !== 'string' || !s.includes('$')) return s
  return s
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => render(m, true))
    .replace(/\$([^$\n]+?)\$/g, (_, m) => render(m, false))
}

export default tex
