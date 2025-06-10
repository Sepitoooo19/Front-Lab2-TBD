<!-- pagina principal del admin-->
  <script setup>
  definePageMeta({
    layout: 'admin',
    middleware: 'auth-role'
  });
  </script>

  <template>
    <div>
      <main class="p-6">
        <h2 class="text-2xl font-bold mb-4">Gestión del Sistema</h2>
        <p>Desde aquí puedes administrar clientes, productos, pedidos y repartidores.</p>
        <!-- Contenido adicional para administración hola-->
      </main>
    </div>
  </template>
  