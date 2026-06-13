<script setup>
// Themeable entrance. The animation's duration, easing and start-transform come from
// variant tokens (--motion-dur / --motion-ease / --reveal-from), so motion has a per-variant
// personality. Honors prefers-reduced-motion and is disabled in print/export.
defineProps({ delay: { type: Number, default: 0 } })
</script>

<template>
  <div class="reveal" :style="{ animationDelay: delay + 'ms' }"><slot /></div>
</template>
