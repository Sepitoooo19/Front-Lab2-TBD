<!-- page para mostrar las órdenes del cliente y calificar el repartidor -->

<script setup lang="ts">
// Importa los módulos necesarios
import { onMounted, ref } from 'vue';
import type { Order, Product, OrderDetails } from '~/types/types';
import { getOrdersByClient, getProductsByOrderId, getClientAddress } from '~/services/ordersService';
import { getOrderDetailsByOrderId } from '~/services/orderDetailsService';
import { getDealerNameById } from '~/services/dealerService'; // Servicio para obtener el nombre del repartidor

// Importa los servicios necesarios
const orders = ref<Order[]>([]); // Lista de órdenes del cliente
const products = ref<Product[]>([]); // Lista de productos de la orden seleccionada
const orderDetails = ref<OrderDetails | null>(null); // Detalles de la orden seleccionada
const showModal = ref(false); // Controla la visibilidad del modal de productos
const showDetailsModal = ref(false); // Controla la visibilidad del modal de detalles
const selectedOrderId = ref<number | null>(null); // ID del pedido seleccionado

// Carga las órdenes del cliente autenticado
// Método: getOClientAddress, getOrdersByClient y getDealerNameById
// Entrada: dealerId (en getDealerNameById)
// Salida: orders (lista de órdenes), address (dirección del cliente), dealerName (nombre del repartidor)
// Descripción: Esta función carga las órdenes del cliente autenticado, obtiene la dirección del cliente y el nombre del repartidor para cada orden.
const loadOrders = async () => {
  try {
    const address = await getClientAddress(); // Obtén la dirección del cliente
    const ordersData: Order[] = await getOrdersByClient(); // Tipifica explícitamente

    // Agrega la dirección y el nombre del repartidor a cada orden
    for (const order of ordersData) {
      order.address = address; // Agrega la dirección a cada orden

      // Verifica si dealerId es válido antes de llamar al servicio
      if (order.dealerId) {
        order.dealerName = await getDealerNameById(order.dealerId); // Obtén el nombre del repartidor
      } else {
        order.dealerName = "Sin asignar"; // Si no hay dealerId, asigna "Sin asignar"
      }
    }

    orders.value = ordersData;
  } catch (err) {
    console.error("Error al cargar órdenes o dirección:", err);
  }
};

// Formatea la fecha para mostrarla en un formato legible
// Entrada: dateStr (cadena de fecha)
// Salida: fecha formateada
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) {
    return 'Fecha no disponible'; // Valor predeterminado para fechas no válidas
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return 'Fecha no disponible'; // Valor predeterminado si la fecha no es válida
  }

  return date.toLocaleDateString(); // Formatea la fecha si es válida
};

// Muestra los productos de una orden
// Método: getProductsByOrderId
// Entrada: orderId (ID de la orden)
// Salida: products (lista de productos)
const viewProducts = async (orderId: number) => {
  try {
    selectedOrderId.value = orderId; // Guarda el ID del pedido seleccionado
    products.value = await getProductsByOrderId(orderId); // Carga los productos
    showModal.value = true; // Muestra el modal de productos
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
};

// Muestra los detalles de una orden
// Método: getOrderDetailsByOrderId
// Entrada: orderId (ID de la orden)
// Salida: orderDetails (detalles de la orden)
const viewOrderDetails = async (orderId: number) => {
  try {
    selectedOrderId.value = orderId; // Guarda el ID del pedido seleccionado
    const details = await getOrderDetailsByOrderId(orderId); // Carga los detalles de la orden

    // Asegúrate de que los datos sean válidos y sigan la interfaz OrderDetails
    if (details.length > 0) {
      const detail = details[0]; // Toma el primer detalle si hay múltiples
      orderDetails.value = {
        id: detail.id,
        orderId: detail.orderId,
        totalProducts: detail.totalProducts,
        price: detail.price, // Convierte a número si es necesario
        paymentMethod: detail.paymentMethod,
      };
    } else {
      orderDetails.value = null; // Si no hay detalles, asigna null
    }

    showDetailsModal.value = true; // Muestra el modal de detalles
  } catch (err) {
    console.error('Error al cargar detalles de la orden:', err);
  }
};

// Carga las órdenes al montar el componente
onMounted(() => {
  loadOrders();
});

definePageMeta({
  layout: 'client', // Usa el layout de cliente
});
</script>

<!-- este template muestra una tabla con las órdenes del cliente, permite ver los detalles y calificar el repartidor -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mis Órdenes</h1>

    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Fecha de Orden</th>
          <th class="px-4 py-2 text-left">Fecha de Entrega</th>
          <th class="px-4 py-2 text-left">Estado</th>
          <th class="px-4 py-2 text-left">Dirección</th>
          <th class="px-4 py-2 text-left">Repartidor</th> <!-- Nueva columna -->
          <th class="px-4 py-2 text-left">Productos</th>
          <th class="px-4 py-2 text-left">Precio Total</th>
          <th class="px-4 py-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="border-t">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ formatDate(order.orderDate) }}</td>
          <td class="px-4 py-2">{{ formatDate(order.deliveryDate) }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">{{ order.address }}</td>
          <td class="px-4 py-2">{{ order.dealerName }}</td> <!-- Nueva celda -->
          <td class="px-4 py-2">
            <button
              @click="viewProducts(order.id)"
              class="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Ver Productos
            </button>
          </td>
          <td class="px-4 py-2">
            ${{ order.totalPrice !== undefined && order.totalPrice !== null ? order.totalPrice.toFixed(2) : '0.00' }}
          </td>
          <td class="px-4 py-2">
            <button
              @click="viewOrderDetails(order.id)"
              class="bg-green-500 text-white px-3 py-1 rounded mb-2"
            >
              Ver Detalles
            </button>
            <button
              @click="$router.push({ path: '/rate-dealer', query: { dealerId: order.dealerId, orderId: order.id, clientId: order.clientId } })"
              class="bg-yellow-500 text-white px-3 py-1 rounded mt-2 hover:bg-yellow-600"
            >
              Calificar Repartidor
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="orders.length === 0" class="mt-4 text-gray-500">
      No tienes órdenes registradas.
    </div>

    <!-- Modal para mostrar los productos -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-md w-1/2">
        <h2 class="text-xl font-bold mb-4">
          Productos del Pedido #{{ selectedOrderId }}
        </h2>
        <ul>
          <li v-for="product in products" :key="product.id" class="mb-2">
            {{ product.name }} - ${{ product.price.toFixed(2) }}
          </li>
        </ul>
        <button
          @click="showModal = false"
          class="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- Modal para mostrar los detalles de la orden -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md w-1/2">
        <h2 class="text-xl font-bold mb-4">
          Detalles del Pedido #{{ selectedOrderId }}
        </h2>
        <div v-if="orderDetails">
          <p><strong>ID de la Orden:</strong> {{ orderDetails.orderId }}</p>
          <p><strong>Método de Pago:</strong> {{ orderDetails.paymentMethod }}</p>
          <p><strong>Total de Productos:</strong> {{ orderDetails.totalProducts }}</p>
          <p><strong>Precio Total:</strong> ${{ orderDetails.price !== undefined && orderDetails.price !== null ? orderDetails.price.toFixed(2) : '0.00' }}</p>
        </div>
        <div v-else>
          <p>No se encontraron detalles para este pedido.</p>
        </div>
        <button
          @click="showDetailsModal = false"
          class="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>