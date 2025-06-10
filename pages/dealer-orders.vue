<!-- pagina que muestra el historial de ordenes del repartidor-->

<script setup lang="ts">
// Importaciones necesarias
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { getOrdersByDealerDto } from '~/services/ordersService'; // Asegúrate de usar el método correcto
import type { OrderTotalProductsDTO } from '~/types/types'; // Ajusta el tipo según el DTO

// Configuración y estado
const config = useRuntimeConfig();
const orders = ref<OrderTotalProductsDTO[]>([]); // Cambia el tipo a OrderTotalProductsDTO

// Cargar las órdenes al montar el componente
onMounted(async () => {
  try {
    // Llamada al servicio que usa el token del dealer autenticado
    orders.value = await getOrdersByDealerDto();
  } catch (error) {
    console.error('Error al cargar el historial de órdenes:', error);
    alert('Error al cargar el historial de órdenes');
  }
});

// Definir metadatos de la página
definePageMeta({
  layout: 'dealer',
});

// Función para formatear la fecha de entrega
const formatDeliveryDate = (order: OrderTotalProductsDTO) => {
  if (order.status === 'FALLIDA') {
    return 'No se pudo entregar';
  }
  return order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : 'EN PROCESO';
};
</script>

<!-- Template para mostrar el historial de órdenes del repartidor -->

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
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td> <!-- Cambiado de order.orderId a order.id -->
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

<style scoped>
</style>