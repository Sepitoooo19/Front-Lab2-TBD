<template>
  <form @submit.prevent="handleLogin" class="space-y-5">
    <AppInput label="Usuario o Email" v-model="credentials.username" required />
    <AppInput label="Contraseña" type="password" v-model="credentials.password" required />
    
    <AppButton type="submit" class="w-full" :loading="loading" variant="primary">
      Ingresar
    </AppButton>

    <transition name="fade">
      <p v-if="loginError" class="text-red-500 text-center">{{ loginError }}</p>
    </transition>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Asumimos que estás usando el authService que consolidamos, que guarda todo en localStorage
import { login as loginService } from '~/services/authService'; 
import AppInput from '~/components/common/AppInput.vue';
import AppButton from '~/components/common/AppButton.vue';

const credentials = ref({
  username: '', // El backend de Lab2 espera 'username' o 'email', ajusta si es necesario
  password: ''
});
const loading = ref(false);
const loginError = ref('');
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  loginError.value = '';
  try {
    const response = await loginService({ 
      username: credentials.value.username, 
      password: credentials.value.password 
    });
    
    const role = response.role; // El authService ya guardó todo en localStorage

    // Redirigir según el rol de Lab 2
    if (role === 'ADMIN') {
      router.push('/admin/dashboard'); // O la ruta de admin que corresponda
    } else if (role === 'CLIENT') {
      router.push('/dashboard'); // O la ruta de cliente que corresponda
    } else if (role === 'DEALER') {
      router.push('/dealer/dashboard'); // O la ruta de repartidor que corresponda
    } else {
      router.push('/'); // Ruta por defecto si el rol no se reconoce
    }

  } catch (error: any) {
    loginError.value = error.data?.message || 'Credenciales incorrectas o error de conexión.';
  } finally {
    loading.value = false;
  }
};
</script>