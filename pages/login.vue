<!-- pagina de login-->
<script setup>
// Importa las dependencias necesarias
import { useRouter } from 'vue-router';
import axios from 'axios';
// Const reactivas
const router = useRouter();
const username = ref('');
const password = ref('');
const loginError = ref('');

// Función para manejar el inicio de sesión
// Método: POST, URL: http://localhost:8090/auth/login
// Entrada: username y password
// Salida: token y rol del usuario
// Descripción: Esta función envía una solicitud de inicio de sesión al backend y maneja la respuesta. Si el inicio de sesión es exitoso, guarda el token y el rol en localStorage y redirige al usuario a la página correspondiente según su rol. Si hay un error, muestra un mensaje de error.
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8090/auth/login', {
      username: username.value,
      password: password.value,
    });

    const { token, role } = response.data;

    // Guarda el token y el rol en el localStorage
    console.log('Token recibido:', token); // Verifica el token recibido
    console.log('Rol recibido:', role); // Verifica el rol recibido
    localStorage.setItem('token', token); // Sobrescribe el token anterior
    localStorage.setItem('role', role);

    // Verifica que el token y el rol se hayan guardado correctamente
    console.log('Token guardado en localStorage:', localStorage.getItem('token'));
    console.log('Rol guardado en localStorage:', localStorage.getItem('role'));

    // Redirige al usuario según su rol
    if (role === 'ADMIN') {
      router.push('/home-admin');
    } else if (role === 'CLIENT') {
      router.push('/home-client');
    } else if (role === 'DEALER') {
      router.push('/home-dealer');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    loginError.value = 'Credenciales incorrectas';
  }
};

// Función para redirigir a la página de registro
const goToRegister = () => {
  router.push('/register');
};
</script>

<!-- Template que contiene el formulario de inicio de sesión y el enlace a la página de registro-->

<template>
  <div class="login max-w-md mx-auto bg-white p-8 shadow-md rounded">
    <h1 class="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium">Usuario</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">
        Iniciar Sesión
      </button>
    </form>
    <button
      @click="goToRegister"
      class="w-full bg-gray-500 text-white py-2 mt-4 rounded"
    >
      Registrarse
    </button>
    <p v-if="loginError" class="text-red-500 mt-4 text-center">{{ loginError }}</p>
  </div>
</template>