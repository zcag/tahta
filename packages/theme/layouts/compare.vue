<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const rows = computed(() => $frontmatter.rows || [])
const cols = computed(() => $frontmatter.columns || ['Metric', 'Before', 'After', 'Δ'])
</script>

<template>
  <div class="slidev-layout l-topic">
    <div class="l-head" v-if="$frontmatter.kicker || $frontmatter.title">
      <div class="kicker" v-if="$frontmatter.kicker">{{ $frontmatter.kicker }}</div>
      <h2 class="text-4xl" v-if="$frontmatter.title" v-html="$frontmatter.title"></h2>
    </div>
    <div class="l-body">
      <table>
        <thead><tr><th v-for="(c, i) in cols" :key="i">{{ c }}</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i">
            <td>{{ r.metric }}</td>
            <td style="color:var(--fg-dim)">{{ r.before }}</td>
            <td><strong>{{ r.after }}</strong></td>
            <td class="accent2" v-if="r.delta !== undefined">{{ r.delta }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Foot />
  </div>
</template>
