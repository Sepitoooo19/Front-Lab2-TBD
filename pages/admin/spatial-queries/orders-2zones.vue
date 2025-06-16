<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Órdenes que cruzan múltiples zonas</h1>

    <!-- Mapa -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Visualización en Mapa</h2>
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

          <!-- Rutas estimadas de órdenes seleccionadas -->
          <LPolyline
            v-if="selectedOrderRoute"
            :lat-lngs="selectedOrderRoute"
            color="#3b82f6"
            :weight="3"
            dashArray="5, 5"
          />
        </LMap>
      </div>

      <!-- Leyenda -->
      <div class="mt-4 flex flex-wrap justify-center gap-6">
        <div v-for="coverage in coverageAreas" :key="'legend-'+coverage.coverageId" class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full" :style="`background-color: ${getCoverageColor(coverage.coverageId)}`"></div>
          <span class="text-sm">{{ coverage.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-1 bg-blue-500"></div>
          <span class="text-sm">Ruta estimada</span>
        </div>
      </div>
    </div>

    <!-- Lista de órdenes -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Órdenes que cruzan más de 2 zonas</h2>
      
      <div v-if="orders.length > 0" class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Cliente</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Dirección</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900">{{ order.id }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ order.nameClient }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ formatDate(order.orderDate) }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ order.status }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ formatCurrency(order.totalPrice) }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ order.address }}</td>
              <td class="px-4 py-2 text-sm">
                <button
                  @click="showOrderRoute(order.id)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  :disabled="loadingRoute"
                >
                  <span v-if="loadingRoute && loadingOrderId === order.id">Cargando...</span>
                  <span v-else>Ver ruta</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-4 text-gray-500">
        No hay órdenes que crucen más de 2 zonas de cobertura
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LPolygon, LPolyline, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import { wktPolygonToLatLngArray } from '~/utils/wktUtils';
import { wktLineStringToGeoJSON } from '~/utils/wktUtils';
import { getAllCoverageAreas } from '~/services/coverageAreaService';
import { getOrdersCrossingMultipleZones, getOrderById } from '~/services/ordersService';

// Estados reactivos
const orders = ref([]);
const coverageAreas = ref([]);
const loading = ref(false);
const isMounted = ref(false);
const map = ref(null);
const selectedOrderRoute = ref(null);
const loadingRoute = ref(false);
const loadingOrderId = ref(null);

// Configuración del mapa
const zoom = ref(10);
const center = ref([-33.4489, -70.6693]); // Centro inicial (ejemplo: Santiago)

// Colores para las áreas de cobertura
const coverageColors = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', 
  '#FF33A8', '#33FFF5', '#FF8C33', '#8C33FF'
];

const getCoverageColor = (coverageId) => {
  return coverageColors[coverageId % coverageColors.length];
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-CL', options);
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

// Carga los datos
const loadData = async () => {
  try {
    loading.value = true;
    
    // Obtener órdenes y áreas de cobertura en paralelo
    const [ordersData, areasData] = await Promise.all([
      getOrdersCrossingMultipleZones(),
      getAllCoverageAreas()
    ]);
    
    orders.value = ordersData;
    coverageAreas.value = areasData;
    
    // Ajustar el mapa si hay datos
    if (orders.value.length > 0 || coverageAreas.value.length > 0) {
      fitMapToPoints();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
};

// Mostrar ruta de una orden específica
const showOrderRoute = async (orderId) => {
  try {
    loadingRoute.value = true;
    loadingOrderId.value = orderId;
    
    // Obtener los detalles completos de la orden
    const orderDetails = await getOrderById(orderId);
    
    if (orderDetails.estimatedRoute) {
      // Convertir WKT LineString a GeoJSON
      const geoJsonRoute = wktLineStringToGeoJSON(orderDetails.estimatedRoute);
      
      if (geoJsonRoute) {
        // Convertir GeoJSON a formato de coordenadas para Leaflet
        // Leaflet espera [lat, lng] mientras que GeoJSON usa [lng, lat]
        const routeCoords = geoJsonRoute.coordinates.map(coord => [coord[1], coord[0]]);
        selectedOrderRoute.value = routeCoords;
        zoomToRoute(routeCoords);
      }
    } else {
      console.warn('La orden no tiene una ruta estimada');
      selectedOrderRoute.value = null;
    }
  } catch (error) {
    console.error('Error al obtener la ruta de la orden:', error);
  } finally {
    loadingRoute.value = false;
    loadingOrderId.value = null;
  }
};

// Ajustar el mapa para mostrar la ruta
const zoomToRoute = (route) => {
  if (!map.value?.leafletObject || !route?.length) return;
  
  const bounds = L.latLngBounds(route);
  map.value.leafletObject.fitBounds(bounds, { padding: [50, 50] });
};

// Ajusta el mapa para mostrar todos los puntos
const fitMapToPoints = () => {
  if (!map.value?.leafletObject) return;

  const bounds = L.latLngBounds([]);

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
  }
};

const onMapReady = () => {
  // Puedes añadir lógica adicional cuando el mapa esté listo
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
.table-auto th {
  position: sticky;
  top: 0;
}
</style>