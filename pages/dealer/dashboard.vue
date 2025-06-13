<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">🛵 Panel del Repartidor</h1>
    
    <div class="grid gap-8 md:grid-cols-2">
      <div class="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Mi Pedido Activo</h3>
        <div v-if="activeOrder">
          <p class="text-lg"><strong>Pedido #{{ activeOrder.id }}</strong></p>
          <p>Estado: <span class="font-bold text-orange-600">{{ activeOrder.status }}</span></p>
          <p>Cliente: {{ activeOrder.clientName }}</p>
          <p>Dirección: {{ activeOrder.deliveryAddress }}</p>
          </div>
        <p v-else class="text-gray-500">No tienes un pedido activo asignado.</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-teal-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Mis Estadísticas</h3>
        <div v-if="dealerStats" class="space-y-2">
            <p>Pedidos Entregados Hoy: <span class="font-bold">{{ dealerStats.deliveryCount }}</span></p>
            <p>Tiempo Promedio de Entrega: <span class="font-bold">{{ dealerStats.avgDeliveryTime.toFixed(2) }} min</span></p>
        </div>
        <p v-else class="text-gray-500">Cargando estadísticas...</p>
      </div>
    </div>
    
    <div class="mt-10 bg-white rounded-2xl shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Todos Mis Pedidos Asignados</h3>
      <p class="text-gray-500">(Tabla o lista con todos los pedidos del repartidor aquí)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuthenticatedDealerDeliveryCount, getAuthenticatedDealerAverageDeliveryTime } from '~/services/dealerService';
import { getActiveOrderByDealer, getOrdersByDealer} from '~/services/ordersService';
import type { Order } from '~/types/types';

// Asumimos que la orden activa tiene esta estructura, ajústala a tu DTO
interface ActiveOrder extends Order {
  clientName: string;
  deliveryAddress: string;
}

const activeOrder = ref<ActiveOrder | null>(null);
const allMyOrders = ref<Order[]>([]);
const dealerStats = ref<{ deliveryCount: number; avgDeliveryTime: number } | null>(null);

definePageMeta({ layout: 'dealer', middleware: 'auth-role' });
useHead({ title: 'Dashboard Repartidor' });

onMounted(async () => {
  try {
    // Cargar datos en paralelo para mayor eficiencia
    const [active, all, count, avgTime] = await Promise.all([
      getActiveOrderByDealer(),
      getOrdersByDealer(),
      getAuthenticatedDealerDeliveryCount(),
      getAuthenticatedDealerAverageDeliveryTime()
    ]);
    
    activeOrder.value = active;
    allMyOrders.value = all;
    dealerStats.value = { deliveryCount: count, avgDeliveryTime: avgTime };

  } catch (error) {
    console.error("Error al cargar datos del repartidor:", error);
  }
});
</script>