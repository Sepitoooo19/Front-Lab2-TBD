<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTaskDistributionByUserAndSector } from '~/services/taskService';

interface TaskDistribution {
  sectors: string[];
  userData: Record<string, Record<string, number>>;
}

const distribution = ref<TaskDistribution | null>(null);
const isLoading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const data = await getTaskDistributionByUserAndSector();
    distribution.value = data as TaskDistribution;
  } catch (e: any) {
    error.value = e.message || 'Failed to load task distribution';
    console.error('Error:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h2 class="text-xl font-bold mb-6 text-blue-700">Tareas de cada usuario por sector</h2>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-flex items-center space-x-2">
        <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading task distribution...</span>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="error && !isLoading" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Distribution table -->
    <div v-if="distribution && !isLoading" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th v-for="sector in distribution.sectors" :key="sector" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ sector }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="[userName, sectorCounts] in Object.entries(distribution.userData)" :key="userName">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ userName }}
            </td>
            <td v-for="sector in distribution.sectors" :key="`${userName}-${sector}`" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ sectorCounts[sector] || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Empty state -->
    <div v-if="!distribution && !isLoading && !error" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No task distribution data</h3>
      <p class="mt-1 text-sm text-gray-500">
        There are no tasks to display in the system yet.
      </p>
    </div>
  </div>
</template>