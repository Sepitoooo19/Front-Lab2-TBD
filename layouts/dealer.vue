<template>
  <!-- Estructura principal del layout -->
  <div class="flex flex-col min-h-screen">
    <!-- Header con navegación para repartidores -->
    <header class="bg-green-600 text-white py-4 w-full">
      <div class="flex justify-between items-center px-4">
        <!-- Título de la aplicación -->
        <h1 class="text-2xl font-bold">Repartidor - Sistema de Delivery</h1>
        <!-- Menú de navegación específico -->
        <ul class="flex space-x-4">
          <li><a href="/dealer/dashboard" class="hover:underline">Inicio</a></li>
          <li><a href="/profile-dealer" class="hover:underline">Perfil</a></li>
          <li><a href="/actual-order" class="hover:underline">Orden actual</a></li>
          <li><a href="/unassigned-orders-dealer" class="hover:underline">Órdenes sin asignar</a></li>
          <li><a href="/dealer-orders" class="hover:underline">Mis Órdenes</a></li>
          <li><a href="/emergencies-dealer" class="hover:underline">Emergencias</a></li>
          <li><a href="/login" class="hover:underline">Cerrar Sesión</a></li>
        </ul>
      </div>
    </header>

    <!-- Contenido principal dinámico -->
    <main class="flex-grow container mx-auto py-8">
      <NuxtPage /> <!-- Componente donde se renderizarán las páginas hijas -->
    </main>

    <!-- Footer común -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto text-center">
        <p>© 2025 Sistema de Delivery</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * Obtiene el ID del repartidor almacenado en localStorage
 * @type {string|null}
 * @description Se usa para identificar al repartidor en las páginas hijas
 */
const dealerId = localStorage.getItem('dealerId');
</script>

<style scoped>
/* Estilos para el menú de navegación */
header ul {
  display: flex;
  gap: 1rem; /* Espaciado entre elementos del menú */
}
</style>