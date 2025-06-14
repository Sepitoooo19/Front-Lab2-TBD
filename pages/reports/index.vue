<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Reportes</h1>
    <p class="mb-6 text-gray-600">
      Visualización de datos agregados y métricas clave del sistema.
    </p>
    <ReportsUser />
  </div>
</template>

<script setup lang="ts">
import ReportsUser from '~/components/ReportsUser.vue'; // Importar el componente de reportes para usuarios

definePageMeta({
  layout: 'user',
  middleware: 'auth-role' // Asegura que solo usuarios autenticados accedan
})

useHead({
  title: 'Mis Reportes - Gestor de Tareas'
})
</script>

<style scoped>
</style>