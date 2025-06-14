<template>
    <div :class="['task-map', $attrs.class]">   
  <ClientOnly>
    <div class="task-map-container">
      <LMap
        v-if="isMounted"
        ref="map"
        v-model:zoom="zoom"
        :center="center"
        :use-global-leaflet="false"
        style="height: 100%; width: 100%;"
      >
        <LTileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <LMarker
          v-for="task in tasksWithLocation"
          :key="task.id"
          :lat-lng="wktToLatLng(task.location)"
        >
          <LIcon :icon-url="getMarkerIcon(task.status)" />
          <LPopup>
            <div class="font-bold">{{ task.title }}</div>
            <div class="text-sm">{{ task.description }}</div>
            <div class="text-xs">Estado: {{ task.status }}</div>
          </LPopup>
        </LMarker>
      </LMap>
    </div>
  </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'
import type { Task } from '~/types/types'
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  tasks: Task[]
}>()

const isMounted = ref(false)
const zoom = ref(13)
const center = ref<[number, number]>([-33.4489, -70.6693]) // Centro en Santiago

const tasksWithLocation = computed(() => {
  return props.tasks.filter(task => 
    task.location && 
    typeof task.location === 'string' &&
    task.location.startsWith('POINT(')
  )
})

const wktToLatLng = (wkt: string | null): [number, number] => {
  if (!wkt) return center.value // Retorna el centro por defecto si location es null
  
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/)
  if (!match) return center.value
  
  const lng = parseFloat(match[1])
  const lat = parseFloat(match[2])
  return [lat, lng]
}
const getMarkerIcon = (status: string) => {
  const icons = {
    PENDING: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    IN_PROGRESS: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    COMPLETED: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
  }
  return icons[status as keyof typeof icons] || icons.PENDING
}

onMounted(() => {
  isMounted.value = true
})
</script>

<style scoped>
.task-map-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.task-map {
  width: 100%;
  height: 100%;
}
</style>