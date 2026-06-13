<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const steps = computed(() => $frontmatter.steps || [])
</script>

<template>
  <SlideFrame mode="topic">
    <div class="steps">
      <template v-for="(s, i) in steps" :key="i">
        <Reveal :delay="i * 120" style="flex:1; display:flex">
          <div class="card" style="flex:1">
            <Icon v-if="s.icon" :name="s.icon" class="step-icon" />
            <div class="step-title">{{ s.title }}</div>
            <div class="step-desc">{{ s.desc }}</div>
          </div>
        </Reveal>
        <div v-if="i < steps.length - 1" class="arrow">→</div>
      </template>
    </div>
  </SlideFrame>
</template>
