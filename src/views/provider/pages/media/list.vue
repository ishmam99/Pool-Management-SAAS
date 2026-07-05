<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Media Library</h1>
      <router-link to="/provider/website/media/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Upload New
      </router-link>
    </div>

    <!-- Global Messages -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input v-model="filters.search" type="text" placeholder="Search by file name..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @input="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">File Type</label>
          <select v-model="filters.type" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Reset</button>
          <button v-if="selectedIds.length > 0" @click="confirmBulkDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Delete Selected ({{ selectedIds.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-gray-500">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="mediaItems.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No media found. <router-link to="/provider/media/upload" class="text-blue-600 hover:underline">Upload your first file</router-link></p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" class="w-4 h-4 text-blue-600 rounded" />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folder</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Size</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="media in mediaItems" :key="media.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="checkbox" v-model="selectedIds" :value="media.id" class="w-4 h-4 text-blue-600 rounded" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img v-if="media.type === 'image'" :src="media.thumbnail_url || media.url" alt="Preview" class="w-12 h-12 object-cover rounded-lg border" />
              <div v-else class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg border text-gray-500 text-xs">
                {{ media.type || 'file' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ media.file_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ media.folder || '/' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatFileSize(media.file_size) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ media.uploaded_by || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(media.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openEditModal(media)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
              <button @click="confirmDelete(media.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-500">
          Showing {{ (meta.current_page - 1) * meta.per_page + 1 }} to {{ Math.min(meta.current_page * meta.per_page, meta.total) }} of {{ meta.total }} results
        </div>
        <div class="flex gap-2">
          <button @click="changePage(meta.current_page - 1)" :disabled="meta.current_page <= 1" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span class="px-3 py-1 border rounded bg-blue-50 text-blue-700">{{ meta.current_page }}</span>
          <button @click="changePage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== EDIT MODAL (Update Folder) ==================== -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeEditModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Edit Media</h2>
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

        <form @submit.prevent="updateMedia">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">File Name</label>
              <p class="text-gray-900 font-medium">{{ editForm.file_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Folder</label>
              <input v-model="editForm.folder" type="text" placeholder="/folder/subfolder" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

// ---------------------- List State ----------------------
const mediaItems = ref([]);
const meta = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
});
const loading = ref(false);
const error = ref('');
const success = ref('');

const filters = reactive({
  search: '',
  type: '',
});

// Selection for bulk delete
const selectedIds = ref([]);
const allSelected = computed(() => {
  return mediaItems.value.length > 0 && selectedIds.value.length === mediaItems.value.length;
});
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = mediaItems.value.map(m => m.id);
  }
};

// ---------------------- Edit Modal State ----------------------
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  file_name: '',
  folder: '',
});

// ---------------------- Fetch Media ----------------------
const fetchMedia = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const params = {
      page,
      per_page: 10,
      ...filters,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const response = await api().get('/tenant/website/media', { params });
    const pagination = response.data.data || {};
    mediaItems.value = pagination.data || [];
    meta.value = {
      current_page: pagination.current_page || 1,
      per_page: pagination.per_page || 10,
      total: pagination.total || 0,
      last_page: pagination.last_page || 1,
    };
    // Clear selection after fetch
    selectedIds.value = [];
  } catch (err) {
    error.value = 'Failed to load media.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ---------------------- Filters & Pagination ----------------------
const applyFilters = () => fetchMedia(1);
const resetFilters = () => {
  filters.search = '';
  filters.type = '';
  fetchMedia(1);
};
const changePage = (page) => {
  if (page >= 1 && page <= meta.value.last_page) {
    fetchMedia(page);
  }
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ---------------------- Single Delete ----------------------
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This media file will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/media/${id}`);
        Swal.fire('Deleted!', 'Media file has been deleted.', 'success');
        await fetchMedia(meta.value.current_page);
        success.value = 'Media deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete media.', 'error');
        console.error(err);
      }
    }
  });
};

// ---------------------- Bulk Delete ----------------------
const confirmBulkDelete = () => {
  if (selectedIds.value.length === 0) return;
  Swal.fire({
    title: 'Delete selected files?',
    text: `You are about to delete ${selectedIds.value.length} file(s). This cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete all!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete('/tenant/website/media', {
          data: { ids: selectedIds.value },
        });
        Swal.fire('Deleted!', 'Selected files have been deleted.', 'success');
        await fetchMedia(meta.value.current_page);
        success.value = 'Selected media deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete selected files.', 'error');
        console.error(err);
      }
    }
  });
};

// ---------------------- Edit Media (Update Folder) ----------------------
const openEditModal = (media) => {
  editForm.id = media.id;
  editForm.file_name = media.file_name;
  editForm.folder = media.folder || '';
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

const updateMedia = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('folder', editForm.folder);
    formData.append('_method', 'PUT');

    await api().post(`/tenant/website/media/${editForm.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchMedia(meta.value.current_page);
    editSuccess.value = 'Media updated successfully!';
    setTimeout(() => {
      closeEditModal();
      success.value = 'Media updated successfully!';
      setTimeout(() => { success.value = ''; }, 3000);
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update media.';
    }
    console.error(err);
  } finally {
    editLoading.value = false;
  }
};

// ---------------------- Lifecycle ----------------------
onMounted(() => {
  fetchMedia(1);
});
</script>