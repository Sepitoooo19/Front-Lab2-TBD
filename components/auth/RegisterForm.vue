<template>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput label="Usuario" v-model="form.username" required />
      <AppInput label="Nombre Completo" v-model="form.name" required />
      <AppInput label="Contraseña" type="password" v-model="form.password" required />
      
      <div>
        <label class="block mb-1 font-medium text-gray-700">Rol</label>
        <select v-model="form.role" class="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300" required>
          <option value="CLIENT">Cliente</option>
          <option value="DEALER">Repartidor</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
    </div>

    <div v-if="form.role === 'CLIENT' || form.role === 'DEALER'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput label="RUT" v-model="form.rut" required />
      <AppInput label="Email" type="email" v-model="form.email" required />
      <AppInput label="Teléfono" v-model="form.phone" required />
    </div>

    <div v-if="form.role === 'DEALER'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInput label="Vehículo" v-model="form.vehicle" required />
      <AppInput label="Patente" v-model="form.plate" required />
    </div>

    <div v-if="form.role === 'CLIENT' || form.role === 'DEALER'">
      <label class="block mb-1 font-medium text-gray-700">Ubicación</label>
      <p class="text-sm text-gray-500 mb-2">Haz clic o arrastra el marcador en el mapa para seleccionar tu ubicación.</p>
      <MapPicker 
        :lat="lat"
        :lng="lng"
        @update:lat="updateLat"
        @update:lng="updateLng"
      />
      <span v-if="lat && lng" class="text-xs text-gray-500 mt-1 block">Ubicación seleccionada: {{ lat.toFixed(6) }}, {{ lng.toFixed(6) }}</span>
    </div>

    <AppButton type="submit" class="w-full" :loading="loading" variant="primary">
      Registrarse
    </AppButton>
    
    <transition name="fade">
      <p v-if="registerError" class="text-red-500 text-center mt-2">{{ registerError }}</p>
    </transition>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register as registerService } from '~/services/authService';
import AppInput from '~/components/common/AppInput.vue';
import AppButton from '~/components/common/AppButton.vue';
import MapPicker from '~/components/common/MapPicker.vue';
import { latLngToWKT } from '~/utils/wktUtils';

const form = ref({
  username: '',
  password: '',
  name: '',
  role: 'CLIENT',
  rut: '',
  email: '',
  phone: '',
  ubication: '',
  vehicle: '',
  plate: '',
});

const lat = ref<number | null>(-33.459229); // Santiago
const lng = ref<number | null>(-70.645348);
const loading = ref(false);
const registerError = ref('');
const router = useRouter();

const updateLat = (newLat: number) => { lat.value = newLat; };
const updateLng = (newLng: number) => { lng.value = newLng; };

const handleRegister = async () => {
  loading.value = true;
  registerError.value = '';

  // 1. Prepara el payload base con los datos comunes
  const payload: any = {
    username: form.value.username,
    password: form.value.password,
    name: form.value.name,
    role: form.value.role,
  };

  // 2. Añade la ubicación si el rol es CLIENT o DEALER
  if (form.value.role === 'CLIENT' || form.value.role === 'DEALER') {
    // Depuración: muestra lat/lng actuales
    console.log('[Registro] Latitud seleccionada:', lat.value);
    console.log('[Registro] Longitud seleccionada:', lng.value);

    if (lat.value === null || lng.value === null) {
      registerError.value = 'Debes seleccionar una ubicación en el mapa.';
      loading.value = false;
      return;
    }

    const wkt = latLngToWKT(lng.value, lat.value);
    // Depuración: muestra el WKT generado
    console.log('[Registro] WKT generado:', wkt);

    payload.ubication = wkt;

    // Añadir otros campos comunes a CLIENT y DEALER
    payload.rut = form.value.rut;
    payload.email = form.value.email;
    payload.phone = form.value.phone;
  }

  // 3. Añade campos específicos solo para DEALER
  if (form.value.role === 'DEALER') {
    payload.vehicle = form.value.vehicle;
    payload.plate = form.value.plate;
  }

  // Depuración: muestra el payload final antes de enviar
  console.log('[Registro] Payload final enviado:', payload);

  // 4. Enviar los datos al servicio
  try {
    await registerService(payload);
    alert('Usuario registrado exitosamente');
    router.push('/login');
  } catch (error: any) {
    registerError.value = error.data?.message || 'Error al registrar. Revisa los datos.';
  } finally {
    loading.value = false;
  }
};
</script>