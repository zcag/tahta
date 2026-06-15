<script setup>
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout l-lead">
    <SlideBg />
    <div v-if="fm.glow !== false" class="glow" />
    <Ghost :text="fm.index ?? ''" />
    <Reveal class="l-lead-inner">
      <Fit>
        <div class="lead-body">
          <div class="accent-bar" />
          <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
          <h1 v-html="fm.title" />
          <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
          <slot />
        </div>
      </Fit>
    </Reveal>
    <Foot />
  </div>
</template>
