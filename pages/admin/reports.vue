<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Reportes y Estadísticas (Admin)</h1>
    <p class="mb-6 text-gray-600">
      Visualización de datos agregados y métricas clave del sistema.
    </p>
    <ReportsAdmin /> 
  </div>
</template>

<script setup lang="ts">
import ReportsAdmin from '~/components/ReportsAdmin.vue'; // Importar el panel correcto

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
});

useHead({
  title: 'Reportes Admin - Gestor de Tareas'
});
</script>

<style scoped>
</style>