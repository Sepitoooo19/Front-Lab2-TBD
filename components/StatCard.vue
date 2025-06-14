<script setup lang="ts">
interface Props {
  title: string;
  hasData?: boolean | null;
  noDataMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hasData: false,
  noDataMessage: 'No hay datos disponibles'
});
</script>

<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <h3 class="font-medium text-gray-700">{{ props.title }}</h3>
    </div>
    <div class="p-4 flex-1">
      <div v-if="props.hasData" class="space-y-2">
        <slot></slot>
      </div>
      <p v-else class="text-gray-500 text-sm">
        {{ props.noDataMessage }}
      </p>
    </div>
  </div>
</template>