<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Auto fit-to-frame: if content is taller than the available area, scale it down (never up).
// transform doesn't affect layout, so scrollHeight stays truthful and there's no feedback loop.
const FLOOR = 0.42  // never shrink below this — past it text is illegible; the slide should be split
const outer = ref(null), inner = ref(null), scale = ref(1), overflow = ref(false)
let ro, warned = false
function fit () {
  if (!outer.value || !inner.value) return
  const avail = outer.value.clientHeight
  const h = inner.value.scrollHeight
  const ideal = avail / h
  scale.value = h > avail + 1 ? Math.max(FLOOR, ideal) : 1
  // Even at the floor the content still spills the frame — an author signal to split the slide.
  // Surfaced as a one-shot console warning (visible in `slidev dev`/export) and a DOM attribute
  // so a render gate (qa harness) or tela can detect it programmatically.
  overflow.value = ideal < FLOOR
  if (overflow.value && !warned) {
    warned = true
    console.warn(`[tahta] slide content overflows even at min scale (${FLOOR}): ${Math.round(h)}px of content in a ${Math.round(avail)}px frame — split this slide or trim its content.`)
  }
}
onMounted(() => { fit(); ro = new ResizeObserver(() => fit()); ro.observe(inner.value); ro.observe(outer.value) })
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <!-- When scaling, top-align: transform-origin is top so the shrunk content must
       grow from the top edge, not center on its unscaled (taller) box and bleed upward. -->
  <div ref="outer" class="fit" :data-fit-overflow="overflow || null" :style="{ justifyContent: scale < 1 ? 'flex-start' : null }">
    <div ref="inner" class="fit-inner" :style="{ transform: `scale(${scale})` }"><slot /></div>
  </div>
</template>
