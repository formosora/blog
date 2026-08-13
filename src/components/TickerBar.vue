<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const lines = [
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Given enough eyeballs, all bugs are shallow." — Eric S. Raymond',
  '在代码、安全与内核之间穿梭。',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"The best way to predict the future is to invent it." — Alan Kay',
]

const index = ref(0)
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % lines.length
  }, 4200)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="ticker">
    <Transition name="ticker-fade" mode="out-in">
      <span :key="index">{{ lines[index] }}</span>
    </Transition>
  </div>
</template>
