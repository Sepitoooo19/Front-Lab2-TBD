<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { getOrdersByDealerDto } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { wktToLatLng } from '~/utils/wktUtils';
import OrdersMap from '~/components/common/OrdersMap.vue';

// Extiende el tipo para incluir clientId y address opcionales
type DealerOrder = {
  id: number;
  orderDate: string;
  deliveryDate: string;
  status: string;
  totalPrice: number;
  totalProducts: number;
  clientId?: number;
  address?: string;
};

const config = useRuntimeConfig();
const orders = ref<DealerOrder[]>([]);
const ordersForMap = ref<Array<{
  id: number,
  location: string | null,
  address?: string,
  status?: string
}>>([]);
const isLoadingMap = ref(true);

onMounted(async () => {
  try {
    // Forzamos el tipo extendido
    orders.value = await getOrdersByDealerDto() as DealerOrder[];

    const points: Array<{
      id: number,
      location: string | null,
      address?: string,
      status?: string
    }> = [];

    await Promise.all(orders.value.map(async (order) => {
      try {
        if (order.clientId) {
          const client = await getClientById(order.clientId);
          if (client && client.ubication) {
            points.push({
              id: order.id,
              location: client.ubication,
              address: order.address,
              status: order.status
            });
          }
        }
      } catch (err) {
        // Si falla, no agrega el punto
      }
    }));

    ordersForMap.value = points;
    isLoadingMap.value = false;
  } catch (error) {
    console.error('Error al cargar el historial de órdenes:', error);
    alert('Error al cargar el historial de órdenes');
    isLoadingMap.value = false;
  }
});

definePageMeta({
  layout: 'dealer',
});

const formatDeliveryDate = (order: DealerOrder) => {
  if (order.status === 'FALLIDA') {
    return 'No se pudo entregar';
  }
  return order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : 'EN PROCESO';
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Historial de Órdenes</h1>

    <!-- Mapa de historial de órdenes -->
    <div class="mb-10">
      <h2 class="text-lg font-semibold mb-2">Mapa de historial de órdenes</h2>
      <div
        class="rounded-xl shadow-lg border overflow-hidden bg-white"
        style="height: 18rem; min-height: 250px; width: 100%;"
      >
        <div v-if="isLoadingMap" class="flex items-center justify-center h-full text-gray-500">
          Cargando mapa...
        </div>
        <div v-else class="h-full w-full">
          <OrdersMap
            :orders="ordersForMap"
            :show-status-icons="true"
          />
        </div>
      </div>
    </div>

    <!-- Tabla de órdenes -->
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Fecha de Pedido</th>
          <th class="px-4 py-2 text-left">Fecha de Entrega</th>
          <th class="px-4 py-2 text-left">Productos</th>
          <th class="px-4 py-2 text-left">Total</th>
          <th class="px-4 py-2 text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ new Date(order.orderDate).toLocaleString() }}</td>
          <td class="px-4 py-2">{{ formatDeliveryDate(order) }}</td>
          <td class="px-4 py-2">{{ order.totalProducts }}</td>
          <td class="px-4 py-2">${{ order.totalPrice }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="orders.length === 0" class="mt-4 text-gray-500">
      No hay órdenes en tu historial.
    </div>
  </div>
</template>