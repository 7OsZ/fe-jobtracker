<script setup lang="ts">
defineProps<{ heading: string }>()
</script>

<template>
  <main class="page-gutter pt-12 pb-12 sm:pt-24">
    <div class="mx-auto max-w-sm">
      <div class="file-tab wordmark">Lamar</div>
      <div class="rounded-sm rounded-tl-none border border-rule bg-card p-6 shadow-edge sm:p-8">
        <h1 class="font-serif text-heading font-semibold">{{ heading }}</h1>
        <p class="mt-1 text-ink-muted">Track every job application on one board.</p>
        <div class="mt-6">
          <slot />
        </div>
      </div>
      <p class="mt-6 text-ink-muted">
        <slot name="switch" />
      </p>
    </div>
  </main>
</template>
