<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const loggingOut = ref(false)

async function logout() {
  loggingOut.value = true
  try {
    await auth.logout()
  } catch {
    // The token is cleared locally either way, so a failed revoke still logs out.
  } finally {
    loggingOut.value = false
    await router.push({ name: 'login' })
  }
}
</script>

<template>
  <header class="page-gutter flex h-14 items-center gap-4 border-b border-rule bg-paper">
    <h1 class="wordmark mr-auto">Lamar</h1>
    <span v-if="auth.user" class="hidden truncate text-ink-muted sm:inline">
      {{ auth.user.name }}
    </span>
    <button type="button" class="btn-text" :disabled="loggingOut" @click="logout">
      {{ loggingOut ? 'Logging out' : 'Log out' }}
    </button>
  </header>
</template>
