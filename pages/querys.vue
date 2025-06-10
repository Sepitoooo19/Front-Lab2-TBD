<!-- page para mostrar las consultas complejas solicitadas-->

<script setup lang="ts">
// Importaciones necesarias
import { ref } from 'vue';
import { getTopSpender } from '~/services/ordersService';
import { getTopProductsByCategoryForLastMonth } from '~/services/productService';
import { getCompaniesWithMostFailedDeliveries } from '~/services/companyService';
import { getMostUsedPaymentMethodForUrgentOrders } from '~/services/orderDetailsService';
import { getAverageDeliveryTimeByDealer, getTopPerformingDealers } from '~/services/dealerService'; // Importa el nuevo servicio
import type { TopSpender } from '~/types/types';

// constantes para almacenar los datos de las consultas
const topSpender = ref<TopSpender | null>(null);
const topProducts = ref<any[]>([]); // Lista de productos más pedidos
const companiesWithMostFailedDeliveries = ref<any[]>([]); // Lista de empresas con más entregas fallidas
const mostUsedPaymentMethod = ref<{ method: string; count: number } | null>(null); // Método de pago más utilizado
const averageDeliveryTimes = ref<any[]>([]); // Lista de tiempos promedio de entrega por repartidor
const topPerformingDealers = ref<any[]>([]); // Lista de los 3 mejores repartidores

const errorMessage = ref<string | null>(null);

// Función para obtener el Cliente con Mayor Gasto
// Método: getTopSpender
// Entrada: token (localStorage)
// Salida: topSpender
// Descripción: Esta función obtiene el cliente con mayor gasto y lo asigna a la variable 'topSpender'.
const fetchTopSpender = async () => {
  try {
    errorMessage.value = null;
    topSpender.value = await getTopSpender();
    console.log('Cliente con mayor gasto:', topSpender.value);
  } catch (error) {
    console.error('Error al obtener el cliente con mayor gasto:', error);
    errorMessage.value = 'Hubo un error al cargar el cliente con mayor gasto.';
  }
};

// Función para obtener los Productos Más Pedidos por Categoría
// Metodo: getTopProductsByCategoryForLastMonth
// Entrada: token (localStorage)
// Salida: topProducts
// Descripción: Esta función obtiene los productos más pedidos por categoría en el último mes y los asigna a la variable 'topProducts'.
const fetchTopProducts = async () => {
  try {
    errorMessage.value = null;
    topProducts.value = await getTopProductsByCategoryForLastMonth();
    console.log('Productos más pedidos por categoría:', topProducts.value);
  } catch (error) {
    console.error('Error al obtener los productos más pedidos:', error);
    errorMessage.value = 'Hubo un error al cargar los productos más pedidos.';
  }
};

// Función para obtener las Empresas con Más Entregas Fallidas
// Metodo: getCompaniesWithMostFailedDeliveries
// Entrada: token (localStorage)
// Salida: companiesWithMostFailedDeliveries
// Descripción: Esta función obtiene las empresas con más entregas fallidas y las asigna a la variable 'companiesWithMostFailedDeliveries'.
const fetchCompaniesWithMostFailedDeliveries = async () => {
  try {
    errorMessage.value = null;
    companiesWithMostFailedDeliveries.value = await getCompaniesWithMostFailedDeliveries();
    console.log('Empresas con más entregas fallidas:', companiesWithMostFailedDeliveries.value);
  } catch (error) {
    console.error('Error al obtener las empresas con más entregas fallidas:', error);
    errorMessage.value = 'Hubo un error al cargar las empresas con más entregas fallidas.';
  }
};

// Función para obtener el Método de Pago Más Utilizado en Pedidos Urgentes
// Metodo: getMostUsedPaymentMethodForUrgentOrders
// Entrada: token (localStorage)
// Salida: mostUsedPaymentMethod
// Descripción: Esta función obtiene el método de pago más utilizado en pedidos urgentes y lo asigna a la variable 'mostUsedPaymentMethod'.
const fetchMostUsedPaymentMethod = async () => {
  try {
    errorMessage.value = null;
    mostUsedPaymentMethod.value = await getMostUsedPaymentMethodForUrgentOrders();
    console.log('Método de pago más utilizado en pedidos urgentes:', mostUsedPaymentMethod.value);
  } catch (error) {
    console.error('Error al obtener el método de pago más utilizado:', error);
    errorMessage.value = 'Hubo un error al cargar el método de pago más utilizado en pedidos urgentes.';
  }
};

// Función para obtener el Tiempo Promedio de Entrega por Repartidor
// Metodo: getAverageDeliveryTimeByDealer
// Entrada: token (localStorage)
// Salida: averageDeliveryTimes
// Descripción: Esta función obtiene el tiempo promedio de entrega por repartidor y lo asigna a la variable 'averageDeliveryTimes'.
const fetchAverageDeliveryTimeByDealer = async () => {
  try {
    errorMessage.value = null;
    averageDeliveryTimes.value = await getAverageDeliveryTimeByDealer();
    console.log('Tiempo promedio de entrega por repartidor:', averageDeliveryTimes.value);
  } catch (error) {
    console.error('Error al obtener el tiempo promedio de entrega por repartidor:', error);
    errorMessage.value = 'Hubo un error al cargar el tiempo promedio de entrega por repartidor.';
  }
};

// Función para obtener los 3 Repartidores con Mejor Rendimiento
// Metodo: getTopPerformingDealers
// Entrada: token (localStorage)
// Salida: topPerformingDealers
// Descripción: Esta función obtiene los 3 repartidores con mejor rendimiento y los asigna a la variable 'topPerformingDealers'.
const fetchTopPerformingDealers = async () => {
  try {
    errorMessage.value = null;
    topPerformingDealers.value = await getTopPerformingDealers();
    console.log('Repartidores con mejor rendimiento:', topPerformingDealers.value);
  } catch (error) {
    console.error('Error al obtener los repartidores con mejor rendimiento:', error);
    errorMessage.value = 'Hubo un error al cargar los repartidores con mejor rendimiento.';
  }
};

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});
</script>

<!-- Template que contiene los cuadros de las consultas y botones para ejecutarlas-->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Consultas</h1>

    <!-- Cuadro para el Cliente con Mayor Gasto -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Cliente con Mayor Gasto</h2>
      <div v-if="topSpender">
        <p><strong>Nombre:</strong> {{ topSpender.name }}</p>
        <p><strong>RUT:</strong> {{ topSpender.rut }}</p>
        <p><strong>Email:</strong> {{ topSpender.email }}</p>
        <p><strong>Teléfono:</strong> {{ topSpender.phone }}</p>
        <p><strong>Dirección:</strong> {{ topSpender.address }}</p>
        <p><strong>Total Gastado:</strong> ${{ topSpender.totalSpent }}</p>
      </div>
      <div v-else class="text-gray-500">
        Presiona el botón para obtener el cliente con mayor gasto.
      </div>
    </div>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6" @click="fetchTopSpender">
      Obtener Cliente con Mayor Gasto
    </button>

    <!-- Cuadro para los Productos Más Pedidos por Categoría -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Productos Más Pedidos por Categoría</h2>
      <div v-if="topProducts.length > 0">
        <ul>
          <li v-for="product in topProducts" :key="product.product_name">
            <strong>Categoría:</strong> {{ product.category }} - 
            <strong>Producto:</strong> {{ product.product_name }} - 
            <strong>Cantidad:</strong> {{ product.product_count }}
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-500">
        Presiona el botón para obtener los productos más pedidos por categoría.
      </div>
    </div>
    <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-6" @click="fetchTopProducts">
      Obtener Productos Más Pedidos
    </button>

    <!-- Cuadro para las Empresas con Más Entregas Fallidas -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Empresas con Más Entregas Fallidas</h2>
      <div v-if="companiesWithMostFailedDeliveries.length > 0">
        <ul>
          <li v-for="company in companiesWithMostFailedDeliveries" :key="company.id">
            <strong>Nombre:</strong> {{ company.name }} - 
            <strong>Entregas Fallidas:</strong> {{ company.failedDeliveries }}
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-500">
        Presiona el botón para obtener las empresas con más entregas fallidas.
      </div>
    </div>
    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" @click="fetchCompaniesWithMostFailedDeliveries">
      Obtener Empresas con Más Entregas Fallidas
    </button>

    <!-- Cuadro para el Método de Pago Más Utilizado en Pedidos Urgentes -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Método de Pago Más Utilizado en Pedidos Urgentes</h2>
      <div v-if="mostUsedPaymentMethod">
        <p><strong>Método:</strong> {{ mostUsedPaymentMethod.method }}</p>
        <p><strong>Veces Usado:</strong> {{ mostUsedPaymentMethod.count }}</p>
      </div>
      <div v-else class="text-gray-500">
        Presiona el botón para obtener el método de pago más utilizado en pedidos urgentes.
      </div>
    </div>
    <button class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" @click="fetchMostUsedPaymentMethod">
      Obtener Método de Pago Más Utilizado
    </button>

    <!-- Cuadro para el Tiempo Promedio de Entrega por Repartidor -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Tiempo Promedio de Entrega por Repartidor</h2>
      <div v-if="averageDeliveryTimes.length > 0">
        <ul>
          <li v-for="dealer in averageDeliveryTimes" :key="dealer.dealer_id">
            <strong>Repartidor:</strong> {{ dealer.dealer_name }} - 
            <strong>Tiempo Promedio:</strong> {{ dealer.avg_delivery_time_hours.toFixed(2) }} horas
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-500">
        Presiona el botón para obtener el tiempo promedio de entrega por repartidor.
      </div>
    </div>
    <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-6" @click="fetchAverageDeliveryTimeByDealer">
      Obtener Tiempo Promedio de Entrega
    </button>

    <!-- Cuadro para los Repartidores con Mejor Rendimiento -->
    <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4" style="min-height: 150px;">
      <h2 class="text-xl font-bold mb-2">Repartidores con Mejor Rendimiento</h2>
      <div v-if="topPerformingDealers.length > 0">
        <ul>
          <li v-for="dealer in topPerformingDealers" :key="dealer.dealer_id">
            <strong>Repartidor:</strong> {{ dealer.dealer_name }} - 
            <strong>Entregas:</strong> {{ dealer.total_deliveries }} - 
            <strong>Puntuación Promedio:</strong> {{ dealer.avg_rating.toFixed(2) }} - 
            <strong>Puntaje de Rendimiento:</strong> {{ dealer.performance_score.toFixed(2) }}
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-500">
        Presiona el botón para obtener los repartidores con mejor rendimiento.
      </div>
    </div>
    <button class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mb-6" @click="fetchTopPerformingDealers">
      Obtener Repartidores con Mejor Rendimiento
    </button>

    <!-- Mensaje de error -->
    <div v-if="errorMessage" class="text-red-500 mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
/* Estilo opcional para los cuadros */
div {
  font-family: Arial, sans-serif;
}
</style>