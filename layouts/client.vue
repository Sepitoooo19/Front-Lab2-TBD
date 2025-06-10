<template>
  <!-- Estructura principal del layout -->
  <div class="flex flex-col min-h-screen">
    <!-- Header con navegación para clientes -->
    <header class="bg-blue-600 text-white py-4 w-full">
      <div class="flex justify-between items-center px-4">
        <!-- Título de la aplicación -->
        <h1 class="text-2xl font-bold">Cliente - Sistema de Delivery</h1>
        <!-- Menú de navegación -->
        <ul class="flex space-x-4">
          <li><a href="/home-client" class="hover:underline">Inicio</a></li>
          <li><a href="/notifications" class="hover:underline">Notificaciones</a></li>
          <li><a href="/client-order" class="hover:underline">Realizar pedido</a></li>
          <li><a href="/client-orders" class="hover:underline">Mis Pedidos</a></li>
          <li><a href="/client-cart" class="hover:underline">Carrito</a></li>
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

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Maneja el cierre de sesión del cliente
 * - Elimina el token de autenticación del localStorage
 * - Redirige al usuario a la página de login
 */
const handleLogout = () => {
  localStorage.removeItem('authToken'); // Elimina el token
  router.push('/login'); // Redirige al login
};
</script>

<style scoped>
/* Estilos para el menú de navegación */
header ul {
  display: flex;
  gap: 1rem; /* Espaciado entre elementos del menú */
}
</style>