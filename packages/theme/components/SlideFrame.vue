<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

// One frame to rule the common layouts. Reads the slide frontmatter and renders
// the shared chrome (glow · ghost · kicker · title · footer) so layouts stay ~3 lines.
const props = defineProps({
  mode: { type: String, default: 'topic' }, // topic | cover | section | statement | end
})
const { $frontmatter: fm } = useSlideContext()
const showGlow = computed(() => {
  if (props.mode === 'topic') return fm.glow === true
  return fm.glow !== false
})
</script>

<template>
  <!-- COVER -->
  <div v-if="mode === 'cover'" class="slidev-layout l-cover">
    <div v-if="showGlow" class="glow" />
    <div class="l-center">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h1 class="fs-cover mw-cover" v-html="fm.title" />
      <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
      <slot />
    </div>
    <Foot />
  </div>

  <!-- SECTION -->
  <div v-else-if="mode === 'section'" class="slidev-layout l-topic">
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.index ?? ''" />
    <div class="l-body">
      <div v-if="fm.index" class="stat-num accent-num fs-stat-sm mb-4">{{ fm.index }}</div>
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h1 class="fs-section mw-title" v-html="fm.title" />
      <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
      <slot />
    </div>
    <Foot />
  </div>

  <!-- STATEMENT (also used by quote, with custom body) -->
  <div v-else-if="mode === 'statement'" class="slidev-layout l-statement">
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.ghost ?? ''" />
    <div class="l-center">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h2 v-if="fm.title" class="fs-h2 mb-10" v-html="fm.title" />
      <slot />
    </div>
    <Foot />
  </div>

  <!-- END -->
  <div v-else-if="mode === 'end'" class="slidev-layout l-end">
    <div class="glow" />
    <div class="l-center middle">
      <div class="accent-bar mb-8" />
      <h1 class="fs-cover" v-html="fm.title || 'Thanks'" />
      <div v-if="fm.subtitle" class="fs-lead dim mt-4" v-html="fm.subtitle" />
      <div v-if="fm.contact" class="kicker mt-8" style="justify-content:center">{{ fm.contact }}</div>
      <slot />
    </div>
    <Foot />
  </div>

  <!-- TOPIC (default: head on top, body centered below) -->
  <div v-else class="slidev-layout l-topic">
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.ghost ?? ''" />
    <div v-if="fm.kicker || fm.title" class="l-head">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h2 v-if="fm.title" class="fs-h2" v-html="fm.title" />
    </div>
    <div class="l-body"><slot /></div>
    <Foot />
  </div>
</template>
