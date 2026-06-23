<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// A framed stage for a VISUAL: a ```mermaid fence (flowchart, sequence, ER, state,
// class…), a <Figure>, or any composed diagram in the slide body. The Mermaid SVG is
// themed to the active variant from tokens (setup/mermaid.ts), so a diagram reskins
// with the deck like every other layout. Optional `note:` prints a caption.
//
// Mermaid renders at its own modest pixel size inside a ShadowRoot; since it's vector,
// we auto-scale the host UP to fill the stage (capped), so a small graph isn't lost in
// a 1080p frame. Re-fits as the async render settles and on resize.
const stage = ref(null)
const MAX = 2.4
let ro
function fit () {
  const el = stage.value
  if (!el) return
  const host = el.querySelector('.mermaid')
  if (!host) return
  host.style.transformOrigin = 'center center'
  host.style.transform = 'none'
  const h = host.getBoundingClientRect()
  const s = el.getBoundingClientRect()
  if (!h.width || !h.height) return
  const scale = Math.min((s.width * 0.96) / h.width, (s.height * 0.94) / h.height, MAX)
  if (scale > 0 && isFinite(scale)) host.style.transform = `scale(${scale})`
}
onMounted(async () => {
  await nextTick()
  ro = new ResizeObserver(() => requestAnimationFrame(fit))
  if (stage.value) ro.observe(stage.value)
  const host = stage.value?.querySelector('.mermaid')
  if (host) ro.observe(host)
  // the SVG lands asynchronously — re-fit a few times as it settles (export waits for it)
  for (const t of [80, 250, 600, 1200]) setTimeout(fit, t)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <SlideFrame mode="topic">
    <div ref="stage" class="diagram-stage"><slot /></div>
    <p v-if="fm.note" class="diagram-note dim" v-html="fm.note" />
  </SlideFrame>
</template>
