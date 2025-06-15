<template>
  <div class="order-map">
    <ClientOnly>
      <div class="order-map-container">
        <LMap
          v-if="isMounted"
          v-model:zoom="zoom"
          :center="computedCenter"
          style="height: 250px; width: 100%;"
        >
          <LTileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <!-- Dealer marker (solo si dealerLocation está presente) -->
          <LMarker
            v-if="dealerLocation"
            :lat-lng="[dealerLocation.lat, dealerLocation.lng]"
            :icon="redIcon"
          >
            <LPopup>
              <span class="font-bold" style="color: #2563eb">Tú (Dealer)</span>
            </LPopup>
          </LMarker>
          <!-- Order delivery points -->
          <LMarker
            v-for="order in ordersWithLocation"
            :key="order.id"
            :lat-lng="[order.lat, order.lng]"
            :icon="getOrderIcon(order)"
          >
            <LPopup>
              <div class="font-bold">Orden #{{ order.id }}</div>
              <div v-if="order.address" class="text-xs">{{ order.address }}</div>
              <div v-if="order.status" class="text-xs">Estado: {{ order.status }}</div>
            </LPopup>
          </LMarker>
        </LMap>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'

// Props
const props = defineProps<{
  orders: Array<{
    id: number,
    location: string | null, // WKT POINT
    address?: string,
    status?: string
  }>
  dealerLocation?: { lat: number, lng: number } | null
  showStatusIcons?: boolean
}>()

const isMounted = ref(false)
const zoom = ref(13)
const defaultCenter: [number, number] = [-33.4489, -70.6693] // Santiago

// Iconos
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Parse POINT WKT string to [lat, lng]
function wktToLatLng(wkt: string | null): [number, number] | null {
  if (!wkt) return null
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/)
  if (!match) return null
  const lng = parseFloat(match[1])
  const lat = parseFloat(match[2])
  if (isNaN(lat) || isNaN(lng)) return null
  return [lat, lng]
}

// Solo órdenes con ubicación válida
const ordersWithLocation = computed(() =>
  props.orders
    .map(order => {
      const latlng = wktToLatLng(order.location)
      if (!latlng) return null
      return {
        ...order,
        lat: latlng[0],
        lng: latlng[1]
      }
    })
    .filter((o): o is {
      id: number,
      location: string | null,
      lat: number,
      lng: number,
      address?: string,
      status?: string
    } => o !== null)
)

// Centro del mapa: primer pedido > dealer > Santiago
const computedCenter = computed<[number, number]>(() => {
  if (ordersWithLocation.value.length > 0)
    return [ordersWithLocation.value[0].lat, ordersWithLocation.value[0].lng]
  if (props.dealerLocation)
    return [props.dealerLocation.lat, props.dealerLocation.lng]
  return defaultCenter
})

// Icono según estado
function getOrderIcon(order: { status?: string }) {
  if (props.showStatusIcons) {
    if (order.status === 'ENTREGADO') return greenIcon
    if (order.status === 'FALLIDA') return redIcon
  }
  return defaultIcon
}

onMounted(() => {
  isMounted.value = true
})
</script>