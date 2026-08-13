<script setup lang="ts">
import { computed } from 'vue'

// Ambient particles (CSS fireflies) — random positions/durations, cheap and GPU-friendly
const particles = computed(() =>
  Array.from({ length: 18 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 3 + Math.random() * 4,
    duration: 14 + Math.random() * 18,
    delay: -Math.random() * 20,
    opacity: 0.25 + Math.random() * 0.4,
  }))
)
</script>

<template>
  <div class="bg-fx" aria-hidden="true">
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <div class="orb orb-3" />
    <span
      v-for="(p, i) in particles"
      :key="i"
      class="particle"
      :style="{
        left: p.left + '%',
        top: p.top + '%',
        width: p.size + 'px',
        height: p.size + 'px',
        opacity: p.opacity,
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's',
      }"
    />
  </div>
</template>
