<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// A framed stage for a VISUAL: a ```mermaid fence (flowchart, sequence, ER, state,
// class…), a <Figure>, or composed markup. The Mermaid SVG is themed to the active
// variant from tokens (setup/mermaid.ts). Optional `note:` prints a caption.
//
// Teaching lever for FLOWCHARTS — `highlight: [Root, M, Hit]` accents that path (nodes
// + the edges between them) and dims the rest, so the point of the diagram pops. Matched
// by author node id in the rendered SVG (node id = `…-flowchart-<id>-<n>`, edge id =
// `…-L_<src>_<dst>_<n>`); keep node ids underscore-free so edges parse. Mermaid renders
// into a ShadowRoot, so we toggle classes there via an injected <style> (pure tokens).
const stage = ref(null)
const MAX = 2.4
let ro

function fit () {
  const el = stage.value; if (!el) return
  const host = el.querySelector('.mermaid'); if (!host) return
  host.style.transformOrigin = 'center center'; host.style.transform = 'none'
  const h = host.getBoundingClientRect(); const s = el.getBoundingClientRect()
  if (!h.width || !h.height) return
  const scale = Math.min((s.width * 0.96) / h.width, (s.height * 0.94) / h.height, MAX)
  if (scale > 0 && isFinite(scale)) host.style.transform = `scale(${scale})`
}

const STYLE_ID = 'tahta-diagram-style'
const CSS = `
.tahta-dim{opacity:.18}
.node.tahta-hi rect,.node.tahta-hi circle,.node.tahta-hi ellipse,.node.tahta-hi polygon,
.node.tahta-hi path,.node.tahta-hi .label-container{stroke:var(--accent) !important;stroke-width:3px !important}
.flowchart-link.tahta-hi{stroke:var(--accent) !important;stroke-width:2.5px !important}`
function ensureStyle (sr) {
  if (!sr || sr.getElementById?.(STYLE_ID)) return
  const s = document.createElement('style'); s.id = STYLE_ID; s.textContent = CSS; sr.appendChild(s)
}

const nodeIdOf = (el) => { const m = /flowchart-(.+?)-\d+$/.exec(el.id || ''); return m && m[1] }
const edgeEndsOf = (el) => { const m = /L_([^_]+)_([^_]+)_\d+$/.exec(el.id || ''); return m && [m[1], m[2]] }

function decorate () {
  const svg = stage.value?.querySelector('.mermaid')?.shadowRoot?.querySelector('svg')
  if (!svg) return
  ensureStyle(svg.parentNode)
  const hi = Array.isArray(fm.highlight) ? new Set(fm.highlight) : null
  if (!hi) return
  svg.querySelectorAll('.node').forEach(n => {
    const id = nodeIdOf(n); n.classList.toggle('tahta-hi', hi.has(id)); n.classList.toggle('tahta-dim', !!id && !hi.has(id))
  })
  svg.querySelectorAll('.flowchart-link, .edgePaths path').forEach(e => {
    const en = edgeEndsOf(e); const on = en && hi.has(en[0]) && hi.has(en[1])
    e.classList.toggle('tahta-hi', !!on); e.classList.toggle('tahta-dim', !on)
  })
}

const tick = () => { fit(); decorate() }

onMounted(async () => {
  await nextTick()
  ro = new ResizeObserver(() => requestAnimationFrame(tick))
  if (stage.value) ro.observe(stage.value)
  const host = stage.value?.querySelector('.mermaid'); if (host) ro.observe(host)
  for (const t of [80, 250, 600, 1200]) setTimeout(tick, t)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <SlideFrame mode="topic">
    <div ref="stage" class="diagram-stage"><slot /></div>
    <p v-if="fm.note" class="diagram-note dim" v-html="fm.note" />
  </SlideFrame>
</template>
