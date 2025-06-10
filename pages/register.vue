<!-- pagina de registro-->

<script setup>
// Importa las dependencias necesarias
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  username: '',
  password: '',
  role: 'CLIENT',
  name: '',
  rut: '',
  email: '',
  phone: '',
  address: '',
  vehicle: '',
  plate: '',
});
const registerError = ref('');

// Función para manejar el registro
// Método: POST, URL: http://localhost:8090/auth/register
// Entrada: form (datos del formulario)
// Salida: respuesta del backend
const handleRegister = async () => {
  registerError.value = "";
  try {
    console.log("Datos enviados al backend:", form.value); // Log para revisar los datos enviados

    const response = await $fetch('/auth/register', {
        baseURL: useRuntimeConfig().public.apiBase, // Asegúrate de que apiBase esté configurado correctamente
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: form.value,
        });

    console.log("Respuesta del backend:", response); // Log para revisar la respuesta

    if (!response || !response.success) {
      throw new Error(response?.message || "Error al registrar el usuario");
    }

    alert("Usuario registrado exitosamente");

    // Redirige a la página de login después del registro
    router.push('/login');
  } catch (error) {
    // Verifica si el error tiene detalles adicionales
    if (error.data) {
      console.error("Detalles del error del backend:", error.data);
    }

    console.error("Error en el registro:", error); // Log para depurar errores
    registerError.value = error.message || "Error desconocido al registrar";
  }
};

// Función para actualizar campos según el rol seleccionado
const updateFields = () => {
  if (form.value.role === 'DEALER') {
    form.value.address = '';
  } else {
    form.value.vehicle = '';
    form.value.plate = '';
  }
};

// Función para redirigir a la página de inicio de sesión
const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register max-w-md mx-auto bg-white p-8 shadow-md rounded">
    <h1 class="text-2xl font-bold mb-4 text-center">Registro</h1>
    <form @submit.prevent="handleRegister">
      <!-- Username -->
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium">Usuario</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <!-- Password -->
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <!-- Role -->
      <div class="mb-4">
        <label for="role" class="block text-sm font-medium">Rol</label>
        <select
          id="role"
          v-model="form.role"
          class="w-full border px-3 py-2 rounded"
          @change="updateFields"
        >
          <option value="CLIENT">Cliente</option>
          <option value="DEALER">Distribuidor</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <!-- Additional fields based on role -->
      <div v-if="form.role === 'CLIENT'" class="mb-4">
        <label for="name" class="block text-sm font-medium">Nombre</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="rut" class="block text-sm font-medium">Rut</label>    
        <input
          id="rut"
          v-model="form.rut"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="email" class="block text-sm font-medium">Correo Electrónico</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="phone" class="block text-sm font-medium">Teléfono</label>
        <input
          id="phone"
          v-model="form.phone"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="address" class="block text-sm font-medium">Dirección</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div v-if="form.role === 'DEALER'" class="mb-4">
        <label for="name" class="block text-sm font-medium">Nombre</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="rut" class="block text-sm font-medium">Rut</label>
        <input
          id="rut"
          v-model="form.rut"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="email" class="block text-sm font-medium">Correo Electrónico</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="phone" class="block text-sm font-medium">Teléfono</label>
        <input
          id="phone"
          v-model="form.phone"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <label for="vehicle" class="block text-sm font-medium">Vehículo</label>
        <input
          id="vehicle"
          v-model="form.vehicle"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div v-if="form.role === 'DEALER'" class="mb-4">
        <label for="plate" class="block text-sm font-medium">Placa</label>
        <input
          id="plate"
          v-model="form.plate"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <button type="submit" class="w-full bg-green-500 text-white py-2 rounded">
        Registrar
      </button>
    </form>
    <p v-if="registerError" class="text-red-500 mt-4 text-center">{{ registerError }}</p>
    <div class="mt-4 text-center">
      <button @click="goToLogin" class="w-full bg-blue-500 text-white py-2 rounded">
        Iniciar Sesión
      </button>
    </div>
  </div>
</template>