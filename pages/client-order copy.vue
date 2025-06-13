<!-- page que muestra las empresas disponibles para el cliente y pedir una orden -->

<script setup lang="ts">
// Importaciones necesarias
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllCompanies } from '~/services/companyService';
import type { Company } from '~/types/types';

// Const reactivos
const companies = ref<Company[]>([]); // Se especifica el tipo explícitamente
const router = useRouter();

// Función para cargar las empresas
// Metodo: getAllCompanies
// Entrada: token (localStorage)
// Salida: companies
// Descripción: Esta función obtiene todas las empresas y las asigna a la variable 'companies'.
const loadCompanies = async () => {
  try {
    companies.value = await getAllCompanies();
  } catch (err) {
    console.error("Error al cargar empresas:", err);
  }
};

// Función para redirigir a la página de productos de una empresa
// Metodo: router.push
// Entrada: companyId
// Salida: void
// Descripción: Esta función redirige al usuario a la página de productos de la empresa seleccionada.
const goToProducts = (companyId: number) => {
  router.push(`/company/${companyId}/products-client`);
};

onMounted(() => {
  loadCompanies();
});

 definePageMeta({
    layout: 'client', // Usa el layout de cliente
  });
</script>

<!-- Template para mostrar las empresas disponibles y un botón para ver sus productos -->

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Empresas Disponibles</h1>
    <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Tipo</th>
          <th class="px-4 py-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in companies" :key="company.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ company.name }}</td>
          <td class="px-4 py-2">{{ company.type }}</td>
          <td class="px-4 py-2">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              @click="goToProducts(company.id)"
            >
              Ver Productos
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
</style>