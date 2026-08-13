import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Post from './pages/Post.vue'
import About from './pages/About.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/post/:slug', name: 'post', component: Post },
    { path: '/about', name: 'about', component: About },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
