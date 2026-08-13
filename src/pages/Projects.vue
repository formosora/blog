<script setup lang="ts">
interface Project {
  emoji: string
  name: string
  desc: string
  tech: string[]
  url: string
}

const projects: Project[] = [
  {
    emoji: '🥗',
    name: 'FreshBite',
    desc: '一个简单的食物订购网页：React 19 + TypeScript 店面，ASP.NET Core 9 + FormCMS 无头后端，SQLite，单容器 Docker 部署。',
    tech: ['React 19', 'TypeScript', 'ASP.NET Core', 'FormCMS', 'Docker'],
    url: 'https://github.com/formosora/freshbite',
  },
  {
    emoji: '📝',
    name: 'formosora · blog',
    desc: '你正在看的这个站：Vue 3 + Vite 驱动的 Markdown 博客，自定义文章日期，毛玻璃 UI，GitHub Pages 自动部署。',
    tech: ['Vue 3', 'TypeScript', 'Vite', 'GitHub Pages'],
    url: 'https://github.com/formosora/blog',
  },
  {
    emoji: '🧩',
    name: 'FormCMS',
    desc: '开源无头 CMS：ASP.NET Core + React，REST / GraphQL 双 API，内置 GrapesJS 页面设计器。',
    tech: ['C#', 'ASP.NET Core', 'React', 'GraphQL'],
    url: 'https://github.com/formosora/formcms',
  },
  {
    emoji: '🔐',
    name: 'vuln-bite（规划中）',
    desc: '故意埋入经典漏洞的 FreshBite 变体：SQLi / XSS / IDOR… 每个漏洞配攻击 writeup 与修复 commit，安全练手靶场。',
    tech: ['Security', 'Web', 'Writeup'],
    url: 'https://github.com/formosora',
  },
]
</script>

<template>
  <div>
    <h1 class="page-title">项目</h1>
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
        <p class="project-desc">{{ p.desc }}</p>
        <div class="project-tech">
          <span v-for="t in p.tech" :key="t" class="tech-chip">{{ t }}</span>
        </div>
        <a :href="p.url" target="_blank" rel="noopener" class="project-link">查看 →</a>
      </div>
    </div>
  </div>
</template>
