<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
import FormField from '@/components/FormField.vue'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string[]>>({})
const formError = ref('')
const submitting = ref(false)

const emailField = useTemplateRef('emailField')
const passwordField = useTemplateRef('passwordField')

onMounted(() => emailField.value?.focus())

// The API reports wrong credentials as a 422 on `email`, same as a malformed email.
function isWrongCredentials(error: ApiError) {
  const keys = Object.keys(error.errors)
  return (
    keys.length === 1 &&
    keys[0] === 'email' &&
    /^[^\s@]+@[^\s@]+$/.test(email.value) &&
    password.value !== ''
  )
}

async function submit() {
  submitting.value = true
  errors.value = {}
  formError.value = ''
  auth.sessionExpired = false
  try {
    await auth.login(email.value, password.value)
    await router.push({ name: 'board' })
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && isWrongCredentials(error)) {
      formError.value = 'Email or password is incorrect.'
      password.value = ''
      passwordField.value?.focus()
    } else if (error instanceof ApiError && error.status === 422) {
      errors.value = error.errors
    } else if (error instanceof ApiError) {
      formError.value = error.message
    } else {
      formError.value = 'Could not reach the server. Try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthCard heading="Log in">
    <form novalidate @submit.prevent="submit">
      <p v-if="auth.sessionExpired" class="mb-4" role="status">Your session ended. Log in again.</p>
      <p v-if="formError" class="mb-4 text-danger" role="alert">{{ formError }}</p>

      <FormField
        id="email"
        ref="emailField"
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        inputmode="email"
        :error="errors.email?.[0]"
      />
      <FormField
        id="password"
        ref="passwordField"
        v-model="password"
        class="mt-4"
        label="Password"
        type="password"
        autocomplete="current-password"
        :error="errors.password?.[0]"
      />

      <button type="submit" class="btn-primary mt-6 w-full" :disabled="submitting">
        {{ submitting ? 'Logging in' : 'Log in' }}
      </button>
    </form>

    <template #switch>
      No account yet? <RouterLink :to="{ name: 'register' }" class="link">Register</RouterLink>
    </template>
  </AuthCard>
</template>
