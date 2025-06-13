<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow container mx-auto py-8">
      <NuxtPage />
    </main>
    <footer class="bg-gray-800 text-white py-4 mt-8">
      <div class="container mx-auto text-center">
        <p>&copy; {{ new Date().getFullYear() }} Sistema de Tareas</p>
      </div>
    </footer>
  </div>
</template>