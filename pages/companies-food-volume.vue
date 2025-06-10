<!-- pagina que muestra las empresas con mayor volumen de comida entregada-->

<script setup lang="ts">
// Importaciones necesarias
import { ref, onMounted } from 'vue';
import { getCompaniesByDeliveredFoodVolume } from '~/services/companyService'; // Servicio para obtener las empresas por volumen de comida entregada
// Importa el servicio y tipos necesarios
const companiesByDeliveredFoodVolume = ref<any[]>([]); // Lista de empresas con mayor volumen de comida entregada
const errorMessage = ref<string | null>(null);

// Función para cargar las empresas con mayor volumen de comida entregada
// Metodo: getCompaniesByDeliveredFoodVolume
// Entrada: token (localStorage)
// Salida: companiesByDeliveredFoodVolume
const fetchCompaniesByDeliveredFoodVolume = async () => {
  try {
    errorMessage.value = null;
    companiesByDeliveredFoodVolume.value = await getCompaniesByDeliveredFoodVolume();
  } catch (error) {
    console.error('Error al cargar las empresas por volumen de comida entregada:', error);
    errorMessage.value = 'Hubo un error al cargar las empresas.';
  }
};

// Cargar los datos al montar el componente
onMounted(fetchCompaniesByDeliveredFoodVolume);

definePageMeta({
  layout: 'admin', // Usa el layout de administrador
});
</script>

<!-- Template para mostrar las empresas con mayor volumen de comida entregada -->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Empresas por Volumen de Comida Entregada</h1>
    <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow" v-if="!errorMessage">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Tipo</th>
          <th class="px-4 py-2 text-left">Volumen de Comida Entregada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in companiesByDeliveredFoodVolume" :key="company.company_id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ company.company_id }}</td>
          <td class="px-4 py-2">{{ company.company_name }}</td>
          <td class="px-4 py-2">{{ company.company_type }}</td>
          <td class="px-4 py-2">{{ company.total_food_delivered }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Estilo opcional para la tabla */
table {
  font-family: Arial, sans-serif;
}
</style>