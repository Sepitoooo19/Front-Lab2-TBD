<!-- page que muestra todas las ordenes en vista admin-->

<script setup lang="ts">
// Importa las dependencias necesarias
import { ref, onMounted } from 'vue';
import { getAllOrders } from '~/services/ordersService'; // Importa el servicio para obtener las órdenes
import { getNameByClientId } from '~/services/clientService'; // Importa el servicio para obtener el nombre del cliente
import { getDealerNameById } from '~/services/dealerService';
import type { Order } from '~/types/types'; // Importa la interfaz Order
// Const orders para almacenar las órdenes
const orders = ref<Order[]>([]); // Lista de órdenes

// Función para formatear fechas
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

// Carga las órdenes al montar el componente
// Método: getAllOrders, getNameByClientId y getDealerNameById
// Entrada: token (localStorage) y dealerId 
// Salida: orders
onMounted(async () => {
  try {
    const ordersData: Order[] = await getAllOrders(); // Obtén todas las órdenes

    // Itera sobre las órdenes y agrega el nombre del cliente y del repartidor
    const ordersWithNames = await Promise.all(
      ordersData.map(async (order: Order) => {
        try {
          // Obtén el nombre del cliente
          const clientName = await getNameByClientId(order.clientId);

          // Obtén el nombre del repartidor o asigna "Sin asignar" si dealerId es null
          const dealerName = order.dealerId
            ? await getDealerNameById(order.dealerId)
            : "Sin asignar";

          return { ...order, nameClient: clientName, dealerName }; // Asigna los nombres al pedido
        } catch (err) {
          console.error(`Error al procesar la orden con ID ${order.id}:`, err);
          return { ...order, nameClient: "Desconocido", dealerName: "Sin asignar" }; // Valores predeterminados en caso de error
        }
      })
    );

    orders.value = ordersWithNames; // Asigna las órdenes con los nombres
  } catch (err) {
    console.error("Error al cargar las órdenes:", err);
  }
});

definePageMeta({
    layout: 'admin',
    middleware: 'auth-role'
});
</script>

<!-- Muestra las órdenes en una tabla-->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Todas las Órdenes</h1>

    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Id Cliente</th>
          <th class="px-4 py-2 text-left">Cliente</th>
          <th class="px-4 py-2 text-left">Id Repartidor</th>
          <th class="px-4 py-2 text-left">Repartidor</th>
          <th class="px-4 py-2 text-left">Fecha de Orden</th>
          <th class="px-4 py-2 text-left">Fecha de Entrega</th>
          <th class="px-4 py-2 text-left">Estado</th>
          <th class="px-4 py-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ order.clientId }}</td> <!-- ID del cliente -->
          <td class="px-4 py-2">{{ order.nameClient }}</td> <!-- Muestra el nombre del cliente -->
          <td class="px-4 py-2">{{ order.dealerId }}</td>
          <td class="px-4 py-2">{{ order.dealerName }}</td>
          <td class="px-4 py-2">{{ formatDate(order.orderDate) }}</td>
          <td class="px-4 py-2">{{ formatDate(order.deliveryDate) }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">${{ order.totalPrice.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="orders.length === 0" class="mt-4 text-gray-500">
      No hay órdenes registradas.
    </div>
  </div>
</template>
