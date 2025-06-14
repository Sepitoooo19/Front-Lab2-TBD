<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuthenticatedDealerProfile, updateDealer } from '~/services/dealerService';
import { wktToLatLng, latLngToWKT } from '~/utils/wktUtils';
import MapPicker from '~/components/common/MapPicker.vue';

const dealer = ref({
  id: null,
  name: '',
  rut: '',
  email: '',
  phone: '',
  vehicle: '',
  plate: '',
  rating: 'Sin calificaciones',
  avgWaitTime: '0.00 horas',
  deliveryCount: 0,
  ubication: ''
});

const lat = ref<number | null>(null);
const lng = ref<number | null>(null);
const isLoading = ref(true);
const isUpdating = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const dealerData = await getAuthenticatedDealerProfile();

    // Manejo seguro del rating
    const ratingValue = typeof dealerData.rating === 'number' 
      ? dealerData.rating.toFixed(1)
      : 'Sin calificaciones';
    
    // Manejo seguro del tiempo promedio
    const avgWaitTimeValue = typeof dealerData.avgWaitTime === 'number'
      ? `${dealerData.avgWaitTime.toFixed(2)} horas`
      : '0.00 horas';

    dealer.value = {
      id: dealerData.id,
      name: dealerData.name || 'Sin nombre',
      rut: dealerData.rut || '',
      email: dealerData.email || '',
      phone: dealerData.phone || '',
      vehicle: dealerData.vehicle || '',
      plate: dealerData.plate || '',
      rating: ratingValue,
      avgWaitTime: avgWaitTimeValue,
      deliveryCount: dealerData.deliveryCount || 0,
      ubication: dealerData.ubication || ''
    };

    // Parsear la ubicación WKT para el mapa
    if (dealer.value.ubication) {
      const coords = wktToLatLng(dealer.value.ubication);
      if (coords) {
        lng.value = coords.lng;
        lat.value = coords.lat;
      }
    } else {
      // Ubicación por defecto (Santiago)
      lat.value = -33.45;
      lng.value = -70.65;
    }
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el perfil';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
});

const onUpdateLat = (newLat: number) => { lat.value = newLat; };
const onUpdateLng = (newLng: number) => { lng.value = newLng; };

const handleUpdateUbication = async () => {
  if (lat.value === null || lng.value === null || dealer.value.id === null) {
    alert('Por favor, selecciona una ubicación en el mapa.');
    return;
  }
  isUpdating.value = true;
  try {
    const dealerToUpdate = {
      name: dealer.value.name,
      rut: dealer.value.rut,
      email: dealer.value.email,
      phone: dealer.value.phone,
      vehicle: dealer.value.vehicle,
      plate: dealer.value.plate,
    };
    await updateDealer(dealer.value.id, dealerToUpdate);
    alert('¡Ubicación actualizada exitosamente!');
  } catch (e: any) {
    alert(e.message || 'Hubo un error al actualizar la ubicación.');
  } finally {
    isUpdating.value = false;
  }
};

definePageMeta({
  layout: 'dealer',
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Perfil del Repartidor</h1>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-else class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 class="text-lg font-semibold">Información Personal</h2>
          <p class="mt-2"><span class="font-medium">Nombre:</span> {{ dealer.name }}</p>
        </div>
        
        <div>
          <h2 class="text-lg font-semibold">Estadísticas</h2>
          <p class="mt-2"><span class="font-medium">Calificación:</span> {{ dealer.rating }}</p>
          <p class="mt-2"><span class="font-medium">Tiempo promedio:</span> {{ dealer.avgWaitTime }}</p>
          <p class="mt-2"><span class="font-medium">Entregas realizadas:</span> {{ dealer.deliveryCount }}</p>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-semibold mb-2">Mi Ubicación</h2>
        <div v-if="isLoading" class="text-gray-500 mb-2">Cargando mapa...</div>
        <div v-else>
          <MapPicker
            :lat="lat"
            :lng="lng"
            @update:lat="onUpdateLat"
            @update:lng="onUpdateLng"
          />
          <div class="text-xs text-gray-500 mt-2">
            Haz clic o arrastra el marcador para actualizar tu ubicación de entrega.
          </div>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            :disabled="isUpdating"
            @click="handleUpdateUbication"
            type="button"
          >
            {{ isUpdating ? 'Actualizando...' : 'Actualizar Ubicación' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>