<template>
  <div class="p-6 bg-slate-50 mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Create Service Area</h1>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      Service area created successfully!
    </div>

    <form @submit.prevent="submitForm" class="bg-white rounded-xl shadow p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
        <input v-model="form.city" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
        <input v-model="form.state" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
        <input v-model="form.zip_code" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input v-model="form.is_active" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
          Active
        </label>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
          <input v-model.number="form.order_index" type="number" min="0" class="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="submit" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? 'Saving...' : 'Create' }}
        </button>
        <router-link to="/provider/service-area/view" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = reactive({
  city: '',
  state: '',
  zip_code: '',
  is_active: true,
  order_index: 0,
});

const submitForm = async () => {
  error.value = '';
  success.value = false;
  loading.value = true;

  try {
    // Convert is_active to 0 or 1 for backend
    const payload = {
      city: form.city,
      state: form.state,
      zip_code: form.zip_code,
      is_active: form.is_active ? 1 : 0,
      order_index: form.order_index ?? 0,
    };

    await api().post('/tenant/website/service-areas', payload);
    success.value = 'Service area created successfully!';
    // Reset form
    form.city = '';
    form.state = '';
    form.zip_code = '';
    form.is_active = true;
    form.order_index = 0;
    // Redirect after short delay
    setTimeout(() => {
      // router.push('/provider/service-area/view');
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(' ');
    } else {
      error.value = err.response?.data?.message || 'Failed to create service area.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>