<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Auto fit-to-frame: if content is taller than the available area, scale it down (never up).
// transform doesn't affect layout, so scrollHeight stays truthful and there's no feedback loop.
const FLOOR = 0.42  // never shrink below this — past it text is illegible; the slide should be split
const outer = ref(null), inner = ref(null), scale = ref(1), overflow = ref(false)
let ro, warned = false

// Available height. outer is `.fit { height:100% }`, which is correct under Slidev's dev
// canvas — but a one-shot export host (tela renders via `slidev export`) can leave the
// percentage-height chain unresolved, inflating outer.clientHeight so nothing ever scales
// and the centered title overflows + clips. So also derive the height from the real visible
// frame (`.slidev-layout`, which has overflow:hidden + a definite height) and take the
// smaller. Layout px throughout (offsetTop, clientHeight) — immune to Slidev's slide transform.
function avail () {
  let a = outer.value.clientHeight
  const frame = outer.value.closest('.slidev-layout')
  if (frame) {
    let top = 0, el = outer.value
    while (el && el !== frame) { top += el.offsetTop; el = el.offsetParent }
    const framed = frame.clientHeight - 2 * top  // Fit's layouts center content → inset is symmetric
    if (framed > 0) a = Math.min(a, framed)
  }
  return a
}

function fit () {
  if (!outer.value || !inner.value) return
  const av = avail()
  const h = inner.value.scrollHeight
  if (!av || !h) return  // not laid out yet (inactive / 0×0 slide) — a later signal will re-fit
  const ideal = av / h
  scale.value = h > av + 1 ? Math.max(FLOOR, ideal) : 1
  // Even at the floor the content still spills the frame — an author signal to split the slide.
  // Surfaced as a one-shot console warning (visible in `slidev dev`/export) and a DOM attribute
  // so a render gate (qa harness) or tela can detect it programmatically.
  overflow.value = ideal < FLOOR
  if (overflow.value && !warned) {
    warned = true
    console.warn(`[tahta] slide content overflows even at min scale (${FLOOR}): ${Math.round(h)}px of content in a ${Math.round(av)}px frame — split this slide or trim its content.`)
  }
}
onMounted(() => {
  fit()
  ro = new ResizeObserver(() => fit()); ro.observe(inner.value); ro.observe(outer.value)
  requestAnimationFrame(fit)              // re-fit after first layout/paint settles
  // Web fonts swap in after mount and reflow the text; without this re-measure a one-shot
  // export can snapshot the pre-swap (unscaled) state with the final font already painted.
  if (typeof document !== 'undefined' && document.fonts) document.fonts.ready.then(fit)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <!-- When scaling, top-align: transform-origin is top so the shrunk content must
       grow from the top edge, not center on its unscaled (taller) box and bleed upward. -->
  <div ref="outer" class="fit" :data-fit-overflow="overflow || null" :style="{ justifyContent: scale < 1 ? 'flex-start' : null }">
    <div ref="inner" class="fit-inner" :style="{ transform: `scale(${scale})` }"><slot /></div>
  </div>
</template>
