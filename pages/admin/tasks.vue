<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Tareas</h1>
      <NuxtLink 
        to="/tasks/createAdmin" 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Crear Nueva Tarea
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="h-[400px] md:h-[500px] rounded-lg border border-gray-200 shadow-md bg-white">
        <TaskMap :tasks="filteredTasks" />
      </div>
      
      <div>
        <TaskListAdmin 
          :tasks="tasks"
          :is-admin="true"
          @deleted="onDelete"
          @completed="onComplete"
          @filter="handleFilter"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TaskListAdmin from '~/components/tasks/TaskList.vue'
import TaskMap from '~/components/tasks/TaskMap.vue'
import { getAllTasks, deleteTask, updateTask } from '~/services/taskService'
import type { Task } from '~/types/types'

const tasks = ref<Task[]>([])
const filter = ref({
  status: '',
  search: ''
})
const router = useRouter()

// Computed filtered list - this is the single source of truth for filtered tasks
const filteredTasks = computed(() => {
  return tasks.value.filter(task => 
    (!filter.value.status || task.status === filter.value.status) &&
    (!filter.value.search || 
     task.title.toLowerCase().includes(filter.value.search.toLowerCase()) ||
     task.description.toLowerCase().includes(filter.value.search.toLowerCase()))
  )
})

// Handle filter changes from child
const handleFilter = (newFilter: { status: string; search: string }) => {
  filter.value = newFilter
}

const fetchTasks = async () => {
  try {
    tasks.value = await getAllTasks()
  } catch (error) {
    console.error('Error loading tasks:', error)
  }
}

const onComplete = async (id: number) => {
  try {
    await updateTask(id, { status: 'COMPLETED' })
    await fetchTasks()
  } catch (error) {
    console.error('Error completing task:', error)
    alert('Error al completar la tarea')
  }
}

const onDelete = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    try {
      await deleteTask(id)
      await fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Error al eliminar la tarea')
    }
  }
}

onMounted(fetchTasks)

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})
</script>