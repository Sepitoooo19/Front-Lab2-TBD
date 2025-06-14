<template>
  <div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-blue-100 p-2 rounded-full">
          <span class="text-2xl">👤</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Mi Perfil de Cliente</h1>
      </div>

      <ClientProfile />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import ClientProfile from '~/components/clients/ClientProfile.vue';

definePageMeta({
  layout: 'client',
  middleware: 'auth-role'
});

useHead({
  title: 'Mi Perfil'
});
</script>