<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getActiveOrderNameAddresDTOByDealer, updateOrderStatusByDealerId } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { getCompleteDealerData } from '~/services/dealerService';
import { wktToLatLng } from '~/utils/wktUtils';
import OrdersMap from '~/components/common/OrdersMap.vue';
import { createEmergencyReport } from '~/services/emergencyService';
import type { OrderNameAddressDTO, Client } from '~/types/types';

const order = ref<OrderNameAddressDTO | null>(null);
const clientUbication = ref<{ lat: number; lng: number } | null>(null);
const dealerUbication = ref<{ lat: number; lng: number } | null>(null);
const dealerId = ref<number | null>(null);
const isLoadingUbication = ref(false);
const isEmergencyProcessing = ref(false); // Para evitar doble click y loading en emergencia

const loadActiveOrder = async () => {
  try {
    order.value = null;
    clientUbication.value = null;
    dealerUbication.value = null;
    dealerId.value = null;

    const activeOrder = await getActiveOrderNameAddresDTOByDealer();
    order.value = activeOrder;

    // Ubicación del cliente
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

    // Ubicación y id actual del dealer
    const dealerProfile = await getCompleteDealerData();
    if (dealerProfile && dealerProfile.ubication) {
      const coords = wktToLatLng(dealerProfile.ubication);
      if (coords) {
        dealerUbication.value = { lat: coords.lat, lng: coords.lng };
      }
    }
    // Guardar id del dealer para los updates
    if (dealerProfile && dealerProfile.id) {
      dealerId.value = dealerProfile.id;
    }
  } catch (err) {
    order.value = null;
    clientUbication.value = null;
    dealerUbication.value = null;
    dealerId.value = null;
    isLoadingUbication.value = false;
  }
};

// Cambia estado a ENTREGADO usando updateOrderStatusByDealerId
const updateOrderEntregada = async () => {
  if (!order.value || !dealerId.value) return;
  const confirmed = confirm("¿Estás seguro de que deseas marcar la orden como ENTREGADA?");
  if (!confirmed) return;
  try {
    await updateOrderStatusByDealerId(order.value.id, dealerId.value, 'ENTREGADO');
    alert('Orden entregada exitosamente.');
    await loadActiveOrder();
  } catch (err) {
    alert(`Error al marcar como entregada: ${(err as Error).message}`);
  }
};

// Cambia estado a FALLIDA usando updateOrderStatusByDealerId y crea EmergencyReport
const updateOrderFallida = async () => {
  if (isEmergencyProcessing.value) return;
  if (!order.value || !dealerId.value || !dealerUbication.value) return;
  const confirmed = confirm("¿Estás seguro de que deseas marcar la orden como FALLIDA?");
  if (!confirmed) return;

  isEmergencyProcessing.value = true;
  try {
    // 1. Crear EmergencyReport
    await createEmergencyReport({
      orderId: order.value.id,
      dealerId: dealerId.value,
      ubication: `POINT(${dealerUbication.value.lng} ${dealerUbication.value.lat})`
    });
    // 2. Cambiar estado a FALLIDA
    await updateOrderStatusByDealerId(order.value.id, dealerId.value, 'FALLIDA');
    alert('La orden fue marcada como fallida y emergencia registrada.');
    await loadActiveOrder();
  } catch (err) {
    alert('No se pudo registrar la emergencia o marcar la orden como fallida: ' + (err as Error).message);
  }
  isEmergencyProcessing.value = false;
};

onMounted(() => {
  loadActiveOrder();
});

definePageMeta({
  layout: 'dealer',
});
</script>

<template>
  <div class="p-6 pb-0">
    <h1 class="text-2xl font-bold mb-4">Orden Activa</h1>
    <div v-if="order" class="border border-gray-300 rounded-lg shadow-md p-6 bg-white mb-2 min-h-[600px]">
      <h2 class="text-xl font-bold">N° Orden: {{ order.id }}</h2>
      <p><strong>Monto:</strong> ${{ order.totalPrice }}</p>
      <p><strong>Estado:</strong> {{ order.status }}</p>
      <p><strong>Fecha de Orden:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
      <p><strong>Id Cliente:</strong> {{ order.clientId || 'N/A' }}</p>
      <p><strong>Nombre Cliente:</strong> {{ order.nameClient || 'N/A' }}</p>
      <p><strong>Dirección:</strong> {{ order.address || 'N/A' }}</p>
      <p v-if="clientUbication">
        <strong>Coordenadas Cliente:</strong>
        Latitud: {{ clientUbication.lat }}, Longitud: {{ clientUbication.lng }}
      </p>
      <p v-if="dealerUbication">
        <strong>Tu ubicación actual:</strong>
        Latitud: {{ dealerUbication.lat }}, Longitud: {{ dealerUbication.lng }}
      </p>

      <!-- Mapa de ubicación de entrega y dealer -->
      <div class="mb-10">
        <h3 class="font-semibold mb-2">Mapa de entrega y tu ubicación</h3>
        <div
          class="rounded-xl shadow-lg border overflow-hidden bg-white"
          style="height: 18rem; min-height: 250px; width: 100%;"
        >
          <div v-if="isLoadingUbication" class="flex items-center justify-center h-full text-gray-500">
            Cargando mapa...
          </div>
          <div v-else class="h-full w-full">
            <OrdersMap
              :orders="clientUbication ? [{ id: order.id, location: `POINT(${clientUbication.lng} ${clientUbication.lat})`, address: order.address }] : []"
              :dealer-location="dealerUbication"
              :show-route="true"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col h-full">
        <div class="mt-4 flex-grow"></div>
        <div class="flex space-x-4">
          <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            @click="updateOrderEntregada"
          >
            Entregar
          </button>
          <button
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            @click="updateOrderFallida"
            :disabled="isEmergencyProcessing"
          >
            Emergencia
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500">
      No hay una orden asignada actualmente.
    </div>
  </div>
</template>