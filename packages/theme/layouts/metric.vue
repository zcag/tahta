<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-metric">
    <SlideBg />
    <Ghost :text="fm.ghost ?? ''" />
    <Reveal class="metric-num">
      <span class="stat-num accent-num"><Num :value="fm.value" /></span><span v-if="fm.unit" class="stat-unit">{{ fm.unit }}</span>
    </Reveal>
    <Reveal class="metric-aside" :delay="120">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <div v-if="fm.label" class="metric-label" v-html="fm.label" />
      <slot />
    </Reveal>
    <Foot />
  </div>
</template>
