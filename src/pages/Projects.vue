<script setup lang="ts">
import { t } from '../i18n'

interface Project {
  emoji: string
  name: string
  zh: string
  en: string
  tech: string[]
  url: string
}

const projects: Project[] = [
  {
    emoji: '🥗',
    name: 'FreshBite',
    zh: '一个简单的食物订购网页：React 19 + TypeScript 店面，ASP.NET Core 9 + FormCMS 无头后端，SQLite，单容器 Docker 部署。',
    en: 'A simple food-ordering web app: React 19 + TypeScript storefront, ASP.NET Core 9 + FormCMS headless backend, SQLite, single-container Docker deploy.',
    tech: ['React 19', 'TypeScript', 'ASP.NET Core', 'FormCMS', 'Docker'],
    url: 'https://github.com/formosora/freshbite',
  },
  {
    emoji: '📝',
    name: 'formosora · blog',
    zh: '你正在看的这个站：Vue 3 + Vite 驱动的 Markdown 博客，自定义文章日期，毛玻璃 UI，GitHub Pages 自动部署。',
    en: 'This very site: a Vue 3 + Vite Markdown blog with custom post dates, glassmorphism UI and GitHub Pages auto-deploy.',
    tech: ['Vue 3', 'TypeScript', 'Vite', 'GitHub Pages'],
    url: 'https://github.com/formosora/blog',
  },
  {
    emoji: '🧩',
    name: 'FormCMS',
    zh: '开源无头 CMS：ASP.NET Core + React，REST / GraphQL 双 API，内置 GrapesJS 页面设计器。',
    en: 'Open-source headless CMS: ASP.NET Core + React, dual REST / GraphQL APIs, built-in GrapesJS page designer.',
    tech: ['C#', 'ASP.NET Core', 'React', 'GraphQL'],
    url: 'https://github.com/formosora/formcms',
  },
  {
    emoji: '🔐',
    name: t('vuln-bite（规划中）', 'vuln-bite (planned)'),
    zh: '故意埋入经典漏洞的 FreshBite 变体：SQLi / XSS / IDOR… 每个漏洞配攻击 writeup 与修复 commit，安全练手靶场。',
    en: 'A deliberately vulnerable FreshBite variant: SQLi / XSS / IDOR… each with an attack writeup and a fix commit. A security training ground.',
    tech: ['Security', 'Web', 'Writeup'],
    url: 'https://github.com/formosora',
  },
]
</script>

<template>
  <div>
    <h1 class="page-title">{{ t('项目', 'Projects') }}</h1>
    <div class="project-grid">
      <div
        v-for="(p, i) in projects"
        :key="p.name"
        class="glass-card project-card"
        :style="{ animationDelay: 0.08 + i * 0.08 + 's' }"
      >
        <div class="project-head">
          <span class="project-emoji">{{ p.emoji }}</span>
          <h2 class="project-name">{{ p.name }}</h2>
        </div>
        <p class="project-desc">{{ t(p.zh, p.en) }}</p>
        <div class="project-tech">
          <span v-for="tech in p.tech" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>
        <a :href="p.url" target="_blank" rel="noopener" class="project-link">{{ t('查看 →', 'View →') }}</a>
      </div>
    </div>
  </div>
</template>
