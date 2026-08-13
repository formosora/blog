<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <div class="site">
    <header class="site-header">
      <div class="wrap header-inner">
        <RouterLink to="/" class="brand">formosora<span>.blog</span></RouterLink>
        <nav class="site-nav">
          <RouterLink to="/">Posts</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <a href="https://github.com/formosora" target="_blank" rel="noopener">GitHub</a>
        </nav>
      </div>
    </header>

    <main class="wrap site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="wrap">
        © {{ year }} formosora · Built with Vue 3 + Vite · Hosted on GitHub Pages
      </div>
    </footer>
  </div>
</template>
