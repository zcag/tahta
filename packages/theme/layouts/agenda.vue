<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// `items: [{ topic, desc }]` — auto-numbered module overview.
const items = computed(() => fm.items || [])
const pad = (n) => String(n).padStart(2, '0')
</script>

<template>
  <SlideFrame mode="topic">
    <Fit>
      <div class="agenda">
        <div v-for="(it, i) in items" :key="i" class="agenda-item">
          <div class="agenda-num">{{ pad(i + 1) }}</div>
          <div>
            <div class="agenda-topic" v-html="it.topic" />
            <div v-if="it.desc" class="agenda-desc" v-html="it.desc" />
          </div>
        </div>
      </div>
    </Fit>
  </SlideFrame>
</template>
