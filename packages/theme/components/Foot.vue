<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
// mark = show the small brand logo in the footer (content slides). Openers pass :mark="false"
// (they carry the hero logo instead); any slide can opt out with `mark: false` in frontmatter.
const props = defineProps({ mark: { type: Boolean, default: true } })
const { $frontmatter, $page, $nav, $slidev } = useSlideContext()
const pad = (n) => String(n ?? '').padStart(2, '0')
// Title may carry accent markup (e.g. <span class="accent2">…</span>) for the cover;
// the footer is plain mono text, so strip any tags rather than print them literally.
const strip = (s) => String(s ?? '').replace(/<[^>]*>/g, '')
const left = () => strip($frontmatter.foot ?? $slidev?.configs?.title ?? '')
const showMark = computed(() => props.mark && $frontmatter.mark !== false)
</script>

<template>
  <div class="foot">
    <span class="foot-left"><BrandLogo v-if="showMark" mode="mark" />{{ left() }}</span>
    <span><span class="pg">{{ pad($page) }}</span> / {{ pad($nav?.total) }}</span>
  </div>
</template>
