<template>
  <div class="p-6 bg-slate-100 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Contact Forms</h1>
      <span class="text-sm text-gray-500">{{ meta.total || 0 }} total inquiries</span>
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input v-model="filters.search" type="text" placeholder="Name, email, phone..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @input="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="converted">Converted</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input v-model="filters.date_from" type="date" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input v-model="filters.date_to" type="date" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" @change="applyFilters" />
        </div>
      </div>
      <div class="mt-2 flex justify-end">
        <button @click="resetFilters" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-gray-500">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="contacts.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">No inquiries found.</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Interest</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="contact in contacts" :key="contact.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.phone || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.service_interest || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'bg-green-100 text-green-800': contact.status === 'new',
                'bg-blue-100 text-blue-800': contact.status === 'replied',
                'bg-purple-100 text-purple-800': contact.status === 'converted',
                'bg-gray-100 text-gray-800': !contact.status
              }" class="px-2 py-1 text-xs font-medium rounded-full capitalize">
                {{ contact.status || 'new' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(contact.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openViewModal(contact.id)" class="text-blue-600 hover:text-blue-900 mr-2">View</button>
              <button @click="confirmDelete(contact.id)" class="text-red-600 hover:text-red-900">Delete</button>
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

    <!-- ==================== VIEW MODAL ==================== -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeViewModal">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Contact Details</h2>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="viewLoading" class="text-center py-6">
          <div class="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="viewData">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Name</label>
              <p class="text-gray-900 font-medium">{{ viewData.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-gray-900">{{ viewData.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Phone</label>
              <p class="text-gray-900">{{ viewData.phone || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Service Interest</label>
              <p class="text-gray-900">{{ viewData.service_interest || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Status</label>
              <span :class="{
                'bg-green-100 text-green-800': viewData.status === 'new',
                'bg-blue-100 text-blue-800': viewData.status === 'replied',
                'bg-purple-100 text-purple-800': viewData.status === 'converted',
                'bg-gray-100 text-gray-800': !viewData.status
              }" class="px-2 py-1 text-xs font-medium rounded-full capitalize inline-block">
                {{ viewData.status || 'new' }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Submitted At</label>
              <p class="text-gray-900">{{ formatDate(viewData.created_at) }}</p>
            </div>
          </div>

          <div class="mb-4">
            <label class="text-sm font-medium text-gray-500">Message</label>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ viewData.message || 'No message provided.' }}</p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            <!-- Status Update -->
            <select v-model="statusUpdate" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Change Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="converted">Converted</option>
            </select>
            <button @click="updateStatus" :disabled="!statusUpdate || statusLoading" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {{ statusLoading ? 'Updating...' : 'Update Status' }}
            </button>

            <!-- Convert to Lead -->
            <button @click="convertToLead" :disabled="converting" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {{ converting ? 'Converting...' : 'Convert to Lead' }}
            </button>

            <!-- Delete -->
            <button @click="confirmDelete(viewData.id)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
              Delete
            </button>

            <button @click="closeViewModal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

// ---------------------- List State ----------------------
const contacts = ref([]);
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
  date_from: '',
  date_to: '',
});

// ---------------------- View Modal State ----------------------
const showViewModal = ref(false);
const viewLoading = ref(false);
const viewData = ref(null);
const statusUpdate = ref('');
const statusLoading = ref(false);
const converting = ref(false);

// ---------------------- Fetch Contacts ----------------------
const fetchContacts = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const params = {
      page,
      per_page: 10,
      ...filters,
    };
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const response = await api().get('/tenant/website/contacts', { params });
    const pagination = response.data.data || {};
    contacts.value = pagination.data || [];
    meta.value = {
      current_page: pagination.current_page || 1,
      per_page: pagination.per_page || 10,
      total: pagination.total || 0,
      last_page: pagination.last_page || 1,
    };
  } catch (err) {
    error.value = 'Failed to load contacts.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ---------------------- Filters & Pagination ----------------------
const applyFilters = () => fetchContacts(1);
const resetFilters = () => {
  filters.search = '';
  filters.status = '';
  filters.date_from = '';
  filters.date_to = '';
  fetchContacts(1);
};
const changePage = (page) => {
  if (page >= 1 && page <= meta.value.last_page) {
    fetchContacts(page);
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
    minute: '2-digit',
  });
};

// ---------------------- View Modal ----------------------
const openViewModal = async (id) => {
  viewLoading.value = true;
  showViewModal.value = true;
  viewData.value = null;
  statusUpdate.value = '';
  try {
    const response = await api().get(`/tenant/website/contacts/${id}`);
    viewData.value = response.data.data;
  } catch (err) {
    error.value = 'Could not load contact details.';
    console.error(err);
    closeViewModal();
  } finally {
    viewLoading.value = false;
  }
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewData.value = null;
  statusUpdate.value = '';
  statusLoading.value = false;
  converting.value = false;
};

// ---------------------- Update Status ----------------------
const updateStatus = async () => {
  if (!statusUpdate.value || !viewData.value) return;
  statusLoading.value = true;
  try {
    await api().patch(`/tenant/website/contacts/${viewData.value.id}/status`, {
      status: statusUpdate.value,
    });
    // Update the local object
    viewData.value.status = statusUpdate.value;
    // Also update in the list
    const idx = contacts.value.findIndex(c => c.id === viewData.value.id);
    if (idx !== -1) contacts.value[idx].status = statusUpdate.value;
    success.value = 'Status updated successfully!';
    setTimeout(() => { success.value = ''; }, 3000);
    statusUpdate.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update status.';
    console.error(err);
  } finally {
    statusLoading.value = false;
  }
};

// ---------------------- Convert to Lead ----------------------
const convertToLead = async () => {
  if (!viewData.value) return;
  converting.value = true;
  try {
    await api().post(`/tenant/website/contacts/${viewData.value.id}/convert-to-lead`);
    // Update status to 'converted' if not already
    viewData.value.status = 'converted';
    const idx = contacts.value.findIndex(c => c.id === viewData.value.id);
    if (idx !== -1) contacts.value[idx].status = 'converted';
    success.value = 'Contact converted to lead successfully!';
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to convert to lead.';
    console.error(err);
  } finally {
    converting.value = false;
  }
};

// ---------------------- Delete ----------------------
const confirmDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This inquiry will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api().delete(`/tenant/website/contacts/${id}`);
        Swal.fire('Deleted!', 'Inquiry has been deleted.', 'success');
        // If modal is open, close it
        if (viewData.value && viewData.value.id === id) {
          closeViewModal();
        }
        await fetchContacts(meta.value.current_page);
        success.value = 'Inquiry deleted successfully!';
        setTimeout(() => { success.value = ''; }, 3000);
      } catch (err) {
        Swal.fire('Error', 'Failed to delete inquiry.', 'error');
        console.error(err);
      }
    }
  });
};

// ---------------------- Lifecycle ----------------------
onMounted(() => {
  fetchContacts(1);
});
</script>