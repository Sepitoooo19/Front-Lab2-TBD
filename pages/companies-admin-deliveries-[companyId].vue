
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getDeliveredOrdersByCompanyId } from '~/services/orderService'; // Cambia el servicio para obtener órdenes entregadas

const route = useRoute();
const companyId = route.params.companyId; // Asegúrate de que el parámetro sea "companyId"
const company = ref({});
const deliveries = ref([]);

// Obtén las órdenes entregadas al montar el componente
onMounted(async () => {
  try {
    deliveries.value = await getDeliveredOrdersByCompanyId(companyId);
  } catch (error) {
    console.error('Error al obtener las entregas:', error);
  }
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Pedidos Entregados - Empresa {{ company.name }}</h1>
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Productos</th>
          <th class="px-4 py-2 text-left">Fecha Pedido</th>
          <th class="px-4 py-2 text-left">Fecha Entrega</th>
          <th class="px-4 py-2 text-left">Monto</th>
          <th class="px-4 py-2 text-left">Método de Pago</th>
          <th class="px-4 py-2 text-left">Repartidor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="delivery in deliveries" :key="delivery.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ delivery.id }}</td>
          <td class="px-4 py-2">{{ delivery.products }}</td>
          <td class="px-4 py-2">{{ delivery.orderDate }}</td>
          <td class="px-4 py-2">{{ delivery.deliveryDate }}</td>
          <td class="px-4 py-2">{{ delivery.total }}</td>
          <td class="px-4 py-2">{{ delivery.paymentMethod }}</td>
          <td class="px-4 py-2">{{ delivery.dealer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
