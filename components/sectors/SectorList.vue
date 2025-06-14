<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white rounded-lg shadow">
      <thead class="bg-blue-100">
        <tr>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Nombre</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Ubicación (WKT)</th>
          <th class="py-3 px-4 text-left font-semibold text-blue-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sector in sectors" :key="sector.id" class="border-b hover:bg-blue-50 transition">
          <td class="py-2 px-4">{{ sector.name }}</td>
          <td class="py-2 px-4 font-mono text-xs text-gray-700">{{ sector.location }}</td>
          <td class="py-2 px-4">
            <AppButton size="sm" variant="secondary" @click="$emit('edit', sector)">Editar</AppButton>
            <AppButton size="sm" variant="danger" @click="$emit('delete', sector.id)">Eliminar</AppButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import type { Sector } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
defineProps<{ sectors: Sector[] }>()
defineEmits(['edit', 'delete'])
</script>