<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Pages</h1>
      <router-link to="/provider/website/pages/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Add New Page
      </router-link>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
      {{ success }}
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input v-model="filters.search" type="text" placeholder="Search by title..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @input="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
          <select v-model="filters.page_type" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Types</option>
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="services">Services</option>
            <option value="pricing">Pricing</option>
            <option value="contact">Contact</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-gray-500">Loading...</p>
    </div>

    <div v-else-if="pages.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No pages found. <router-link to="/provider/pages/create" class="text-blue-600 hover:underline">Create one</router-link></p>
    </div>

    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y table-zebra divide-gray-200 table-zebra">
        <thead class="bg-cyan-50">
          <tr>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Type</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(page, index) in pages" :key="page.id">
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-500">{{ index+1 }}</td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-900">{{ page.title }}</td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-900">
              <span class="capitalize">{{ page.page_type }}</span>
            </td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap">
              <span :class="page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 text-xs font-medium rounded-full capitalize">
                {{ page.status }}
              </span>
            </td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-500">{{ formatDate(page.updated_at) }}</td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm font-medium">
              <button @click="openEditModal(page)" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
              <button @click="confirmDelete(page.id)" class="text-red-600 hover:text-red-900">Delete</button>
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

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Edit Page</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
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

        <form @submit.prevent="updatePage">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="editForm.title" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Page Type *</label>
              <select v-model="editForm.page_type" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="custom">Custom</option>
                <option value="home">Home</option>
                <option value="about">About</option>
                <option value="services">Services</option>
                <option value="pricing">Pricing</option>
                <option value="contact">Contact</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea v-model="editForm.content" rows="6" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Page content..."></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input v-model="editForm.meta_title" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea v-model="editForm.meta_description" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="editForm.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="editLoading" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span v-if="editLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ editLoading ? 'Saving...' : 'Update' }}
            </button>
            <button type="button" @click="closeModal" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Cancel</button>
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

// List state
const pages = ref([]);
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
  status: '',
  page_type: '',
});

// Edit modal state
const showModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  title: '',
  content: '',
  page_type: 'custom',
  meta_title: '',
  meta_description: '',
  status: 'draft',
});

// Fetch pages
const fetchPages = async (page = 1) => {
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
    const response = await api().get('/tenant/website/pages', { params });
    const pagination = response.data.data || {};
    pages.value = pagination.data || [];
    meta.value = {
      current_page: pagination.current_page || 1,
      per_page: pagination.per_page || 10,
      total: pagination.total || 0,
      last_page: pagination.last_page || 1,
    };
  } catch (err) {
    error.value = 'Failed to load pages.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => fetchPages(1);
const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.page_type = '';
  fetchPages(1);
};
const changePage = (page) => {
  if (page >= 1 && page <= meta.value.last_page) {
    fetchPages(page);
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Delete
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This page will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/pages/${id}`);
        Swal.fire('Deleted!', 'Page has been deleted.', 'success');
        fetchPages(meta.value.current_page);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete page.', 'error');
        console.error(err);
      }
    }
  });
};

// Open edit modal – fetch fresh page data
const openEditModal = async (page) => {
  editError.value = '';
  editSuccess.value = '';
  // Prefill with current data (faster, but we'll also fetch to be safe)
  editForm.id = page.id;
  editForm.title = page.title;
  editForm.content = page.content || '';
  editForm.page_type = page.page_type;
  editForm.meta_title = page.meta_title || '';
  editForm.meta_description = page.meta_description || '';
  editForm.status = page.status;

  showModal.value = true;

  // Optionally fetch fresh data from API to ensure latest
  try {
    const response = await api().get(`/tenant/website/pages/${page.id}`);
    const data = response.data.data;
    Object.assign(editForm, {
      id: data.id,
      title: data.title,
      content: data.content || '',
      page_type: data.page_type,
      meta_title: data.meta_title || '',
      meta_description: data.meta_description || '',
      status: data.status,
    });
  } catch (err) {
    editError.value = 'Could not fetch latest data, but you can still edit.';
    console.error(err);
  }
};

const closeModal = () => {
  showModal.value = false;
  editLoading.value = false;
  editError.value = '';
  editSuccess.value = '';
};

// Update page
const updatePage = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;

  try {
    const formData = new FormData();
    // Append fields
    const fields = ['title', 'content', 'page_type', 'meta_title', 'meta_description', 'status'];
    fields.forEach(field => {
      formData.append(field, editForm[field] || '');
    });
    formData.append('_method', 'PUT');

    await api().post(`/tenant/website/pages/${editForm.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    editSuccess.value = 'Page updated successfully!';
    // Refresh list
    await fetchPages(meta.value.current_page);
    // Close modal after short delay
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update page.';
    }
    console.error(err);
  } finally {
    editLoading.value = false;
  }
};

onMounted(() => {
  fetchPages(1);
});
</script>