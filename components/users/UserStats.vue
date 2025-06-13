<template>
  <div v-if="isLoading" class="text-center text-gray-500 py-4">
    Cargando estadísticas...
  </div>
  <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong class="font-bold">Error:</strong>
    <span class="block sm:inline">{{ error }}</span>
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-blue-100 rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-blue-700">{{ stats.assignedTasks }}</div>
      <div class="text-gray-600 text-sm mt-1">Tareas Asignadas</div>
    </div>
    <div class="bg-yellow-100 rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-yellow-700">{{ stats.pendingTasks }}</div>
      <div class="text-gray-600 text-sm mt-1">Tareas Pendientes</div>
    </div>
    <div class="bg-green-100 rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-green-700">{{ stats.completedTasks }}</div>
      <div class="text-gray-600 text-sm mt-1">Tareas Completadas</div>
    </div>
    <div class="bg-purple-100 rounded-lg p-4 text-center shadow">
      <div class="text-2xl font-bold text-purple-700">{{ stats.distinctSectors }}</div>
      <div class="text-gray-600 text-sm mt-1">Sectores Asignados</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMyTasks } from '~/services/taskService'; 
import type { Task } from '~/types/types';

const stats = ref({
  assignedTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  distinctSectors: 0
});

const isLoading = ref(true);
const error = ref<string | null>(null);

const STATUS_PENDING = 'PENDING';
const STATUS_COMPLETED = 'COMPLETED';

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const userTasks: Task[] = await getMyTasks();
    if (userTasks && Array.isArray(userTasks)) {
      stats.value.assignedTasks = userTasks.length;
      stats.value.completedTasks = userTasks.filter(task => task.status === STATUS_COMPLETED).length;
      stats.value.pendingTasks = userTasks.filter(task => task.status === STATUS_PENDING).length;

      // Calcular sectores distintos por sectorId
      const sectorIds = new Set<number>();
      userTasks.forEach(task => {
        if (typeof task.sectorId === 'number' && !isNaN(task.sectorId)) {
          sectorIds.add(task.sectorId);
        }
      });
      stats.value.distinctSectors = sectorIds.size;
    } else {
      stats.value.assignedTasks = 0;
      stats.value.completedTasks = 0;
      stats.value.pendingTasks = 0;
      stats.value.distinctSectors = 0;
    }
  } catch (e: any) {
    console.error("Error al cargar estadísticas del usuario:", e);
    error.value = e.message || "No se pudieron cargar las estadísticas del usuario.";
    stats.value.assignedTasks = 0;
    stats.value.completedTasks = 0;
    stats.value.pendingTasks = 0;
    stats.value.distinctSectors = 0;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.rounded-lg {
  border-radius: 0.75rem;
}
</style>