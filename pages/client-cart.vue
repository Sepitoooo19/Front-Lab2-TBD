<!-- Page para el carrito del cliente -->

<script setup lang="ts">
// Importaciones necesarias
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { createOrder as createOrderService } from '~/services/ordersService';
import { createOrderDetailsForLastOrder } from '~/services/orderDetailsService';
import { getCompanyIdByProductId } from '~/services/productService';
import { getPaymentMethodByCompanyId } from '~/services/paymentMethodService';
import type { PaymentMethod } from '~/types/types';

// Importa el store del carrito local
const cartStore = useCartStore();
cartStore.loadFromLocalStorage();

// Const reactivos
const cartProducts = computed(() => cartStore.products);
const paymentMethods = ref<PaymentMethod[]>([]); // Lista de métodos de pago
const selectedPaymentMethod = ref<string | null>(null); // Método de pago seleccionado
const isUrgent = ref<boolean>(false); // Estado para marcar como URGENTE
const errorMessage = ref<string | null>(null);

// Función para eliminar un producto del carrito
// Metodo: removeFromCart
// Entrada: productId
// Salida: void
const removeFromCart = (productId: number) => {
  cartStore.removeProduct(productId);
};

// Función para obtener el ID de la empresa por el ID del producto
// Metodo: getCompanyIdByProductId y getPaymentMethodByCompanyId
// Entrada: productId y companyId
// Salida: companyId y paymentMethods
// Descripción: Esta función obtiene el ID de la empresa asociada al primer producto del carrito y luego obtiene los métodos de pago disponibles para esa empresa.
onMounted(async () => {
  try {
    if (cartProducts.value.length === 0) {
      errorMessage.value = 'El carrito está vacío.';
      return;
    }

    const firstProductId = cartProducts.value[0]?.id;
    const companyId = await getCompanyIdByProductId(firstProductId);
    paymentMethods.value = await getPaymentMethodByCompanyId(companyId);

    console.log('Métodos de pago obtenidos:', paymentMethods.value);
  } catch (error) {
    console.error('Error al cargar los métodos de pago:', error);
    errorMessage.value = 'Hubo un error al cargar los métodos de pago.';
  }
});

// Función para crear la orden y los detalles
// Metodo: createOrderService y createOrderDetailsForLastOrder
// Entrada: order y productIds
// Salida: successMessage
// Descripción: Esta función crea una orden y sus detalles. Muestra errores si no se selecciona un método de pago o si ocurre un error al crear la orden.
const createOrder = async () => {
  try {
    if (!selectedPaymentMethod.value) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    // Crear la orden
    const productIds = cartStore.products.map((product) => product.id).join(',');
    const order = {
      orderDate: new Date().toISOString(),
      status: isUrgent.value ? "URGENTE" : "PENDIENTE", // Cambia el estado según el checkbox
    };

    await createOrderService(order, productIds);

    // Crear el detalle de la orden
    const totalProducts = cartProducts.value.length;
    const price = cartProducts.value.reduce((sum, product) => sum + product.price, 0);
    const paymentMethod = selectedPaymentMethod.value; // Asigna el método de pago seleccionado

    await createOrderDetailsForLastOrder(paymentMethod, totalProducts, price);

    alert('Pedido y detalles creados exitosamente.');
    cartStore.clearCart();
  } catch (error) {
    console.error('Error al crear la orden o los detalles:', error);
    alert('Hubo un error al confirmar el pedido.');
  }
};

definePageMeta({
  layout: 'client', // Usa el layout de cliente
});
</script>

<!-- Template para el carrito del cliente, la tabla de productos y el formulario de pago -->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Carrito de Compras</h1>

    <table v-if="cartProducts.length > 0" class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Precio</th>
          <th class="px-4 py-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in cartProducts" :key="product.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ product.id }}</td>
          <td class="px-4 py-2">{{ product.name }}</td>
          <td class="px-4 py-2">${{ product.price }}</td>
          <td class="px-4 py-2">
            <button
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              @click="removeFromCart(product.id)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="mt-4 text-gray-500">
      No hay productos en el carrito.
    </div>

    <div v-if="cartProducts.length > 0" class="mt-4">
      <label for="payment-method" class="block text-sm font-medium mb-2">Método de Pago</label>
      <select
        id="payment-method"
        v-model="selectedPaymentMethod"
        class="w-full border px-3 py-2 rounded mb-4 text-black bg-white"
      >
        <option value="" disabled class="text-gray-500">Selecciona un método de pago</option>
        <option
          v-for="method in paymentMethods"
          :key="method.id"
          :value="method.type"
          class="text-black"
        >
          {{ method.type }}
        </option>
      </select>

      <!-- Botón para marcar como URGENTE -->
      <div class="flex items-center mb-4">
        <input
          type="checkbox"
          id="urgent"
          v-model="isUrgent"
          class="mr-2"
        />
        <label for="urgent" class="text-sm font-medium">Marcar como URGENTE</label>
      </div>

      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        @click="createOrder"
      >
        Confirmar Pedido
      </button>
    </div>
  </div>
</template>