<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class=" mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i :class="statusConfig.icon" class="text-indigo-600"></i>
            {{ statusConfig.title }}
          </h1>
          <p class="text-gray-500 text-sm mt-1">
            {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }} found
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64"
            />
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            @click="fetchData"
            class="p-2 text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <i class="ri-refresh-line"></i>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="ri-loader-4-line text-4xl text-indigo-600 animate-spin"></i>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl">
        <i class="ri-error-warning-line text-6xl text-red-400 block mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600">Could not load data</h3>
        <p class="text-gray-400 mt-2">{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
        >
          Try Again
        </button>
      </div>

      <!-- Data Table -->
      <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {{ col.label }}
                </th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="item in filteredItems"
                :key="item.id"
                class="hover:bg-gray-50 transition"
              >
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  <template v-if="col.key === 'status'">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(item[col.key])"
                    >
                      {{ formatStatus(item[col.key]) }}
                    </span>
                  </template>
                  <template v-else-if="col.key === 'type'">
                    <span class="capitalize">{{ item[col.key] }}</span>
                  </template>
                  <template v-else-if="col.key === 'customer'">
                    {{ item.customer?.contact_name || item.customer?.name || '—' }}
                  </template>
                  <template v-else-if="col.key === 'technician'">
                    {{ item.technician?.name || '—' }}
                  </template>
                  <template v-else-if="col.key === 'pool'">
                    {{ item.pool?.label || item.pool?.name || '—' }}
                  </template>
                  <template v-else>
                    {{ item[col.key] || '—' }}
                  </template>
                </td>
                <td class="px-6 py-4 text-right text-sm">
                  <button
                    @click="viewItem(item)"
                    class="text-indigo-600 hover:text-indigo-800 transition mr-2"
                    title="View Details"
                  >
                    <i class="ri-eye-line"></i>
                  </button>
                  <button
                    v-if="statusConfig.type === 'workorder'"
                    @click="editItem(item)"
                    class="text-blue-600 hover:text-blue-800 transition mr-2"
                    title="Edit"
                  >
                    <i class="ri-edit-line"></i>
                  </button>
                  <button
                    v-if="statusConfig.type === 'pool'"
                    @click="scheduleMaintenance(item)"
                    class="text-green-600 hover:text-green-800 transition"
                    title="Schedule Maintenance"
                  >
                    <i class="ri-tools-line"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredItems.length === 0">
                <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-gray-400">
                  <i class="ri-inbox-line text-4xl block mb-2"></i>
                  No items found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <div class="text-sm text-gray-500">
            Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }}
          </div>
          <div class="flex gap-2">
            <button
              :disabled="pagination.current_page === 1 || loading"
              @click="goToPage(pagination.current_page - 1)"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <span class="px-3 py-1 text-sm">{{ pagination.current_page || 1 }} / {{ pagination.last_page || 1 }}</span>
            <button
              :disabled="pagination.current_page === pagination.last_page || loading"
              @click="goToPage(pagination.current_page + 1)"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../../../services/api.js';

const route = useRoute();
const router = useRouter();
const statusParam = computed(() => route.params.status || 'required');

// Configuration for each status
const statusConfigs = {
    repair: {
    title: 'Repair Maintenance',
    icon: 'ri-error-warning-line',
    endpoint: '/work-order-management/work-orders',
    params: { type: 'repair' },
    type: 'workorder',
    statusKey: 'status',
  },
  required: {
    title: 'Installation Maintenance',
    icon: 'ri-error-warning-line',
    endpoint: '/work-order-management/work-orders',
    params: { type: 'installation' },
    type: 'workorder',
    statusKey: 'status',
  },
  requested: {
    title: 'Requested Maintenance',
    icon: 'ri-mail-send-line',
    endpoint: '/work-order-management/work-orders',
    params: { type: 'inspection' },
    type: 'workorder',
    statusKey: 'status',
  },
  recommended: {
    title: 'Recommended Maintenance',
    icon: 'ri-lightbulb-line',
    endpoint: '/work-order-management/work-orders',
    params: {type: 'one_time' },
    type: 'workorder',
    statusKey: 'status',
  },
  emergency: {
    title: 'Emergency Maintenance',
    icon: 'ri-alarm-warning-line',
    endpoint: '/work-order-management/work-orders',
    params: { type: 'emergency' },
    type: 'workorder',
    statusKey: 'status',
  },
};

const statusConfig = computed(() => statusConfigs[statusParam.value] || statusConfigs.required);

// Data
const items = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  from: 0,
  to: 0,
});

// Fetch data
const fetchData = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const config = statusConfig.value;
    const response = await api().get(config.endpoint, {
      params: { ...config.params, page },
    });
    const data = response.data.data || response.data || [];
    // Normalize response
    if (Array.isArray(data)) {
      items.value = data;
      // If pagination is in the response
      const meta = response.data.meta || response.data.pagination || {};
      pagination.value = {
        current_page: meta.current_page || page,
        last_page: meta.last_page || 1,
        total: meta.total || items.value.length,
        from: meta.from || 0,
        to: meta.to || items.value.length,
      };
    } else {
      // Fallback
      items.value = data;
      pagination.value = { current_page: 1, last_page: 1, total: items.value.length, from: 1, to: items.value.length };
    }
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = err.response?.data?.message || 'Failed to load data. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return;
  fetchData(page);
};

// Column definitions based on type
const columns = computed(() => {
  const type = statusConfig.value.type;
  if (type === 'workorder') {
    return [
      { key: 'id', label: 'ID' },
      { key: 'pool', label: 'Pool' },
      { key: 'customer', label: 'Customer' },
      { key: 'technician', label: 'Technician' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status' },
      { key: 'scheduled_date', label: 'Scheduled' },
    ];
  }
  return [];
});

// Filter items based on search (simple)
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter(item => {
    const searchable = `${item.id} ${item.label || ''} ${item.title || ''} ${item.contact_name || ''} ${item.notes || ''}`;
    return searchable.toLowerCase().includes(q);
  });
});

// Helpers
const formatStatus = (value) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusBadgeClass = (status) => {
  const map = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    missed: 'bg-red-100 text-red-800',
    rescheduled: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-gray-100 text-gray-800',
    created: 'bg-gray-100 text-gray-800',
    true: 'bg-red-100 text-red-800',
    false: 'bg-green-100 text-green-800',
    emergency: 'bg-red-100 text-red-800',
    service_request: 'bg-blue-100 text-blue-800',
  };
  const key = String(status).toLowerCase();
  return map[key] || 'bg-gray-100 text-gray-800';
};

// Actions
const viewItem = (item) => {
  // For work orders, view detail; for others, maybe show a modal
  if (statusConfig.value.type === 'workorder') {
    router.push(`/work-order-management/work-orders/${item.id}`);
  } else {
    Swal.fire({
      title: 'Details',
      html: `<pre>${JSON.stringify(item, null, 2)}</pre>`,
      confirmButtonColor: '#4f46e5',
    });
  }
};

const editItem = (item) => {
  router.push(`/work-order-management/work-orders/${item.id}/edit`);
};

const scheduleMaintenance = (pool) => {
  router.push(`/work-order-management/work-orders/create?pool_id=${pool.id}`);
};

// Total items for header
const totalItems = computed(() => pagination.value.total || items.value.length);

// Watch route param change to refetch
watch(statusParam, () => {
  fetchData(1);
});

// Initial load
onMounted(() => {
  fetchData();
});
</script>