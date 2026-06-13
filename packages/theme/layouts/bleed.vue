<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const duotone = computed(() => $frontmatter.duotone !== false)
const bg = computed(() => ({ backgroundImage: `url(${$frontmatter.image})` }))
</script>

<template>
  <div class="slidev-layout l-bleed">
    <div class="bleed-img" :class="{ duotone }" :style="bg"></div>
    <div class="bleed-duotone" v-if="duotone"></div>
    <div class="bleed-scrim"></div>
    <div class="l-center" style="z-index: 3">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <div class="stat-num accent-num" style="font-size: 11rem; line-height: 0.84" v-if="$frontmatter.stat">{{ $frontmatter.stat }}</div>
      <h2 class="text-4xl" style="max-width: 22ch" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
      <div class="text-xl mt-3 bleed-sub" style="max-width: 38ch" v-if="$frontmatter.subtitle" v-html="$frontmatter.subtitle"></div>
      <slot />
    </div>
    <Foot />
  </div>
</template>
