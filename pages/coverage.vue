<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Cobertura de Cliente</h1>

    <!-- Información del cliente -->
    <div v-if="clientInfo" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 class="text-xl font-semibold">{{ clientInfo.clientName }}</h2>
          <p><span class="font-medium">DIRECCION: </span>{{ clientInfo.clientAddress }}</p>
        </div>
        <div>
          <p><span class="font-medium">RUT: </span> {{ clientInfo.clientRut }}</p>
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Visualización en Mapa</h2>
      <div class="h-96 border border-gray-300 rounded-md overflow-hidden">
        <LMap
          v-if="isMounted && clientCoordinates"
          ref="map"
          :zoom="zoom"
          :center="clientCoordinates"
          :use-global-leaflet="false"
          style="height: 100%; width: 100%;"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          
          <!-- Marcador del cliente -->
          <LMarker
            v-if="clientCoordinates"
            :lat-lng="clientCoordinates"
            :icon="clientIcon"
          >
            <LPopup>
              <div class="text-center">
                <h4 class="font-bold text-blue-600">{{ clientInfo?.clientName }}</h4>
                <p class="text-sm">{{ clientInfo?.clientAddress }}</p>
                <p class="text-xs text-gray-600">RUT: {{ clientInfo?.clientRut }}</p>
              </div>
            </LPopup>
          </LMarker>

          <!-- Áreas de cobertura -->
          <LPolygon
            v-for="coverage in coverageAreas"
            :key="coverage.coverageId"
            :lat-lngs="wktPolygonToLatLngArray(coverage.coverageArea)"
            :fill-color="getCoverageColor(coverage.coverageId)"
            :fill-opacity="0.2"
            :color="getCoverageColor(coverage.coverageId)"
            :weight="2"
          >
            <LPopup>
              <div class="text-center">
                <h4 class="font-bold">{{ coverage.name }}</h4>
                <p class="text-sm">ID: {{ coverage.coverageId }}</p>
              </div>
            </LPopup>
          </LPolygon>
        </LMap>
      </div>

      <!-- Leyenda -->
      <div class="mt-4 flex flex-wrap justify-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span class="text-sm">Ubicación del cliente</span>
        </div>
        <div v-for="coverage in coverageAreas" :key="'legend-'+coverage.coverageId" class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full" :style="`background-color: ${getCoverageColor(coverage.coverageId)}`"></div>
          <span class="text-sm">{{ coverage.name }}</span>
        </div>
      </div>
    </div>

    <!-- Lista de coberturas -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Detalles de Cobertura</h2>
      
      <div v-if="clientCoverages.length > 0" class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Empresa</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Zona de Cobertura</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="coverage in clientCoverages" :key="`${coverage.companyId}-${coverage.coverageId}`" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ coverage.companyName }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">
                <span v-if="coverage.coverageName">{{ coverage.coverageName }}</span>
                <span v-else class="text-gray-400">Sin zona específica</span>
              </td>
              <td class="px-4 py-2 text-sm">
                <span :class="coverage.isCovered ? 'text-red-600' : 'text-green-600 font-medium'">
                  {{ coverage.isCovered ? 'Fuera de cobertura' : 'Cubierto' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-4 text-gray-500">
        El cliente no se encuentra en ninguna zona de cobertura
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { LMap, LTileLayer, LMarker, LPopup, LPolygon } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import { parseWKTPoint, wktPolygonToLatLngArray } from '~/utils/wktUtils';
import { getAllCoverageAreas, getClientCoverages } from '~/services/coverageAreaService';
import { getClientById } from '~/services/clientService';

// Estados reactivos
const route = useRoute();
const clientId = ref(route.query.clientId ? Number(route.query.clientId) : null);
const clientInfo = ref(null);
const clientCoverages = ref([]);
const coverageAreas = ref([]);
const loading = ref(false);
const isMounted = ref(false);
const map = ref(null);

// Configuración del mapa
const zoom = ref(12);
const clientCoordinates = ref(null);

// Icono del cliente
const clientIcon = L.divIcon({
  className: 'custom-client-marker',
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Colores para las áreas de cobertura
const coverageColors = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', 
  '#FF33A8', '#33FFF5', '#FF8C33', '#8C33FF'
];

const getCoverageColor = (coverageId) => {
  return coverageColors[coverageId % coverageColors.length];
};

// Carga los datos
const loadData = async () => {
  if (!clientId.value) return;

  try {
    loading.value = true;
    
    // Obtener información del cliente
    const client = await getClientById(clientId.value);
    clientInfo.value = {
      clientName: client.name,
      clientRut: client.rut,
      clientAddress: client.address,
      clientUbication: client.ubication
    };
    
    // Parsear coordenadas del cliente
    if (client.ubication) {
      clientCoordinates.value = parseWKTPoint(client.ubication);
    }
    
    // Obtener coberturas del cliente y todas las áreas de cobertura
    const [coverages, allAreas] = await Promise.all([
      getClientCoverages(clientId.value),
      getAllCoverageAreas()
    ]);
    
    clientCoverages.value = coverages;
    coverageAreas.value = allAreas;
    
    // Ajustar el mapa si hay datos
    if (clientCoordinates.value) {
      fitMapToPoints();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
};

// Ajusta el mapa para mostrar todos los puntos
const fitMapToPoints = () => {
  if (!map.value?.leafletObject || !clientCoordinates.value) return;

  const bounds = L.latLngBounds([clientCoordinates.value]);

  // Agregar todas las áreas de cobertura al bounds
  coverageAreas.value.forEach(coverage => {
    const polygonPoints = wktPolygonToLatLngArray(coverage.coverageArea);
    if (polygonPoints && polygonPoints.length > 0) {
      polygonPoints[0].forEach(point => bounds.extend(point));
    }
  });

  if (bounds.isValid()) {
    map.value.leafletObject.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: 12
    });
  } else {
    // Centrar en el cliente si no hay áreas válidas
    map.value.leafletObject.setView(clientCoordinates.value, 12);
  }
};

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});

onMounted(() => {
  isMounted.value = true;
  loadData();
});
</script>

<style scoped>
:deep(.custom-client-marker) {
  background: transparent;
  border: none;
}

.table-auto th {
  position: sticky;
  top: 0;
}
</style>