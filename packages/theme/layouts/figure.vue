<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-figure">
    <SlideBg />
    <Ghost :text="fm.ghost ?? ''" />
    <Reveal class="figure-num">
      <span class="stat-num accent-num" v-html="fm.value" /><span v-if="fm.unit" class="stat-unit">{{ fm.unit }}</span>
    </Reveal>
    <Reveal class="figure-aside" :delay="120">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <div v-if="fm.label" class="figure-label" v-html="fm.label" />
      <slot />
    </Reveal>
    <Foot />
  </div>
</template>
