<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const side = computed(() => $frontmatter.side || 'right')
const bg = computed(() => ({ backgroundImage: `url(${$frontmatter.image})` }))
</script>
<template>
  <div :class="['slidev-layout', 'l-split', side === 'left' ? 'showcase flip' : 'showcase']">
    <div v-if="side === 'left'" class="showcase-media" :style="bg" />
    <div class="showcase-body">
      <Fit>
        <Reveal>
          <div v-if="$frontmatter.kicker" class="kicker">{{ $frontmatter.kicker }}</div>
          <h1 v-if="$frontmatter.title" class="fs-h2 mw-title" v-html="$frontmatter.title" />
          <div v-if="$frontmatter.subtitle" class="fs-lead dim mt-5 mw-lead" v-html="$frontmatter.subtitle" />
          <slot />
        </Reveal>
      </Fit>
    </div>
    <div v-if="side !== 'left'" class="showcase-media" :style="bg" />
    <Foot />
  </div>
</template>
