<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const props = defineProps({ mode: { type: String, default: 'topic' } })
const { $frontmatter: fm } = useSlideContext()
const showGlow = computed(() => props.mode === 'topic' ? fm.glow === true : fm.glow !== false)
</script>

<template>
  <!-- COVER -->
  <div v-if="mode === 'cover'" class="slidev-layout l-cover">
    <SlideBg />
    <div v-if="showGlow" class="glow" />
    <Reveal class="l-center">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h1 class="fs-cover mw-cover" v-html="fm.title" />
      <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
      <slot />
    </Reveal>
    <Foot />
  </div>

  <!-- SECTION -->
  <div v-else-if="mode === 'section'" class="slidev-layout l-topic">
    <SlideBg />
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.index ?? ''" />
    <Reveal class="l-body">
      <div v-if="fm.index" class="stat-num accent-num fs-stat-sm mb-4">{{ fm.index }}</div>
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h1 class="fs-section mw-title" v-html="fm.title" />
      <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
      <slot />
    </Reveal>
    <Foot />
  </div>

  <!-- STATEMENT (also quote / fact, with custom body) -->
  <div v-else-if="mode === 'statement'" class="slidev-layout l-statement">
    <SlideBg />
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.ghost ?? ''" />
    <Reveal class="l-center">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h2 v-if="fm.title" class="fs-h2 mb-10" v-html="fm.title" />
      <slot />
    </Reveal>
    <Foot />
  </div>

  <!-- END -->
  <div v-else-if="mode === 'end'" class="slidev-layout l-end">
    <SlideBg />
    <div class="glow" />
    <Reveal class="l-center middle">
      <div class="accent-bar mb-8" />
      <h1 class="fs-cover" v-html="fm.title || 'Thanks'" />
      <div v-if="fm.subtitle" class="fs-lead dim mt-4" v-html="fm.subtitle" />
      <div v-if="fm.contact" class="kicker mt-8" style="justify-content:center">{{ fm.contact }}</div>
      <slot />
    </Reveal>
    <Foot />
  </div>

  <!-- TOPIC -->
  <div v-else class="slidev-layout l-topic">
    <SlideBg />
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.ghost ?? ''" />
    <Reveal v-if="fm.kicker || fm.title" class="l-head">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h2 v-if="fm.title" class="fs-h2" v-html="fm.title" />
    </Reveal>
    <div class="l-body"><slot /></div>
    <Foot />
  </div>
</template>
