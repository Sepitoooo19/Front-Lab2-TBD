<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Editar Tarea</h1>
    <TaskForm 
      :task-id="Number(route.params.id)" 
      @saved="onSaved" 
      @cancel="onCancel" 
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TaskForm from '~/components/tasks/TaskForm.vue'

definePageMeta({
  layout: 'user', // Asegúrate de que sea 'admin'
  middleware: 'auth-role'
})

const route = useRoute()
const router = useRouter()

const onSaved = () => {
  // Navegar a la vista de admin de tareas
  router.push('/admin/tasks') // O la ruta correcta de tu vista de admin
}

const onCancel = () => {
  router.push('/admin/tasks') // O la ruta correcta de tu vista de admin
}
</script>