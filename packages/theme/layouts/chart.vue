<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const c = computed(() => $frontmatter.chart || {})
</script>

<template>
  <div class="slidev-layout l-topic">
    <div class="l-head" v-if="$frontmatter.kicker || $frontmatter.title">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
    </div>
    <div class="l-body">
      <div style="max-width: 62rem; width: 100%">
        <BarChart v-if="c.categories" :categories="c.categories" :series="c.series"
          :unit="c.unit || ''" :height="c.height || '350px'" :horizontal="c.horizontal !== false" />
      </div>
      <p class="mt-2 text-sm" style="color:var(--fg-dim)" v-if="$frontmatter.note" v-html="$frontmatter.note"></p>
    </div>
    <Foot />
  </div>
</template>
