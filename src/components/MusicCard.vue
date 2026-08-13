<script setup lang="ts">
import { ref } from 'vue'

const SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

const audio = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const current = ref(0)
const duration = ref(0)

const toggle = () => {
  const a = audio.value
  if (!a) return
  if (playing.value) a.pause()
  else a.play()
}

const seek = (e: Event) => {
  const a = audio.value
  if (a) a.currentTime = Number((e.target as HTMLInputElement).value)
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
</script>

<template>
  <section class="music-card glass-card">
    <div class="music-top">
      <div class="disc" :class="{ spinning: playing }">
        <div class="disc-hole" />
      </div>
      <div class="track-meta">
        <span class="music-badge">ONLINE MUSIC</span>
        <h3>SoundHelix Song 1</h3>
        <p>SoundHelix · 测试音轨</p>
      </div>
    </div>

    <div class="progress-row">
      <span>{{ fmt(current) }}</span>
      <input
        type="range"
        min="0"
        :max="duration || 0"
        :value="current"
        step="0.1"
        @input="seek"
      />
      <span>{{ fmt(duration) }}</span>
    </div>

    <div class="controls">
      <button class="play-btn" @click="toggle" :title="playing ? '暂停' : '播放'">
        {{ playing ? '⏸' : '▶' }}
      </button>
    </div>

    <audio
      ref="audio"
      :src="SRC"
      preload="metadata"
      @play="playing = true"
      @pause="playing = false"
      @ended="playing = false"
      @timeupdate="current = audio?.currentTime ?? 0"
      @loadedmetadata="duration = audio?.duration ?? 0"
    />
  </section>
</template>
