<script setup>
// Per-slide background slot, rendered in-layout (works in dev / print / export alike,
// unlike a global/slide-top component which lands in a separate DOM subtree on export).
// `bg:` frontmatter → a generated, accent-derived background (mesh / aurora / grain /
// dots / grid), or an image path which gets an automatic contrast scrim. Rendered as
// an early child so it sits behind content (like .glow); painting lives in index.css.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
const IMAGEY = /^(https?:|\/|\.\/|\.\.\/|data:)|\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i
const kind = computed(() => { const b = fm.bg; return b ? (IMAGEY.test(b) ? 'image' : b) : null })
const style = computed(() => (kind.value === 'image' ? { '--bg-image': `url("${fm.bg}")` } : null))
</script>

<template>
  <div v-if="kind" class="slide-bg" :data-bg="kind" :style="style" />
</template>
