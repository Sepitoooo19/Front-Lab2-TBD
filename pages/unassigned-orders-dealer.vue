<!-- page que muestra las ordenes sin asignar en vista repartidor-->

<script setup lang="ts">
// Importa los módulos necesarios
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { getAllOrders, getActiveOrderByDealer } from '~/services/ordersService';
import type { Order } from '~/types/types';

// constantes y variables reactivas
const config = useRuntimeConfig();
const orders = ref<Order[]>([]);
const unassignedOrders = ref<Order[]>([]);
const hasActiveOrder = ref(false);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

// Función para cargar las órdenes al montar el componente
// Método: getAllOrders y getActiveOrderByDealer
// Entrada: token (localStorage)
// Salida: orders (lista de órdenes), unassignedOrders (órdenes sin asignar), hasActiveOrder (booleano)
// Descripción: Esta función carga todas las órdenes y filtra las que no tienen un dealerId asignado.
onMounted(async () => {
  try {
    const [allOrdersResponse, activeOrderResponse] = await Promise.all([
      getAllOrders(),
      getActiveOrderByDealer()
    ]);

    orders.value = allOrdersResponse;
    hasActiveOrder.value = activeOrderResponse !== null;

    // Filtrar órdenes sin asignar (dealerId null o undefined)
    unassignedOrders.value = orders.value.filter(order => 
      !order.dealerId && order.status !== 'ENTREGADO' && order.status !== 'FALLIDA'
    );

  } catch (err) {
    console.error('Error al cargar las órdenes:', err);
  }
});

// Función para asignar una orden al dealer
// Método: assignOrder
// Entrada: orderId (ID de la orden)
// Salida: orden asignada
// Descripción: Esta función asigna una orden al dealer y actualiza el estado de las órdenes.
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
        Authorization: `Bearer ${localStorage.getItem('token')}`
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
    
    // Recargar la orden activa
    const activeOrder = await getActiveOrderByDealer();
    if (activeOrder) {
      console.log('Orden activa cargada:', activeOrder);
    }
  } catch (err) {
    console.error('Error al asignar la orden:', err);
    alert('Error al asignar la orden: ' + (err as Error).message);
  }
};

definePageMeta({
  layout: 'dealer',
});
</script>

<!-- Template para mostrar las órdenes sin asignar y el botón para tomarlas-->

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Órdenes Sin Asignar</h1>
    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">N° Orden</th>
          <th class="px-4 py-2 text-left">Monto</th>
          <th class="px-4 py-2 text-left">Fecha Pedido</th>
          <th class="px-4 py-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in unassignedOrders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">${{ order.totalPrice }}</td>
          <td class="px-4 py-2">{{ formatDate(order.orderDate) }}</td>
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


<style scoped>
/* Estilo adicional opcional */
</style>