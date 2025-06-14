<template>
  <div class="container mx-auto py-8 px-4">
    <div class="bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl p-8 mb-10 shadow-lg text-center">
      <h1 class="text-3xl font-extrabold mb-2 text-blue-800">👋 ¡Bienvenido, {{ userName }}!</h1>
      <p class="text-gray-700 max-w-2xl mx-auto">
        Aquí puedes ver tus pedidos recientes y estadísticas. ¡Explora los productos y haz tu próximo pedido!
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-3">
      <div class="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Mis Pedidos Recientes</h3>
        <div v-if="recentOrders.length > 0" class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="bg-gray-50 p-3 rounded-lg">
            <p class="font-medium">Pedido #{{ order.id }} - Estado: <span class="font-bold">{{ order.status }}</span></p>
            <p class="text-sm text-gray-600">Fecha: {{ new Date(order.orderDate).toLocaleDateString() }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">No tienes pedidos recientes.</p>
        <div class="mt-4 text-right">
          <NuxtLink to="/orders/my-orders" class="text-blue-600 hover:underline font-semibold">Ver todos mis pedidos</NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-green-500">
        <h4 class="text-xl font-bold mb-4 text-gray-800">Estadísticas</h4>
        <p class="text-gray-500">(Componente de estadísticas del cliente aquí)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/auth'; // Asumiendo que usas Pinia
import { getOrdersByClient } from '~/services/ordersService'; // Servicio de Lab 2
import type { Order } from '~/types/types'; // Tipo de Lab 2

const userStore = useUserStore();
const userName = userStore.userName || 'Cliente';
const recentOrders = ref<Order[]>([]);

definePageMeta({ layout: 'client', middleware: 'auth-role' }); // O 'user' si renombras el layout

useHead({ title: 'Mi Dashboard' });

onMounted(async () => {
  try {
    // Obtenemos los pedidos del cliente logueado y mostramos los 5 más recientes
    const allOrders = await getOrdersByClient();
    recentOrders.value = allOrders.slice(0, 5);
  } catch (error) {
    console.error("Error al cargar los pedidos del cliente:", error);
  }
});
</script>