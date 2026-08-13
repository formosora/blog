<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '../i18n'
import { formatDate, posts } from '../posts'

const activeTag = ref<string | null>(null)

const allTags = computed(() => [...new Set(posts.flatMap(p => p.tags))])

const filtered = computed(() =>
  activeTag.value ? posts.filter(p => p.tags.includes(activeTag.value!)) : posts
)
</script>

<template>
  <div>
    <h1 class="page-title">{{ t('文章', 'Posts') }}</h1>

    <div class="tag-bar" v-if="allTags.length">
      <button
        class="tag-chip"
        :class="{ active: activeTag === null }"
        @click="activeTag = null"
      >{{ t('全部', 'All') }}</button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-chip"
        :class="{ active: activeTag === tag }"
        @click="activeTag = tag"
      >{{ tag }}</button>
    </div>

    <ul class="post-list">
      <li
        v-for="(post, i) in filtered"
        :key="post.slug"
        class="glass-card post-item"
        :style="{ animationDelay: 0.1 + i * 0.07 + 's' }"
      >
        <RouterLink :to="`/post/${post.slug}`" class="post-link">
          <span class="post-date">{{ formatDate(post.date) }}</span>
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <span class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
