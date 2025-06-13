<template>
  <ClientOnly>
    <div v-if="isMounted" class="h-full">
      <LMap
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
        
        <LPolygon
          v-for="sector in sectors"
          :key="sector.id"
          :lat-lngs="parseWktPolygon(sector.location)"
          :color="getColorForSector(sector)"
          :fill-opacity="0.3"
          :weight="2"
        >
          <LPopup>
            <div class="font-bold">{{ sector.name }}</div>
          </LPopup>
        </LPolygon>
      </LMap>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet'
import type { Sector } from '~/types/types'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  sectors: Sector[]
}>()

const isMounted = ref(false)
const zoom = ref(13)
const center = ref<[number, number]>([41.9028, 12.4964]) // Tipo explícito
const map = ref(null)

const getColorForSector = (sector: Sector) => {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
  const index = props.sectors.findIndex(s => s.id === sector.id) % colors.length
  return colors[index]
}

const parseWktPolygon = (wkt: string): [number, number][] => {
  try {
    const coordSection = wkt.match(/\(\((.*?)\)\)/)?.[1]
    if (!coordSection) return []
    
    return coordSection.split(',').map(coord => {
      const [lng, lat] = coord.trim().split(/\s+/).map(Number)
      return [lat, lng] as [number, number]
    })
  } catch (error) {
    console.error('Error parsing WKT:', wkt, error)
    return []
  }
}

onMounted(() => {
  isMounted.value = true
})
</script>