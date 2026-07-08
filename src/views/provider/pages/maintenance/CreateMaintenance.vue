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

      <!-- Progress Indicator -->
      <div class="mb-6 flex items-center justify-between max-w-md">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">1</div>
            <span class="text-sm font-medium" :class="currentTab === 0 ? 'text-indigo-600' : 'text-gray-400'">Select Components</span>
          </div>
          <div class="w-12 h-0.5 bg-gray-300"></div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" 
                 :class="currentTab === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'">2</div>
            <span class="text-sm font-medium" :class="currentTab === 1 ? 'text-indigo-600' : 'text-gray-400'">Schedule Maintenance</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white rounded-t-xl shadow-sm border border-gray-200">
        <div class="flex border-b border-gray-200">
          <button @click="switchTab(0)" 
                  class="flex-1 px-6 py-3 text-sm font-medium transition-all relative"
                  :class="currentTab === 0 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'">
            <i class="ri-checkbox-line mr-2"></i>
            Select Components
            <span v-if="componentSelectionValid" class="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {{ selectedComponents.length }} selected
            </span>
          </button>
          <button @click="switchTab(1)" 
                  class="flex-1 px-6 py-3 text-sm font-medium transition-all relative"
                  :class="[
                    currentTab === 1 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700',
                    !tab2Enabled ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  :disabled="!tab2Enabled">
            <i class="ri-calendar-event-line mr-2"></i>
            Schedule Maintenance
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-b-xl shadow-md border border-t-0 border-gray-200 p-6 md:p-8">
        <!-- Tab 1: Select Components -->
        <div v-show="currentTab === 0">
          <div class="space-y-6">
            <!-- Customer and Pool Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pool <span class="text-red-500">*</span>
                </label>
                <select v-model="form.pool_id" required :disabled="!form.customer_id" @change="onPoolChange"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                  <option value="" selected disabled>Select a pool</option>
                  <option v-for="pool in availablePools" :key="pool.id" :value="pool.id">
                    {{ pool.label || pool.name || `Pool #${pool.id}` }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Installed Equipment Display -->
            <div v-if="poolEquipmentLoading" class="flex justify-center items-center py-12">
              <div class="text-center">
                <i class="ri-loader-4-line animate-spin text-4xl text-indigo-600"></i>
                <p class="mt-2 text-gray-500">Loading pool equipment...</p>
              </div>
            </div>

            <div v-else-if="!form.pool_id" class="text-center py-12">
              <i class="ri-water-flash-line text-6xl text-gray-300"></i>
              <p class="mt-4 text-gray-500">Select a customer and pool to view installed equipment</p>
            </div>

            <div v-else-if="poolEquipment && poolEquipment.length === 0" class="text-center py-12">
              <i class="ri-tools-line text-6xl text-gray-300"></i>
              <p class="mt-4 text-gray-500">No installed equipment found for this pool</p>
            </div>

            <div v-else>
              <!-- Equipment Categories -->
              <div v-for="(category, categoryName) in categorizedEquipment" :key="categoryName" class="mt-8">
                <div v-if="category.length > 0" class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold text-gray-800 capitalize">
                    {{ categoryName }}
                    <span class="ml-2 text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {{ category.length }}
                    </span>
                  </h3>
                </div>

                <div v-if="category.length > 0" class="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Select
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Manufacturer
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Model
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Component
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Serial Number
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Maintenance Type
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in category" :key="item.id" 
                            class="hover:bg-gray-50 transition"
                            :class="{ 'bg-indigo-50': isItemSelected(item.id) }">
                          <td class="px-4 py-3">
                            <input type="checkbox" 
                                   :value="item.id" 
                                   v-model="selectedComponentIds"
                                   @change="onComponentSelect(item)"
                                   class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                          </td>
                          <td class="px-4 py-3 text-sm text-gray-700">{{ getManufacturer(item) }}</td>
                          <td class="px-4 py-3 text-sm text-gray-700">{{ getModel(item) }}</td>
                          <td class="px-4 py-3 text-sm text-gray-700">{{ getComponentName(item) }}</td>
                          <td class="px-4 py-3 text-sm text-gray-700">{{ item.serial_number || '-' }}</td>
                          <td class="px-4 py-3 text-sm">
                            <span class="px-2 py-1 rounded-full text-xs font-medium"
                                  :class="getStatusClass(item.status)">
                              {{ item.status || 'Unknown' }}
                            </span>
                          </td>
                          <td class="px-4 py-3">
                            <select :value="getMaintenanceType(item.id)" 
                                    @change="(event) => updateMaintenanceType(item.id, event)"
                                    :disabled="!isItemSelected(item.id)"
                                    class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                              <option value="" disabled>Select type</option>
                              <option value="Inspect">Inspect</option>
                              <option value="Repair">Repair</option>
                              <option value="Install">Install</option>
                              <option value="Replace">Replace</option>
                              <option value="Clean">Clean</option>
                              <option value="Service">Service</option>
                              <option value="Remove">Remove</option>
                              <option value="Upgrade">Upgrade</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Continue Button -->
            <div class="flex justify-end pt-6 border-t border-gray-200 mt-8">
              <button @click="goToTab2" 
                      
                      class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue to Schedule →
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 2: Schedule Maintenance -->
        <div v-show="currentTab === 1">
          <form @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <span class="text-gray-700 flex items-center gap-2">
        <span v-if="item.isAutoGenerated" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
          Auto
        </span>
        {{ item.text }}
      </span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '../../../../services/api.js';

const router = useRouter();

// Tab state
const currentTab = ref(0);
const tab2Enabled = ref(false);

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
const poolEquipment = ref([]);
const poolEquipmentLoading = ref(false);

// Component selection state
const selectedComponentIds = ref([]);
const selectedComponents = ref([]);

// Track auto-generated checklist items to manage them
const autoGeneratedItems = ref([]);

// Computed property for available pools based on selected customer
const availablePools = computed(() => {
  if (!form.customer_id) return [];
  const selectedCustomer = customers.value.find(c => c.id === form.customer_id);
  return selectedCustomer?.pools || [];
});

// Category mapping - based on component type
const equipmentCategories = {
  Equipments: ['pump', 'filter', 'heater', 'salt_cell', 'chlorinator', 'blower', 'chemical_feeder'],
  Electronics: ['controller', 'automation', 'light', 'cleaner', 'sensor'],
  Parts: ['valve', 'parts'],
  'Pool Structure': ['structure'],
  Others: ['other']
};

// Helper functions to get nested properties safely
const getManufacturer = (item) => {
  return item.manufacturer?.name || item.manufacturer || '-';
};

const getModel = (item) => {
  return item.equipment_model?.name || item.model || '-';
};

const getComponentName = (item) => {
  // Try different possible paths for component name
  if (item.component?.name) return item.component.name;
  if (item.component_name) return item.component_name;
  if (item.name) return item.name;
  if (item.equipment_model?.name) return item.equipment_model.name;
  return 'Unknown Component';
};

const getComponentType = (item) => {
  // Try different possible paths for type
  if (item.component?.type) return item.component.type;
  if (item.component_type) return item.component_type;
  if (item.type) return item.type;
  return null;
};

// Get full equipment name for display
const getEquipmentDisplayName = (item) => {
  const name = getComponentName(item);
  const model = getModel(item);
  if (model && model !== '-') {
    return `${name} (${model})`;
  }
  return name;
};

// Categorize equipment based on component type
const categorizedEquipment = computed(() => {
  const categorized = {};
  
  // Initialize categories
  Object.keys(equipmentCategories).forEach(category => {
    categorized[category] = [];
  });
  
  // Categorize each equipment item
  poolEquipment.value.forEach(item => {
    const type = getComponentType(item);
    let assigned = false;
    
    // Check which category this item belongs to
    for (const [category, types] of Object.entries(equipmentCategories)) {
      if (types.includes(type?.toLowerCase())) {
        categorized[category].push(item);
        assigned = true;
        break;
      }
    }
    
    // If no category matched, put in Others
    if (!assigned) {
      categorized['Others'].push(item);
    }
  });
  
  return categorized;
});

// Component selection validation
const componentSelectionValid = computed(() => {
  if (selectedComponents.value.length === 0) return false;
  return selectedComponents.value.every(item => item.maintenance_type);
});

// Helper functions
const isItemSelected = (itemId) => {
  return selectedComponentIds.value.includes(itemId);
};

const getMaintenanceType = (itemId) => {
  const selected = selectedComponents.value.find(item => item.equipment_id === itemId);
  return selected?.maintenance_type || '';
};

const updateMaintenanceType = (itemId, event) => {
  const type = event.target.value;
  const index = selectedComponents.value.findIndex(item => item.equipment_id === itemId);
  if (index !== -1) {
    selectedComponents.value[index].maintenance_type = type;
    // Regenerate checklist when maintenance type changes
    regenerateAutoChecklist();
  }
};

const onComponentSelect = (item) => {
  const isSelected = selectedComponentIds.value.includes(item.id);
  if (isSelected) {
    selectedComponents.value.push({
      equipment_id: item.id,
      maintenance_type: '',
      component_name: getComponentName(item)
    });
  } else {
    const index = selectedComponents.value.findIndex(comp => comp.equipment_id === item.id);
    if (index !== -1) {
      selectedComponents.value.splice(index, 1);
    }
  }
  // Regenerate checklist when selection changes
  regenerateAutoChecklist();
};

// Function to generate auto checklist items from selected components
const generateAutoChecklistItems = () => {
  return selectedComponents.value
    .filter(item => item.maintenance_type && item.maintenance_type.trim() !== '')
    .map(item => ({
      text: `${item.component_name || 'Unknown Component'} - ${item.maintenance_type}`,
      isAutoGenerated: true,
      equipmentId: item.equipment_id
    }));
};

// Function to regenerate/synchronize auto-generated checklist
const regenerateAutoChecklist = () => {
  // Generate new auto items
  const newAutoItems = generateAutoChecklistItems();
  
  // Store the current auto-generated item texts for comparison
  const newAutoTexts = newAutoItems.map(item => item.text);
  
  // Remove old auto-generated items from checklist
  const existingManualItems = form.checklist.filter(item => !item.isAutoGenerated);
  
  // Keep manual items that don't match any new auto item (in case user modified them)
  const preservedManualItems = existingManualItems.filter(manualItem => {
    // Check if this manual item matches an auto-generated item pattern
    const matchingAutoItem = newAutoItems.find(autoItem => autoItem.text === manualItem.text);
    // If it matches, we'll replace it with the new auto item
    // If it doesn't match, keep it as a manual item
    return !matchingAutoItem;
  });
  
  // Combine preserved manual items with new auto items
  form.checklist = [...preservedManualItems, ...newAutoItems];
  
  // Update the auto-generated items reference
  autoGeneratedItems.value = newAutoItems.map(item => item.text);
};

// Watch for changes to selectedComponents to update checklist
watch(selectedComponents, () => {
  // Only regenerate if we're on Tab 2 or if tab2 is enabled
  if (tab2Enabled.value || currentTab.value === 1) {
    regenerateAutoChecklist();
  }
}, { deep: true });

const getStatusClass = (status) => {
  const statusMap = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-red-100 text-red-700',
    'Maintenance': 'bg-yellow-100 text-yellow-700',
    'Installed': 'bg-blue-100 text-blue-700',
    'Broken': 'bg-red-100 text-red-700',
    'Available': 'bg-green-100 text-green-700',
    'Unavailable': 'bg-gray-100 text-gray-700'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700';
};

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

// Fetch pool equipment with proper response structure
const fetchPoolEquipment = async (poolId) => {
  if (!poolId) return;
  poolEquipmentLoading.value = true;
  poolEquipment.value = [];
  
  try {
    const response = await api().get(`/pool-management/pools/${poolId}`);
    
    // Debug: Log the response structure
    console.log('Pool Response:', response.data);
    console.log('Data:', response.data.data);
    
    // Extract equipment from the response - adjust based on actual structure
    const poolData = response.data;
    const equipment = poolData?.equipment || poolData?.installed_equipment || [];
    
    console.log('Equipment Array:', equipment);
    if (equipment.length > 0) {
      console.log('First Equipment Item:', equipment[0]);
      console.log('Component Type:', equipment[0]?.component?.type || equipment[0]?.type);
    }
    
    poolEquipment.value = equipment;
    
  } catch (error) {
    console.error('Failed to fetch pool equipment:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load pool equipment. Please try again.',
      confirmButtonColor: '#4f46e5',
    });
  } finally {
    poolEquipmentLoading.value = false;
  }
};

// Handle customer change - clear pool selection
const onCustomerChange = () => {
  form.pool_id = '';
  poolEquipment.value = [];
  selectedComponentIds.value = [];
  selectedComponents.value = [];
  autoGeneratedItems.value = [];
};

// Handle pool change - fetch equipment
const onPoolChange = () => {
  if (form.pool_id) {
    fetchPoolEquipment(form.pool_id);
  }
};

// Tab switching
const switchTab = (tabIndex) => {
  if (tabIndex === 1 && !tab2Enabled.value) return;
  currentTab.value = tabIndex;
};

const goToTab2 = () => {
  if (!componentSelectionValid.value) return;
  
  // Regenerate checklist before showing Tab 2
  regenerateAutoChecklist();
  
  tab2Enabled.value = true;
  currentTab.value = 1;
};

// Watch for pool_id changes to reset selection
watch(() => form.pool_id, (newVal) => {
  if (!newVal) {
    poolEquipment.value = [];
    selectedComponentIds.value = [];
    selectedComponents.value = [];
    autoGeneratedItems.value = [];
  }
});

// Checklist methods
const addChecklistItem = () => {
  const trimmed = newChecklistItem.value.trim();
  if (trimmed) {
    // Check if this item already exists (as auto-generated or manual)
    const exists = form.checklist.some(item => item.text === trimmed);
    if (!exists) {
      form.checklist.push({
        text: trimmed,
        isAutoGenerated: false
      });
      newChecklistItem.value = '';
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Item',
        text: 'This checklist item already exists.',
        confirmButtonColor: '#4f46e5',
      });
    }
  }
};

const removeChecklistItem = (index) => {
  const item = form.checklist[index];
  // If it's auto-generated, we should remove it from the auto-generated list
  if (item.isAutoGenerated) {
    // Find the corresponding selected component and remove it
    const equipmentId = item.equipmentId;
    const compIndex = selectedComponents.value.findIndex(c => c.equipment_id === equipmentId);
    if (compIndex !== -1) {
      selectedComponents.value.splice(compIndex, 1);
      // Remove from selectedComponentIds
      const idIndex = selectedComponentIds.value.indexOf(equipmentId);
      if (idIndex !== -1) {
        selectedComponentIds.value.splice(idIndex, 1);
      }
      // Regenerate checklist
      regenerateAutoChecklist();
    }
  } else {
    // Just remove manual item
    form.checklist.splice(index, 1);
  }
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

    // Prepare checklist payload - extract text from checklist items
    const checklistPayload = form.checklist.map((item, index) => ({
      service_id: index + 1,
      item: item.text || item, // Handle both object and string formats
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

    // Step 2: Create Work Order
    const workOrderResponse = await api().post('/work-order-management/work-orders', workOrderPayload);
    
    // Step 3: Get workOrderId from response
    const workOrderId = workOrderResponse.data.data.id;

    // Step 4: Attach equipment if components were selected
    if (selectedComponents.value.length > 0) {
      try {
        // Build the equipment payload
        const equipmentPayload = {
          equipments: selectedComponents.value.map(component => ({
            pool_equipment_id: component.equipment_id,
            issue_type: component.maintenance_type,
            issue_description: "",
            status: "pending"
          }))
        };

        // Call the attach equipment API
        await api().post(`/tenant/work-orders/${workOrderId}/equipments`, equipmentPayload);
      } catch (equipmentError) {
        console.error('Failed to attach equipment:', equipmentError);
        let equipmentMessage = 'Work order created but failed to attach equipment.';
        if (equipmentError.response?.data?.message) {
          equipmentMessage = equipmentError.response.data.message;
        }
        
        // Show error but don't block the success flow
        await Swal.fire({
          icon: 'warning',
          title: 'Partial Success',
          text: `Work order created successfully, but equipment attachment failed: ${equipmentMessage}`,
          confirmButtonColor: '#4f46e5',
        });
        
        // Still redirect to list page since work order was created
        // router.push('/work-order-management/work-orders');
        return;
      }
    }

    // Step 5: Success
    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: selectedComponents.value.length > 0 
        ? 'Work order created with equipment attached successfully.'
        : 'Work order created successfully.',
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
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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

/* Table styles */
table {
  border-collapse: collapse;
}

tr:last-child td {
  border-bottom: none;
}

/* Smooth transitions */
button, select, input, textarea {
  transition: all 0.2s ease;
}
</style>