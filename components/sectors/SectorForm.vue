<template>
  <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto bg-white p-6 rounded-xl shadow space-y-4">
    <AppInput label="Nombre del Sector" v-model="form.name" required />
    <div>
      <label class="block mb-1 font-medium text-gray-700">Puntos del Polígono</label>
      <div v-for="(point, i) in points" :key="i" class="flex gap-2 mb-2">
        <AppInput label="Lat" v-model="point.lat" type="number" step="any" required />
        <AppInput label="Lng" v-model="point.lng" type="number" step="any" required />
        <AppButton type="button" variant="danger" @click="removePoint(i)" v-if="points.length > 3">Quitar</AppButton>
      </div>
      <AppButton type="button" variant="secondary" @click="addPoint">Agregar punto</AppButton>
    </div>
    <div class="flex justify-end gap-2">
      <AppButton type="button" variant="secondary" @click="$emit('close')">Cancelar</AppButton>
      <AppButton type="submit" variant="primary" :loading="loading">
        {{ isEditMode ? 'Actualizar' : 'Guardar' }} Sector
      </AppButton>
    </div>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </form>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Sector } from '~/types/types'
import { createSector, updateSector } from '~/services/sectorService'
import { latLngArrayToPolygonWKT, wktPolygonToLatLngArray } from '~/utils/wktUtils'
import AppInput from '~/components/common/AppInput.vue'
import AppButton from '~/components/common/AppButton.vue'

const props = defineProps<{
  sectorData?: Sector
  isEditMode?: boolean
}>()
const emit = defineEmits(['close', 'saved'])
const form = ref<Omit<Sector, 'id'>>({ name: '', location: '' })
const points = ref<{ lat: string, lng: string }[]>([
  { lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }
])
const error = ref('')
const loading = ref(false)

const resetForm = () => {
  if (props.isEditMode && props.sectorData) {
    form.value.name = props.sectorData.name
    const arr = wktPolygonToLatLngArray(props.sectorData.location)
    points.value = arr ? arr.map(p => ({ lat: p.lat.toString(), lng: p.lng.toString() })).slice(0, -1) : [
      { lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }
    ]
  } else {
    form.value.name = ''
    points.value = [
      { lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }
    ]
  }
  error.value = ''
}

watch(() => props.sectorData, resetForm, { immediate: true, deep: true })

const addPoint = () => {
  points.value.push({ lat: '', lng: '' })
}
const removePoint = (i: number) => {
  if (points.value.length > 3) points.value.splice(i, 1)
}

const handleSubmit = async () => {
  error.value = ''
  const arr = points.value.map(p => ({ lat: Number(p.lat), lng: Number(p.lng) }))
  if (arr.length < 3 || arr.some(p => isNaN(p.lat) || isNaN(p.lng))) {
    error.value = 'Debes ingresar al menos 3 puntos válidos.'
    return
  }
  form.value.location = latLngArrayToPolygonWKT(arr)
  loading.value = true
  try {
    if (props.isEditMode && props.sectorData?.id) {
      await updateSector(props.sectorData.id, form.value)
    } else {
      await createSector(form.value)
    }
    emit('saved')
  } catch (e) {
    error.value = 'Error al guardar sector'
  } finally {
    loading.value = false
  }
}
</script>