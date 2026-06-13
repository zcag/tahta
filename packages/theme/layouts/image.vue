<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const side = computed(() => $frontmatter.side || 'right')
const bg = computed(() => ({ backgroundImage: `url(${$frontmatter.image})` }))
</script>

<template>
  <div :class="['slidev-layout', 'l-split', side === 'left' ? 'split left' : 'split']">
    <div v-if="side === 'left'" class="split-media" :style="bg" />
    <div class="split-body">
      <div v-if="$frontmatter.kicker" class="kicker">{{ $frontmatter.kicker }}</div>
      <h2 v-if="$frontmatter.title" class="fs-h2 mb-4" v-html="$frontmatter.title" />
      <div class="fs-body dim"><slot /></div>
    </div>
    <div v-if="side !== 'left'" class="split-media" :style="bg" />
    <Foot />
  </div>
</template>
