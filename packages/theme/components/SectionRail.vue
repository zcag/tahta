<script setup>
// Section progress rail — a thin segmented bar at the top edge showing where the
// audience is across the deck's parts. Rendered PER SLIDE (driven by $page) so it's
// correct in `slidev export`, where the global nav stays on slide 1 while every
// frame is rendered at once. Sections are delimited by `layout: section` slides
// (everything before the first is the intro segment). Hidden when there are none.
// Pure tokens — carries the variant.
import { computed, toValue } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $page, $nav, $slidev } = useSlideContext()

const slides = computed(() => toValue($nav?.slides) || toValue($slidev?.nav?.slides) || [])
const page = computed(() => Number(toValue($page)) || 1)

const sections = computed(() => {
  const out = []
  const arr = slides.value
  for (let i = 0; i < arr.length; i++) {
    const fm = arr[i]?.meta?.slide?.frontmatter || {}
    if (fm.layout === 'section' || out.length === 0) out.push({ start: i + 1, count: 1 })
    else out[out.length - 1].count++
  }
  return out
})

const curIdx = computed(() => {
  let idx = 0
  sections.value.forEach((s, i) => { if (page.value >= s.start) idx = i })
  return idx
})

const show = computed(() => sections.value.length >= 2)
</script>

<template>
  <div v-if="show" class="tahta-rail" aria-hidden="true">
    <span
      v-for="(s, i) in sections" :key="i" class="rail-seg"
      :class="{ done: i < curIdx, current: i === curIdx }" :style="{ flexGrow: s.count }"
    />
  </div>
</template>
