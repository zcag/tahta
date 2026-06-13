<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const rows = computed(() => $frontmatter.rows || [])
const cols = computed(() => $frontmatter.columns || ['Metric', 'Before', 'After', 'Δ'])
</script>

<template>
  <SlideFrame mode="topic">
    <table>
      <thead><tr><th v-for="(c, i) in cols" :key="i">{{ c }}</th></tr></thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i">
          <td>{{ r.metric }}</td>
          <td class="dim">{{ r.before }}</td>
          <td><strong>{{ r.after }}</strong></td>
          <td v-if="r.delta !== undefined" class="accent2">{{ r.delta }}</td>
        </tr>
      </tbody>
    </table>
  </SlideFrame>
</template>
