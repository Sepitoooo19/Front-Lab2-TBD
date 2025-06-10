<script setup>
import { ref } from 'vue';
import axios from 'axios';

const description = ref('');
const reportEmergency = async () => {
  await axios.put('/api/orders/1/emergency', { description: description.value }); // Replace '1' with order ID
  alert('Emergencia reportada');
};

definePageMeta({
    layout: 'dealer', // Usa el layout de repartidor
  });
</script>

<template>
  <div>
    <h1>Emergencias</h1>
    <textarea v-model="description" placeholder="Describe la emergencia"></textarea>
    <button @click="reportEmergency">Notificar Emergencia</button>
  </div>
</template>
