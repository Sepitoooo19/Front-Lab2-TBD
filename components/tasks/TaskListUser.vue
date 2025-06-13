<template>
  <div class="w-full">
    <!-- Sección de Filtros -->
    <div class="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
      <select 
        v-model="filter.status" 
        class="border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Todos los estados</option>
        <option value="PENDING">Pendiente</option>
        <option value="IN_PROGRESS">En Progreso</option>
        <option value="COMPLETED">Completada</option>
      </select>
      
      <input
        v-model="filter.word"
        type="text"
        placeholder="Buscar por texto..."
        class="border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex-grow min-w-[200px]"
      />
      
      <AppButton 
        size="sm" 
        variant="primary" 
        @click="applyFilter"
        class="whitespace-nowrap"
      >
        Filtrar
      </AppButton>
      
      <AppButton 
        size="sm" 
        variant="secondary" 
        @click="resetFilter"
        class="whitespace-nowrap"
      >
        Limpiar
      </AppButton>
    </div>
    <div class="flex flex-col xl:flex-row gap-4 w-full">
      <!-- Mapa -->
      <div class="w-full xl:w-1/2 h-[400px] xl:h-[600px] rounded-lg border border-gray-200 shadow-md">
        <TaskMap :tasks="filteredTasks" class="w-full h-full" />
      </div>
      <!-- Tabla con scroll interno -->
      <div class="w-full xl:w-1/2">
        <div class="overflow-x-auto">
          <div class="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 shadow-md">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-blue-50 sticky top-0 z-10">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider whitespace-nowrap">ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Título</th>
                  <th class="py-3 px-4 text-left font-semibold text-blue-800 truncate max-w-[150px]">Descripción</th>
                  <th class="py-3 px-4 text-left font-semibold text-blue-800">Vencimiento</th>
                  <th class="py-3 px-4 text-left font-semibold text-blue-800">Estado</th>
                  <th class="py-3 px-4 text-left font-semibold text-blue-800">Sector</th>
                  <th class="py-3 px-4 text-left font-semibold text-blue-800 truncate max-w-[100px]">Ubicación</th>
                  <th class="py-3 px-4 text-left font-semibold text-blue-800">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in localTasks" :key="task.id">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ task.id }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate">{{ task.title }}</td>
                  <td class="py-2 px-4 truncate max-w-[150px]">{{ task.description }}</td>
                  <td class="py-2 px-4 whitespace-nowrap">{{ formatDate(task.dueDate) }}</td>
                  <td class="py-2 px-4">
                    <span
                      :class="{
                        'bg-green-100 text-green-700 px-2 py-1 rounded': task.status === 'COMPLETED',
                        'bg-yellow-100 text-yellow-700 px-2 py-1 rounded': task.status === 'IN_PROGRESS',
                        'bg-red-100 text-red-700 px-2 py-1 rounded': task.status === 'PENDING'
                      }"
                    >
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="py-2 px-4">{{ task.sectorId }}</td>
                  <td class="py-2 px-4 font-mono text-xs text-gray-700 truncate max-w-[100px]">{{ task.location }}</td>
                  <td class="py-2 px-4 flex gap-2 flex-wrap">
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
                <tr v-if="!localTasks.length">
                  <td colspan="8" class="py-8 text-center text-gray-400">No hay tareas para mostrar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '~/types/types'
import AppButton from '~/components/common/AppButton.vue'
import { deleteTask, updateTask, filterTasks } from '~/services/taskService'
import TaskMap from '~/components/tasks/TaskMap.vue'

const props = defineProps<{ 
  tasks: Task[]
}>()

const emit = defineEmits(['deleted', 'completed'])

const localTasks = ref<Task[]>([...props.tasks])
const filter = ref({
  status: '',
  word: ''
})
const router = useRouter()

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const filteredTasks = computed(() => {
  return localTasks.value.filter(task => 
    (!filter.value.status || task.status === filter.value.status) &&
    (!filter.value.word || 
     task.title.toLowerCase().includes(filter.value.word.toLowerCase()) ||
     task.description.toLowerCase().includes(filter.value.word.toLowerCase()))
  )
})

watch(
  () => props.tasks,
  (newTasks) => {
    localTasks.value = [...newTasks]
  }
)

const applyFilter = async () => {
  try {
    localTasks.value = await filterTasks({ 
      status: filter.value.status, 
      word: filter.value.word 
    })
  } catch (error) {
    console.error('Error al filtrar tareas:', error)
    // Filtrado local como fallback
    localTasks.value = props.tasks.filter(task => 
      (!filter.value.status || task.status === filter.value.status) &&
      (!filter.value.word || 
       task.title.toLowerCase().includes(filter.value.word.toLowerCase()) ||
       task.description.toLowerCase().includes(filter.value.word.toLowerCase()))
    )
  }
}

const resetFilter = () => {
  filter.value = { status: '', word: '' }
  localTasks.value = [...props.tasks]
}

const goToEdit = (taskId: number) => {
  router.push(`/tasks/${taskId}/editUser`)
}

const handleDelete = async (taskId: number) => {
  if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
    try {
      await deleteTask(taskId)
      localTasks.value = localTasks.value.filter(t => t.id !== taskId)
      emit('deleted', taskId)
    } catch (e) {
      alert('Error al eliminar la tarea')
    }
  }
}

const handleComplete = async (taskId: number) => {
  const idx = localTasks.value.findIndex(t => t.id === taskId)
  if (idx === -1) return

  const task = localTasks.value[idx]
  const updatedTask = { 
    ...task, 
    status: 'COMPLETED' as const
  }
  
  try {
    await updateTask(taskId, updatedTask)
    localTasks.value[idx].status = 'COMPLETED'
    emit('completed', taskId)
  } catch (e) {
    alert('Error al completar la tarea')
  }
}
</script>