<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import bgFallback from '../assets/bg.svg'

// Random anime wallpapers from dmoe.cc; a unique query param per slot
// makes each slot a different random image. Local bokeh SVG stays
// underneath as a fallback if the API is unreachable.
const sources = Array.from(
  { length: 4 },
  (_, i) => `https://www.dmoe.cc/random.php?slot=${i + 1}`
)

const current = ref(0)
const failed = ref<number[]>([])
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    current.value = (current.value + 1) % sources.length
  }, 8000)
})

onBeforeUnmount(() => clearInterval(timer))

const onError = (i: number) => {
  if (!failed.value.includes(i)) failed.value = [...failed.value, i]
}

const particles = Array.from({ length: 16 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 2.5 + Math.random() * 3.5,
  duration: 14 + Math.random() * 18,
  delay: -Math.random() * 20,
  opacity: 0.2 + Math.random() * 0.4,
}))
</script>

<template>
  <div class="bg-fx" aria-hidden="true">
    <img class="bg-img base" :src="bgFallback" alt="" />
    <img
      v-for="(src, i) in sources"
      v-show="!failed.includes(i)"
      :key="src"
      class="bg-img slide"
      :class="{ active: i === current }"
      :src="src"
      alt=""
      @error="onError(i)"
    />
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
