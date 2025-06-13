<template>
  <ClientOnly>
    <div v-if="isMounted">
      <LMap
        v-model:zoom="zoom"
        :center="center"
        style="height: 300px; width: 100%;"
        @click="onMapClick"
      >
        <LTileLayer :url="tileUrl" :attribution="tileAttribution" />
        <LMarker 
          v-if="markerLat !== null && markerLng !== null"
          :lat-lng="[markerLat, markerLng]" 
          draggable 
          @update:lat-lng="updateMarker" 
        />
      </LMap>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { LatLngTuple } from 'leaflet'

interface Props {
  lat?: number | string | null
  lng?: number | string | null
}

const props = withDefaults(defineProps<Props>(), {
  lat: null,
  lng: null
})

const emit = defineEmits(['update:lat', 'update:lng'])

// Convert props to numbers safely
const toNumber = (value: number | string | null): number | null => {
  if (value === null) return null
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? null : num
}

const zoom = ref(13)
const isMounted = ref(false)
const markerLat = ref<number | null>(toNumber(props.lat))
const markerLng = ref<number | null>(toNumber(props.lng))
const center = ref<LatLngTuple>([markerLat.value || 0, markerLng.value || 0])

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tileAttribution = '&copy; OpenStreetMap contributors'

// Actualizar center cuando cambian los props
watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  const lat = toNumber(newLat)
  const lng = toNumber(newLng)
  
  if (lat !== null && lng !== null) {
    markerLat.value = lat
    markerLng.value = lng
    center.value = [lat, lng]
  }
})

const onMapClick = (e: { latlng: { lat: number; lng: number } }) => {
  markerLat.value = e.latlng.lat
  markerLng.value = e.latlng.lng
  center.value = [e.latlng.lat, e.latlng.lng]
  emit('update:lat', e.latlng.lat)
  emit('update:lng', e.latlng.lng)
}

const updateMarker = ([lat, lng]: [number, number]) => {
  markerLat.value = lat
  markerLng.value = lng
  center.value = [lat, lng]
  emit('update:lat', lat)
  emit('update:lng', lng)
}

onMounted(() => {
  isMounted.value = true
})
</script>