<script setup>
import { ref, watch } from 'vue'
import { useIsSlideActive } from '@slidev/client'
// Count a number up from 0 when the slide becomes ACTIVE (not on mount — Slidev pre-mounts
// slides, so a mount-time animation finishes off-screen and reads as static). Re-runs on
// every re-entry. Only a plain number animates (commas/decimals ok); anything else (∞, −80%,
// "v2.0.1") renders verbatim. Skipped under reduced-motion AND print/export — there it shows
// the final value so the static frame is correct.
const props = defineProps({
  value: { type: [String, Number], default: '' },
  dur: { type: Number, default: 850 },
})
const out = ref(String(props.value ?? ''))
const active = useIsSlideActive()
let raf

function parse (v) {
  const s = String(v).trim()
  if (!/\d/.test(s) || !/^-?[\d,]*\.?\d+$/.test(s)) return null
  return { n: parseFloat(s.replace(/,/g, '')), dec: (s.split('.')[1] || '').length, grp: s.includes(',') }
}

function run () {
  const final = String(props.value ?? '')
  const p = parse(props.value)
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const print = typeof document !== 'undefined' && !!document.querySelector('.print, .slidev-print, [data-print]')
  if (!p || reduce || print) { out.value = final; return }
  cancelAnimationFrame(raf)
  const fmt = (x) => {
    const f = x.toFixed(p.dec)
    return p.grp ? Number(f).toLocaleString('en-US', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) : f
  }
  const ease = (t) => 1 - Math.pow(1 - t, 3)
  let start
  out.value = fmt(0)
  const step = (now) => {
    start ??= now
    const t = Math.min(1, (now - start) / props.dur)
    out.value = fmt(p.n * ease(t))
    if (t < 1) raf = requestAnimationFrame(step)
    else out.value = final
  }
  raf = requestAnimationFrame(step)
}

watch(active, (a) => { if (a) run() }, { immediate: true })
</script>

<template><span class="tahta-num">{{ out }}</span></template>
