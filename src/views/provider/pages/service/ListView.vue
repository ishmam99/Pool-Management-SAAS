<template>
  <div class=" px-4 sm:px-6 lg:px-8 py-6 font-sans text-gray-800">
    <!-- ====== HEADER ====== -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Schedule Visits</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage scheduled pool service visits, technicians, priorities, and visit
          statuses.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button @click="fetchVisits" :disabled="loading"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 card-shadow transition disabled:opacity-50">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i> Refresh
        </button>
        <button
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 card-shadow transition">
          <i class="fas fa-calendar-alt"></i> Calendar View
        </button>
        <button
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 card-shadow transition">
          <i class="fas fa-route"></i> Route Board
        </button>
      </div>
    </div>

    <!-- ====== KPI CARDS ====== -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
      <div v-for="(kpi, key) in kpis" :key="key" class="bg-white p-4 rounded-xl card-shadow border border-gray-100">
        <div class="text-xs text-gray-500 uppercase tracking-wider">{{ key }}</div>
        <div class="text-2xl font-semibold mt-1">{{ kpi }}</div>
      </div>
    </div>

    <!-- ====== TABS + SEARCH + FILTERS ====== -->
    <div class="bg-white rounded-xl card-shadow border border-gray-100 p-4 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <!-- tabs -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            :class="['px-3 py-1.5 text-sm rounded-full font-medium transition', activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            {{ tab.label }} <span class="ml-1 text-xs opacity-80">({{ tabCounts[tab.key] }})</span>
          </button>
        </div>
        <!-- search + filters -->
        <div class="flex flex-wrap items-center gap-2 ml-auto">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input v-model="searchQuery" type="text" placeholder="Search ID, pool, address, tech"
              class="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-48 md:w-56 focus:ring-1 focus:ring-indigo-400 focus:outline-none">
          </div>
          <select v-model="filterTechnician"
            class="py-1.5 px-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-indigo-400">
            <option value="">All Technicians</option>
            <option v-for="t in technicians" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <select v-model="filterPriority"
            class="py-1.5 px-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-indigo-400">
            <option value="">All Priorities</option>
            <option value="first_visit">First Visit</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
          <select v-model="sortKey"
            class="py-1.5 px-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-indigo-400">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="service_address">Service Address A-Z</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ====== TABLE (desktop) / CARDS (mobile) ====== -->
    <div class="bg-white rounded-xl card-shadow border border-gray-100 overflow-hidden">
      <!-- loading skeleton -->
      <div v-if="loading" class="p-4 space-y-4">
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
        <div class="skeleton h-8 w-full rounded"></div>
      </div>

      <!-- empty state -->
      <div v-else-if="visits.length === 0" class="py-16 text-center">
        <i class="fas fa-calendar-times text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No visits found.</p>
      </div>

      <!-- TABLE (hidden on mobile) -->
      <div v-else class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 zebra">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Address
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="v in visits" :key="v.id">
              <td class="px-4 py-3"><span class="bg-gray-100 px-2 py-1 rounded text-xs font-mono">#{{ v.id }}</span>
              </td>
              <td class="px-4 py-3 text-sm">{{ formatDate(v.scheduled_date) }}</td>
              <td class="px-4 py-3 text-sm">{{ v.pool?.label || '—' }}</td>
              <td class="px-4 py-3 text-sm">{{ v.pool?.service_address || '—' }}</td>
              <td class="px-4 py-3 text-sm">{{ v.technician?.name || '—' }}</td>
              <td class="px-4 py-3 text-sm">{{ formatTime(v.time_window_start) }} – {{ formatTime(v.time_window_end) }}
              </td>
              <td class="px-4 py-3"><span :class="priorityBadgeClass(v.priority)">{{ formatPriority(v.priority)
                  }}</span></td>
              <td class="px-4 py-3"><span :class="statusBadgeClass(v.status)">{{ formatStatus(v.status) }}</span></td>
              <td class="px-4 py-3 text-right relative">
                <div class="inline-block text-left">
                  <button @click="toggleMenu(v.id)"
                    class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div v-if="activeMenu === v.id"
                    class="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1 text-sm">
                    <button @click="openDetail(v)" class="block w-full px-4 py-2 text-left hover:bg-gray-50">
                      <i class="fas fa-eye mr-2 text-gray-400"></i> View Details
                    </button>
                    <button @click="openEdit(v)" class="block w-full px-4 py-2 text-left hover:bg-gray-50">
                      <i class="fas fa-edit mr-2 text-gray-400"></i> Edit Visit
                    </button>
                    <button @click="openChangeStatus(v)" class="block w-full px-4 py-2 text-left hover:bg-gray-50">
                      <i class="fas fa-exchange-alt mr-2 text-gray-400"></i> Change Status
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- pagination -->
      <div v-if="!loading && visits.length > 0"
        class="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <span class="text-gray-500">Showing {{ pagination.from }} – {{ pagination.to }} of {{ pagination.total }}
          visits</span>
        <div class="flex items-center gap-2">
          <button @click="changePage(currentPage - 1)" :disabled="!pagination.prev_page_url"
            class="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition">Previous</button>
          <span class="px-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button @click="changePage(currentPage + 1)" :disabled="!pagination.next_page_url"
            class="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition">Next</button>
        </div>
      </div>
    </div>

    <!-- ====== MODAL: DETAIL / EDIT / STATUS ====== -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <!-- detail mode -->
        <div v-if="modalMode === 'detail'">
          <h3 class="text-lg font-bold mb-4">Visit Details</h3>
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <dt class="text-gray-500">Visit ID</dt>
            <dd>#{{ selectedVisit?.id }}</dd>
            <dt class="text-gray-500">Scheduled Date</dt>
            <dd>{{ moment(selectedVisit?.scheduled_date).format("LLLL") }}</dd>
            <dt class="text-gray-500">Start Time</dt>
            <dd>{{ formatTime(selectedVisit?.time_window_start) }}</dd>
            <dt class="text-gray-500">End Time</dt>
            <dd>{{ formatTime(selectedVisit?.time_window_end) }}</dd>
            <dt class="text-gray-500">Status</dt>
            <dd><span :class="statusBadgeClass(selectedVisit?.status)">{{ formatStatus(selectedVisit?.status) }}</span>
            </dd>
            <dt class="text-gray-500">Priority</dt>
            <dd><span :class="priorityBadgeClass(selectedVisit?.priority)">{{ formatPriority(selectedVisit?.priority)
                }}</span></dd>
            <dt class="text-gray-500">Pool Name</dt>
            <dd>{{ selectedVisit?.pool?.label || '—' }}</dd>
            <dt class="text-gray-500">Service Address</dt>
            <dd>{{ selectedVisit?.pool?.service_address || '—' }}</dd>
            <dt class="text-gray-500">Technician Name</dt>
            <dd>{{ selectedVisit?.technician?.name || '—' }}</dd>
            <dt class="text-gray-500">Technician Phone</dt>
            <dd>{{ selectedVisit?.technician?.phone || '—' }}</dd>
            <dt class="text-gray-500">Agreement ID</dt>
            <dd>{{ selectedVisit?.service_agreement?.id || '—' }}</dd>
            <dt class="text-gray-500">Frequency</dt>
            <dd>{{ selectedVisit?.service_agreement?.frequency || '—' }}</dd>
            <dt class="text-gray-500">Agreement Price</dt>
            <dd>{{ selectedVisit?.service_agreement?.price || '—' }}</dd>
            <dt class="text-gray-500">Work Order ID</dt>
            <dd>{{ selectedVisit?.work_order?.id || '—' }}</dd>
            <dt class="text-gray-500">Work Order Type</dt>
            <dd>{{ selectedVisit?.work_order?.type || '—' }}</dd>
            <dt class="text-gray-500">Work Order Status</dt>
            <dd>{{ selectedVisit?.work_order?.status || '—' }}</dd>
          </dl>
          <div class="mt-6 flex justify-end">
            <button @click="closeModal"
              class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Close</button>
          </div>
        </div>

        <!-- edit mode (includes change status) -->
        <div v-else-if="modalMode === 'edit' || modalMode === 'status'">
          <h3 class="text-lg font-bold mb-4">{{ modalMode === 'edit' ? 'Edit Visit' : 'Change Status' }}</h3>
          <form @submit.prevent="saveVisit" class="space-y-4">
            <!-- technician -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Technician</label>
              <select v-model="editForm.technician_id"
                class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-400">
                <option v-for="t in technicians" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input v-model="editForm.scheduled_date" type="date"
                  class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Priority</label>
                <select v-model="editForm.priority"
                  class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="first_visit">First Visit</option>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Time</label>
                <input v-model="editForm.time_window_start" type="time"
                  class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Time</label>
                <input v-model="editForm.time_window_end" type="time"
                  class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select v-model="editForm.status" class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
            <!-- rescheduled extra fields -->
            <div v-if="editForm.status === 'rescheduled'" class="border-l-4 border-indigo-300 pl-4 space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">New Date</label>
                <input v-model="editForm.rescheduled_date" type="date" required
                  class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Start</label>
                  <input v-model="editForm.rescheduled_start" type="time" required
                    class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">End</label>
                  <input v-model="editForm.rescheduled_end" type="time" required
                    class="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-4">
              <button type="button" @click="closeModal"
                class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button type="submit" :disabled="saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../../../../services/api.js';
import Swal from 'sweetalert2';

// ----- DATA -----
const visits = ref([]);
const technicians = ref([]);
const loading = ref(false);
const saving = ref(false);
const searchQuery = ref('');
const activeTab = ref('all');
const filterTechnician = ref('');
const filterPriority = ref('');
const sortKey = ref('newest');
const currentPage = ref(1);
const activeMenu = ref(null);
const modalOpen = ref(false);
const modalMode = ref('detail');
const selectedVisit = ref(null);
const editForm = ref({});
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
  next_page_url: null,
  prev_page_url: null
});

// ----- API FUNCTIONS -----
const fetchTechnicians = async () => {
  try {
    const response = await api().get(`/user-management/technicians`);
    technicians.value = response.data;
  } catch (error) {
    console.error('Error fetching technicians:', error);
    technicians.value = [];
  }
};

const fetchVisits = async (page = 1) => {
  loading.value = true;
  try {
    const response = await api().get(`/schedule-visit-management/visits`, {
      params: { page }
    });

    pagination.value = response.data;
    visits.value = response.data.data;
  } catch (error) {
    console.error('Error fetching visits:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load visits. Please try again.',
    });
    visits.value = [];
  } finally {
    loading.value = false;
  }
};

const updateVisit = async (visitId, data) => {
  saving.value = true;
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    await api().post(`/schedule-visit-management/visits/${visitId}`, formData);

    await Swal.fire({
      icon: 'success',
      title: 'Visit updated successfully.',
      timer: 2000,
      showConfirmButton: false
    });

    closeModal();
    await fetchVisits(currentPage.value);
  } catch (error) {
    console.error('Error updating visit:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to update visit. Please try again.',
    });
  } finally {
    saving.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    currentPage.value = page;
    fetchVisits(page);
  }
};

// ----- HELPERS (format, badge) -----
const formatDate = (d) => {
  if (!d) return '—';

  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
const formatTime = (t) => t ? t.slice(0, 5) : '—';
const formatStatus = (s) => s ? s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—';
const formatPriority = (p) => p ? p.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—';
const statusBadgeClass = (s) => {
  const map = {
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    missed: 'bg-gray-100 text-gray-700',
    rescheduled: 'bg-purple-100 text-purple-700'
  };
  return 'badge-pill ' + (map[s] || 'bg-gray-100 text-gray-700');
};
const priorityBadgeClass = (p) => {
  const map = {
    first_visit: 'bg-blue-100 text-blue-700',
    normal: 'bg-gray-100 text-gray-700',
    urgent: 'bg-red-100 text-red-700'
  };
  return 'badge-pill ' + (map[p] || 'bg-gray-100 text-gray-700');
};

// ----- COMPUTED: filter, sort, KPIs -----
const tabCounts = computed(() => {
  const all = visits.value;
  const counts = { all: all.length };
  ['scheduled', 'in_progress', 'completed', 'cancelled', 'missed', 'rescheduled'].forEach(st => {
    counts[st] = all.filter(v => v.status === st).length;
  });
  return counts;
});

const kpis = computed(() => {
  const all = visits.value;
  return {
    'Total Visits': all.length,
    'Scheduled': all.filter(v => v.status === 'scheduled').length,
    'In Progress': all.filter(v => v.status === 'in_progress').length,
    'Completed': all.filter(v => v.status === 'completed').length,
    'Cancelled': all.filter(v => v.status === 'cancelled').length,
    'Missed': all.filter(v => v.status === 'missed').length,
  };
});

// ----- MODALS -----
const toggleMenu = (id) => {
  activeMenu.value = activeMenu.value === id ? null : id;
};

const closeModal = () => {
  modalOpen.value = false;
  activeMenu.value = null;
  selectedVisit.value = null;
};

const openDetail = (v) => {
  selectedVisit.value = v;
  modalMode.value = 'detail';
  modalOpen.value = true;
  activeMenu.value = null;
};

const openEdit = (v) => {
  selectedVisit.value = v;
  modalMode.value = 'edit';
  editForm.value = {
    technician_id: v.technician_id || null,
    scheduled_date: v.scheduled_date,
    time_window_start: v.time_window_start,
    time_window_end: v.time_window_end,
    priority: v.priority,
    status: v.status,
    rescheduled_date: '',
    rescheduled_start: '',
    rescheduled_end: ''
  };
  modalOpen.value = true;
  activeMenu.value = null;
};

const openChangeStatus = (v) => {
  openEdit(v);
  modalMode.value = 'status';
};

const saveVisit = async () => {
  if (!selectedVisit.value) return;

  const payload = {
    technician_id: editForm.value.technician_id,
    scheduled_date: editForm.value.scheduled_date,
    time_window_start: editForm.value.time_window_start,
    time_window_end: editForm.value.time_window_end,
    priority: editForm.value.priority,
    status: editForm.value.status
  };

  if (payload.status === 'rescheduled') {
    if (!editForm.value.rescheduled_date || !editForm.value.rescheduled_start || !editForm.value.rescheduled_end) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all rescheduled date and time fields.',
      });
      return;
    }
    payload.scheduled_date = editForm.value.rescheduled_date;
    payload.time_window_start = editForm.value.rescheduled_start;
    payload.time_window_end = editForm.value.rescheduled_end;
  }

  await updateVisit(selectedVisit.value.id, payload);
};

// ----- LIFECYCLE -----
onMounted(async () => {
  await Promise.all([fetchTechnicians(), fetchVisits(1)]);
});

// ----- WATCHERS -----
watch([activeTab, filterTechnician, filterPriority, sortKey], () => {
  // Re-fetch with filters applied
  fetchVisits(1);
});

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'missed', label: 'Missed' },
  { key: 'rescheduled', label: 'Rescheduled' }
];
</script>

<style>
.card-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02);
}

.badge-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.zebra tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

.skeleton {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

[v-cloak] {
  display: none;
}
</style>