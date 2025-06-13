<script setup lang="ts">
definePageMeta({
  middleware: 'auth-role' // Redirige según login y rol
});
</script>
<template>
  <div class="container">
    <p>Redirigiendo...</p>
  </div>
</template>