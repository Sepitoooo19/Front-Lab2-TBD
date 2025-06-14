<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-semibold transition-colors duration-150',
      variantClass,
      sizeClass,
      { 'opacity-60 cursor-not-allowed': loading }
    ]"
    :disabled="loading || disabled"
    v-bind="$attrs"
  >
    <span v-if="loading" class="animate-spin mr-2">&#9696;</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const variantClass = computed(() => ({
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white"
})[props.variant || "primary"]);

const sizeClass = computed(() => ({
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-6 py-3"
})[props.size || "md"]);
</script>