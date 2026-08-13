<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatDate, posts } from '../posts'

const activeTag = ref<string | null>(null)

const allTags = computed(() => [...new Set(posts.flatMap(p => p.tags))])

const filtered = computed(() =>
  activeTag.value ? posts.filter(p => p.tags.includes(activeTag.value!)) : posts
)
</script>

<template>
  <div class="home">
    <section class="intro">
      <h1>Notes on web, security &amp; kernels</h1>
      <p>Build logs, vulnerability writeups and Windows kernel study notes.</p>
    </section>

    <div class="tag-bar" v-if="allTags.length">
      <button
        class="tag-chip"
        :class="{ active: activeTag === null }"
        @click="activeTag = null"
      >All</button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-chip"
        :class="{ active: activeTag === tag }"
        @click="activeTag = tag"
      >{{ tag }}</button>
    </div>

    <ul class="post-list">
      <li v-for="post in filtered" :key="post.slug" class="post-item">
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
