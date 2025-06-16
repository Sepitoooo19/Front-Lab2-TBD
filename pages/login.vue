<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <h1 class="text-3xl font-bold text-center text-gray-800">Iniciar Sesión</h1>
      <LoginForm />
      <div class="text-center text-sm">
        <NuxtLink to="/register" class="!text-purple-600 hover:underline transition-all">
          ¿No tienes cuenta? Regístrate
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue';

definePageMeta({
  layout: 'auth', // O el layout que uses para vistas sin autenticación
});

useHead({
  title: 'Iniciar Sesión'
});
</script>