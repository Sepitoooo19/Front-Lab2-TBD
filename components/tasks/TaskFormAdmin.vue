<template>
  <div class="max-w-2xl mx-auto px-4 overflow-y-auto" :class="isEditing ? 'mt-60' : 'mt-40'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700">Fecha y hora límite</label>
        <input
          id="dueDate"
          v-model="form.dueDate"
          type="datetime-local"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="sectorId" class="block text-sm font-medium text-gray-700">Sector</label>
        <select
          id="sectorId"
          v-model="form.sectorId"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Seleccionar sector</option>
          <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
            {{ sector.name }}
          </option>
        </select>
      </div>

      <!-- NUEVO: Selección de usuario -->
      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700">Asignar a usuario</label>
        <select
          id="userId"
          v-model="form.userId"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Seleccionar usuario</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} ({{ user.username }})
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Ubicación</label>
        <p class="text-sm text-gray-500 mt-1 mb-2">Haz clic en el mapa para seleccionar la ubicación</p>
        <MapPicker 
          :lat="lat"
          :lng="lng"
          @update:lat="updateLat"
          @update:lng="updateLng"
        />
      </div>

      <div v-if="isEditing">
        <label for="status" class="block text-sm font-medium text-gray-700">Estado</label>
        <select
          id="status"
          v-model="form.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="PENDING">Pendiente</option>
          <option value="COMPLETED">Completada</option>
        </select>
      </div>

      <div class="flex space-x-4">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Tarea' : 'Crear Tarea') }}
        </button>
        
        <button
          type="button"
          @click="$emit('cancel')"
          class="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { getTaskById, createTask, updateTask } from '~/services/taskService'
import { getSectors } from '~/services/sectorService'
import { getUsers } from '~/services/userService' // Nuevo: debe existir este método
import type { Task, Sector, User } from '~/types/types'
import { latLngToWKT } from '~/utils/wktUtils'
import MapPicker from '~/components/common/MapPicker.vue'

const props = defineProps<{
  taskId?: number
}>()

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const loading = ref(false)
const sectors = ref<Sector[]>([])
const users = ref<User[]>([]) // NUEVO: lista de usuarios
const lat = ref<number>(-33.459229)
const lng = ref<number>(-70.645348)

const taskId = computed(() => {
  return props.taskId && !isNaN(Number(props.taskId)) ? Number(props.taskId) : null
})

const isEditing = computed(() => taskId.value !== null)

const form = reactive({
  title: '',
  description: '',
  dueDate: '',
  sectorId: '',
  userId: '', // NUEVO: usuario asignado
  status: 'PENDING' as Task['status']
})

const updateLat = (newLat: number) => {
  lat.value = newLat
}

const updateLng = (newLng: number) => {
  lng.value = newLng
}

const loadSectors = async () => {
  try {
    sectors.value = await getSectors()
  } catch (error) {
    console.error('Error cargando sectores:', error)
  }
}

// NUEVO: cargar usuarios para asignar
const loadUsers = async () => {
  try {
    users.value = await getUsers()
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  }
}

const loadTask = async () => {
  if (!taskId.value) return
  
  try {
    loading.value = true
    const task = await getTaskById(taskId.value)
    form.title = task.title || ''
    form.description = task.description || ''
    form.dueDate = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
    form.sectorId = task.sectorId?.toString() || ''
    form.status = task.status || 'PENDING'
    form.userId = task.userId?.toString() || '' // NUEVO: cargar usuario asignado

    if (task.location) {
      const match = task.location.match(/POINT\(([^)]+)\)/)
      if (match) {
        const coords = match[1].split(' ')
        lng.value = parseFloat(coords[0])
        lat.value = parseFloat(coords[1])
      }
    }
  } catch (error) {
    console.error('Error cargando tarea:', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    const taskData = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate || null,
      sectorId: form.sectorId ? Number(form.sectorId) : null,
      userId: form.userId ? Number(form.userId) : null, // NUEVO: usuario asignado
      location: latLngToWKT(lat.value, lng.value),
      ...(isEditing.value && { status: form.status })
    }
    if (isEditing.value && taskId.value) {
      await updateTask(taskId.value, taskData)
    } else {
      await createTask(taskData)
    }
    emit('saved')
  } catch (error) {
    console.error('Error guardando tarea:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadSectors(), loadUsers()])
  if (isEditing.value) {
    await loadTask()
  }
})
</script>