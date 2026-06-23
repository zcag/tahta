<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const TONES = { good: '--good', warn: '--warn', bad: '--bad', info: '--info', accent: '--accent' }
const { $frontmatter } = useSlideContext()
const stats = computed(() => $frontmatter.stats || [])
const cols = computed(() => $frontmatter.columns || Math.min(stats.value.length || 3, 4))
const numSize = computed(() => (cols.value >= 4 ? 'fs-stat-lg' : 'fs-stat-xl'))
const toneStyle = (t) => t ? { color: `var(${TONES[t] || '--accent'})` } : null
</script>

<template>
  <SlideFrame mode="topic">
    <div class="stat-grid" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, textAlign: 'center' }">
      <Reveal v-for="(s, i) in stats" :key="i" :delay="i * 90">
        <div class="stat">
          <Icon v-if="s.icon" :name="s.icon" class="stat-icon" :style="toneStyle(s.tone)" />
          <div :class="['stat-num', numSize, !s.tone && 'accent-num']" :style="toneStyle(s.tone)"><Num :value="s.value" /><span v-if="s.unit" class="stat-unit" :style="toneStyle(s.tone)">{{ s.unit }}</span></div>
          <div v-if="s.label" class="stat-label">{{ s.label }}</div>
        </div>
      </Reveal>
    </div>
  </SlideFrame>
</template>
