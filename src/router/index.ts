import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    guest?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'board', component: () => import('@/views/BoardView.vue') },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.guest) return auth.isLoggedIn ? { name: 'board' } : true
  if (!auth.isLoggedIn) return { name: 'login' }

  // A stored token survives reloads, the user object does not.
  if (!auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      // A 401 already cleared the token; other failures leave the board to show the error.
      if (!auth.isLoggedIn) return { name: 'login' }
    }
  }
  return true
})

export default router
