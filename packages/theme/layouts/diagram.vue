<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useSlideContext, useIsSlideActive } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
const active = useIsSlideActive()
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

// Opt-in `build: true` — cascade the diagram's pieces in on entry, ordered by vertical
// position (a sequence reads top→down chronologically; a TD flowchart roughly follows its
// flow). The teaching "watch it assemble" beat, for the diagrams where the build-up is the
// point — not every diagram. Skipped in print/export + reduced-motion (static = whole
// diagram). Composes with `highlight`: after it settles we clear inline opacity and re-run
// decorate() so the accent path takes over.
const REDUCE = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const isPrint = () => typeof document !== 'undefined' && !!document.querySelector('.print,.slidev-print,[data-print],.export')
const BUILD_SEL = '.node,.cluster,.flowchart-link,.edgePaths path,.edgeLabel,.messageText,.messageLine0,.messageLine1,.note,.noteText,.loopLine,.loopText,.labelText,.activation0,.activation1,.activation2'
let built = false, bRaf, bClear, bEls = []
function clearStyles () { bEls.forEach(el => { el.style.opacity = el.style.transition = el.style.transitionDelay = '' }) }
function cancelBuild () { cancelAnimationFrame(bRaf); clearTimeout(bClear); clearStyles(); bEls = [] }
function buildIn (svg) {
  if (built || !fm.build || REDUCE || isPrint()) return
  const els = [...svg.querySelectorAll(BUILD_SEL)]
  if (!els.length) return
  built = true
  const y = (el) => { try { const b = el.getBBox(); return b.y + b.height / 2 } catch { return 0 } }
  els.sort((a, b) => y(a) - y(b))
  bEls = els
  const step = Math.min(110, 1300 / els.length)
  els.forEach((el, i) => { el.style.opacity = '0'; el.style.transition = 'opacity .42s ease'; el.style.transitionDelay = `${Math.round(i * step)}ms` })
  bRaf = requestAnimationFrame(() => requestAnimationFrame(() => els.forEach(el => { el.style.opacity = '1' })))
  bClear = setTimeout(() => { clearStyles(); decorate() }, els.length * step + 520)
}

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
const tryBuild = () => {
  const svg = stage.value?.querySelector('.mermaid')?.shadowRoot?.querySelector('svg')
  if (svg) buildIn(svg)
}

onMounted(async () => {
  await nextTick()
  ro = new ResizeObserver(() => requestAnimationFrame(tick))
  if (stage.value) ro.observe(stage.value)
  const host = stage.value?.querySelector('.mermaid'); if (host) ro.observe(host)
  for (const t of [80, 250, 600, 1200]) setTimeout(tick, t)
})

// Build (and replay) when the slide is actually shown — mount fires while pre-rendered
// off-screen, so a mount-time cascade would finish before the audience sees it. Reset on
// leave so the next entry re-assembles. The mermaid SVG renders async (and can take >½s on
// first paint), so poll until buildIn finds elements rather than guessing a fixed delay.
let pollId
watch(active, (a) => {
  clearInterval(pollId)
  if (!a) { cancelBuild(); built = false; return }
  let n = 0
  pollId = setInterval(() => { tryBuild(); if (built || ++n > 40) clearInterval(pollId) }, 100)
}, { immediate: true })
onBeforeUnmount(() => { ro?.disconnect(); clearInterval(pollId) })
</script>

<template>
  <SlideFrame mode="topic">
    <div ref="stage" class="diagram-stage"><slot /></div>
    <p v-if="fm.note" class="diagram-note dim" v-html="fm.note" />
  </SlideFrame>
</template>
