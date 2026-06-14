<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-bigtype">
    <SlideBg />
    <div v-if="fm.glow === true" class="glow" />
    <Fit>
      <Reveal class="bigtype-body">
        <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
        <h1 v-html="fm.title" />
        <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-6" v-html="fm.subtitle" />
        <slot />
      </Reveal>
    </Fit>
    <Foot />
  </div>
</template>
