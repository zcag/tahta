<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const features = computed(() => $frontmatter.features || [])
const cols = computed(() => $frontmatter.columns || Math.min(features.value.length || 3, 4))
</script>

<template>
  <SlideFrame mode="topic">
    <div class="feature" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }">
      <Reveal v-for="(f, i) in features" :key="i" :delay="i * 100">
        <div class="feature-cell card">
          <Icon v-if="f.icon" :name="f.icon" class="feature-icon" />
          <div class="feature-title">{{ f.title }}</div>
          <div class="feature-desc">{{ f.desc }}</div>
        </div>
      </Reveal>
    </div>
  </SlideFrame>
</template>
