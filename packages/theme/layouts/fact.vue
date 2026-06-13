<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
</script>

<template>
  <SlideFrame mode="statement">
    <Reveal>
      <div class="fact-num">{{ $frontmatter.value }}<span v-if="$frontmatter.unit" class="stat-unit">{{ $frontmatter.unit }}</span></div>
      <div v-if="$frontmatter.label" class="fs-lead dim mt-4 mw-lead" v-html="$frontmatter.label" />
    </Reveal>
  </SlideFrame>
</template>
