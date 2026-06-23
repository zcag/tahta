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
      <Fit>
        <BrandLogo mode="hero" />
        <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
        <h1 class="fs-cover mw-cover" v-html="fm.title" />
        <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
        <slot />
      </Fit>
    </Reveal>
    <Foot :mark="false" />
  </div>

  <!-- SECTION -->
  <div v-else-if="mode === 'section'" class="slidev-layout l-topic">
    <SlideBg />
    <SectionRail />
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.index ?? ''" />
    <Reveal class="l-body">
      <Fit>
        <BrandLogo mode="hero" />
        <div v-if="fm.index" class="stat-num accent-num fs-stat-sm mb-4">{{ fm.index }}</div>
        <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
        <h1 class="fs-section mw-title" v-html="fm.title" />
        <div v-if="fm.subtitle" class="fs-lead mw-lead dim mt-5" v-html="fm.subtitle" />
        <slot />
      </Fit>
    </Reveal>
    <Foot :mark="false" />
  </div>

  <!-- STATEMENT (also quote / fact, with custom body) -->
  <div v-else-if="mode === 'statement'" class="slidev-layout l-statement">
    <SlideBg />
    <SectionRail />
    <div v-if="showGlow" class="glow" />
    <Ghost :text="fm.ghost ?? ''" />
    <Reveal class="l-center">
      <Fit>
        <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
        <h2 v-if="fm.title" class="fs-h2 mb-10" v-html="fm.title" />
        <slot />
      </Fit>
    </Reveal>
    <Foot />
  </div>

  <!-- END -->
  <div v-else-if="mode === 'end'" class="slidev-layout l-end">
    <SlideBg />
    <div class="glow" />
    <Reveal class="l-center middle">
      <Fit>
        <BrandLogo mode="hero" />
        <div class="accent-bar mb-8" />
        <h1 class="fs-cover" v-html="fm.title || 'Thanks'" />
        <div v-if="fm.subtitle" class="fs-lead dim mt-4" v-html="fm.subtitle" />
        <div v-if="fm.contact" class="kicker mt-8" style="justify-content:center">{{ fm.contact }}</div>
        <slot />
      </Fit>
    </Reveal>
    <Foot :mark="false" />
  </div>

  <!-- TOPIC -->
  <div v-else class="slidev-layout l-topic" :class="{ 'l-aside': fm.aside }">
    <SlideBg />
    <SectionRail />
    <div v-if="showGlow" class="glow" />
    <div v-if="fm.aside" class="aside-tag">{{ typeof fm.aside === 'string' ? fm.aside : 'deep dive' }}</div>
    <Ghost :text="fm.ghost ?? ''" />
    <Reveal v-if="fm.kicker || fm.title" class="l-head">
      <div v-if="fm.kicker" class="kicker">{{ fm.kicker }}</div>
      <h2 v-if="fm.title" class="fs-h2" v-html="fm.title" />
    </Reveal>
    <div class="l-body"><slot /></div>
    <Foot />
  </div>
</template>
