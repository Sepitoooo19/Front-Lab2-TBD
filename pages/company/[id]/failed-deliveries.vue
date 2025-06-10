<!-- Productos fallidos de la empresa por id para el admin -->

<script setup>
// Importa las dependencias necesarias
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getFailedDeliveriesByCompanyId } from '~/services/ordersService'; // Importa el servicio para obtener las entregas fallidas

// Define las variables reactivas
const route = useRoute();
const companyId = route.params.id; // Obtiene el parámetro de la ruta
const failedOrders = ref([]); // Lista de entregas fallidas
const error = ref(null); // Manejo de errores

// Obtén las entregas fallidas al montar el componente
// Metodo: getFailedDeliveriesByCompanyId
// Entrada: companyId (ID de la empresa)
// Salida: failedOrders (Lista de entregas fallidas) y error (Manejo de errores)
onMounted(async () => {
  try {
    failedOrders.value = await getFailedDeliveriesByCompanyId(companyId);
  } catch (err) {
    console.error('Error al obtener las entregas fallidas:', err);
    error.value = 'No se pudieron cargar las entregas fallidas.';
  }
});

 definePageMeta({
    layout: 'admin', // Usa el layout de administrador
  });
</script>

<!-- Este template muestra una tabla con las entregas fallidas de la empresa -->

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Entregas Fallidas - Empresa {{ companyId }}</h1>
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Fecha Pedido</th>
          <th class="px-4 py-2 text-left">Fecha Entrega</th>
          <th class="px-4 py-2 text-left">Estado</th>
          <th class="px-4 py-2 text-left">Productos</th>
          <th class="px-4 py-2 text-left">Cliente</th>
          <th class="px-4 py-2 text-left">Repartidor</th>
          <th class="px-4 py-2 text-left">Monto Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in failedOrders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ order.orderDate }}</td>
          <td class="px-4 py-2">{{ order.deliveryDate }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">{{ order.products }}</td>
          <td class="px-4 py-2">{{ order.clientId.name }}</td>
          <td class="px-4 py-2">{{ order.dealerId.name }}</td>
          <td class="px-4 py-2">{{ order.totalPrice }}</td>
        </tr>
        <tr v-if="failedOrders.length === 0">
          <td colspan="8" class="px-4 py-2 text-center text-gray-500">No se encontraron entregas fallidas para esta empresa.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>