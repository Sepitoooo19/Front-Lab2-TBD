<template>
  <div class="container max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Crear Nueva Tarea</h2>
    <TaskFormAdmin @saved="onSaved" />
  </div>
</template>
<script setup lang="ts">
import TaskFormAdmin from '~/components/tasks/TaskFormAdmin.vue'
import { useRouter } from 'vue-router'
definePageMeta({ layout: 'admin', middleware: 'auth-role' })
const router = useRouter()
const onSaved = () => router.push('/tasks')
const onCancel = () => router.push('/tasks')
defineExpose({ onCancel })
</script>