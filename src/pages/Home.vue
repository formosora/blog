<script setup lang="ts">
import HeroCard from '../components/HeroCard.vue'
import { formatDate, posts } from '../posts'

const latest = posts.slice(0, 4)
</script>

<template>
  <HeroCard />

  <section class="latest">
    <div class="section-head">
      <h2>Latest writing</h2>
      <RouterLink to="/posts" class="more-link">All posts →</RouterLink>
    </div>

    <ul class="latest-list">
      <li
        v-for="(post, i) in latest"
        :key="post.slug"
        class="glass-card latest-item"
        :style="{ animationDelay: 0.2 + i * 0.09 + 's' }"
      >
        <RouterLink :to="`/post/${post.slug}`" class="latest-link">
          <span class="post-date">{{ formatDate(post.date) }}</span>
          <h3 class="latest-title">{{ post.title }}</h3>
          <span class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
