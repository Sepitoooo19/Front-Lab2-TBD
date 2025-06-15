<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { 
  getAuthenticatedDealerProfile, 
  getCompleteDealerData,
  updateDealer 
} from '~/services/dealerService';
import { wktToLatLng, latLngToWKT } from '~/utils/wktUtils';
import MapPicker from '~/components/common/MapPicker.vue';

// Estado del perfil
const basicProfile = ref({
  rating: 'Sin calificaciones',
  avgWaitTime: '0.00 horas',
  deliveryCount: 0
});

// Estado de información del dealer
const dealerInfo = ref({
  id: null as number | null,
  ubication: ''
});

// Estado del mapa
const mapKey = ref(0); // Para forzar recarga del mapa
const lat = ref<number>(-33.45); // Valor por defecto (Santiago)
const lng = ref<number>(-70.65); // Valor por defecto (Santiago)
const isLoading = ref(true);
const isUpdating = ref(false);
const error = ref<string | null>(null);

// Función para cargar datos
const loadDealerData = async () => {
  try {
    isLoading.value = true;
    
    // 1. Cargar datos básicos
    const basicData = await getAuthenticatedDealerProfile();
    basicProfile.value = {
      rating: typeof basicData.rating === 'number' 
        ? basicData.rating.toFixed(1)
        : 'Sin calificaciones',
      avgWaitTime: typeof basicData.avgWaitTime === 'number'
        ? `${basicData.avgWaitTime.toFixed(2)} horas`
        : '0.00 horas',
      deliveryCount: basicData.deliveryCount || 0
    };

    // 2. Cargar datos completos
    const completeData = await getCompleteDealerData();
    dealerInfo.value = {
      id: completeData.id,
      ubication: completeData.ubication || ''
    };

    // 3. Procesar ubicación
    console.log('Ubicación recibida:', dealerInfo.value.ubication); // Debug
    
    if (dealerInfo.value.ubication) {
      const coords = wktToLatLng(dealerInfo.value.ubication);
      console.log('Coordenadas parseadas:', coords); // Debug
      
      if (coords) {
        lat.value = coords.lat;
        lng.value = coords.lng;
        mapKey.value++; // Forzar recarga del mapa
      }
    }
    
  } catch (err: any) {
    error.value = err.message || 'Error al cargar datos';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Actualizar ubicación
const handleUpdateUbication = async () => {
  if (!dealerInfo.value.id) return;
  
  isUpdating.value = true;
  try {
    const wktUbication = latLngToWKT(lng.value, lat.value);
    await updateDealer(dealerInfo.value.id, { ubication: wktUbication });
    dealerInfo.value.ubication = wktUbication;
    alert('¡Ubicación actualizada!');
    await loadDealerData(); // Recargar datos
  } catch (e: any) {
    alert('Error: ' + (e.message || 'No se pudo actualizar'));
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  loadDealerData();
});

definePageMeta({
  layout: 'dealer',
  middleware: 'auth-role'
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Perfil del Repartidor</h1>
    
    <!-- Mostrar error si existe -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow p-6">
      <!-- Sección de estadísticas -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Estadísticas</h2>
        <p><span class="font-medium">Calificación:</span> {{ basicProfile.rating }}</p>
        <p><span class="font-medium">Tiempo promedio:</span> {{ basicProfile.avgWaitTime }}</p>
        <p><span class="font-medium">Entregas realizadas:</span> {{ basicProfile.deliveryCount }}</p>
      </div>

      <!-- Sección del mapa -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Mi Ubicación</h2>
        
        <div v-if="isLoading" class="h-96 flex items-center justify-center">
          <p>Cargando mapa...</p>
        </div>
        
        <div v-else>
          <MapPicker
            :key="'map-' + mapKey"
            :lat="lat"
            :lng="lng"
            @update:lat="(val) => lat = val"
            @update:lng="(val) => lng = val"
            class="h-96 border rounded-md"
          />
          
          <button
            @click="handleUpdateUbication"
            :disabled="isUpdating"
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {{ isUpdating ? 'Actualizando...' : 'Actualizar Ubicación' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>