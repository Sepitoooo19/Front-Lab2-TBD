<!-- page para ver las órdenes sin asignar en vista admin-->

<script setup lang="ts">
// Importa las dependencias necesarias
import { ref, onMounted } from 'vue';
import { getAllOrders } from '~/services/ordersService'; // Importa el servicio para obtener las órdenes
import type { Order } from '~/types/types'; // Importa la interfaz Order

// const orders para almacenar las órdenes
const orders = ref<Order[]>([]); // Lista de todas las órdenes
const unassignedOrders = ref<Order[]>([]); // Lista de órdenes sin asignar

// Función para formatear fechas
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

// Carga las órdenes al montar el componente y filtra las no asignadas
// Método: getAllOrders
// Entrada: token (localStorage)
// Salida: orders (lista de órdenes), unassignedOrders (órdenes sin asignar)
onMounted(async () => {
  try {
    orders.value = await getAllOrders();

    // Verifica los valores de dealerId en las órdenes
    console.log('Órdenes cargadas:', orders.value);

    // Filtra órdenes sin dealerId (null, undefined o vacío)
    unassignedOrders.value = orders.value.filter(order => !order.dealerId);
    console.log('Órdenes sin asignar:', unassignedOrders.value);
  } catch (err) {
    console.error('Error al cargar las órdenes:', err);
  }
});

definePageMeta({
    layout: 'admin',
    middleware: 'auth-role'
});
</script>

<!-- Template que contiene la lista de órdenes sin asignar-->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Órdenes Sin Asignar</h1>

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