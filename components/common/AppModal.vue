<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
        <button
          @click="$emit('update:modelValue', false)"
          class="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Cerrar"
        >&times;</button>
        <h3 v-if="title" class="mb-4 text-lg font-bold text-gray-900">{{ title }}</h3>
        <div class="mb-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="pt-2 border-t flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  modelValue: Boolean,
  title: String
})
defineEmits(['update:modelValue'])
</script>