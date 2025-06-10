

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductsByCompanyId } from '~/services/companyService';

const route = useRoute();
const companyId = route.params.id;
const products = ref([]);

onMounted(async () => {
  products.value = await getProductsByCompanyId(companyId);
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Productos - Empresa {{ company.name }}</h1>
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