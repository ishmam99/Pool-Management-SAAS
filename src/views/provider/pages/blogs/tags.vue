<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Blog Tags</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Add New Tag
      </button>
    </div>

    <!-- Global Messages -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-gray-500">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="tags.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No tags found. Click "Add New Tag" to create one.</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y table-zebra divide-gray-200">
        <thead class="bg-emerald-50">
          <tr>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(tag, index) in tags" :key="tag.id">
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-900">{{ tag.name }}</td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm font-medium">
              <button @click="openEditModal(tag)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
              <button @click="confirmDelete(tag.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ==================== CREATE MODAL ==================== -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeCreateModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Create Tag</h2>
          <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="createError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ createError }}
        </div>

        <form @submit.prevent="createTag">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input v-model="createForm.name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="createLoading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="createLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ createLoading ? 'Saving...' : 'Create' }}
            </button>
            <button type="button" @click="closeCreateModal" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==================== EDIT MODAL ==================== -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeEditModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Edit Tag</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="editError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ editError }}
        </div>
        <div v-if="editSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {{ editSuccess }}
        </div>

        <form @submit.prevent="updateTag">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input v-model="editForm.name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="editLoading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="editLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ editLoading ? 'Saving...' : 'Update' }}
            </button>
            <button type="button" @click="closeEditModal" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

// ---------------------- List State ----------------------
const tags = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

// ---------------------- Create Modal State ----------------------
const showCreateModal = ref(false);
const createLoading = ref(false);
const createError = ref('');
const createForm = reactive({
  name: '',
});

// ---------------------- Edit Modal State ----------------------
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  name: '',
});

// ---------------------- Fetch Tags ----------------------
const fetchTags = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await api().get('/tenant/website/blog-tags');
    tags.value = response.data.data || [];
  } catch (err) {
    error.value = 'Failed to load tags.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ---------------------- Create ----------------------
const openCreateModal = () => {
  createForm.name = '';
  createError.value = '';
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createLoading.value = false;
  createError.value = '';
};

const createTag = async () => {
  createError.value = '';
  createLoading.value = true;
  try {
    await api().post('/tenant/website/blog-tags', {
      name: createForm.name,
    });
    await fetchTags();
    success.value = 'Tag created successfully!';
    closeCreateModal();
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      createError.value = Object.values(errors).flat().join(' ');
    } else {
      createError.value = err.response?.data?.message || 'Failed to create tag.';
    }
    console.error(err);
  } finally {
    createLoading.value = false;
  }
};

// ---------------------- Edit ----------------------
const openEditModal = (tag) => {
  editForm.id = tag.id;
  editForm.name = tag.name;
  editError.value = '';
  editSuccess.value = '';
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editLoading.value = false;
  editError.value = '';
  editSuccess.value = '';
};

const updateTag = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;
  try {
    // Use PUT directly (no _method override)
    await api().put(`/tenant/website/blog-tags/${editForm.id}`, {
      name: editForm.name,
    });
    await fetchTags();
    editSuccess.value = 'Tag updated successfully!';
    setTimeout(() => {
      closeEditModal();
      success.value = 'Tag updated successfully!';
      setTimeout(() => { success.value = ''; }, 3000);
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update tag.';
    }
    console.error(err);
  } finally {
    editLoading.value = false;
  }
};

// ---------------------- Delete (SweetAlert2) ----------------------
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This tag will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/blog-tags/${id}`);
        Swal.fire('Deleted!', 'Tag has been deleted.', 'success');
        await fetchTags();
        success.value = 'Tag deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete tag.', 'error');
        console.error(err);
      }
    }
  });
};

// ---------------------- Lifecycle ----------------------
onMounted(() => {
  fetchTags();
});
</script>