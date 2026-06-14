<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
// `columns: [{ title, items: [..] }]` (or { title, body: "<html>" }).
const cols = computed(() => fm.columns || [])
</script>

<template>
  <SlideFrame mode="topic">
    <Fit>
      <div class="cols">
        <div v-for="(c, i) in cols" :key="i" class="col">
          <div class="col-rule" />
          <div v-if="c.title" class="col-head" v-html="c.title" />
          <div class="col-body">
            <ul v-if="Array.isArray(c.items)"><li v-for="(it, j) in c.items" :key="j" v-html="it" /></ul>
            <div v-else-if="c.body" v-html="c.body" />
          </div>
        </div>
      </div>
    </Fit>
  </SlideFrame>
</template>
