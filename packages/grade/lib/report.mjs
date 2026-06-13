import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

/** results: [{ variant, dir, slides: [{ index, rel, a, flags }] }]  → writes outDir/index.html */
export function writeReport (outDir, results, meta = {}) {
  const totalFlags = results.reduce((s, r) => s + r.slides.filter(x => x.flags.length).length, 0)
  const tabs = results.map((r, i) => {
    const bad = r.slides.filter(s => s.flags.length).length
    return `<button class="tab${i === 0 ? ' on' : ''}" data-i="${i}">${esc(r.variant || 'deck')}${bad ? ` <em>${bad}</em>` : ''}</button>`
  }).join('')

  const panels = results.map((r, i) => {
    const cards = r.slides.map(s => {
      const bad = s.flags.length > 0
      return `<figure class="card${bad ? ' bad' : ''}">
        <a href="${esc(s.rel)}" target="_blank"><img loading="lazy" src="${esc(s.rel)}" alt="slide ${s.index}"></a>
        <figcaption><span class="n">${s.index}</span>${bad ? `<span class="warn">${s.flags.map(esc).join(' · ')}</span>` : `<span class="ok">${s.a.distinctColors} colors · σ${s.a.luminanceStd}</span>`}</figcaption>
      </figure>`
    }).join('')
    return `<section class="panel${i === 0 ? ' on' : ''}" data-i="${i}"><div class="grid">${cards}</div></section>`
  }).join('')

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>tahta · grade — ${esc(meta.title || 'deck')}</title>
<style>
:root{--bg:#0b0d12;--surface:#141821;--line:#252b38;--fg:#e9ecf2;--dim:#8b94a7;--accent:#6aa0f0;--bad:#ff5c5c}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 ui-sans-serif,system-ui,sans-serif}
header{position:sticky;top:0;z-index:5;background:rgba(11,13,18,.86);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:14px 22px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.brand{font-weight:800;letter-spacing:-.02em}.brand b{color:var(--accent)}
.meta{color:var(--dim);font:12px/1 ui-monospace,monospace}
.summary{margin-left:auto;font:12px/1 ui-monospace,monospace;color:var(--dim)}
.summary .flagged{color:var(--bad)}.summary .clean{color:var(--accent)}
.tabs{display:flex;gap:6px;padding:12px 22px 0;flex-wrap:wrap}
.tab{background:var(--surface);border:1px solid var(--line);color:var(--dim);border-radius:8px;padding:6px 14px;font:600 13px/1 ui-sans-serif;cursor:pointer;text-transform:capitalize}
.tab.on{color:var(--fg);border-color:var(--accent)}
.tab em{color:var(--bad);font-style:normal;font:700 11px/1 ui-monospace,monospace;margin-left:4px}
.panel{display:none;padding:18px 22px 60px}.panel.on{display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:16px}
.card{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.card.bad{border-color:var(--bad);box-shadow:0 0 0 1px var(--bad) inset}
.card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#000}
figcaption{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;font:12px/1.3 ui-monospace,monospace}
.n{color:var(--dim)}.ok{color:var(--dim)}.warn{color:var(--bad);text-align:right}
</style></head>
<body>
<header>
  <span class="brand"><b>tahta</b> · grade</span>
  <span class="meta">${esc(meta.title || '')}</span>
  <span class="summary">${totalFlags ? `<span class="flagged">${totalFlags} flagged</span>` : `<span class="clean">all clean</span>`} · ${esc(meta.stamp || '')}</span>
</header>
<div class="tabs">${tabs}</div>
${panels}
<script>
const tabs=[...document.querySelectorAll('.tab')],panels=[...document.querySelectorAll('.panel')]
tabs.forEach(t=>t.onclick=()=>{const i=t.dataset.i;tabs.forEach(x=>x.classList.toggle('on',x.dataset.i===i));panels.forEach(p=>p.classList.toggle('on',p.dataset.i===i))})
</script>
</body></html>`
  writeFileSync(join(outDir, 'index.html'), html)
  return totalFlags
}
