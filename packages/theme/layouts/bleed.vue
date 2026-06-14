<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const duotone = computed(() => $frontmatter.duotone !== false)
const bg = computed(() => ({ backgroundImage: `url(${$frontmatter.image})` }))
</script>

<template>
  <div class="slidev-layout l-bleed">
    <SlideBg />
    <div class="bleed-img" :class="{ duotone }" :style="bg" />
    <div v-if="duotone" class="bleed-duotone" />
    <div class="bleed-scrim" />
    <div class="l-center" style="z-index: 3">
      <div v-if="$frontmatter.kicker" class="kicker">{{ $frontmatter.kicker }}</div>
      <div v-if="$frontmatter.stat" class="stat-num accent-num fs-bleed-stat">{{ $frontmatter.stat }}</div>
      <h2 v-if="$frontmatter.title" class="fs-h2 mw-title" v-html="$frontmatter.title" />
      <div v-if="$frontmatter.subtitle" class="fs-lead mt-3 bleed-sub mw-lead" v-html="$frontmatter.subtitle" />
      <slot />
    </div>
    <Foot />
  </div>
</template>
