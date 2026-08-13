<script setup lang="ts">
import { computed, ref } from 'vue'
import ProfileCard from '../components/ProfileCard.vue'
import TickerBar from '../components/TickerBar.vue'
import { t } from '../i18n'
import { coverHue, formatDate, posts, tagEmoji } from '../posts'
import { theme, toggleTheme } from '../theme'

const query = ref('')

const latest = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = q
    ? posts.filter(p =>
        [p.title, p.excerpt, p.tags.join(' '), p.body]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    : posts
  return list.slice(0, 3)
})

const coverStyle = (slug: string) => {
  const h = coverHue(slug)
  return {
    background: `linear-gradient(135deg, hsl(${h} 65% 42%), hsl(${(h + 50) % 360} 60% 30%))`,
  }
}
</script>

<template>
  <div class="search-wrap">
    <label class="search-box">
      <span class="mag">🔍</span>
      <input
        v-model="query"
        type="search"
        :placeholder="t('搜索标题、描述或标签…', 'Search title, excerpt or tags…')"
      />
    </label>
  </div>

  <ProfileCard />

  <TickerBar />

  <section>
    <div class="section-head">
      <h2>{{ t('最新文章', 'Latest writing') }}</h2>
      <RouterLink to="/posts" class="more-link">{{ t('全部文章 →', 'All posts →') }}</RouterLink>
    </div>

    <div class="bento">
      <RouterLink
        v-for="(post, i) in latest"
        :key="post.slug"
        :to="`/post/${post.slug}`"
        class="glass-card bento-item"
        :style="{ animationDelay: 0.1 + i * 0.09 + 's' }"
      >
        <div class="cover" :style="coverStyle(post.slug)">
          <span class="cover-emoji">{{ tagEmoji(post.tags[0]) }}</span>
        </div>
        <div class="bento-content">
          <div class="bento-badges">
            <span class="pill">{{ post.tags[0] ?? 'NOTE' }}</span>
            <span class="pill date">{{ formatDate(post.date) }}</span>
          </div>
          <h3 class="bento-title">{{ post.title }}</h3>
          <p v-if="i === 0" class="bento-excerpt">{{ post.excerpt }}</p>
        </div>
      </RouterLink>

      <button class="glass-card bento-item theme-card" @click="toggleTheme">
        <span class="theme-icon">{{ theme === 'dark' ? '🌞' : '✨' }}</span>
        <b>{{ theme === 'dark' ? t('日间模式', 'Light mode') : t('夜间模式', 'Dark mode') }}</b>
        <span>{{
          theme === 'dark' ? t('切换到清爽浅色', 'Switch to light') : t('流萤飞舞的深空', 'Fireflies in deep space')
        }}</span>
      </button>
    </div>
  </section>
</template>
