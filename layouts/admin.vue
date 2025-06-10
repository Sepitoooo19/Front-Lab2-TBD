<template>
  <!-- Estructura principal del layout -->
  <div class="flex flex-col min-h-screen">
    <!-- Header con navegación para administradores -->
    <header class="bg-red-600 text-white py-4 w-full">
      <div class="flex justify-between items-center px-4">
        <!-- Título de la aplicación -->
        <h1 class="text-2xl font-bold">Administrador - Sistema de Delivery</h1>
        <!-- Menú de navegación extendido -->
        <ul class="flex space-x-4">
          <li><a href="/home-admin" class="hover:underline">Inicio</a></li>
          <li><a href="/querys" class="hover:underline">Querys Complejas</a></li>
          <li><a href="/companies-food-volume" class="hover:underline">Vol. Comida</a></li>
          <li><a href="/clients" class="hover:underline">Clientes</a></li>
          <li><a href="/orders" class="hover:underline">Todas las órdenes</a></li>
          <li><a href="/dealers" class="hover:underline">Repartidores</a></li>
          <li><a href="/unassigned-orders" class="hover:underline">Órdenes no asignadas</a></li>
          <li><a href="/companies-admin" class="hover:underline">Empresas</a></li>
          <!-- Botón de logout con evento click -->
          <li>
            <button @click="handleLogout" class="hover:underline">Cerrar Sesión</button>
          </li>
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
import { logout } from '~/services/authService'; // Importa servicio de autenticación
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Maneja el cierre de sesión del administrador
 * - Llama al servicio de logout para invalidar la sesión en el backend
 * - Redirige al usuario a la página de login
 */
const handleLogout = async () => {
  await logout(); // Llama al servicio de logout
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