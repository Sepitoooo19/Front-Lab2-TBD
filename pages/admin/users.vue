<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Gestión de Clientes</h1>
    <UserList :users="clients" @refresh="loadClients" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from '~/components/users/UserList.vue'
import type { Client } from '~/types/types.ts'
import { getAllClients } from '~/services/clientService'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})

const clients = ref<Client[]>([])

const loadClients = async () => {
  clients.value = await getAllClients()
}

onMounted(loadClients)
</script>