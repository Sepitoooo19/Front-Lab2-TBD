<!-- Pagina que muestra los productos de una empresa en vista de admin -->

<script setup>
// Importa las dependencias necesarias
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductsByCompanyId } from '~/services/productService'; // Servicio para obtener productos
import { getCompanyById } from '~/services/companyService'; // Servicio para obtener la empresa

// Define las variables reactivas
const route = useRoute();
const companyId = route.params.id; // Obtén el ID de la empresa desde la URL
const products = ref([]); // Lista de productos
const company = ref({}); // Datos de la empresa

// Obtiene los productos y los datos de la empresa al montar el componente
// Metodo: getProductsByCompanyId y getCompanyById
// Entrada: companyId (ID de la empresa)
// Salida: products (Lista de productos) y company (Datos de la empresa)
onMounted(async () => {
  try {
    // Carga los productos de la empresa
    products.value = await getProductsByCompanyId(companyId);

    // Carga los datos de la empresa
    company.value = await getCompanyById(companyId);
    console.log('Datos de la empresa cargados:', company.value); // Verifica los datos en la consola
  } catch (err) {
    console.error('Error al cargar los datos:', err);
  }
});

definePageMeta({
  layout: 'admin', // Usa el layout de administrador
});
</script>

<!-- Este template muestra una tabla con los productos de la empresa -->

<template>
  <div>
    <!-- Título dinámico basado en el nombre de la empresa -->
    <h1 v-if="company.name" class="text-2xl font-bold mb-4">
      Productos - Empresa {{ company.name }}
    </h1>
    <h1 v-else class="text-2xl font-bold mb-4">
      Cargando datos de la empresa...
    </h1>

    <!-- Tabla de productos -->
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">Tipo</th>
          <th class="px-4 py-2 text-left">Precio</th>
          <th class="px-4 py-2 text-left">Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
          <td class="px-4 py-2">{{ product.id }}</td>
          <td class="px-4 py-2">{{ product.name }}</td>
          <td class="px-4 py-2">{{ product.type }}</td>
          <td class="px-4 py-2">{{ product.price }}</td>
          <td class="px-4 py-2">{{ product.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>