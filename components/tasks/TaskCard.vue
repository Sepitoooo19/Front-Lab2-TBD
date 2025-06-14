<template>
  <div class="bg-white rounded-xl shadow p-4 mb-3 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100 hover:shadow-lg transition">
    <div>
      <div class="font-bold text-lg text-blue-700">{{ task.title }}</div>
      <div class="text-gray-600 text-sm mb-1">{{ task.description }}</div>
      <div class="text-xs text-gray-400">Vence: {{ task.dueDate }}</div>
      <div class="text-xs text-gray-400">Sector: {{ task.sectorName || task.sectorId }}</div>
      <div class="text-xs text-gray-500 font-mono">Ubicación: {{ task.location }}</div>
    </div>
    <div class="flex flex-row gap-2 mt-2 md:mt-0">
      <AppButton size="sm" variant="secondary" @click="$emit('edit', task)">Editar</AppButton>
      <AppButton
        v-if="task.status === 'PENDING'"
        size="sm"
        variant="success"
        @click="$emit('complete', task.id)"
      >Completar</AppButton>
      <AppButton size="sm" variant="danger" @click="$emit('delete', task.id)">Eliminar</AppButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppButton from '~/components/common/AppButton.vue'
defineProps<{ task: any }>()
defineEmits(['edit', 'complete', 'delete'])
</script>