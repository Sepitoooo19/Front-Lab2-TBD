<template>
  <div class="container mx-auto py-8 px-4">
    <div class="bg-gradient-to-r from-red-100 to-red-300 rounded-xl p-8 mb-10 shadow-lg flex flex-col items-center">
      <h1 class="text-3xl font-extrabold mb-2 text-red-800 flex items-center gap-2">
        <span>🛡️</span> Panel de Administración
      </h1>
      <p class="text-gray-700 text-center max-w-2xl">
        Gestiona clientes, repartidores, pedidos y compañías desde este panel centralizado.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-blue-500">
        <div class="bg-blue-100 rounded-full p-3 mb-4"><span class="text-3xl">👤</span></div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Gestionar Clientes</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Administra los usuarios de tipo cliente.</p>
        <NuxtLink to="/clients" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg text-sm shadow">Ir a Clientes</NuxtLink>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-green-500">
        <div class="bg-green-100 rounded-full p-3 mb-4"><span class="text-3xl">🛵</span></div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Gestionar Repartidores</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Administra los usuarios de tipo repartidor.</p>
        <NuxtLink to="/dealers" class="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg text-sm shadow">Ir a Repartidores</NuxtLink>
      </div>
      
      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-yellow-500">
        <div class="bg-yellow-100 rounded-full p-3 mb-4"><span class="text-3xl">📦</span></div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Gestionar Pedidos</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Visualiza y gestiona todos los pedidos del sistema.</p>
        <NuxtLink to="/admin/orders" class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg text-sm shadow">Ir a Pedidos</NuxtLink>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow border-t-4 border-purple-500">
        <div class="bg-purple-100 rounded-full p-3 mb-4"><span class="text-3xl">📊</span></div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Reportes Globales</h3>
        <p class="text-gray-600 text-sm mb-4 text-center">Ver estadísticas y reportes del sistema.</p>
        <NuxtLink to="/admin/reports" class="inline-block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg text-sm shadow">Ir a Reportes</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth-role'],
});
useHead({
  title: 'Admin Dashboard',
});
</script>