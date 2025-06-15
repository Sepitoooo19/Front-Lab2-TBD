<!-- page para mostrar los dealers en vista de admin-->

<script setup lang="ts">
// Importaciones necesarias
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllDealers, deleteDealerById, getAllDealersWithDistance } from '~/services/dealerService';
import type { Dealer, DealerWithDistance, DealerWithDistanceDTO } from '~/types/types';
// Importa el servicio y el tipo Dealer
const router = useRouter();
const dealers = ref<Dealer[]>([]);
const dealersWithDistance = ref<DealerWithDistance[]>([]);

// Carga todos los dealers al montar el componente
// Metodo: getAllDealers
// Entrada: token (localStorage)
// Salida: dealers

onMounted(async () => {
  try {
    const [dealersData, distanceData] = await Promise.all([
      getAllDealers(),
      getAllDealersWithDistance()
    ]);
    
    dealersWithDistance.value = dealersData.map((dealer: Dealer) => {
      // Aseguramos que el id no sea null para la comparación
      const dealerId = dealer.id;
      const distanceInfo = dealerId ? 
        distanceData.find((d: DealerWithDistanceDTO) => d.id === dealerId) : 
        null;
      
      return {
        ...dealer,
        distanceMeters: distanceInfo?.distanceMeters || 0,
        distanceFormatted: formatDistance(distanceInfo?.distanceMeters || 0)
      } as DealerWithDistance;
    });
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar los dealers');
  }
});

const formatDistance = (meters: number): string => {
  return meters ? `${(meters / 1000).toFixed(2)} km` : '0 km';
};

// Funcion de redirección a la página de creación de dealer
const createDealer = () => {
  router.push('/dealers/create'); // Ruta para crear un dealer
};

// Funcion de redirección a la página de edición de dealer
const editDealer = (dealer: Dealer) => {
  router.push(`/dealers/${dealer.id}/edit`); // Ruta para editar dealer
};

// Función para eliminar un dealer y refrescar la lista
// Metodo: deleteDealerById y getAllDealers
// Entrada: dealerId
// Salida: dealers (lista actualizada)
const deleteDealer = async (dealerId: number) => {
  const confirmDelete = confirm('¿Estás seguro que deseas eliminar este dealer?');
  if (confirmDelete) {
    try {
      await deleteDealerById(dealerId);
      dealers.value = await getAllDealers(); // Refrescar lista
    } catch (error) {
      alert('Error al eliminar el dealer');
    }
  }
};

// Función de redirección a la página de órdenes de un dealer
const viewOrders = (dealerId: number) => {
  router.push(`/dealer-orders-admin/${dealerId}`); // Nueva ruta
};

definePageMeta({
  layout: 'admin', // Usa el layout de repartidor
});
</script>

<!-- Template para mostrar los dealers en vista de admin -->

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Lista de Dealers</h1>

    <!-- Botón para crear dealer -->
    

    <!-- Tabla de dealers -->
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Nombre</th>
          <th class="px-4 py-2 text-left">RUT</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Teléfono</th>
          <th class="px-4 py-2 text-left">Vehículo</th>
          <th class="px-4 py-2 text-left">Placa</th>
          <th class="px-4 py-2 text-left">Distancia (mes)</th> <!-- Nueva columna -->
          <th class="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dealer in dealersWithDistance" :key="dealer.id ?? `dealer-${index}`">
          <td class="px-4 py-2">{{ dealer.id }}</td>
          <td class="px-4 py-2">{{ dealer.name }}</td>
          <td class="px-4 py-2">{{ dealer.rut }}</td>
          <td class="px-4 py-2">{{ dealer.email }}</td>
          <td class="px-4 py-2">{{ dealer.phone }}</td>
          <td class="px-4 py-2">{{ dealer.vehicle }}</td>
          <td class="px-4 py-2">{{ dealer.plate }}</td>
          <td class="px-4 py-2">{{ dealer.distanceFormatted }}</td>
          <td class="px-4 py-2 space-x-2">
            
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
              @click="deleteDealer(dealer.id)"
            >
              Eliminar
            </button>
            <button
              @click="viewOrders(dealer.id)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Ver órdenes
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
</style>