<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
import FormField from '@/components/FormField.vue'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const errors = ref<Record<string, string[]>>({})
const formError = ref('')
const submitting = ref(false)

const nameField = useTemplateRef('nameField')

onMounted(() => nameField.value?.focus())

async function submit() {
  submitting.value = true
  errors.value = {}
  formError.value = ''
  try {
    await auth.register(form)
    await router.push({ name: 'board' })
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) errors.value = error.errors
    else if (error instanceof ApiError) formError.value = error.message
    else formError.value = 'Could not reach the server. Try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AuthCard heading="Create account">
    <form novalidate @submit.prevent="submit">
      <p v-if="formError" class="mb-4 text-danger" role="alert">{{ formError }}</p>

      <FormField
        id="name"
        ref="nameField"
        v-model="form.name"
        label="Name"
        autocomplete="name"
        inputmode="text"
        :error="errors.name?.[0]"
      />
      <FormField
        id="email"
        v-model="form.email"
        class="mt-4"
        label="Email"
        type="email"
        autocomplete="email"
        inputmode="email"
        :error="errors.email?.[0]"
      />
      <FormField
        id="password"
        v-model="form.password"
        class="mt-4"
        label="Password"
        type="password"
        autocomplete="new-password"
        :error="errors.password?.[0]"
      />
      <FormField
        id="password_confirmation"
        v-model="form.password_confirmation"
        class="mt-4"
        label="Confirm password"
        type="password"
        autocomplete="new-password"
        :error="errors.password_confirmation?.[0]"
      />

      <button type="submit" class="btn-primary mt-6 w-full" :disabled="submitting">
        {{ submitting ? 'Creating account' : 'Create account' }}
      </button>
    </form>

    <template #switch>
      Already registered? <RouterLink :to="{ name: 'login' }" class="link">Log in</RouterLink>
    </template>
  </AuthCard>
</template>
