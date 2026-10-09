import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { request, TOKEN_KEY } from '@/api/client'
import type { AuthResponse, Resource, User } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)
  const sessionExpired = ref(false)

  const isLoggedIn = computed(() => token.value !== null)

  function setSession(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.token)
    token.value = response.token
    user.value = response.data
    sessionExpired.value = false
  }

  function clear() {
    localStorage.removeItem(TOKEN_KEY)
    token.value = null
    user.value = null
  }

  async function login(email: string, password: string) {
    setSession(await request<AuthResponse>('POST', '/login', { email, password }))
  }

  async function register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    setSession(await request<AuthResponse>('POST', '/register', payload))
  }

  async function fetchMe() {
    user.value = (await request<Resource<User>>('GET', '/me')).data
  }

  async function logout() {
    try {
      await request('POST', '/logout')
    } finally {
      clear()
    }
  }

  return { token, user, sessionExpired, isLoggedIn, login, register, fetchMe, logout, clear }
})
