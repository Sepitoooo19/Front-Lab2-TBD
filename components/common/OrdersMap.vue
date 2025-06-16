<template>
  <div class="order-map">
    <ClientOnly>
      <div class="order-map-container" style="position: relative;">
        <LMap
          v-if="isMounted"
          v-model:zoom="zoom"
          :center="computedCenter"
          ref="lmap"
          style="height: 250px; width: 100%;"
        >
          <LTileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LMarker
            v-if="dealerLocation"
            :lat-lng="[dealerLocation.lat, dealerLocation.lng]"
            :icon="redIcon"
          >
            <LPopup>
              <span class="font-bold" style="color: #2563eb">Tú (Dealer)</span>
            </LPopup>
          </LMarker>
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
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import L from 'leaflet'
// @ts-ignore
import 'leaflet-routing-machine'

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
  showRoute?: boolean // <-- Nueva prop para controlar si se dibuja la ruta
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

const lmap = ref<any>(null)
let routeControl: any = null

// Dibuja la ruta solo si showRoute es true
async function safeAddRoute(retry = 0) {
  if (!props.showRoute) return
  if (!lmap.value?.leafletObject) {
    if (retry < 10) setTimeout(() => safeAddRoute(retry + 1), 150)
    return
  }
  // Limpia cualquier ruta anterior
  if (routeControl) {
    try { lmap.value.leafletObject.removeControl(routeControl) } catch {}
    routeControl = null
  }
  if (
    !props.dealerLocation ||
    ordersWithLocation.value.length === 0
  ) return

  const dest = ordersWithLocation.value[0]
  routeControl = L.Routing.control({
    waypoints: [
      L.latLng(props.dealerLocation.lat, props.dealerLocation.lng),
      L.latLng(dest.lat, dest.lng)
    ],
    lineOptions: {
      styles: [{ color: '#2563eb', weight: 6 }]
    },
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    show: false,
    createMarker: () => null
  }).addTo(lmap.value.leafletObject)
}

onMounted(() => {
  isMounted.value = true
  nextTick(() => safeAddRoute())
})

watch(
  () => [
    props.dealerLocation ? props.dealerLocation.lat : null,
    props.dealerLocation ? props.dealerLocation.lng : null,
    ordersWithLocation.value.length > 0 ? ordersWithLocation.value[0].lat : null,
    ordersWithLocation.value.length > 0 ? ordersWithLocation.value[0].lng : null,
    props.showRoute // observa la prop showRoute
  ],
  () => {
    nextTick(() => safeAddRoute())
  }
)
</script>

<style>
.order-map-container {
  position: relative;
  width: 100%;
  height: 250px;
}
</style>