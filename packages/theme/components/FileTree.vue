<script setup>
import { computed } from 'vue'
// Project / config tree. Pass nested `items`:
//   [{ name: "src", children: [{ name: "main.ts" }] }, { name: "README.md" }]
// A node is a directory if it has children or `dir: true`.
const props = defineProps({ items: { type: Array, default: () => [] } })
function flatten (items, prefix, out) {
  items.forEach((raw, i) => {
    const it = raw || {}
    const last = i === items.length - 1
    const isDir = it.dir || (Array.isArray(it.children) && it.children.length > 0)
    out.push({ guide: prefix + (last ? '└─ ' : '├─ '), name: it.name ?? '', dir: isDir })
    if (Array.isArray(it.children) && it.children.length) flatten(it.children, prefix + (last ? '   ' : '│  '), out)
  })
  return out
}
const rows = computed(() => flatten(props.items, '', []))
</script>

<template>
  <div class="filetree">
    <div v-for="(r, i) in rows" :key="i" class="ft-row"><span class="ft-guide">{{ r.guide }}</span><span :class="r.dir ? 'ft-dir' : 'ft-name'">{{ r.name }}</span></div>
  </div>
</template>
