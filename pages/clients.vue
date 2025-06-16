<!-- page para mostrar los clientes en vista de admin -->

<script setup lang="ts">
// Importaciones necesarias
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllClients, deleteClientById } from '~/services/clientService';
import { getOrdersByClientId } from '~/services/ordersService';
import type { Client, Order } from '~/types/types';
// Importa los servicios y tipos necesarios
const router = useRouter();
const clients = ref<Client[]>([]);
const orders = ref<Order[]>([]); // Lista de órdenes del cliente seleccionado
const isOrdersModalOpen = ref(false); // Estado del modal
const selectedClientName = ref(''); // Nombre del cliente seleccionado

// Funcion que obtiene los clientes
// Metodo: getAllClients
// Entrada: void
// Salida: clients
onMounted(async () => {
  try {
    clients.value = await getAllClients();
  } catch (error) {
    alert('Error al cargar los clientes');
  }
});

// Funciones para manejar las acciones de los botones
// Función para crear un nuevo cliente
const createClient = () => {
  router.push('/clients/create'); // Ruta para crear un cliente
};

// Función para editar un cliente
const editClient = (client: Client) => {
  router.push(`/clients/${client.id}/edit`); // Ruta para editar cliente
};

// Función para ver la cobertura de un cliente
const viewCoverage = (clientId: number) => {
  router.push(`/coverage?clientId=${clientId}`);
};

// Función para eliminar un cliente y refrescar la lista
// Metodo: deleteClientById y getAllClients
const deleteClient = async (clientId: number) => {
  const confirmDelete = confirm('¿Estás seguro que deseas eliminar este cliente?');
  if (confirmDelete) {
    try {
      await deleteClientById(clientId);
      clients.value = await getAllClients(); // Refrescar lista
    } catch (error) {
      alert('Error al eliminar el cliente');
    }
  }
};

// Función para ver las órdenes de un cliente
// Metodo: getOrdersByClientId
// Entrada: clientId
// Salida: orders
const viewOrders = async (clientId: number, clientName: string) => {
  try {
    orders.value = await getOrdersByClientId(clientId); // Obtiene las órdenes del cliente
    selectedClientName.value = clientName; // Guarda el nombre del cliente seleccionado
    isOrdersModalOpen.value = true; // Abre el modal
  } catch (error) {
    alert('Error al obtener las órdenes del cliente');
  }
};

// Función para cerrar el modal de órdenes
// Metodo: closeOrdersModal
// Entrada: void
// Salida: void
const closeOrdersModal = () => {
  isOrdersModalOpen.value = false; // Cierra el modal
  orders.value = []; // Limpia las órdenes
};

 definePageMeta({
    layout: 'admin', // Usa el layout de administrador
  });
</script>

<!-- Template para mostrar los clientes en vista de admin -->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Lista de Clientes</h1>


    <!-- Tabla de clientes -->
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">RUT</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Teléfono</th>
          <th class="px-4 py-2 text-left">Dirección</th>
          <th class="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ client.id }}</td>
          <td class="px-4 py-2">{{ client.name }}</td>
          <td class="px-4 py-2">{{ client.rut }}</td>
          <td class="px-4 py-2">{{ client.email }}</td>
          <td class="px-4 py-2">{{ client.phone }}</td>
          <td class="px-4 py-2">{{ client.address }}</td>
          <td class="px-4 py-2 space-x-2">
            
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
              @click="deleteClient(client.id)"
            >
              Eliminar
            </button>
            <button
              @click="viewOrders(client.id, client.name)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Ver órdenes
            </button>
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded"
              @click="viewCoverage(client.id)"
            >
              Cobertura
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para mostrar órdenes -->
    <div
      v-if="isOrdersModalOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-3/4">
        <h2 class="text-xl font-bold mb-4">Órdenes de {{ selectedClientName }}</h2>
        <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Fecha de Orden</th>
              <th class="px-4 py-2 text-left">Fecha de Entrega</th>
              <th class="px-4 py-2 text-left">Estado</th>
              <th class="px-4 py-2 text-left">Productos</th>
              <th class="px-4 py-2 text-left">Precio Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-4 py-2">{{ order.id }}</td>
              <td class="px-4 py-2">{{ order.orderDate }}</td>
              <td class="px-4 py-2">{{ order.deliveryDate }}</td>
              <td class="px-4 py-2">{{ order.status }}</td>
              <td class="px-4 py-2">{{ order.products }}</td>
              <td class="px-4 py-2">{{ order.totalPrice }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end mt-4">
          <button @click="closeOrdersModal" class="bg-red-500 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>