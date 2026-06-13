<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter } = useSlideContext()
const c = computed(() => $frontmatter.chart || {})
</script>

<template>
  <SlideFrame mode="topic">
    <div style="max-width: 62rem; width: 100%; margin: 0 auto">
      <Plot v-if="c.categories || c.series"
        :type="c.type || 'bar'" :categories="c.categories || []" :series="c.series || []"
        :unit="c.unit || ''" :height="c.height || '350px'" :horizontal="c.horizontal !== false" />
    </div>
    <p v-if="$frontmatter.note" class="mt-2 dim" v-html="$frontmatter.note" />
  </SlideFrame>
</template>
