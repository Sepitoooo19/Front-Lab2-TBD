<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllOrders } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { wktToLatLng } from '~/utils/wktUtils';
import type { Order } from '~/types/types';
import OrdersMap from '~/components/common/OrdersMap.vue';

const orders = ref<Order[]>([]);
const unassignedOrders = ref<Order[]>([]);

const isLoadingMap = ref(true);
const ordersForMap = ref<Array<{
  id: number,
  location: string | null,
  address?: string,
  status?: string
}>>([]);

const orderCoords = ref<Record<number, { lat: number; lng: number } | null>>({});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

const loadMapPoints = async () => {
  isLoadingMap.value = true;
  orderCoords.value = {};
  ordersForMap.value = [];

  const points: Array<{
    id: number,
    location: string | null,
    address?: string,
    status?: string
  }> = [];

  await Promise.all(unassignedOrders.value.map(async (order) => {
    try {
      if (order.clientId) {
        const client = await getClientById(order.clientId);
        if (client && client.ubication) {
          const coords = wktToLatLng(client.ubication);
          if (
            coords &&
            typeof coords.lat === 'number' &&
            typeof coords.lng === 'number' &&
            coords.lat !== 0 &&
            coords.lng !== 0
          ) {
            points.push({
              id: order.id,
              location: client.ubication,
              address: order.address,
              status: order.status
            });
            orderCoords.value[order.id] = { lat: coords.lat, lng: coords.lng };
          } else {
            orderCoords.value[order.id] = null;
          }
        } else {
          orderCoords.value[order.id] = null;
        }
      } else {
        orderCoords.value[order.id] = null;
      }
    } catch (err) {
      orderCoords.value[order.id] = null;
      console.error(`Error al obtener ubicación del cliente para orden ${order.id}:`, err);
    }
  }));

  ordersForMap.value = points;
  isLoadingMap.value = false;
};

onMounted(async () => {
  try {
    orders.value = await getAllOrders();
    unassignedOrders.value = orders.value.filter(order => !order.dealerId);
    await loadMapPoints();
  } catch (err) {
    console.error('Error al cargar las órdenes:', err);
  }
});

definePageMeta({
    layout: 'admin',
    middleware: 'auth-role'
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Órdenes Sin Asignar</h1>

    <!-- Mapa de puntos de entrega de órdenes sin asignar -->
    <div class="mb-10">
      <h2 class="text-lg font-semibold mb-2">Mapa de puntos de entrega</h2>
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
            :show-route="false"
          />
        </div>
      </div>
    </div>

    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Cliente</th>
          <th class="px-4 py-2 text-left">Fecha de Orden</th>
          <th class="px-4 py-2 text-left">Fecha de Entrega</th>
          <th class="px-4 py-2 text-left">Estado</th>
          <th class="px-4 py-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in unassignedOrders" :key="order.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ order.nameClient }}</td>
          <td class="px-4 py-2">{{ formatDate(order.orderDate) }}</td>
          <td class="px-4 py-2">{{ formatDate(order.deliveryDate) }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">${{ order.totalPrice.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="unassignedOrders.length === 0" class="mt-4 text-gray-500">
      No hay órdenes sin asignar.
    </div>
  </div>
</template>