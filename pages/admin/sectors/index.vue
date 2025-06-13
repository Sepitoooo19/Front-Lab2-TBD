<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Sectores</h1>
      <router-link 
        to="/admin/sectors/create" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Crear Nuevo Sector
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Mapa -->
      <div class="h-[500px] rounded-lg border border-gray-200 shadow-md">
        <SectorMap :sectors="sectors" />
      </div>

      <!-- Lista -->
      <div>
        <SectorList 
          :sectors="sectors"
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SectorList from '~/components/sectors/SectorList.vue'
import SectorMap from '~/components/sectors/SectorMap.vue'
import { getSectors, deleteSector } from '~/services/sectorService'
import type { Sector } from '~/types/types'

const sectors = ref<Sector[]>([])
const router = useRouter()

const fetchSectors = async () => {
  try {
    sectors.value = await getSectors()
  } catch (error) {
    console.error('Error loading sectors:', error)
  }
}

const onEdit = (sector: Sector) => {
  router.push(`/admin/sectors/${sector.id}/edit`)
}

const onDelete = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar este sector?')) {
    await deleteSector(id)
    await fetchSectors()
  }
}

onMounted(fetchSectors)

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})
</script>