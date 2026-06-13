<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const side = computed(() => $frontmatter.side || 'right')
const bg = computed(() => ({ backgroundImage: `url(${$frontmatter.image})` }))
</script>

<template>
  <div :class="['slidev-layout', 'l-split', side === 'left' ? 'split left' : 'split']">
    <div class="split-media" v-if="side === 'left'" :style="bg"></div>
    <div class="split-body">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl mb-4" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
      <div class="text-lg" style="color:var(--fg-dim)"><slot /></div>
    </div>
    <div class="split-media" v-if="side !== 'left'" :style="bg"></div>
    <Foot />
  </div>
</template>
