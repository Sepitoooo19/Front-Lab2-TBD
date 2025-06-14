<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTasks } from '~/services/taskService'
import type { Task } from '~/types/types'

const notifications = ref<Task[]>([])

onMounted(async () => {
  notifications.value = []
  const tasks = await getTasks()
  const now = new Date()
  notifications.value = tasks.filter(task => {
    if (task.status !== 'PENDING' || !task.dueDate) return false
    const due = new Date(task.dueDate)
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 2 && diff >= 0
  })
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>

<template>
  <div v-if="notifications.length > 0" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded-lg shadow">
    <p class="font-bold mb-1">¡Atención! Tareas próximas a vencer:</p>
    <ul class="list-disc ml-5">
      <li v-for="task in notifications" :key="task.id" class="mb-0.5">
        “{{ task.title }}” vence el <span class="font-semibold">{{ formatDate(task.dueDate) }}</span>
      </li>
    </ul>
  </div>
</template>