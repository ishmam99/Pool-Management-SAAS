<template>
  <div class="p-6 bg-slate-50 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Service Areas</h1>
      <router-link to="/provider/website/service/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Add New
      </router-link>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-gray-500">Loading...</p>
    </div>

    <div v-else-if="areas.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No service areas found. <router-link to="/provider/website/service/create" class="text-blue-600 hover:underline">Create one</router-link></p>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ZIP</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(area, index) in areas" :key="area.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ area.city }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ area.state }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ area.zip_code || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="area.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ area.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ area.order_index ?? 0 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openEditModal(area)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
              <button @click="confirmDelete(area.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingArea" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Edit Service Area</h2>
        <form @submit.prevent="updateArea">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input v-model="editForm.city" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input v-model="editForm.state" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input v-model="editForm.zip_code" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input v-model="editForm.is_active" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
                Active
              </label>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input v-model.number="editForm.order_index" type="number" min="0" class="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="updating" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="updating" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ updating ? 'Saving...' : 'Update' }}
            </button>
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

const areas = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

// Edit modal
const editingArea = ref(null);
const editForm = ref({
  id: null,
  city: '',
  state: '',
  zip_code: '',
  is_active: true,
  order_index: 0,
});
const updating = ref(false);

const fetchAreas = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await api().get('/tenant/website/service-areas');
    areas.value = response.data.data || [];
  } catch (err) {
    error.value = 'Failed to load service areas.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/service-areas/${id}`);
        Swal.fire('Deleted!', 'Service area has been deleted.', 'success');
        fetchAreas();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete service area.', 'error');
        console.error(err);
      }
    }
  });
};

const openEditModal = (area) => {
  editingArea.value = area;
  editForm.value = {
    id: area.id,
    city: area.city,
    state: area.state,
    zip_code: area.zip_code || '',
    is_active: area.is_active,
    order_index: area.order_index ?? 0,
  };
};

const closeModal = () => {
  editingArea.value = null;
  editForm.value = { id: null, city: '', state: '', zip_code: '', is_active: true, order_index: 0 };
};

const updateArea = async () => {
  updating.value = true;
  error.value = '';
  success.value = '';
  try {
    const formData = new FormData();
    formData.append('city', editForm.value.city);
    formData.append('state', editForm.value.state);
    formData.append('zip_code', editForm.value.zip_code);
    formData.append('is_active', editForm.value.is_active ? '1' : '0');
    formData.append('order_index', editForm.value.order_index);
    formData.append('_method', 'PUT'); // override

    await api().post(`/tenant/website/service-areas/${editForm.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    success.value = 'Service area updated successfully!';
    closeModal();
    fetchAreas();
    // Show success toast
    Swal.fire('Updated!', 'Service area has been updated.', 'success');
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(' ');
    } else {
      error.value = err.response?.data?.message || 'Failed to update.';
    }
    console.error(err);
  } finally {
    updating.value = false;
  }
};

onMounted(fetchAreas);
</script>