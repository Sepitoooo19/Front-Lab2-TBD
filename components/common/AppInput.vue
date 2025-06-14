<template>
  <div class="mb-6 w-full max-w-md mx-auto">
    <label v-if="label" :for="id" class="block mb-1 font-medium text-gray-700 ">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      :type="type"
      :placeholder="placeholder"
      :class="[
        'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2',
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:ring-blue-300'
      ]"
      v-model="model"
      :disabled="disabled"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: "text" },
  placeholder: String,
  error: String,
  id: String,
  disabled: Boolean
});
const emit = defineEmits(["update:modelValue"]);
const model = computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v)
});
</script>