<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { lang, t } from '../i18n'

const LAUNCH = new Date('2026-08-13T00:00:00+08:00').getTime()

const clock = ref('')
const uptime = ref('')
let timer: number | undefined

const pad = (n: number) => String(n).padStart(2, '0')

onMounted(() => {
  const tick = () => {
    const now = new Date()
    clock.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const diff = Math.max(0, now.getTime() - LAUNCH)
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    uptime.value = lang.value === 'zh' ? `${days}天 ${hours}小时` : `${days}d ${hours}h`
  }
  tick()
  timer = window.setInterval(tick, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="status-bar">
    <span class="status-clock">{{ clock }}</span>
    <span class="uptime"><span class="dot">●</span> {{ t('系统已稳定运行：', 'Stable for ') }}{{ uptime }}</span>
    <span class="status-badges">
      <span class="tech-badge">Vue 3</span>
      <span class="tech-badge">Vite 7</span>
      <span class="tech-badge">TypeScript</span>
    </span>
    <span>© 2026 formosora</span>
  </div>
</template>
