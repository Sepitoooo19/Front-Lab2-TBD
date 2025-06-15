<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getActiveOrderNameAddresDTOByDealer, updateOrderStatus } from '~/services/ordersService';
import { getClientById } from '~/services/clientService';
import { getCompleteDealerData } from '~/services/dealerService';
import { wktToLatLng } from '~/utils/wktUtils';
import OrdersMap from '~/components/common/OrdersMap.vue';
import { createEmergencyReport } from '~/services/emergencyService';
import type { OrderNameAddressDTO, Client } from '~/types/types';

const order = ref<OrderNameAddressDTO | null>(null);
const clientUbication = ref<{ lat: number; lng: number } | null>(null);
const dealerUbication = ref<{ lat: number; lng: number } | null>(null);
const isLoadingUbication = ref(false);
const isEmergencyProcessing = ref(false); // Para evitar doble click y loading en emergencia

const loadActiveOrder = async () => {
  try {
    order.value = null;
    clientUbication.value = null;
    dealerUbication.value = null;
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

    // Ubicación actual del dealer (usando getCompleteDealerData)
    const dealerProfile = await getCompleteDealerData();
    if (dealerProfile && dealerProfile.ubication) {
      const coords = wktToLatLng(dealerProfile.ubication);
      if (coords) {
        dealerUbication.value = { lat: coords.lat, lng: coords.lng };
      }
    }
  } catch (err) {
    order.value = null;
    clientUbication.value = null;
    dealerUbication.value = null;
    isLoadingUbication.value = false;
  }
};

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
    await loadActiveOrder(); // Recarga la orden para refrescar estado y mapa
  } catch (err) {
    alert(`Error: ${(err as Error).message}`);
  }
};

// NUEVO: función para crear EmergencyReport. Devuelve true si ok, false si falla.
const reportEmergency = async (): Promise<boolean> => {
  if (!order.value || !dealerUbication.value) return false;
  try {
    // Obtener el id del dealer
    const dealerProfile = await getCompleteDealerData();
    const dealerId = dealerProfile?.id;
    if (!dealerId) throw new Error('No se pudo obtener el ID del dealer');
    // Crear EmergencyReport
    await createEmergencyReport({
      orderId: order.value.id,
      dealerId,
      ubication: `POINT(${dealerUbication.value.lng} ${dealerUbication.value.lat})`
    });
    return true;
  } catch (err) {
    alert('No se pudo registrar la emergencia: ' + (err as Error).message);
    return false;
  }
};

const deliverOrder = () => {
  const confirmed = confirm("¿Estás seguro de que deseas marcar la orden como ENTREGADA?");
  if (confirmed) {
    updateOrder('ENTREGADO');
  }
};

const failOrder = async () => {
  if (isEmergencyProcessing.value) return;
  const confirmed = confirm("¿Estás seguro de que deseas marcar la orden como FALLIDA?");
  if (!confirmed) return;
  isEmergencyProcessing.value = true;
  const ok = await reportEmergency(); // Crea EmergencyReport primero
  if (ok) {
    await updateOrder('FALLIDA'); // Solo cambia estado si la emergencia fue registrada
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
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col h-full">
        <div class="mt-4 flex-grow"></div>
        <div class="flex space-x-4">
          <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            @click="deliverOrder"
          >
            Entregar
          </button>
          <button
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            @click="failOrder"
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