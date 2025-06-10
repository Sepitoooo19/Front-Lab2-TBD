<script setup>
import { getAuthenticatedDealerProfile } from '~/services/dealerService';

const dealer = ref({
  name: '',
  rating: 'Sin calificaciones',
  avgWaitTime: '0.00 horas',
  deliveryCount: 0
});

const error = ref(null);

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
      name: dealerData.name || 'Sin nombre',
      rating: ratingValue,
      avgWaitTime: avgWaitTimeValue,
      deliveryCount: dealerData.deliveryCount || 0
    };
    
  } catch (err) {
    error.value = err.message || 'Error al cargar el perfil';
    console.error('Error:', err);
  }
});

// Definir metadatos de la página
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
    </div>
  </div>
</template>