<script setup lang="ts">
import BackgroundFX from './components/BackgroundFX.vue'
import StatusBar from './components/StatusBar.vue'
</script>

<template>
  <div class="site">
    <BackgroundFX />

    <header class="site-header glass-bar">
      <div class="wrap header-inner">
        <RouterLink to="/" class="brand">formosora<span> の 小站</span></RouterLink>
        <nav class="site-nav">
          <RouterLink to="/projects">项目</RouterLink>
          <RouterLink to="/posts">文章</RouterLink>
        </nav>
      </div>
    </header>

    <main class="wrap site-main">
      <RouterView />
    </main>

    <footer class="wrap">
      <StatusBar />
    </footer>
  </div>
</template>
