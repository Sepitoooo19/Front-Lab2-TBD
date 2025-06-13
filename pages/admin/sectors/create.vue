<template>
  <div class="container max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Crear Nuevo Sector</h2>
    <SectorForm @saved="onSaved" @close="onClose" />
  </div>
</template>
<script setup lang="ts">
import SectorForm from '~/components/sectors/SectorForm.vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})

const router = useRouter()
const onSaved = () => router.push('/admin/sectors')
const onClose = () => router.push('/admin/sectors')
</script>