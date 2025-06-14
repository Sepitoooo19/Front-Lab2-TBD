<!-- En esta page se muestra la orden activa del repartidor, incluyendo el mapa de entrega -->

<script setup lang="ts">
// Importa los módulos necesarios
import { ref, onMounted } from 'vue';
import { getActiveOrderNameAddresDTOByDealer, updateOrderStatus } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { wktToLatLng } from '~/utils/wktUtils';
import MapPicker from '~/components/common/MapPicker.vue';
import type { OrderNameAddressDTO, Client } from '~/types/types';

const order = ref<OrderNameAddressDTO | null>(null);
const clientUbication = ref<{ lat: number; lng: number } | null>(null);
const isLoadingUbication = ref(false);

// Función para cargar la orden activa y la ubicación del cliente
const loadActiveOrder = async () => {
  try {
    order.value = null;
    clientUbication.value = null;
    const activeOrder = await getActiveOrderNameAddresDTOByDealer();
    order.value = activeOrder;

    // Si hay orden y clientId, obtener la ubicación del cliente
    if (activeOrder && activeOrder.clientId) {
      isLoadingUbication.value = true;
      const client: Client = await getClientById(activeOrder.clientId);
      if (client && client.ubication) {
        const coords = wktToLatLng(client.ubication);
        if (coords) {
          clientUbication.value = { lat: coords.lat, lng: coords.lng };
        }
      }
      isLoadingUbication.value = false;
    }
  } catch (err) {
    console.error('Error al cargar la orden activa o la ubicación:', err);
    order.value = null;
    clientUbication.value = null;
    isLoadingUbication.value = false;
  }
};

// Función para actualizar el estado de la orden
const updateOrder = async (newStatus: string) => {
  if (!order.value) return;
  try {
    const body: any = { status: newStatus };
    if (newStatus === 'FALLIDA') {
      body.deliveryDate = null;
    }
    await updateOrderStatus(order.value.id, body);
    const successMessage = newStatus === 'ENTREGADO'
      ? 'Orden entregada exitosamente.'
      : 'La orden fue marcada como fallida.';
    alert(successMessage);
    order.value = null;
    clientUbication.value = null;
  } catch (err) {
    console.error(`Error al actualizar el estado a ${newStatus}:`, err);
    alert(`Error: ${(err as Error).message}`);
  }
};

const deliverOrder = () => {
  const confirmed = confirm("¿Estás seguro de que deseas marcar la orden como ENTREGADA?");
  if (confirmed) {
    updateOrder('ENTREGADO');
  }
};

const failOrder = () => {
  const confirmed = confirm("¿Estás seguro de que deseas marcar la orden como FALLIDA?");
  if (confirmed) {
    updateOrder('FALLIDA');
  }
};

onMounted(() => {
  loadActiveOrder();
});

definePageMeta({
  layout: 'dealer',
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Orden Activa</h1>
    <div v-if="order" class="border border-gray-300 rounded-lg shadow-md p-6 bg-white">
      <h2 class="text-xl font-bold">N° Orden: {{ order.id }}</h2>
      <p><strong>Monto:</strong> ${{ order.totalPrice }}</p>
      <p><strong>Estado:</strong> {{ order.status }}</p>
      <p><strong>Fecha de Orden:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
      <p><strong>Id Cliente:</strong> {{ order.clientId || 'N/A' }}</p>
      <p><strong>Nombre Cliente:</strong> {{ order.nameClient || 'N/A' }}</p>
      <p><strong>Dirección:</strong> {{ order.address || 'N/A' }}</p>
      <p v-if="clientUbication">
        <strong>Coordenadas:</strong>
        Latitud: {{ clientUbication.lat }}, Longitud: {{ clientUbication.lng }}
      </p>

      <!-- Mapa de ubicación de entrega a -->
      <div class="mt-6">
        <h3 class="font-semibold mb-2">Ubicación de entrega</h3>
        <div v-if="isLoadingUbication" class="text-gray-500 mb-2">Cargando mapa...</div>
        <div v-else-if="clientUbication">
          <MapPicker
            :lat="clientUbication.lat"
            :lng="clientUbication.lng"
            :draggable="false"
          />
        </div>
        <div v-else class="text-gray-500 mb-2">No se pudo obtener la ubicación del cliente.</div>
      </div>

      <div class="mt-4 flex space-x-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          @click="deliverOrder"
        >
          Entregar
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          @click="failOrder"
        >
          Emergencia
        </button>
      </div>
    </div>
    <div v-else class="text-gray-500">
      No hay una orden asignada actualmente.
    </div>
  </div>
</template>