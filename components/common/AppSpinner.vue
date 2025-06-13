<template>
  <span
    :class="[
      'inline-block align-middle',
      small ? 'w-4 h-4 border-2' : 'w-6 h-6 border-4'
    ]"
    role="status"
    aria-label="Cargando"
  >
    <svg
      :class="[
        'animate-spin text-blue-600',
        small ? 'w-4 h-4' : 'w-6 h-6'
      ]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps({
  small: { type: Boolean, default: false }
})
</script>