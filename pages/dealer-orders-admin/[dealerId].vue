<!-- Esta page muestra el historial de órdenes de un dealer específico en vista de administrador -->

<script setup lang="ts">
// Importa las dependencias necesarias
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getOrdersByDealerId, updateOrderStatusByDealerId } from '~/services/ordersService';
import type { Order } from '~/types/types';

// Obtener el dealerId de la URL
const route = useRoute();
const dealerId = Number(route.params.dealerId);
const orders = ref<Order[]>([]);

// Actualiza el estado de una orden
// Metodo: updateOrderStatusByDealerId 
// Entrada: orderId (ID de la orden), dealerId (ID del dealer), newStatus (nuevo estado)
// Salida: Actualiza el estado de la orden en la lista local y en el servidor
const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    // Llamar a la función del servicio para actualizar el estado de la orden
    await updateOrderStatusByDealerId(orderId, dealerId, newStatus);

    // Actualizar el estado de la orden en la lista local
    const order = orders.value.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
    }

    alert(`El estado de la orden ${orderId} fue actualizado a "${newStatus}"`);
  } catch (error) {
    console.error('Error al actualizar el estado de la orden:', error);
    alert('Error al actualizar el estado de la orden');
  }
};

// Carga las órdenes del dealer al montar el componente
// Metodo: getOrdersByDealerId
// Entrada: dealerId (ID del dealer)
// Salida: orders (Lista de órdenes del dealer)
onMounted(async () => {
  try {
    // Llamada al servicio para obtener las órdenes del dealer actual
    orders.value = await getOrdersByDealerId(dealerId);
  } catch (error) {
    alert('Error al cargar el historial de órdenes');
  }
});

definePageMeta({
  layout: 'admin', // Usa el layout para dealers
});
</script>

<!-- Este template muestra una tabla con el historial de órdenes del dealer y permite actualizar el estado de las órdenes -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Historial de Órdenes</h1>

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
          <th class="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ order.orderDate }}</td>
          <td class="px-4 py-2">{{ order.deliveryDate }}</td>
          <td class="px-4 py-2">{{ order.products }}</td>
          <td class="px-4 py-2">{{ order.totalPrice }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">
            <select
              class="border border-gray-300 rounded px-2 py-1"
              v-model="order.status"
              @change="updateOrderStatus(order.id, order.status)"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="DEVUELTO">Devuelto</option>
              <option value="FALLIDA">Fallido</option>
              <option value="EN PROCESO">En Proceso</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Estilo adicional opcional */
</style>