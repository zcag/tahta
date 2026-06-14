<script setup>
import { computed } from 'vue'
// Shell-session window. Pass `lines` as a mix of:
//   { cmd: "claude --version" }   → prompt-prefixed command
//   { out: "2.0.1" }              → output (dim)
//   { comment: "first run" }      → "# comment" (dimmer)
//   "plain string"                → treated as output
// `title` optionally labels the window bar.
const props = defineProps({
  lines: { type: Array, default: () => [] },
  title: { type: String, default: '' }
})
const rows = computed(() => props.lines.map(l => (typeof l === 'string' ? { out: l } : (l || {}))))
</script>

<template>
  <div class="terminal">
    <div class="terminal-bar"><i /><i /><i /><span v-if="title" class="term-title">{{ title }}</span></div>
    <div class="terminal-body"><template v-for="(l, i) in rows" :key="i"><div v-if="l.cmd != null" class="term-cmd">{{ l.cmd }}</div><div v-else-if="l.comment != null" class="term-comment"># {{ l.comment }}</div><div v-else class="term-out">{{ l.out }}</div></template></div>
  </div>
</template>
