<!-- En esta page se muestra la orden activa del repartidor -->

<script setup lang="ts">
// Importa los módulos necesarios
import { ref, onMounted } from 'vue';
import { getActiveOrderNameAddresDTOByDealer, updateOrderStatus } from '~/services/ordersService';
import type { Order, OrderNameAddressDTO  } from '~/types/types';
// Se define una referencia reactiva para almacenar la orden activa
const order = ref<OrderNameAddressDTO  | null>(null);


// Función para cargar la orden activa del repartidor
// Metodo: getActiveOrderByDealer
// Entrada: token (localStorage)
// Salida: order
// Descripción: Esta función obtiene la orden activa del repartidor y la asigna a la variable 'order'.
const loadActiveOrder = async () => {
  try {
    const activeOrder = await getActiveOrderNameAddresDTOByDealer();
    order.value = activeOrder;
  } catch (err) {
    console.error('Error al cargar la orden activa:', err);
    order.value = null;
  }
};

// Función para actualizar el estado de la orden
// Metodo: updateOrderStatus
// Entrada: orderId, body (status y deliveryDate)
// Salida: successMessage
// Descripción: Esta función actualiza el estado de la orden activa. Si el nuevo estado es 'FALLIDA', se asigna null a la fecha de entrega.
const updateOrder = async (newStatus: string) => {
  if (!order.value) return;
  try {
    const body: any = { status: newStatus };
    
    // Si es un fallo, asignamos null a la fecha de entrega
    if (newStatus === 'FALLIDA') {
      body.deliveryDate = null;
    }
    
    await updateOrderStatus(order.value.id, body);
    const successMessage = newStatus === 'ENTREGADO' 
      ? 'Orden entregada exitosamente.' 
      : 'La orden fue marcada como fallida.';
    alert(successMessage);
    order.value = null;
  } catch (err) {
    console.error(`Error al actualizar el estado a ${newStatus}:`, err);
    alert(`Error: ${(err as Error).message}`);
  }
};

// Funciones para manejar los botones de entrega y fallo, con validacion
// Metodo: updateOrder
// Entrada: Status
// Salida: successMessage
// Descripción: Estas funciones manejan la lógica de los botones "Entregar" y "Emergencia" respectivamente.
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

<!-- En este template se muestra la orden activa del repartidor, los detalles de la orden y los botones para entregar o marcar como fallida -->

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
      <!-- <p><strong>Metodo de Pago:</strong> {{ order.paymentMethod || 'N/A' }}</p> -->

      
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



<style scoped> 
</style>