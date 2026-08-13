<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate, getPost, renderPost } from '../posts'

const route = useRoute()
const post = computed(() => getPost(route.params.slug as string))
const html = computed(() => (post.value ? renderPost(post.value) : ''))
</script>

<template>
  <article v-if="post" class="post glass-card post-shell">
    <p><RouterLink to="/posts" class="back-link">← All posts</RouterLink></p>
    <h1 class="post-heading">{{ post.title }}</h1>
    <p class="post-meta">
      <time>{{ formatDate(post.date) }}</time>
      <span v-if="post.updated" class="updated">(updated {{ formatDate(post.updated) }})</span>
      <span class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </span>
    </p>
    <!-- Content is authored locally in Markdown, so v-html is safe here -->
    <div class="post-body" v-html="html" />
  </article>

  <div v-else class="glass-card post-shell not-found">
    <h1>Post not found</h1>
    <p><RouterLink to="/" class="back-link">← Back home</RouterLink></p>
  </div>
</template>
