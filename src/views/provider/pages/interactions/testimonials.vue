<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Testimonials</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Add Testimonial
      </button>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.is_active" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Featured</label>
          <select v-model="filters.is_featured" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All</option>
            <option value="1">Featured</option>
            <option value="0">Not Featured</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Reset Filters
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
    <div v-else-if="testimonials.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No testimonials found. Click "Add Testimonial" to create one.</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-teal-50">
          <tr>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(testimonial, index) in testimonials" :key="testimonial.id">
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div v-if="testimonial.customer_photo" class="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <img :src="testimonial.customer_photo" alt="Photo" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ testimonial.customer_name }}</div>
                  <div class="text-xs text-gray-500">{{ testimonial.customer_location || '' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
              <div class="flex items-center">
                <span v-for="i in 5" :key="i" class="text-sm" :class="i <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
              </div>
            </td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
              <span :class="testimonial.is_featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ testimonial.is_featured ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap">
              <span :class="testimonial.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ testimonial.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm text-gray-500">{{ testimonial.order_index ?? 0 }}</td>
            <td class="px-6 py-4 border-e border-slate-200 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-1 flex-wrap">
                <button @click="moveUp(index)" :disabled="index === 0" class="text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" title="Move Up">
                  ↑
                </button>
                <button @click="moveDown(index)" :disabled="index === testimonials.length - 1" class="text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" title="Move Down">
                  ↓
                </button>
                <button @click="openEditModal(testimonial)" class="text-blue-600 hover:text-blue-900">Edit</button>
                <button @click="confirmDelete(testimonial.id)" class="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ==================== CREATE MODAL ==================== -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeCreateModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Add Testimonial</h2>
          <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="createError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ createError }}
        </div>

        <form @submit.prevent="createTestimonial">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input v-model="createForm.customer_name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input v-model="createForm.customer_location" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
              <div class="flex items-center gap-2">
                <select v-model="createForm.rating" required class="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="i in 5" :key="i" :value="i">{{ i }} ★</option>
                </select>
                <span class="text-sm text-gray-500">(1–5)</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="createForm.title" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea v-model="createForm.content" rows="3" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer Photo</label>
              <input type="file" accept="image/*" @change="handleCreatePhoto" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="createForm.photoPreview" class="mt-2">
                <img :src="createForm.photoPreview" alt="Preview" class="h-20 w-20 object-cover rounded-full border" />
              </div>
            </div>
            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input v-model="createForm.is_featured" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
                Featured
              </label>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input v-model="createForm.is_active" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
                Active
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
              <input v-model.number="createForm.order_index" type="number" min="0" class="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Edit Testimonial</h2>
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

        <form @submit.prevent="updateTestimonial">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input v-model="editForm.customer_name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input v-model="editForm.customer_location" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
              <div class="flex items-center gap-2">
                <select v-model="editForm.rating" required class="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="i in 5" :key="i" :value="i">{{ i }} ★</option>
                </select>
                <span class="text-sm text-gray-500">(1–5)</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="editForm.title" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea v-model="editForm.content" rows="3" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer Photo</label>
              <div v-if="editForm.existing_photo" class="mb-2">
                <img :src="editForm.existing_photo" alt="Current photo" class="h-20 w-20 object-cover rounded-full border" />
                <p class="text-xs text-gray-500 mt-1">Current photo</p>
              </div>
              <input type="file" accept="image/*" @change="handleEditPhoto" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="editForm.photoPreview" class="mt-2">
                <img :src="editForm.photoPreview" alt="Preview" class="h-20 w-20 object-cover rounded-full border" />
                <p class="text-xs text-gray-500 mt-1">New photo preview</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input v-model="editForm.is_featured" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
                Featured
              </label>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input v-model="editForm.is_active" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
                Active
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
              <input v-model.number="editForm.order_index" type="number" min="0" class="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
const testimonials = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const filters = reactive({
  is_active: '',
  is_featured: '',
});

// ---------------------- Create Modal State ----------------------
const showCreateModal = ref(false);
const createLoading = ref(false);
const createError = ref('');
const createForm = reactive({
  customer_name: '',
  customer_location: '',
  rating: 5,
  title: '',
  content: '',
  is_featured: false,
  is_active: true,
  order_index: 0,
  photoFile: null,
  photoPreview: '',
});

// ---------------------- Edit Modal State ----------------------
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  customer_name: '',
  customer_location: '',
  rating: 5,
  title: '',
  content: '',
  is_featured: false,
  is_active: true,
  order_index: 0,
  photoFile: null,
  photoPreview: '',
  existing_photo: '',
});

// ---------------------- Fetch Testimonials ----------------------
const fetchTestimonials = async () => {
  loading.value = true;
  error.value = '';
  try {
    const params = {};
    if (filters.is_active !== '') params.is_active = filters.is_active === '1';
    if (filters.is_featured !== '') params.is_featured = filters.is_featured === '1';
    const response = await api().get('/tenant/website/testimonials', { params });
    testimonials.value = response.data.data || [];
    // Ensure each has order_index for reordering
    testimonials.value.forEach((t, idx) => {
      if (t.order_index === undefined || t.order_index === null) {
        t.order_index = idx;
      }
    });
  } catch (err) {
    error.value = 'Failed to load testimonials.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => fetchTestimonials();
const resetFilters = () => {
  filters.is_active = '';
  filters.is_featured = '';
  fetchTestimonials();
};

// ---------------------- Image Handlers ----------------------
const handleCreatePhoto = (e) => {
  const file = e.target.files[0];
  if (file) {
    createForm.photoFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => { createForm.photoPreview = ev.target.result; };
    reader.readAsDataURL(file);
  }
};
const handleEditPhoto = (e) => {
  const file = e.target.files[0];
  if (file) {
    editForm.photoFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => { editForm.photoPreview = ev.target.result; };
    reader.readAsDataURL(file);
  }
};

// ---------------------- Create ----------------------
const openCreateModal = () => {
  createForm.customer_name = '';
  createForm.customer_location = '';
  createForm.rating = 5;
  createForm.title = '';
  createForm.content = '';
  createForm.is_featured = false;
  createForm.is_active = true;
  createForm.order_index = testimonials.value.length;
  createForm.photoFile = null;
  createForm.photoPreview = '';
  createError.value = '';
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createLoading.value = false;
  createError.value = '';
};

const createTestimonial = async () => {
  createError.value = '';
  createLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('customer_name', createForm.customer_name);
    formData.append('customer_location', createForm.customer_location || '');
    formData.append('rating', createForm.rating);
    formData.append('title', createForm.title || '');
    formData.append('content', createForm.content);
    formData.append('is_featured', createForm.is_featured ? '1' : '0');
    formData.append('is_active', createForm.is_active ? '1' : '0');
    formData.append('order_index', createForm.order_index);
    if (createForm.photoFile) {
      formData.append('customer_photo', createForm.photoFile);
    }

    await api().post('/tenant/website/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchTestimonials();
    success.value = 'Testimonial created successfully!';
    closeCreateModal();
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      createError.value = Object.values(errors).flat().join(' ');
    } else {
      createError.value = err.response?.data?.message || 'Failed to create testimonial.';
    }
    console.error(err);
  } finally {
    createLoading.value = false;
  }
};

// ---------------------- Edit ----------------------
const openEditModal = (testimonial) => {
  editForm.id = testimonial.id;
  editForm.customer_name = testimonial.customer_name;
  editForm.customer_location = testimonial.customer_location || '';
  editForm.rating = testimonial.rating;
  editForm.title = testimonial.title || '';
  editForm.content = testimonial.content;
  editForm.is_featured = testimonial.is_featured;
  editForm.is_active = testimonial.is_active;
  editForm.order_index = testimonial.order_index ?? 0;
  editForm.existing_photo = testimonial.customer_photo || '';
  editForm.photoFile = null;
  editForm.photoPreview = '';
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

const updateTestimonial = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('customer_name', editForm.customer_name);
    formData.append('customer_location', editForm.customer_location || '');
    formData.append('rating', editForm.rating);
    formData.append('title', editForm.title || '');
    formData.append('content', editForm.content);
    formData.append('is_featured', editForm.is_featured ? '1' : '0');
    formData.append('is_active', editForm.is_active ? '1' : '0');
    formData.append('order_index', editForm.order_index);
    if (editForm.photoFile) {
      formData.append('customer_photo', editForm.photoFile);
    }
    formData.append('_method', 'PUT');

    await api().post(`/tenant/website/testimonials/${editForm.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchTestimonials();
    editSuccess.value = 'Testimonial updated successfully!';
    setTimeout(() => {
      closeEditModal();
      success.value = 'Testimonial updated successfully!';
      setTimeout(() => { success.value = ''; }, 3000);
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update testimonial.';
    }
    console.error(err);
  } finally {
    editLoading.value = false;
  }
};

// ---------------------- Delete ----------------------
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This testimonial will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/testimonials/${id}`);
        Swal.fire('Deleted!', 'Testimonial has been deleted.', 'success');
        await fetchTestimonials();
        success.value = 'Testimonial deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete testimonial.', 'error');
        console.error(err);
      }
    }
  });
};

// ---------------------- Reorder (Move Up/Down) ----------------------
const moveUp = (index) => {
  if (index === 0) return;
  swapItems(index, index - 1);
};

const moveDown = (index) => {
  if (index === testimonials.value.length - 1) return;
  swapItems(index, index + 1);
};

const swapItems = (i, j) => {
  const items = testimonials.value;
  [items[i], items[j]] = [items[j], items[i]];
  // Update order_index for all items (1-based for API? Usually 0-based is fine)
  // We'll send the new order to the API.
  // Prepare the ordered IDs
  const orderedIds = items.map(item => item.id);
  reorderItems(orderedIds);
};

const reorderItems = async (orderedIds) => {
  try {
    await api().patch('/tenant/website/testimonials/reorder', { ids: orderedIds });
    // No need to refetch, order is already updated locally
    // But ensure the order_index in each item is updated (optional)
    // For consistency, we could refetch, but to avoid flicker, we keep local order.
    // We'll also update order_index values to reflect new order (optional)
    testimonials.value.forEach((item, idx) => {
      item.order_index = idx;
    });
    success.value = 'Order updated successfully!';
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    error.value = 'Failed to update order.';
    console.error(err);
    // Revert local swap? Actually we already swapped; we could refetch to revert.
    // Better to refetch if reorder fails.
    await fetchTestimonials();
  }
};

// ---------------------- Lifecycle ----------------------
onMounted(() => {
  fetchTestimonials();
});
</script>