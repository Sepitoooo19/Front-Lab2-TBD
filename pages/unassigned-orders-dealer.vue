<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { getAllOrders, getActiveOrderByDealer } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { getCompleteDealerData } from '~/services/dealerService';
import { wktToLatLng } from '~/utils/wktUtils';
import type { Order } from '~/types/types';
import OrdersMap from '~/components/common/OrdersMap.vue';

const config = useRuntimeConfig();
const orders = ref<Order[]>([]);
const unassignedOrders = ref<Order[]>([]);
const hasActiveOrder = ref(false);

const dealerLocation = ref<{ lat: number; lng: number } | null>(null);
const isLoadingMap = ref(true);

const ordersForMap = ref<Array<{
  id: number,
  location: string | null,
  address?: string,
  status?: string
}>>([]);

const orderCoords = ref<Record<number, { lat: number; lng: number } | null>>({});

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2,'0')}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getFullYear()}`;
};

const loadMapPoints = async () => {
  isLoadingMap.value = true;
  dealerLocation.value = null;
  orderCoords.value = {};
  ordersForMap.value = [];

  // 1. Ubicación del dealer
  try {
    const dealerProfile = await getCompleteDealerData();
    if (dealerProfile && dealerProfile.ubication) {
      const coords = wktToLatLng(dealerProfile.ubication);
      if (coords) {
        dealerLocation.value = { lat: coords.lat, lng: coords.lng };
      }
    }
  } catch (err) {
    console.error('Error al obtener ubicación del dealer:', err);
  }

  // 2. Obtener ubicaciones de entrega de todas las órdenes sin asignar
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
    const [allOrdersResponse, activeOrderResponse] = await Promise.all([
      getAllOrders(),
      getActiveOrderByDealer()
    ]);

    orders.value = allOrdersResponse;
    hasActiveOrder.value = activeOrderResponse !== null;

    unassignedOrders.value = orders.value.filter(order =>
      !order.dealerId && order.status !== 'ENTREGADO' && order.status !== 'FALLIDA'
    );

    await loadMapPoints();
  } catch (err) {
    console.error('Error al cargar las órdenes:', err);
  }
});

const assignOrder = async (orderId: number) => {
  try {
    if (hasActiveOrder.value) {
      alert('Ya tienes una orden asignada en proceso. No puedes tomar más órdenes.');
      return;
    }

    const response = await fetch(`${config.public.apiBase}/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    });

    if (!response.ok) {
      if (response.status === 409) {
        alert('Ya tienes una orden activa. No puedes tomar más órdenes.');
        hasActiveOrder.value = true;
      } else {
        throw new Error('Error al asignar la orden');
      }
      return;
    }

    alert('Orden asignada exitosamente.');
    unassignedOrders.value = unassignedOrders.value.filter(order => order.id !== orderId);
    hasActiveOrder.value = true;

    await loadMapPoints();
  } catch (err) {
    console.error('Error al asignar la orden:', err);
    alert('Error al asignar la orden: ' + (err as Error).message);
  }
};

definePageMeta({
  layout: 'dealer',
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Órdenes Sin Asignar</h1>

    <!-- Mapa de puntos de entrega y ubicación del dealer -->
    <div class="mb-10">
      <h2 class="text-lg font-semibold mb-2">Mapa de puntos de entrega</h2>
      <div
        class="rounded-xl shadow-lg border overflow-hidden bg-white"
        style="height: 18rem; min-height: 250px; width: 100%;"
      >
        <div v-if="isLoadingMap || !dealerLocation" class="flex items-center justify-center h-full text-gray-500">
          Cargando mapa...
        </div>
        <div v-else class="h-full w-full">
          <OrdersMap
            :orders="ordersForMap"
            :dealer-location="dealerLocation"
            :show-route="false"
          />
        </div>
      </div>
    </div>

    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">N° Orden</th>
          <th class="px-4 py-2 text-left">ID Cliente</th>
          <th class="px-4 py-2 text-left">Monto</th>
          <th class="px-4 py-2 text-left">Fecha Pedido</th>
          <th class="px-4 py-2 text-left">Coordenadas</th>
          <th class="px-4 py-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in unassignedOrders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ order.clientId || 'N/A' }}</td>
          <td class="px-4 py-2">${{ order.totalPrice }}</td>
          <td class="px-4 py-2">{{ formatDate(order.orderDate) }}</td>
          <td class="px-4 py-2">
            <span v-if="orderCoords[order.id]">
              Lat: {{ orderCoords[order.id]?.lat }}, Lng: {{ orderCoords[order.id]?.lng }}
            </span>
            <span v-else class="text-gray-400">No disponible</span>
          </td>
          <td class="px-4 py-2">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              @click="assignOrder(order.id)"
              :disabled="hasActiveOrder"
            >
              Tomar Orden
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="unassignedOrders.length === 0" class="mt-4 text-gray-500">
      No hay órdenes sin asignar.
    </div>
  </div>
</template>