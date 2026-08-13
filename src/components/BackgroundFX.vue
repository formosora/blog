<script setup lang="ts">
import { computed } from 'vue'
import bgUrl from '../assets/bg.svg'

const particles = computed(() =>
  Array.from({ length: 16 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 2.5 + Math.random() * 3.5,
    duration: 14 + Math.random() * 18,
    delay: -Math.random() * 20,
    opacity: 0.2 + Math.random() * 0.4,
  }))
)
</script>

<template>
  <div class="bg-fx" aria-hidden="true">
    <img class="bg-img" :src="bgUrl" alt="" />
    <div class="bg-dim" />
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
