<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">🛵 Panel del Repartidor</h1>
    
    <div class="grid gap-8 md:grid-cols-2">
      <div class="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Mi Pedido Activo</h3>
        <div v-if="activeOrder">
          <p class="text-lg"><strong>Pedido #{{ activeOrder.id }}</strong></p>
          <p>Id Cliente: <span class="font-bold">{{ activeOrder.clientId }}</span></p>
          <p>Dirección: {{ activeOrder.deliveryAddress }}</p>
          <p v-if="clientUbication">
            Coordenadas: 
            <span class="font-mono">Lat: {{ clientUbication.lat }}, Lng: {{ clientUbication.lng }}</span>
          </p>
          <div v-if="clientUbication" class="mt-4">
            <MapPicker
              :lat="clientUbication.lat"
              :lng="clientUbication.lng"
              :draggable="false"
            />
          </div>
        </div>
        <p v-else class="text-gray-500">No tienes un pedido activo asignado.</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-teal-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Mis Estadísticas</h3>
        <div v-if="dealerStats" class="space-y-2">
            <p>Pedidos Entregados: <span class="font-bold">{{ dealerStats.deliveryCount }}</span></p>
            <p>Tiempo Promedio de Entrega: <span class="font-bold">{{ dealerStats.avgDeliveryTime.toFixed(2) }} min</span></p>
        </div>
        <p v-else class="text-gray-500">Cargando estadísticas...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuthenticatedDealerDeliveryCount, getAuthenticatedDealerAverageDeliveryTime } from '~/services/dealerService';
import { getActiveOrderByDealer } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { wktToLatLng } from '~/utils/wktUtils';
import MapPicker from '~/components/common/MapPicker.vue';
import type { Order } from '~/types/types';

interface ActiveOrder extends Order {
  clientId: number;
  clientName: string;
  deliveryAddress: string;
}

const activeOrder = ref<ActiveOrder | null>(null);
const dealerStats = ref<{ deliveryCount: number; avgDeliveryTime: number } | null>(null);
const clientUbication = ref<{ lat: number; lng: number } | null>(null);

definePageMeta({ layout: 'dealer', middleware: 'auth-role' });
useHead({ title: 'Dashboard Repartidor' });

onMounted(async () => {
  try {
    // Cargar datos en paralelo para mayor eficiencia
    const [active, count, avgTime] = await Promise.all([
      getActiveOrderByDealer(),
      getAuthenticatedDealerDeliveryCount(),
      getAuthenticatedDealerAverageDeliveryTime()
    ]);
    
    activeOrder.value = active;
    dealerStats.value = { deliveryCount: count, avgDeliveryTime: avgTime };

    // Si hay pedido activo y clientId, obtener ubicación del cliente
    if (active && active.clientId) {
      const client = await getClientById(active.clientId);
      if (client && client.ubication) {
        const coords = wktToLatLng(client.ubication);
        if (coords) {
          clientUbication.value = { lat: coords.lat, lng: coords.lng };
        }
      }
    }
  } catch (error) {
    console.error("Error al cargar datos del repartidor:", error);
  }
});
</script>