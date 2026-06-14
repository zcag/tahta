<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Auto fit-to-frame: if content is taller than the available area, scale it down (never up).
// transform doesn't affect layout, so scrollHeight stays truthful and there's no feedback loop.
const outer = ref(null), inner = ref(null), scale = ref(1)
let ro
function fit () {
  if (!outer.value || !inner.value) return
  const avail = outer.value.clientHeight
  const h = inner.value.scrollHeight
  scale.value = h > avail + 1 ? Math.max(0.42, avail / h) : 1
}
onMounted(() => { fit(); ro = new ResizeObserver(() => fit()); ro.observe(inner.value); ro.observe(outer.value) })
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <!-- When scaling, top-align: transform-origin is top so the shrunk content must
       grow from the top edge, not center on its unscaled (taller) box and bleed upward. -->
  <div ref="outer" class="fit" :style="{ justifyContent: scale < 1 ? 'flex-start' : null }">
    <div ref="inner" class="fit-inner" :style="{ transform: `scale(${scale})` }"><slot /></div>
  </div>
</template>
