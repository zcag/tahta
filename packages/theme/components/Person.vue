<script setup>
import { computed } from 'vue'
// Avatar + name + role. Speaker bios, team, testimonial attribution.
//   <Person name="Ada Lovelace" role="Founder" photo="/ada.jpg" />
// With no photo, falls back to initials in an accent ring.
const props = defineProps({ name: { type: String, default: '' }, role: { type: String, default: '' }, photo: { type: String, default: '' } })
const initials = computed(() => props.name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase())
</script>

<template>
  <div class="person">
    <div class="person-avatar" :style="photo ? { backgroundImage: `url(${photo})` } : null">
      <span v-if="!photo">{{ initials }}</span>
    </div>
    <div class="person-meta">
      <div class="person-name">{{ name }}</div>
      <div v-if="role" class="person-role" v-html="role" />
    </div>
  </div>
</template>
