import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      topbar: () => import('../views/TopBar.vue'),
      banner: () => import('../views/Banner.vue'),
      musiccontrol: () => import('../views/MusicControl.vue'),
      main: () => import('../views/Main.vue')
    },
    meta: {
      title: '首页'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router