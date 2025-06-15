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
          v-if="markerLatLng"
          :lat-lng="markerLatLng" 
          draggable 
          @update:lat-lng="updateMarker" 
        />
      </LMap>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { LatLngExpression, LatLngTuple } from 'leaflet'

interface Props {
  lat?: number | null
  lng?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  lat: null,
  lng: null
})

const emit = defineEmits(['update:lat', 'update:lng'])

const zoom = ref(13)
const isMounted = ref(false)

// Usamos una sola referencia para las coordenadas del marcador
const markerLatLng = ref<LatLngTuple | null>(null)

// Centro del mapa (usamos computed para reactividad)
const center = computed<LatLngExpression>(() => {
  return markerLatLng.value || [0, 0]
})

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tileAttribution = '&copy; OpenStreetMap contributors'

// Inicialización y watch de props
const initializeFromProps = () => {
  if (props.lat !== null && props.lng !== null) {
    markerLatLng.value = [props.lat, props.lng]
  } else {
    markerLatLng.value = null
  }
}

onMounted(() => {
  isMounted.value = true
  initializeFromProps()
})

watch(() => [props.lat, props.lng], () => {
  initializeFromProps()
})

// Manejo de eventos
const onMapClick = (e: { latlng: { lat: number; lng: number } }) => {
  const newLatLng: LatLngTuple = [e.latlng.lat, e.latlng.lng]
  markerLatLng.value = newLatLng
  emit('update:lat', e.latlng.lat)
  emit('update:lng', e.latlng.lng)
}

const updateMarker = (event: { latlng: LatLngExpression }) => {
  if (Array.isArray(event.latlng)) {
    const [lat, lng] = event.latlng
    markerLatLng.value = [lat, lng]
    emit('update:lat', lat)
    emit('update:lng', lng)
  } else if ('lat' in event.latlng && 'lng' in event.latlng) {
    const { lat, lng } = event.latlng
    markerLatLng.value = [lat, lng]
    emit('update:lat', lat)
    emit('update:lng', lng)
  }
}
</script>