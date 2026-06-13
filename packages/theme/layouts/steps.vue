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
        <div class="card" style="flex:1">
          <div class="step-title">{{ s.title }}</div>
          <div class="step-desc">{{ s.desc }}</div>
        </div>
        <div v-if="i < steps.length - 1" class="arrow">→</div>
      </template>
    </div>
  </SlideFrame>
</template>
