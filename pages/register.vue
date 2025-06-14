<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-bold mb-4 text-center text-gray-800">Crear una Cuenta</h1>
      <RegisterForm /> <div class="mt-6 text-center text-sm">
        <NuxtLink to="/login" class="text-blue-600 hover:underline">
          ¿Ya tienes cuenta? Inicia Sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '~/components/auth/RegisterForm.vue';

definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Registro de Usuario'
});
</script>