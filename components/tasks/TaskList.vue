<template>
  <div>
    <!-- Filtros -->
    <div class="flex gap-2 mb-4">
      <select v-model="filter.status" class="border rounded px-2 py-1">
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendiente</option>
        <option value="IN_PROGRESS">En Progreso</option>
        <option value="COMPLETED">Completada</option>
      </select>
      <input 
        v-model="filter.search" 
        type="text" 
        placeholder="Buscar por texto..." 
        class="border rounded px-2 py-1" 
        @input="emitFilter"
      />
      <AppButton size="sm" variant="secondary" @click="resetFilter">Limpiar</AppButton>
    </div>

    <div class="overflow-x-auto">
      <div class="max-h-[500px] overflow-y-auto">
        <table class="min-w-full bg-white rounded-lg shadow">
          <thead class="bg-blue-100 sticky top-0">
            <tr>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">ID</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Título</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Descripción</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Vencimiento</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Estado</th>
              <th v-if="isAdmin" class="py-3 px-4 text-left font-semibold text-blue-800">Usuario</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Sector</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Ubicación</th>
              <th class="py-3 px-4 text-left font-semibold text-blue-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks" :key="task.id" class="border-b hover:bg-blue-50 transition">
              <td class="py-2 px-4">{{ task.id }}</td>
              <td class="py-2 px-4">{{ task.title }}</td>
              <td class="py-2 px-4">{{ task.description }}</td>
              <td class="py-2 px-4">{{ task.dueDate }}</td>
              <td class="py-2 px-4">
                <span
                  :class="task.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700 px-2 py-1 rounded'
                    : task.status === 'IN_PROGRESS'
                      ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded'
                      : 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded'"
                >
                  {{ task.status }}
                </span>
              </td>
              <td v-if="isAdmin" class="py-2 px-4">{{ task.userId }}</td>
              <td class="py-2 px-4">{{ task.sectorId }}</td>
              <td class="py-2 px-4 font-mono text-xs text-gray-700">{{ task.location }}</td>
              <td class="py-2 px-4 flex gap-2">
                <AppButton size="sm" variant="secondary" @click="goToEdit(task.id)">Editar</AppButton>
                <AppButton size="sm" variant="danger" @click="handleDelete(task.id)">Eliminar</AppButton>
                <AppButton
                  v-if="task.status !== 'COMPLETED'"
                  size="sm"
                  variant="success"
                  @click="handleComplete(task.id)"
                >
                  Completar
                </AppButton>
              </td>
            </tr>
            <tr v-if="!filteredTasks.length">
              <td :colspan="isAdmin ? 9 : 8" class="py-8 text-center text-gray-400">No hay tareas para mostrar.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'

const router = useRouter()

interface Props {
  tasks: Task[]
  isAdmin?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'deleted', id: number): void
  (e: 'completed', id: number): void
  (e: 'filter', filter: { status: string; search: string }): void
}>()

const filter = ref({
  status: '',
  search: ''
})

// Computed property for filtered tasks
const filteredTasks = computed(() => {
  return props.tasks.filter(task => 
    (!filter.value.status || task.status === filter.value.status) &&
    (!filter.value.search || 
     task.title.toLowerCase().includes(filter.value.search.toLowerCase()) ||
     task.description.toLowerCase().includes(filter.value.search.toLowerCase()))
  ) 
})

// Navigation method
const goToEdit = (taskId: number) => {
  router.push(`/tasks/${taskId}/edit`)
}

// Watch for filter changes and emit to parent
watch(filter, (newFilter) => {
  emit('filter', newFilter)
}, { deep: true })

const emitFilter = () => {
  emit('filter', filter.value)
}

const resetFilter = () => {
  filter.value = { status: '', search: '' }
  emit('filter', filter.value)
}

const handleDelete = (taskId: number) => {
  if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
    emit('deleted', taskId)
  }
}

const handleComplete = (taskId: number) => {
  emit('completed', taskId)
}
</script>