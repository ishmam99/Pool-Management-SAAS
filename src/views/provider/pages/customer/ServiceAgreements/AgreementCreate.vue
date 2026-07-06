<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Create Service Agreement</h1>
        <p class="text-gray-600">Create a new service agreement for a customer</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Selection -->
          <div class="bg-cyan-50 rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
              <h2 class="text-lg font-semibold text-gray-900">Customer Information</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
                <select v-model="form.customer_id"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                  @change="onCustomerChange">
                  <option value="">Select a customer...</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.contact_name }} - {{ customer.email }}
                  </option>
                </select>
                <p v-if="validationErrors.customer_id" class="mt-2 text-sm text-red-600">{{
                  validationErrors.customer_id[0] }}</p>
              </div>

              <!-- Customer Details Card -->
              <div v-if="selectedCustomer" class="bg-gray-50 rounded-lg p-4 mt-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Contact Name</p>
                    <p class="font-medium text-gray-900">{{ selectedCustomer.contact_name }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium text-gray-900">{{ selectedCustomer.email }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Phone</p>
                    <p class="font-medium text-gray-900">{{ selectedCustomer.phone }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Type</p>
                    <p class="font-medium text-gray-900">{{ selectedCustomer.type || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Status</p>
                    <span
                      :class="selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                      {{ selectedCustomer.status || 'N/A' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Billing Address</p>
                    <p class="font-medium text-gray-900">{{ selectedCustomer.billing_address || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Existing Agreement Warning -->
          <div v-if="selectedCustomer && hasActiveAgreement"
            class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-yellow-800">Active Agreement Warning</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>This customer already has an active service agreement.</p>
                  <div class="mt-2 bg-yellow-100 rounded p-3">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span class="font-medium">Agreement ID: </span>
                        <span>#{{ activeAgreement.id }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Frequency: </span>
                        <span>{{ activeAgreement.frequency }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Price:</span>
                        <span>${{ activeAgreement.price }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Start Date: </span>
                        <span>{{ activeAgreement.start_date }}</span>
                      </div>
                      <div class="col-span-2">
                        <span class="font-medium">End Date: </span>
                        <span>{{ activeAgreement.end_date || 'No end date' }}</span>
                      </div>
                      <div class="col-span-2">
                        <span class="font-medium">Associated Pools: </span>
                        <div class="mt-1 flex flex-wrap gap-1">
                          <span v-for="pool in activeAgreement.pools" :key="pool.id"
                            class="inline-flex items-center px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                            {{ pool.label || pool.name }}
                          </span>
                          <span v-if="!activeAgreement.pools || activeAgreement.pools.length === 0"
                            class="text-yellow-600 text-xs">
                            No pools associated
                          </span>
                        </div>
                      </div>
                      <div class="col-span-2" v-if="activeAgreement.assigned_technician_id">
                        <span class="font-medium">Assigned Technician: </span>
                        <span>{{ getTechnicianName(activeAgreement.assigned_technician_id) || 'Unassigned' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pool Selection -->
          <div class="bg-purple-50 rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
              <h2 class="text-lg font-semibold text-gray-900">Pool Selection</h2>
            </div>

            <div v-if="selectedCustomer && selectedCustomer.pools && selectedCustomer.pools.length > 0">
              <p class="text-sm text-gray-600 mb-4">Select at least one pool for this agreement</p>
              <div class="space-y-3">
                <div v-for="pool in selectedCustomer.pools" :key="pool.id"
                  class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input type="checkbox" :id="`pool-${pool.id}`" :value="pool.id" v-model="form.pool_ids"
                    class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <label :for="`pool-${pool.id}`" class="flex-1 cursor-pointer">
                    <div class="flex flex-col">
                      <span class="font-medium text-gray-900">{{ pool.label }}</span>
                      <div class="grid grid-cols-3 gap-2 mt-1 text-sm text-gray-600">
                        <span>Chemical: {{ pool.chemical_type || 'N/A' }}</span>
                        <span>Volume: {{ formatGallons(pool.volume_gallons) }}</span>
                        <span>Service: {{ pool.service_address || 'N/A' }}</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <p v-if="validationErrors.pool_ids" class="mt-2 text-sm text-red-600">{{ validationErrors.pool_ids[0] }}
              </p>
            </div>
            <div v-else-if="selectedCustomer" class="text-center py-8">
              <p class="text-gray-500">No pools found for this customer.</p>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500">Please select a customer to see available pools.</p>
            </div>
          </div>

          <!-- Agreement Details -->
          <div class="bg-green-50 rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
              <h2 class="text-lg font-semibold text-gray-900">Agreement Details</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                <select v-model="form.frequency"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p v-if="validationErrors.frequency" class="mt-2 text-sm text-red-600">{{ validationErrors.frequency[0]
                }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Billing Cycle *</label>
                <select v-model="form.billing_cycle"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p v-if="validationErrors.billing_cycle" class="mt-2 text-sm text-red-600">{{
                  validationErrors.billing_cycle[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" v-model="form.price" step="0.01" min="0.01"
                    class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00" />
                </div>
                <p v-if="validationErrors.price" class="mt-2 text-sm text-red-600">{{ validationErrors.price[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Technician</label>
                <select v-model="form.assigned_technician_id"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <option value="">-- Unassigned --</option>
                  <option v-for="technician in technicians" :key="technician.id" :value="technician.id">
                    {{ technician.name }}
                  </option>
                </select>
                <p class="mt-2 text-sm text-gray-500">Optional: Leave unassigned to assign later</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input type="date" v-model="form.start_date"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <p v-if="validationErrors.start_date" class="mt-2 text-sm text-red-600">{{
                  validationErrors.start_date[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="date" v-model="form.end_date"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <p v-if="validationErrors.end_date" class="mt-2 text-sm text-red-600">{{ validationErrors.end_date[0] }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input type="time" v-model="form.start_time"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <p v-if="validationErrors.start_time" class="mt-2 text-sm text-red-600">
                  {{ validationErrors.start_time[0] }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input type="time" v-model="form.end_time"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <p v-if="validationErrors.end_time" class="mt-2 text-sm text-red-600">
                  {{ validationErrors.end_time[0] }}
                </p>
                <p class="mt-1 text-sm text-gray-500">Optional: Leave empty for no end time</p>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">Auto Renew</p>
                  <p class="text-sm text-gray-600">Automatically renew agreement when it expires</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.auto_renew" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Service Includes -->
          <div class="bg-pink-50 rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">4</span>
              <h2 class="text-lg font-semibold text-gray-900">Service Includes</h2>
            </div>
            <p class="text-sm text-gray-600 mb-4 ml-11">Select the services that are included in this agreement.</p>

            <!-- Loading Skeleton -->
            <div v-if="loadingServices" class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="i in 8" :key="i" class="flex items-start space-x-3 p-3 rounded-lg animate-pulse">
                <div class="h-4 w-4 bg-gray-200 rounded mt-1"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            </div>

            <!-- Services List -->
            <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="service in services" :key="service.id" 
                class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                <input 
                  type="checkbox" 
                  :id="`service-${service.id}`" 
                  :value="service.id" 
                  v-model="form.service_includes"
                  class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label :for="`service-${service.id}`" class="flex-1 cursor-pointer">
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-900">{{ service.title }}</span>
                    <span class="text-sm text-gray-600">${{ service.price }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <p class="text-gray-500">No services available.</p>
            </div>

            <!-- Selected Services Summary -->
            <div v-if="form.service_includes && form.service_includes.length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-2">Selected Services ({{ form.service_includes.length }})</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="serviceId in form.service_includes" 
                  :key="serviceId"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                >
                  {{ getServiceTitle(serviceId) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="createAgreement" :disabled="submitting || !isFormValid"
              class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!submitting">Create Agreement</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Creating Agreement...
              </span>
            </button>
            <button @click="cancel"
              class="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors">
              Cancel
            </button>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <div class="bg-yellow-50 rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Agreement Summary</h2>

              <div class="space-y-4">
                <div>
                  <p class="text-sm text-gray-500">Customer</p>
                  <p class="font-medium text-gray-900">{{ selectedCustomer?.contact_name || 'Not selected' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Selected Pools</p>
                  <p class="font-medium text-gray-900">{{ form.pool_ids.length }} pool(s) selected</p>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span v-for="poolId in form.pool_ids" :key="poolId"
                      class="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                      {{ getPoolName(poolId) }}
                    </span>
                  </div>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Frequency</p>
                  <p class="font-medium text-gray-900 capitalize">{{ form.frequency }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Billing Cycle</p>
                  <p class="font-medium text-gray-900 capitalize">{{ form.billing_cycle }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Price</p>
                  <p class="font-medium text-gray-900">${{ form.price || '0.00' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Assigned Technician</p>
                  <p class="font-medium text-gray-900">{{ selectedTechnician?.name || 'Unassigned' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Auto Renew</p>
                  <p class="font-medium text-gray-900">{{ form.auto_renew ? 'Yes' : 'No' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Start Date</p>
                  <p class="font-medium text-gray-900">{{ form.start_date || 'Not set' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">End Date</p>
                  <p class="font-medium text-gray-900">{{ form.end_date || 'Not set' }}</p>
                </div>

                <div>
                  <p class="text-sm text-gray-500">Service Includes</p>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span v-if="form.service_includes && form.service_includes.length > 0" 
                      v-for="serviceId in form.service_includes" 
                      :key="serviceId"
                      class="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                      {{ getServiceTitle(serviceId) }}
                    </span>
                    <span v-else class="text-gray-500 text-sm">No services selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import api from '../../../../../services/api'
import Swal from 'sweetalert2'
import { useAuthStore } from '../../../../../store/AuthStore'

const authStore = useAuthStore()

const router = useRouter()
const submitting = ref(false)
const loadingServices = ref(false)

const customers = ref([])
const technicians = ref([])
const services = ref([])
const validationErrors = reactive({})

const form = reactive({
  customer_id: '',
  frequency: 'weekly',
  price: '',
  billing_cycle: 'monthly',
  assigned_technician_id: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  auto_renew: true,
  pool_ids: [],
  service_includes: []
})

// Computed
const selectedCustomer = computed(() => {
  return customers.value.find(c => c.id === form.customer_id)
})

const selectedTechnician = computed(() => {
  return technicians.value.find(t => t.id === form.assigned_technician_id)
})

const hasActiveAgreement = computed(() => {
  if (!selectedCustomer.value || !selectedCustomer.value.agreements) return false
  return selectedCustomer.value.agreements.some(agreement =>
    agreement.status === 'active' || agreement.status === 'Active'
  )
})

const activeAgreement = computed(() => {
  if (!selectedCustomer.value || !selectedCustomer.value.agreements) return null
  return selectedCustomer.value.agreements.find(agreement =>
    agreement.status === 'active' || agreement.status === 'Active'
  )
})

const getTechnicianName = (technicianId) => {
  if (!technicianId) return null
  const technician = technicians.value.find(t => t.id == technicianId)
  return technician ? technician.name : null
}

const getServiceTitle = (serviceId) => {
  const service = services.value.find(s => s.id === serviceId)
  return service ? service.title : 'Unknown Service'
}

const isFormValid = computed(() => {
  return (
    form.customer_id &&
    form.frequency &&
    form.price > 0 &&
    form.billing_cycle &&
    form.start_date &&
    form.start_time &&
    form.pool_ids.length > 0
  )
})

// Methods
const getPoolName = (id) => {
  if (!selectedCustomer.value) return ''
  const pool = selectedCustomer.value.pools?.find(p => p.id === id)
  return pool ? pool.name : ''
}

const formatGallons = (gallons) => {
  if (!gallons) return 'N/A'
  return new Intl.NumberFormat().format(gallons) + ' Gallons'
}

const onCustomerChange = () => {
  form.pool_ids = []
}

const loadCustomers = async () => {

  const url = authStore.authType == 'admin' ? `/customer-management/customers-advance?tenant_id=${authStore.tenantId}` : '/customer-management/customers-advance'
  try {
    const response = await api().get(url, {
      params: { with: 'pools,agreements.pools' }
    })
    customers.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load customers:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Load Customers',
      text: 'Unable to load customer data. Please refresh the page.'
    })
  }
}

const loadTechnicians = async () => {
  const url = authStore.authType == 'admin' ? `/user-management/technicians?tenant_id=${authStore.tenantId}` : '/user-management/technicians'
  try {
    const response = await api().get(url)
    technicians.value = response.data || []
  } catch (error) {
    console.error('Failed to load technicians:', error)
    // Non-critical, just log error
  }
}

const loadServices = async () => {
  loadingServices.value = true
  const url = authStore.authType == 'admin' ? `/tenant-portal/services?tenant_id=${authStore.tenantId}` : '/tenant-portal/services'
  try {
    const response = await api().get(url)
    services.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load services:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Load Services',
      text: 'Unable to load service data. Please refresh the page.'
    })
  } finally {
    loadingServices.value = false
  }
}

const createAgreement = async () => {
  // Clear previous validation errors
  Object.keys(validationErrors).forEach(key => delete validationErrors[key])

  // Client-side validation
  if (!form.customer_id) {
    validationErrors.customer_id = ['Please select a customer']
    return
  }
  if (!form.frequency) {
    validationErrors.frequency = ['Please select a frequency']
    return
  }
  if (!form.price || form.price <= 0) {
    validationErrors.price = ['Price must be greater than 0']
    return
  }
  if (!form.billing_cycle) {
    validationErrors.billing_cycle = ['Please select a billing cycle']
    return
  }
  if (!form.start_date) {
    validationErrors.start_date = ['Please select a start date']
    return
  }
  if (!form.start_time) {
    validationErrors.start_time = ['Please select a start time']
    return
  }
  if (form.end_date && form.end_date <= form.start_date) {
    validationErrors.end_date = ['End date must be after start date']
    return
  }
  if (form.end_time && form.start_time && form.end_time <= form.start_time) {
    validationErrors.end_time = ['End time must be after start time']
    return
  }
  if (form.pool_ids.length === 0) {
    validationErrors.pool_ids = ['Please select at least one pool']
    return
  }

  try {
    submitting.value = true

    // Format service_includes for API - convert array of service IDs to array of objects
    const serviceIncludesFormatted = form.service_includes.map(serviceId => {
      const service = services.value.find(s => s.id === serviceId)
      return {
        service_id: serviceId,
        item: service ? service.title : '',
        isChecked: "false",
        activities: "",
        photos: []
      }
    })
    
    const serviceIncludesJson = JSON.stringify(serviceIncludesFormatted)

    const payload = {
      customer_id: form.customer_id,
      frequency: form.frequency,
      price: Number(form.price),
      billing_cycle: form.billing_cycle,
      assigned_technician_id: form.assigned_technician_id || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      start_time: form.start_time,
      end_time: form.end_time || null,
      auto_renew: form.auto_renew == true ? 1 : 0,
      pool_ids: form.pool_ids,
      service_includes: serviceIncludesJson,
      status: 'active' 
    }

    // Step 1: Create the agreement
    const response = await api().post('/service-agreement-management/agreements', payload)
    const agreementId = response.data.data.id

    // Step 2: Automatically generate visits
    const visitPayload = {
      start_time: form.start_time,  
      end_time: form.end_time || null 
    }

    try {
      await api().post(
        `/service-agreement-management/${agreementId}/generate-visits`,
        visitPayload
      )

      await Swal.fire({
        icon: 'success',
        title: 'Agreement Created',
        text: 'Service agreement created successfully with scheduled visits'
      })

      router.push('/provider/customers-agreements')
    } catch (visitError) {
      console.error('Failed to generate visits:', visitError)

      await Swal.fire({
        icon: 'warning',
        title: 'Agreement Created with Warning',
        text: 'Service agreement was created successfully but automatic visit generation failed. Please generate visits manually.',
        footer: 'Agreement ID: #' + agreementId
      })

      router.push('/provider/customers-agreements')
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(validationErrors, error.response.data.errors)
      Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check the form for errors'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Agreement',
        text: error.response?.data?.message || 'Something went wrong'
      })
    }
  } finally {
    submitting.value = false
  }
}

const cancel = () => {
  router.push('/provider/customers-agreements')
}

// Watch for customer changes to reset pool selection
watch(() => form.customer_id, () => {
  form.pool_ids = []
})

watch(() => authStore.tenantId, () => {
   loadCustomers(),
    loadTechnicians(),
    loadServices()
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCustomers(),
    loadTechnicians(),
    loadServices()
  ])
})
</script>