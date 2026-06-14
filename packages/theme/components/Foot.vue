<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter, $page, $nav, $slidev } = useSlideContext()
const pad = (n) => String(n ?? '').padStart(2, '0')
// Title may carry accent markup (e.g. <span class="accent2">…</span>) for the cover;
// the footer is plain mono text, so strip any tags rather than print them literally.
const strip = (s) => String(s ?? '').replace(/<[^>]*>/g, '')
const left = () => strip($frontmatter.foot ?? $slidev?.configs?.title ?? '')
</script>

<template>
  <div class="foot">
    <span>{{ left() }}</span>
    <span><span class="pg">{{ pad($page) }}</span> / {{ pad($nav?.total) }}</span>
  </div>
</template>
