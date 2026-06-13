<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const stats = computed(() => $frontmatter.stats || [])
const cols = computed(() => $frontmatter.columns || Math.min(stats.value.length || 3, 4))
const numSize = computed(() => (cols.value >= 4 ? 'text-6xl' : 'text-8xl'))
</script>

<template>
  <div class="slidev-layout l-topic">
    <Ghost :text="$frontmatter.ghost ?? ''" />
    <div class="l-head" v-if="$frontmatter.kicker || $frontmatter.title">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
    </div>
    <div class="l-body">
      <div class="stat-grid" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, textAlign: 'center' }">
        <div v-for="(s, i) in stats" :key="i" class="stat">
          <div :class="['stat-num', 'accent-num', numSize]">{{ s.value }}<span class="stat-unit" v-if="s.unit">{{ s.unit }}</span></div>
          <div class="stat-label text-lg">{{ s.label }}</div>
        </div>
      </div>
    </div>
    <Foot />
  </div>
</template>
