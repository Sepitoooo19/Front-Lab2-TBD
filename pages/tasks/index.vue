<template>
  <div class="w-full">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Mis Tareas</h1>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <nuxt-link
          to="/tasks/create"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-center"
        >
          Nueva Tarea
        </nuxt-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">Cargando tareas...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <TaskListUser
        :tasks="tasks"
        @deleted="loadTasks"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TaskListUser from '~/components/tasks/TaskListUser.vue'
import { getMyTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

definePageMeta({
  layout: 'user',
  middleware: 'auth-role'
})

const tasks = ref<Task[]>([])
const loading = ref(true)

const loadTasks = async () => {
  loading.value = true
  try {
    tasks.value = await getMyTasks()
  } catch (error) {
    console.error('Error cargando tareas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTasks)
</script>

<style scoped>
/* Estilos específicos para esta página */
</style>