<template>
  <div v-if="isLoading" class="text-center text-gray-500 py-10">Cargando perfil...</div>
  <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ error }}</div>
  
  <form v-else @submit.prevent="handleUpdateProfile" class="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AppInput label="Nombre Completo" v-model="editableProfile.name" required />
      <AppInput label="Email" v-model="editableProfile.email" type="email" required />
      <AppInput label="RUT" v-model="editableProfile.rut" required />
      <AppInput label="Teléfono" v-model="editableProfile.phone" required />
    </div>

    <div>
      <label class="block text-gray-700 font-medium mb-2">Mi Ubicación</label>
      <MapPicker
        :lat="lat"
        :lng="lng"
        @update:lat="onUpdateLat"
        @update:lng="onUpdateLng"
      />
      <div class="text-xs text-gray-500 mt-2">
        Haz clic o arrastra el marcador para actualizar tu dirección de entrega.
      </div>
    </div>
    
    <div class="flex justify-end pt-4 border-t">
      <AppButton type="submit" :loading="isUpdating" variant="primary">
        Actualizar Perfil
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getAuthenticatedClientProfile, updateClientProfile } from '~/services/clientService';
import { wktToLatLng, latLngToWKT } from '~/utils/wktUtils';
import MapPicker from '~/components/common/MapPicker.vue';
import AppInput from '~/components/common/AppInput.vue';
import AppButton from '~/components/common/AppButton.vue';
import type { Client } from '~/types/types';

const { $toast } = useNuxtApp();

const isLoading = ref(true);
const isUpdating = ref(false);
const error = ref('');

// Usamos un objeto reactivo para el formulario
const editableProfile = reactive<Partial<Client>>({
  id: undefined,
  name: '',
  rut: '',
  email: '',
  phone: '',
  ubication: '',
});

const lat = ref<number | null>(null);
const lng = ref<number | null>(null);

onMounted(async () => {
  try {
    const profile = await getAuthenticatedClientProfile();
    
    // Poblar el formulario con los datos del perfil
    editableProfile.id = profile.id;
    editableProfile.name = profile.name;
    editableProfile.rut = profile.rut;
    editableProfile.email = profile.email;
    editableProfile.phone = profile.phone;
    editableProfile.ubication = profile.ubication;

    // Parsear la ubicación WKT para el mapa
    if (profile.ubication) {
      const coords = wktToLatLng(profile.ubication);
      if (coords) {
        // se invierte lat/lng porque WKT usa lng primero
        lng.value = coords.lng;
        lat.value = coords.lat;
      }
    } else {
      // Ubicación por defecto si no hay una guardada (Santiago)
      lat.value = -33.45;
      lng.value = -70.65;
    }
  } catch (e: any) {
    console.error("Error al cargar el perfil:", e);
    error.value = e.message || "No se pudo cargar el perfil.";
    $toast?.error(error.value);
  } finally {
    isLoading.value = false;
  }
});

// Funciones para actualizar lat/lng desde el MapPicker
const onUpdateLat = (newLat: number) => { lat.value = newLat; };
const onUpdateLng = (newLng: number) => { lng.value = newLng; };

// Manejar la actualización del perfil
const handleUpdateProfile = async () => {
  if (!editableProfile.id) return;
  if (lat.value === null || lng.value === null) {
    $toast?.error('Por favor, selecciona una ubicación en el mapa.');
    return;
  }
  
  isUpdating.value = true;
  try {
    const updatePayload: Partial<Client> = {
      name: editableProfile.name,
      rut: editableProfile.rut,
      email: editableProfile.email,
      phone: editableProfile.phone,
      ubication: latLngToWKT(lng.value, lat.value), // Convertir a WKT
    };

    await updateClientProfile(editableProfile.id, updatePayload);
    $toast?.success('¡Perfil actualizado exitosamente!');
    
  } catch (e: any) {
    console.error("Error al actualizar perfil:", e);
    $toast?.error(e.data?.message || 'Hubo un error al actualizar el perfil.');
  } finally {
    isUpdating.value = false;
  }
};
</script>