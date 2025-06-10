<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { Order } from '~/types/types'
// import { getOrdersByClientId } from '~/services/ordersService'

const route = useRoute()
const clientId = Number(route.params.clientId)
const orders = ref<Order[]>([])

const loadOrders = async () => {
  try {
    // orders.value = await getOrdersByClientId(clientId)
  } catch (err) {
    console.error("Error al cargar órdenes:", err)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Órdenes del Cliente #{{ clientId }}</h1>

    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
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
        <tr v-for="order in orders" :key="order.id" class="border-t">
          <td class="px-4 py-2">{{ order.id }}</td>
          <td class="px-4 py-2">{{ formatDate(order.orderDate) }}</td>
          <td class="px-4 py-2">{{ formatDate(order.deliveryDate) }}</td>
          <td class="px-4 py-2">{{ order.status }}</td>
          <td class="px-4 py-2">{{ order.products }}</td>
          <td class="px-4 py-2">${{ order.totalPrice.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="orders.length === 0" class="mt-4 text-gray-500">
      Este cliente no tiene órdenes registradas.
    </div>
  </div>
</template>
