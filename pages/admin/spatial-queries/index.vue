<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Consultas Geoespaciales</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. Puntos de entrega más cercanos a una empresa -->
      <NuxtLink 
        to="/admin/spatial-queries/nearest-farthest-delivery-points"
        class="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
      >
        <h2 class="text-xl font-bold mb-2">📍 Puntos de entrega más cercanos y lejanos a una empresa</h2>
        <p class="text-gray-600">Encontrar los 5 puntos de entrega más cercanos a una empresa e 
            identificar el punto de entrega más lejano desde cada empresa asociada</p>
      </NuxtLink>

      <!-- 2. Pedidos cuya ruta cruce más de 2 zonas -->
      <NuxtLink 
        to="/admin/spatial-queries/orders-2zones"
        class="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
      >
        <h2 class="text-xl font-bold mb-2">🛣️ Pedidos que cruzan más de 2 zonas</h2>
        <p class="text-gray-600">Filtra pedidos cuya ruta de entrega atraviesa múltiples zonas geográficas</p>
      </NuxtLink>

      <!-- 3. Clientes lejanos a empresas -->
      <NuxtLink 
        to="/admin/spatial-queries/clients-5km"
        class="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
      >
        <h2 class="text-xl font-bold mb-2">⛰️ Clientes a más de 5km de cualquier empresa</h2>
        <p class="text-gray-600">Detecta clientes que están fuera del radio de cobertura estándar</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});

</script>

<style scoped>
.nuxt-link-exact-active {
  border-color: rgb(59 130 246); /* blue-500 */
  box-shadow: 0 0 0 2px rgb(191 219 254); /* ring-2 ring-blue-200 */
}
</style>