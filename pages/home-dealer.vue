<!-- pagina principal del repartidor-->
  <script setup>
  definePageMeta({
    layout: 'dealer',
    middleware: 'auth-role' // Usa el layout de repartidor
  });
  </script>

  <template>
    <div>
      <main class="p-6">
        <h2 class="text-2xl font-bold mb-4">Gestión de Pedidos</h2>
        <p>Aquí puedes gestionar y actualizar el estado de tus pedidos.</p>
        <!-- Contenido adicional para gestión de pedidos -->
      </main>
    </div>
  </template>
  