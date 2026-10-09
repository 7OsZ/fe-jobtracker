<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'

const props = defineProps<{
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  autocomplete?: string
  inputmode?: 'text' | 'email'
  error?: string
}>()

const model = defineModel<string>({ required: true })
const input = useTemplateRef<HTMLInputElement>('input')
const revealed = ref(false)

const inputType = computed(() => (props.type === 'password' && revealed.value ? 'text' : props.type))

function toggleReveal() {
  revealed.value = !revealed.value
  input.value?.focus()
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div>
    <div class="mb-1 flex items-end justify-between">
      <label :for="id" class="field-label">{{ label }}</label>
      <button
        v-if="type === 'password'"
        type="button"
        class="btn-text -my-2.5 text-ink-muted pointer-coarse:-my-3"
        :aria-label="revealed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`"
        :aria-controls="id"
        @click="toggleReveal"
      >
        {{ revealed ? 'Hide' : 'Show' }}
      </button>
    </div>
    <input
      :id="id"
      ref="input"
      v-model="model"
      :type="inputType"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      class="field-input"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? `${id}-error` : undefined"
    />
    <p v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</p>
  </div>
</template>
