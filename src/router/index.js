import { TOOLTIP_INJECTION_KEY } from 'element-plus'
import { nextTick } from 'vue'
import { createRouter, createWebHistory,} from 'vue-router'

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
  {
    path: '/Login',
    name: 'Login',
    components: {
      login: () => import('../views/Login.vue'),
    },
    meta: {
      title: '登录'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  if (localStorage.cookie && localStorage.userId && to.name == 'Login') {
    alert('已经是登录状态,请先退出登录')
    return from.path
  }
  else if ((!localStorage.cookie || !localStorage.userId) && to.name !== 'Login') {
    return '/Login'
  }
}
)




export default router