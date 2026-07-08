<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">FAQs</h1>
      <button @click="openCreateModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        + Add FAQ
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input v-model="filters.category" type="text" placeholder="Filter by category..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @input="applyFilters" />
        </div>
        <div class="flex items-end gap-2">
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
    <div v-else-if="faqs.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No FAQs found. Click "Add FAQ" to create one.</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-green-50">
          <tr>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 border-e border-slate-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(faq, index) in faqs" :key="faq.id">
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 border-e border-slate-300 text-sm text-gray-900 max-w-xs truncate">{{ faq.question }}</td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-900">{{ faq.category || '-' }}</td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap">
              <span :class="faq.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ faq.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm text-gray-500">{{ faq.order_index ?? 0 }}</td>
            <td class="px-6 py-4 border-e border-slate-300 whitespace-nowrap text-sm font-medium">
              <div class="flex  border-e border-slate-300 items-center gap-1 flex-wrap">
                <button @click="moveUp(index)" :disabled="index === 0" class="text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" title="Move Up">
                  ↑
                </button>
                <button @click="moveDown(index)" :disabled="index === faqs.length - 1" class="text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed" title="Move Down">
                  ↓
                </button>
                <button @click="openEditModal(faq)" class="text-blue-600 hover:text-blue-900">Edit</button>
                <button @click="confirmDelete(faq.id)" class="text-red-600 hover:text-red-900">Delete</button>
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
          <h2 class="text-xl font-semibold text-gray-800">Add FAQ</h2>
          <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="createError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {{ createError }}
        </div>

        <form @submit.prevent="createFaq">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Question *</label>
              <input v-model="createForm.question" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
              <textarea v-model="createForm.answer" rows="4" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="createForm.category" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center gap-6">
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
          <h2 class="text-xl font-semibold text-gray-800">Edit FAQ</h2>
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

        <form @submit.prevent="updateFaq">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Question *</label>
              <input v-model="editForm.question" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
              <textarea v-model="editForm.answer" rows="4" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="editForm.category" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center gap-6">
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
const faqs = ref([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const filters = reactive({
  category: '',
});

// ---------------------- Create Modal State ----------------------
const showCreateModal = ref(false);
const createLoading = ref(false);
const createError = ref('');
const createForm = reactive({
  question: '',
  answer: '',
  category: '',
  is_active: true,
  order_index: 0,
});

// ---------------------- Edit Modal State ----------------------
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({
  id: null,
  question: '',
  answer: '',
  category: '',
  is_active: true,
  order_index: 0,
});

// ---------------------- Fetch FAQs ----------------------
const fetchFaqs = async () => {
  loading.value = true;
  error.value = '';
  try {
    const params = {};
    if (filters.category) params.category = filters.category;
    const response = await api().get('/tenant/website/faqs', { params });
    faqs.value = response.data.data || [];
    // Ensure order_index is set
    faqs.value.forEach((f, idx) => {
      if (f.order_index === undefined || f.order_index === null) {
        f.order_index = idx;
      }
    });
  } catch (err) {
    error.value = 'Failed to load FAQs.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => fetchFaqs();
const resetFilters = () => {
  filters.category = '';
  fetchFaqs();
};

// ---------------------- Create ----------------------
const openCreateModal = () => {
  createForm.question = '';
  createForm.answer = '';
  createForm.category = '';
  createForm.is_active = true;
  createForm.order_index = faqs.value.length;
  createError.value = '';
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createLoading.value = false;
  createError.value = '';
};

const createFaq = async () => {
  createError.value = '';
  createLoading.value = true;
  try {
    await api().post('/tenant/website/faqs', {
      question: createForm.question,
      answer: createForm.answer,
      category: createForm.category || '',
      is_active: createForm.is_active ? 1 : 0,
      order_index: createForm.order_index,
    });
    await fetchFaqs();
    success.value = 'FAQ created successfully!';
    closeCreateModal();
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      createError.value = Object.values(errors).flat().join(' ');
    } else {
      createError.value = err.response?.data?.message || 'Failed to create FAQ.';
    }
    console.error(err);
  } finally {
    createLoading.value = false;
  }
};

// ---------------------- Edit ----------------------
const openEditModal = (faq) => {
  editForm.id = faq.id;
  editForm.question = faq.question;
  editForm.answer = faq.answer;
  editForm.category = faq.category || '';
  editForm.is_active = faq.is_active;
  editForm.order_index = faq.order_index ?? 0;
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

const updateFaq = async () => {
  editError.value = '';
  editSuccess.value = '';
  editLoading.value = true;
  try {
    // Use PUT directly
    await api().put(`/tenant/website/faqs/${editForm.id}`, {
      question: editForm.question,
      answer: editForm.answer,
      category: editForm.category || '',
      is_active: editForm.is_active ? 1 : 0,
      order_index: editForm.order_index,
    });
    await fetchFaqs();
    editSuccess.value = 'FAQ updated successfully!';
    setTimeout(() => {
      closeEditModal();
      success.value = 'FAQ updated successfully!';
      setTimeout(() => { success.value = ''; }, 3000);
    }, 1500);
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(' ');
    } else {
      editError.value = err.response?.data?.message || 'Failed to update FAQ.';
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
    text: 'This FAQ will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/faqs/${id}`);
        Swal.fire('Deleted!', 'FAQ has been deleted.', 'success');
        await fetchFaqs();
        success.value = 'FAQ deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete FAQ.', 'error');
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
  if (index === faqs.value.length - 1) return;
  swapItems(index, index + 1);
};

const swapItems = (i, j) => {
  const items = faqs.value;
  [items[i], items[j]] = [items[j], items[i]];
  const orderedIds = items.map(item => item.id);
  reorderItems(orderedIds);
};

const reorderItems = async (orderedIds) => {
  try {
    await api().patch('/tenant/website/faqs/reorder', { ids: orderedIds });
    faqs.value.forEach((item, idx) => {
      item.order_index = idx;
    });
    success.value = 'Order updated successfully!';
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    error.value = 'Failed to update order.';
    console.error(err);
    await fetchFaqs(); // revert to server order
  }
};

// ---------------------- Lifecycle ----------------------
onMounted(() => {
  fetchFaqs();
});
</script>