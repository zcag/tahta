<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const stats = computed(() => $frontmatter.stats || [])
const cols = computed(() => $frontmatter.columns || Math.min(stats.value.length || 3, 4))
const numSize = computed(() => (cols.value >= 4 ? 'fs-stat-lg' : 'fs-stat-xl'))
</script>

<template>
  <SlideFrame mode="topic">
    <div class="stat-grid" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, textAlign: 'center' }">
      <Reveal v-for="(s, i) in stats" :key="i" :delay="i * 90">
        <div class="stat">
          <Icon v-if="s.icon" :name="s.icon" class="stat-icon" />
          <div :class="['stat-num', 'accent-num', numSize]">{{ s.value }}<span v-if="s.unit" class="stat-unit">{{ s.unit }}</span></div>
          <div v-if="s.label" class="stat-label">{{ s.label }}</div>
        </div>
      </Reveal>
    </div>
  </SlideFrame>
</template>
