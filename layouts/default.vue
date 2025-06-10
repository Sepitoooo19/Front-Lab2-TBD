<template>
    <div class="flex flex-col min-h-screen">
      <!-- Contenido principal -->
      <main class="flex-grow container mx-auto py-8">
        <NuxtPage />
      </main>
      <!-- Footer siempre al fondo -->
      <footer class="bg-gray-800 text-white py-4">
        <div class="container mx-auto text-center">
          <p>© 2025 Sistema de Delivery</p>
        </div>
      </footer>
    </div>
  </template>
  
  <style scoped>
  /* Estructura para sticky footer */
  .flex {
    display: flex;
    flex-direction: column;
  }
  
  .flex-grow {
    flex-grow: 1;
  }
  </style>