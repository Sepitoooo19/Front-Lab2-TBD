<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
    <UserList :users="users" @refresh="loadUsers" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from '~/components/users/UserList.vue'
import type { User } from '~/types/types.ts'
import { getAllUsers } from '~/services/userService'

definePageMeta({
  layout: 'admin',
  middleware: 'auth-role'
})

const users = ref<User[]>([])

const loadUsers = async () => {
  users.value = await getAllUsers()
}

onMounted(loadUsers)
</script>