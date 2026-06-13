<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter, $page, $nav, $slidev } = useSlideContext()
const pad = (n) => String(n ?? '').padStart(2, '0')
const left = () => $frontmatter.foot ?? $slidev?.configs?.title ?? ''
</script>

<template>
  <div class="foot">
    <span>{{ left() }}</span>
    <span><span class="pg">{{ pad($page) }}</span> / {{ pad($nav?.total) }}</span>
  </div>
</template>
