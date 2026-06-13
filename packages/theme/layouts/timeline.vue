<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const events = computed(() => $frontmatter.events || [])
</script>
<template>
  <SlideFrame mode="topic">
    <div class="timeline">
      <Reveal v-for="(e, i) in events" :key="i" :delay="i * 100" class="tl-item">
        <div class="tl-dot" />
        <div class="tl-date">{{ e.date }}</div>
        <div class="tl-title">{{ e.title }}</div>
        <div v-if="e.desc" class="tl-desc">{{ e.desc }}</div>
      </Reveal>
    </div>
  </SlideFrame>
</template>
