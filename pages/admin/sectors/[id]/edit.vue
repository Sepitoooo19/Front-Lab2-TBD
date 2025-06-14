<template>
  <div class="container max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Editar Sector</h2>
    <SectorForm
      :sectorData="sectorData"
      :isEditMode="true"
      @saved="onSaved"
      @close="onClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSectorById } from '~/services/sectorService'
import SectorForm from '~/components/sectors/SectorForm.vue'
import type { Sector } from '~/types/types'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})

const route = useRoute()
const router = useRouter()
const sectorData = ref<Sector | undefined>(undefined)
onMounted(async () => {
  const result = await getSectorById(Number(route.params.id))
  sectorData.value = result ?? undefined
})
const onSaved = () => router.push('/admin/sectors')
const onClose = () => router.push('/admin/sectors')
</script>