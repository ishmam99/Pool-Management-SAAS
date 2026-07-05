<template>
  <div class="p-6 bg-slate-50 mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Import Service Areas</h1>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <div class="bg-white rounded-xl shadow p-6">
      <p class="text-sm text-gray-600 mb-4">
        Paste a JSON array of service areas. Each object must contain <strong>city</strong> and <strong>state</strong>; <em>zip_code</em> is optional.
      </p>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">JSON Data</label>
        <textarea v-model="jsonInput" rows="8" class="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='[{"city":"New York","state":"NY","zip_code":"10001"},{"city":"Los Angeles","state":"CA"}]'></textarea>
      </div>
      <div class="flex gap-3">
        <button @click="importAreas" :disabled="loading || !jsonInput.trim()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? 'Importing...' : 'Import' }}
        </button>
        <button @click="clearJson" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Clear</button>
        <router-link to="/provider/service-area/view" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">View All</router-link>
      </div>
      <div v-if="previewCount" class="mt-4 text-sm text-gray-500">
        Preview: <strong>{{ previewCount }}</strong> area(s) detected.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

const router = useRouter();
const jsonInput = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const previewCount = computed(() => {
  try {
    const parsed = JSON.parse(jsonInput.value);
    if (Array.isArray(parsed)) return parsed.length;
    return 0;
  } catch {
    return 0;
  }
});

const clearJson = () => {
  jsonInput.value = '';
  error.value = '';
  success.value = '';
};

const importAreas = async () => {
  error.value = '';
  success.value = '';
  let areas;
  try {
    areas = JSON.parse(jsonInput.value);
    if (!Array.isArray(areas) || areas.length === 0) {
      throw new Error('Please provide a non-empty array of service areas.');
    }
    // Validate each item has at least city and state
    for (const item of areas) {
      if (!item.city || !item.state) {
        throw new Error('Each area must have "city" and "state" fields.');
      }
    }
  } catch (err) {
    error.value = 'Invalid JSON: ' + err.message;
    return;
  }

  loading.value = true;
  try {
    await api().post('/tenant/website/service-areas/bulk-import', { areas });
    success.value = `Successfully imported ${areas.length} service area(s).`;
    jsonInput.value = '';
    // Redirect after delay
    setTimeout(() => {
      router.push('/provider/service-area/view');
    }, 2000);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(' ');
    } else {
      error.value = err.response?.data?.message || 'Import failed.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>