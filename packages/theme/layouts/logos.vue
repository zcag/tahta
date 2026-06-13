<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const logos = computed(() => $frontmatter.logos || [])
const cols = computed(() => $frontmatter.columns || Math.min(logos.value.length || 4, 5))
</script>
<template>
  <SlideFrame mode="topic">
    <div class="logos" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }">
      <Reveal v-for="(l, i) in logos" :key="i" :delay="i * 70" class="logo-cell">
        <Icon v-if="l.icon" :name="l.icon" />
        <div class="logo-text">{{ l.text || l.name }}</div>
      </Reveal>
    </div>
  </SlideFrame>
</template>
