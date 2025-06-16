<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Clientes Lejanos</h1>

    <!-- Mapa -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Clientes a más de 5km de cualquier empresa</h2>
      <h3 class="text-lg font-semibold mb-4">Visualización en Mapa</h3>
      <div class="h-96 border border-gray-300 rounded-md overflow-hidden">
      <LMap
        v-if="isMounted"
        ref="map"
        :zoom="zoom"
        :center="center"
        :use-global-leaflet="false"
        style="height: 100%; width: 100%;"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        <!-- Marcadores de empresas válidas -->
        <LMarker
          v-for="company in validCompanies"
          :key="'company-'+company.id"
          :lat-lng="company.coordinates"
          :icon="companyIcon"
        >
          <LPopup>
            <div class="text-center">
              <h4 class="font-bold text-red-600">{{ company.name }}</h4>
              <p class="text-sm">{{ company.address }}</p>
            </div>
          </LPopup>
        </LMarker>

        <!-- Marcadores de clientes válidos -->
        <LMarker
          v-for="client in validFarClients"
          :key="client.id"
          :lat-lng="client.coordinates"
          :icon="clientIcon"
        >
          <LPopup>
            <div class="text-center">
              <h4 class="font-bold text-blue-600">{{ client.name }}</h4>
              <p class="text-sm">{{ client.address }}</p>
              <p class="text-xs text-gray-600">RUT: {{ client.rut }}</p>
            </div>
          </LPopup>
        </LMarker>
      </LMap>
    </div>

      <!-- Leyenda -->
      <div v-if="farClients.length > 0" class="mt-4 flex justify-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
          <span class="text-sm">Empresas</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span class="text-sm">Clientes (+5km)</span>
        </div>
      </div>
    </div>

    <!-- Mostrar mensaje cuando no hay clientes lejanos -->
    <div v-if="farClients.length === 0 && !loading" class="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
      <div class="text-gray-500 text-lg py-8">
        No hay ningún cliente a más de 5km de cualquier empresa
      </div>
    </div>

    <!-- Lista de resultados -->
    <div v-if="farClients.length > 0" class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        Listado de Clientes a más de 5km de cualquier empresa
      </h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">RUT</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Dirección</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Contacto</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(client, index) in farClients" :key="client.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ client.name }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ client.rut }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ client.address }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">
                <div>{{ client.email }}</div>
                <div>{{ client.phone }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import { parseWKTPoint } from '~/utils/wktUtils';
import { getClientsBeyond5Km } from '~/services/clientService';
import { getAllCompanies } from '~/services/companyService';

// Estados reactivos
const companies = ref([]);
const farClients = ref([]);
const loading = ref(false);
const isMounted = ref(false);
const map = ref(null);

// Configuración del mapa
const zoom = ref(10);
const center = ref([-33.4489, -70.6693]); // Santiago de Chile como centro inicial

// Filtra clientes con ubicaciones válidas
const validFarClients = computed(() => {
  return farClients.value.filter(client => {
    const coords = parseWKTPoint(client.ubication);
    if (!coords) {
      console.warn(`Cliente ${client.id} tiene ubicación inválida:`, client.ubication);
      return false;
    }
    return true;
  }).map(client => ({
    ...client,
    coordinates: parseWKTPoint(client.ubication)
  }));
});

// Filtra empresas con ubicaciones válidas
const validCompanies = computed(() => {
  return companies.value.filter(company => {
    const coords = parseWKTPoint(company.ubication);
    if (!coords) {
      console.warn(`Empresa ${company.id} tiene ubicación inválida:`, company.ubication);
      return false;
    }
    return true;
  }).map(company => ({
    ...company,
    coordinates: parseWKTPoint(company.ubication)
  }));
});

// Iconos personalizados
const companyIcon = L.divIcon({
  className: 'custom-company-marker',
  html: '<div style="background-color: #dc2626; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const clientIcon = L.divIcon({
  className: 'custom-client-marker',
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Carga los datos
const loadData = async () => {
  try {
    loading.value = true;
    const [companiesData, clientsData] = await Promise.all([
      getAllCompanies(),
      getClientsBeyond5Km()
    ]);
    
    companies.value = companiesData;
    farClients.value = clientsData;
    
    // Ajustar el mapa si hay datos válidos
    if (validCompanies.value.length > 0 || validFarClients.value.length > 0) {
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
  if (!map.value?.leafletObject) return;

  const bounds = L.latLngBounds([]);

  // Agregar empresas válidas
  validCompanies.value.forEach(company => {
    bounds.extend(company.coordinates);
  });

  // Agregar clientes válidos
  validFarClients.value.forEach(client => {
    bounds.extend(client.coordinates);
  });

  if (bounds.isValid()) {
    map.value.leafletObject.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: 12
    });
  } else {
    // Fallback: Centrar en el primer punto válido
    const firstPoint = validCompanies.value[0]?.coordinates || 
                      validFarClients.value[0]?.coordinates;
    if (firstPoint) {
      map.value.leafletObject.setView(firstPoint, 10);
    }
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
:deep(.custom-company-marker),
:deep(.custom-client-marker) {
  background: transparent;
  border: none;
}

.table-auto th {
  position: sticky;
  top: 0;
}

.bg-blue-600:disabled {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>