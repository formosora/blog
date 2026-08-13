<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../i18n'
import { posts } from '../posts'

const postCount = posts.length
const tagCount = computed(() => new Set(posts.flatMap(p => p.tags)).size).value
const projectCount = 4
</script>

<template>
  <section class="profile-card glass-card">
    <div class="avatar-ring">
      <img
        class="avatar"
        src="https://avatars.githubusercontent.com/u/53005693?v=4"
        alt="formosora avatar"
        width="96"
        height="96"
      />
    </div>

    <div class="profile-main">
      <h1 class="profile-name">formosora</h1>
      <p class="profile-bio">
        {{ t(
          '在台湾的开发者，开发与学习已近十年。白天写 Web（Vue / React / ASP.NET Core），夜里研究安全与 Windows 内核，持续输出笔记。',
          'Developer based in Taiwan — nearly a decade of building & learning. Web (Vue / React / ASP.NET Core) by day, security and Windows kernels by night.'
        ) }}
      </p>

      <div class="profile-stats">
        <div class="stat"><b>{{ postCount }}</b><span>{{ t('文章', 'Posts') }}</span></div>
        <div class="stat-divider" />
        <div class="stat"><b>{{ tagCount }}</b><span>{{ t('标签', 'Tags') }}</span></div>
        <div class="stat-divider" />
        <div class="stat"><b>{{ projectCount }}</b><span>{{ t('项目', 'Projects') }}</span></div>

        <div class="profile-socials">
          <a
            class="social-btn"
            href="https://github.com/formosora"
            target="_blank"
            rel="noopener"
            title="GitHub"
          >🐙</a>
          <a
            class="social-btn"
            href="https://github.com/formosora/freshbite"
            target="_blank"
            rel="noopener"
            title="FreshBite"
          >🥗</a>
          <RouterLink class="social-btn" to="/posts" :title="t('文章', 'Posts')">📝</RouterLink>
          <RouterLink class="social-btn" to="/projects" :title="t('项目', 'Projects')">🧩</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
