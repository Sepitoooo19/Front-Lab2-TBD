<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Notificaciones</h1>
    <div v-if="failedOrders.length > 0">
      <ul class="space-y-4">
        <li
          v-for="order in failedOrders"
          :key="order.id"
          class="bg-red-100 border border-red-300 p-4 rounded shadow"
        >
          <p class="text-gray-800 font-semibold">
            Pedido #{{ order.id }} ha sido marcado como FALLIDA.
          </p>
          <p class="text-sm text-gray-500">
            Fecha: {{ formatDate(order.orderDate) }}
          </p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="text-gray-500">No tienes ninguna notificación.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getFailedOrdersByClient } from '~/services/ordersService';
import type { Order } from '~/types/types';

const failedOrders = ref<Order[]>([]);

onMounted(async () => {
  try {
    failedOrders.value = await getFailedOrdersByClient();
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
  }
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

definePageMeta({
  layout: 'client'
});
</script>
