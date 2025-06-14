import { defineNuxtPlugin } from '#app'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png'
})

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const { LMap, LTileLayer, LMarker } = await import('@vue-leaflet/vue-leaflet')
    
    nuxtApp.vueApp.component('LMap', LMap)
    nuxtApp.vueApp.component('LTileLayer', LTileLayer)
    nuxtApp.vueApp.component('LMarker', LMarker)
  }
})