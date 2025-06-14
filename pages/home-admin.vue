<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth-role' });
</script>
<template>
  <main class="p-6">
    <h2 class="text-2xl font-bold mb-4">Panel de Administración</h2>
    <ul class="list-disc ml-8">
      <li><router-link to="/tasks">Gestión de Tareas</router-link></li>
      <li><router-link to="/sectors">Gestión de Sectores</router-link></li>
      <li><router-link to="/statistics">Estadísticas y Consultas Espaciales</router-link></li>
      <li><router-link to="/profile">Mi Perfil</router-link></li>
    </ul>
  </main>
</template>