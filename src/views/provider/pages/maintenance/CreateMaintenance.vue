<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i class="ri-tools-line text-indigo-600"></i>
            Schedule Maintenance
          </h1>
          <p class="text-gray-500 text-sm">Create a new work order for pool maintenance</p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Customer <span class="text-red-500">*</span>
              </label>
              <select v-model="form.customer_id" @change="onCustomerChange" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" selected disabled>Select a customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.contact_name || `Customer #${customer.id}` }}
                </option>
              </select>
            </div>

            <!-- Pool -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pool <span class="text-red-500">*</span>
              </label>
              <select v-model="form.pool_id" required :disabled="!form.customer_id"
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                <option value="" selected disabled>Select a pool</option>
                <option v-for="pool in availablePools" :key="pool.id" :value="pool.id">
                  {{ pool.label || pool.name || `Pool #${pool.id}` }}
                </option>
              </select>
            </div>

            <!-- Technician -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Technician <span class="text-red-500">*</span>
              </label>
              <select v-model="form.technician_id" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" selected disabled>Select a technician</option>
                <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                  {{ tech.name || `Technician #${tech.id}` }}
                </option>
              </select>
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Type <span class="text-red-500">*</span>
              </label>
              <select v-model="form.type" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" selected disabled>Select type</option>
                <option value="one_time">One‑time – One‑time service</option>
                <option value="repair">Repair – Equipment repair</option>
                <option value="inspection">Inspection – Safety/equipment inspection</option>
                <option value="installation">Installation – New equipment installation</option>
                <option value="emergency">Emergency – Urgent/emergency service</option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status <span class="text-red-500">*</span>
              </label>
              <select v-model="form.status" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" selected disabled>Select status</option>
                <option value="created">Created</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Scheduled Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date <span class="text-red-500">*</span>
              </label>
              <input v-model="form.scheduled_date" type="date" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Time Window Start -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Time Window Start <span class="text-red-500">*</span>
              </label>
              <input v-model="form.time_window_start" type="time" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Time Window End -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Time Window End <span class="text-red-500">*</span>
              </label>
              <input v-model="form.time_window_end" type="time" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Priority <span class="text-red-500">*</span>
              </label>
              <select v-model="form.priority" required
                class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" selected disabled>Select priority</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="first_visit">First Visit</option>
              </select>
            </div>
          </div>

          <!-- Checklist -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Checklist
            </label>
            <div class="flex gap-2 mb-3">
              <input v-model="newChecklistItem" type="text" placeholder="Add a task..."
                class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @keyup.enter="addChecklistItem" />
              <button type="button" @click="addChecklistItem"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium">
                <i class="ri-add-line"></i> Add
              </button>
            </div>
            <div v-if="form.checklist.length === 0" class="text-gray-400 text-sm italic">
              No tasks added yet.
            </div>
            <ul class="space-y-2">
              <li v-for="(item, index) in form.checklist" :key="index"
                class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                <span class="text-gray-700">{{ item }}</span>
                <button type="button" @click="removeChecklistItem(index)"
                  class="text-red-500 hover:text-red-700 transition">
                  <i class="ri-close-circle-line text-xl"></i>
                </button>
              </li>
            </ul>
          </div>

          <!-- Notes -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea v-model="form.notes" rows="4" placeholder="Any additional details..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>

          <!-- Submit -->
          <div class="mt-8 flex justify-end gap-3">
            <router-link to="/work-order-management/work-orders"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </router-link>
            <button type="submit" :disabled="loading"
              class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
              <i v-if="loading" class="ri-loader-4-line animate-spin"></i>
              <i v-else class="ri-save-line"></i>
              {{ loading ? 'Creating...' : 'Create Work Order' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../../../services/api.js';

const router = useRouter();

// Form data
const form = reactive({
  pool_id: '',
  customer_id: '',
  technician_id: '',
  type: '',
  status: '',
  scheduled_date: '',
  time_window_start: '',
  time_window_end: '',
  priority: 'normal',
  checklist: [],
  notes: '',
});

// UI state
const loading = ref(false);
const customers = ref([]);
const technicians = ref([]);
const newChecklistItem = ref('');

// Computed property for available pools based on selected customer
const availablePools = computed(() => {
  if (!form.customer_id) return [];
  const selectedCustomer = customers.value.find(c => c.id === form.customer_id);
  return selectedCustomer?.pools || [];
});

// Fetch customers with nested pools
const fetchCustomers = async () => {
  try {
    const res = await api().get('/customer-management/customers-advance?with=pools');
    customers.value = res.data.data || [];
  } catch (error) {
    console.error('Failed to fetch customers:', error);
  }
};

const fetchTechnicians = async () => {
  try {
    const res = await api().get('/user-management/technicians');
    technicians.value = res.data || [];
  } catch (error) {
    console.error('Failed to fetch technicians:', error);
  }
};

// Handle customer change - clear pool selection
const onCustomerChange = () => {
  form.pool_id = '';
};

// Checklist methods
const addChecklistItem = () => {
  const trimmed = newChecklistItem.value.trim();
  if (trimmed) {
    form.checklist.push(trimmed);
    newChecklistItem.value = '';
  }
};

const removeChecklistItem = (index) => {
  form.checklist.splice(index, 1);
};

// Submit
const handleSubmit = async () => {
  // Basic validation
  if (!form.customer_id || !form.pool_id || !form.technician_id ||
    !form.type || !form.status || !form.scheduled_date ||
    !form.time_window_start || !form.time_window_end || !form.priority) {
    await Swal.fire({
      icon: 'warning',
      title: 'Incomplete Form',
      text: 'Please fill in all required fields.',
      confirmButtonColor: '#4f46e5',
    });
    return;
  }

  loading.value = true;

  try {
    // Step 1: Create Schedule Visit
    const scheduleVisitPayload = {
      pool_id: form.pool_id,
      technician_id: form.technician_id,
      scheduled_date: form.scheduled_date,
      time_window_start: form.time_window_start,
      time_window_end: form.time_window_end,
      priority: form.priority,
    };

    const scheduleVisitResponse = await api().post('/schedule-visit-management/visits', scheduleVisitPayload);
    const scheduleVisitId = scheduleVisitResponse.data.data.id;


    const checklistPayload = form.checklist.map((item, index) => ({
      service_id: index + 1,
      item,
      isChecked: false,
      activities: "",
      photos: []
    }));

    const workOrderPayload = {
      pool_id: form.pool_id,
      customer_id: form.customer_id,
      technician_id: form.technician_id,
      type: form.type,
      status: form.status,
      scheduled_date: form.scheduled_date,
      checklist: checklistPayload,
      notes: form.notes,
      scheduled_visit_id: scheduleVisitId,
    };

    await api().post('/work-order-management/work-orders', workOrderPayload);

    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Work order created successfully.',
      confirmButtonColor: '#4f46e5',
    });

    // Redirect to list page
    // router.push('/work-order-management/work-orders');

  } catch (error) {
    console.error('Create work order error:', error);
    let message = 'Failed to create work order. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#4f46e5',
    });
  } finally {
    loading.value = false;
  }
};

// Load data on mount
onMounted(() => {
  fetchCustomers();
  fetchTechnicians();
});
</script>

<style scoped>
/* Optional custom scrollbar for checklist */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c4c4c4;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>