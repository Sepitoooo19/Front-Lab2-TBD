<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Consultas Geoespaciales</h1>
    
    <!-- Panel de control -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Puntos de Entrega Cercanos</h2>
      
      <!-- Selector de empresa -->
      <div class="flex items-center gap-4 mb-4">
        <label class="font-medium text-gray-700">Seleccionar Empresa:</label>
        <select 
          v-model="selectedCompanyId" 
          @change="onCompanyChange"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccione una empresa --</option>
          <option 
            v-for="company in companies" 
            :key="company.id" 
            :value="company.id"
          >
            {{ company.name }}
          </option>
        </select>
        
        <button 
          @click="findNearestPoints"
          :disabled="!selectedCompanyId || loading"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Buscando...</span>
          <span v-else>Buscar Puntos Cercanos</span>
        </button>
        <button 
            @click="findFarthestPoints"
            :disabled="loading"
            class="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Buscando...</span>
            <span v-else>Ver Puntos Más Lejanos</span>
          </button>
        
      </div>



      <!-- Información de la empresa seleccionada -->
      <div v-if="selectedCompany" class="mb-4 p-3 bg-blue-50 rounded-md">
        <p class="text-sm text-blue-800">
          <strong>Empresa seleccionada:</strong> {{ selectedCompany.name }} - {{ selectedCompany.address }}
        </p>
      </div>
    </div>

    <!-- Mapa -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Visualización en Mapa</h3>
      <div class="h-96 border border-gray-300 rounded-md overflow-hidden">
        <LMap
          v-if="isMounted"
          ref="map"
          :zoom="zoom"
          :center="center"
          :use-global-leaflet="false"
          style="height: 100%; width: 100%;"
          @ready="onMapReady"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          
          <!-- Marcador de la empresa -->
          <LMarker
            v-if="companyMarker"
            :lat-lng="companyMarker"
            :icon="companyIcon"
          >
            <LPopup>
              <div class="text-center">
                <h4 class="font-bold text-red-600">{{ selectedCompany?.name }}</h4>
                <p class="text-sm">{{ selectedCompany?.address }}</p>
                <p class="text-xs text-gray-600">Empresa</p>
              </div>
            </LPopup>
          </LMarker>

          <!-- Marcadores de puntos de entrega -->
          <LMarker
            v-for="point in deliveryPoints"
            :key="point.clientId"
            :lat-lng="point.coordinates"
            :icon="deliveryIcon"
          >
            <LPopup>
              <div class="text-center">
                <h4 class="font-bold text-green-600">{{ point.clientName }}</h4>
                <p class="text-sm">{{ point.clientAddress }}</p>
                <p class="text-xs text-gray-600">
                  Distancia: {{ Math.round(point.distanceMeters) }}m
                </p>
              </div>
            </LPopup>
          </LMarker>
          <LMarker
            v-for="(point, index) in farthestPoints"
            :key="'far-'+index"
            :lat-lng="point.coordinates"
            :icon="farthestIcon"
            >
            <LPopup>
                <div class="text-center">
                <h4 class="font-bold text-orange-600">Punto más lejano</h4>
                <p class="text-sm">Empresa: {{ point.companyName }}</p>
                <p class="text-xs text-gray-600">Coordenadas: {{ point.pointText }}</p>
                </div>
            </LPopup>
            </LMarker>
        </LMap>
      </div>

      <!-- Leyenda -->
      <div v-if="deliveryPoints.length > 0" class="mt-4 flex justify-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
          <span class="text-sm">Empresa</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-green-500 rounded-full"></div>
          <span class="text-sm">Puntos de Entrega</span>
        </div>
        <div v-if="farthestPoints.length > 0" class="flex items-center gap-2">
            <div class="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span class="text-sm">Puntos Lejanos</span>
        </div>
      </div>
    </div>

    <!-- Lista de resultados -->
    <div v-if="deliveryPoints.length > 0 && !loading" class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        Top 5 Puntos de Entrega Cercanos a {{ selectedCompany?.name }}
      </h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Cliente</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Dirección</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Distancia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(point, index) in deliveryPoints" :key="point.clientId" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ point.clientName }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ point.clientAddress }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ Math.round(point.distanceMeters) }}m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="farthestPoints.length > 0 && !loading" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">
        Puntos de Entrega Más Lejanos por Empresa
        </h3>
        
        <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
            <thead class="bg-gray-50">
            <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Empresa</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Coordenadas</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr 
                v-for="(point, index) in farthestPoints" 
                :key="`far-${index}`" 
                class="hover:bg-gray-50"
                :class="{ 'bg-blue-50': selectedCompanyId && point.companyId === parseInt(selectedCompanyId) }"
            >
                <td class="px-4 py-2 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-900">
                {{ point.companyName }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-700">
                {{ point.pointText }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-700">
                <button 
                    v-if="point.companyId"
                    @click="selectedCompanyId = point.companyId.toString(); onCompanyChange()"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Ver Empresa
                </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import { parseWKTPoint } from '~/utils/wktUtils';
import { getAllCompanies } from '~/services/companyService';
import { getNearestDeliveryPoints } from '~/services/mapQueryService';
import { getFarthestDeliveryPoints } from '~/services/mapQueryService';

// Estados reactivos
const companies = ref([]);
const selectedCompanyId = ref('');
const deliveryPoints = ref([]);
const loading = ref(false);
const searchPerformed = ref(false);
const isMounted = ref(false);
const mapReady = ref(false);
const showFarthestPoints = ref(false);
const farthestPoints = ref([]);

// Configuración del mapa
const zoom = ref(13);
const center = ref([-36.8485, -73.0524]);
const map = ref(null);

// Empresa seleccionada
const selectedCompany = computed(() => {
  return companies.value.find(c => c.id === parseInt(selectedCompanyId.value));
});

// Marcador de empresa
const companyMarker = ref(null);

// Iconos personalizados
const companyIcon = L.divIcon({
  className: 'custom-company-marker',
  html: '<div style="background-color: #dc2626; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const deliveryIcon = L.divIcon({
  className: 'custom-delivery-marker',
  html: '<div style="background-color: #16a34a; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Función para cuando el mapa está listo
const onMapReady = () => {
  mapReady.value = true;
  if (map.value?.leafletObject) {
    map.value.leafletObject.invalidateSize();
  }
};

// Función para limpiar marcadores del mapa
const clearMapMarkers = () => {
  if (!map.value?.leafletObject) return;
  
  map.value.leafletObject.eachLayer(layer => {
    if (layer instanceof L.Marker && layer !== companyMarker.value) {
      map.value.leafletObject.removeLayer(layer);
    }
  });
};

// Carga las empresas disponibles
const loadCompanies = async () => {
  try {
    companies.value = await getAllCompanies();
  } catch (error) {
    console.error('Error al cargar empresas:', error);
  }
};

// Maneja el cambio de empresa seleccionada
const onCompanyChange = async () => {
  if (!isMounted.value) return;
  showFarthestPoints.value = false;
  
  loading.value = true;
  clearMapMarkers();
  deliveryPoints.value = [];
  companyMarker.value = null;
  searchPerformed.value = false;
  
  const company = companies.value.find(c => c.id === parseInt(selectedCompanyId.value));
  if (company?.ubication) {
    const coords = parseWKTPoint(company.ubication);
    if (coords) {
      companyMarker.value = coords;
      center.value = coords;
      zoom.value = 15;
      
      await nextTick();
      if (map.value?.leafletObject) {
        map.value.leafletObject.invalidateSize();
      }
    }
  }
  
  loading.value = false;
};

// Ajusta el mapa para mostrar todos los puntos
const fitMapToPoints = () => {
  if (!map.value?.leafletObject || !companyMarker.value) return;

  const bounds = L.latLngBounds([companyMarker.value]);

  deliveryPoints.value.forEach(point => {
    if (point?.coordinates) {
      bounds.extend(point.coordinates);
    }
  });

  if (bounds.isValid()) {
    try {
      map.value.leafletObject.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 15
      });
    } catch (e) {
      console.warn('Error al ajustar mapa:', e);
    }
  }
};

// Busca los puntos de entrega más cercanos
const findNearestPoints = async () => {
  if (!selectedCompanyId.value || !isMounted.value) return;

  loading.value = true;
  searchPerformed.value = true;
  deliveryPoints.value = [];
  clearMapMarkers();

  try {
    const response = await getNearestDeliveryPoints(parseInt(selectedCompanyId.value));
    
    if (!isMounted.value) return;
    
    if (Array.isArray(response) && response.length > 0) {
      const processedPoints = response
        .map(point => {
          const coordinates = parseWKTPoint(point.clientLocation);
          return coordinates ? { ...point, coordinates } : null;
        })
        .filter(Boolean);
      
      deliveryPoints.value = processedPoints;
      
      // Centrar el mapa
      if (selectedCompany.value?.ubication) {
        const companyCoords = parseWKTPoint(selectedCompany.value.ubication);
        if (companyCoords) {
          companyMarker.value = companyCoords;
          center.value = companyCoords;
          await nextTick();
          fitMapToPoints();
        }
      }
    }
  } catch (error) {
    console.error('Error al buscar puntos cercanos:', error);
    if (isMounted.value) {
      deliveryPoints.value = [];
    }
  } finally {
    if (isMounted.value) {
      loading.value = false;
    }
  }
};

const findFarthestPoints = async () => {
  try {
    console.log('[DEBUG] Iniciando findFarthestPoints');
    loading.value = true;
    clearMapMarkers();
    deliveryPoints.value = [];
    farthestPoints.value = [];
    searchPerformed.value = true;
    showFarthestPoints.value = true;

    console.log('[DEBUG] Llamando a getFarthestDeliveryPoints...');
    const response = await getFarthestDeliveryPoints();
    console.log('[DEBUG] Respuesta cruda del backend:', response);
    
    if (Array.isArray(response) && response.length > 0) {
      console.log('[DEBUG] Procesando puntos lejanos...');
      
      const processedPoints = response.map((item, index) => {
        console.log(`[DEBUG] Procesando item ${index}:`, item);
        
        if (!item.company_name || !item.farthest_delivery_point) {
          console.warn(`[WARN] Item ${index} no tiene los campos requeridos`, item);
          return null;
        }
        
        try {
          const coordinates = parseWKTPoint(item.farthest_delivery_point);
          console.log(`[DEBUG] Coordenadas parseadas para item ${index}:`, coordinates);
          
          if (!coordinates) {
            console.warn(`[WARN] No se pudo parsear coordenadas para item ${index}`);
            return null;
          }
          
          const companyId = companies.value.find(c => c.name === item.company_name)?.id;
          console.log(`[DEBUG] Company ID encontrado para ${item.company_name}:`, companyId);
          
          return {
            companyName: item.company_name,
            coordinates,
            pointText: item.farthest_delivery_point,
            companyId
          };
        } catch (e) {
          console.error(`[ERROR] Error procesando item ${index}:`, e);
          return null;
        }
      }).filter(Boolean);
      
      console.log('[DEBUG] Puntos procesados:', processedPoints);
      farthestPoints.value = processedPoints;

      // Si hay una empresa seleccionada, resaltar su punto lejano
      if (selectedCompanyId.value) {
        const selectedCompany = companies.value.find(c => c.id === parseInt(selectedCompanyId.value));
        if (selectedCompany) {
          const companyFarPoint = farthestPoints.value.find(p => p.companyName === selectedCompany.name);
          if (companyFarPoint) {
            // Centrar en el punto lejano de la empresa seleccionada
            center.value = companyFarPoint.coordinates;
            zoom.value = 14;
          }
        }
      } else {
        // Centrar el mapa para mostrar todos los puntos lejanos
        if (farthestPoints.value.length > 0) {
          center.value = farthestPoints.value[0].coordinates;
          zoom.value = 10;
        }
        
      }} else {
      console.warn('[WARN] Respuesta vacía o no es array');
    }
  } catch (error) {
    console.error('[ERROR] Error en findFarthestPoints:', error);
  } finally {
    loading.value = false;
    console.log('[DEBUG] Búsqueda finalizada');
  }
};

const fitMapToFarthestPoints = () => {
  if (!map.value?.leafletObject || farthestPoints.value.length === 0) {
    console.warn('No se puede ajustar el mapa - condiciones no cumplidas');
    return;
  }

  try {
    // Filtrar solo puntos con coordenadas válidas
    const validPoints = farthestPoints.value
      .filter(p => p.coordinates && !isNaN(p.coordinates.lat) && !isNaN(p.coordinates.lng))
      .map(p => p.coordinates);
    
    if (validPoints.length === 0) {
      console.warn('No hay coordenadas válidas para ajustar el mapa');
      return;
    }
    
    const bounds = L.latLngBounds(validPoints);
    
    if (!bounds.isValid()) {
      console.warn('Bounds no válidos, centrando en primer punto');
      map.value.leafletObject.setView(validPoints[0], 10);
      return;
    }
    
    // Ajustar el zoom con un padding
    map.value.leafletObject.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 12
    });
    
  } catch (e) {
    console.error('Error crítico al ajustar mapa:', e);
    // Fallback seguro
    if (farthestPoints.value[0]?.coordinates) {
      map.value.leafletObject.setView(farthestPoints.value[0].coordinates, 10);
    }
  }
};

const farthestIcon = L.divIcon({
  className: 'custom-farthest-marker',
  html: '<div style="background-color: #ea580c; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Ciclo de vida del componente
onMounted(() => {
  isMounted.value = true;
  loadCompanies();
});

onBeforeUnmount(() => {
  isMounted.value = false;
  if (map.value?.leafletObject) {
    map.value.leafletObject.remove();
  }
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});
</script>

<style scoped>
:deep(.custom-company-marker),
:deep(.custom-delivery-marker) {
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

:deep(.custom-farthest-marker) {
  background: transparent;
  border: none;
}
</style>