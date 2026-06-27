<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Create Service Agreement</h1>
        <p class="text-gray-600">Create a new service agreement for a customer</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Selection -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
                <Combobox v-model="form.customer_id">
                  <div class="relative">
                    <ComboboxInput
                      class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Search for a customer..."
                      :displayValue="(id) => getCustomerName(id)"
                      @change="searchQuery = $event.target.value"
                    />
                    <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </ComboboxButton>
                  </div>
                  <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <ComboboxOption
                      v-for="customer in filteredCustomers"
                      :key="customer.id"
                      :value="customer.id"
                      class="relative cursor-pointer select-none py-3 px-4 hover:bg-blue-50"
                    >
                      <div class="flex flex-col">
                        <span class="font-medium text-gray-900">{{ customer.contact_name }}</span>
                        <span class="text-sm text-gray-500">{{ customer.email }}</span>
                        <span class="text-sm text-gray-500">{{ customer.phone }}</span>
                      </div>
                    </ComboboxOption>
                    <div v-if="filteredCustomers.length === 0" class="py-3 px-4 text-sm text-gray-500">
                      No customers found
                    </div>
                  </ComboboxOptions>
                </Combobox>
                <p v-if="validationErrors.customer_id" class="mt-2 text-sm text-red-600">{{ validationErrors.customer_id[0] }}</p>
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
                    <span :class="selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
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
          <div v-if="selectedCustomer && hasActiveAgreement" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Active Agreement Warning</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>This customer already has an active service agreement.</p>
                  <div class="mt-2 bg-yellow-100 rounded p-3">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span class="font-medium">Agreement ID:</span>
                        <span>#{{ activeAgreement.id }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Frequency:</span>
                        <span>{{ activeAgreement.frequency }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Price:</span>
                        <span>${{ activeAgreement.price }}</span>
                      </div>
                      <div>
                        <span class="font-medium">Start Date:</span>
                        <span>{{ activeAgreement.start_date }}</span>
                      </div>
                      <div class="col-span-2">
                        <span class="font-medium">End Date:</span>
                        <span>{{ activeAgreement.end_date || 'No end date' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pool Selection -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Pool Selection *</h2>
            
            <div v-if="selectedCustomer && selectedCustomer.pools && selectedCustomer.pools.length > 0">
              <p class="text-sm text-gray-600 mb-4">Select at least one pool for this agreement</p>
              <div class="space-y-3">
                <div
                  v-for="pool in selectedCustomer.pools"
                  :key="pool.id"
                  class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    :id="`pool-${pool.id}`"
                    :value="pool.id"
                    v-model="form.pool_ids"
                    class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label :for="`pool-${pool.id}`" class="flex-1 cursor-pointer">
                    <div class="flex flex-col">
                      <span class="font-medium text-gray-900">{{ pool.name }}</span>
                      <div class="grid grid-cols-3 gap-2 mt-1 text-sm text-gray-600">
                        <span>Chemical: {{ pool.chemical_type || 'N/A' }}</span>
                        <span>Volume: {{ formatGallons(pool.volume_gallons) }}</span>
                        <span>Service: {{ pool.service_address || 'N/A' }}</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <p v-if="validationErrors.pool_ids" class="mt-2 text-sm text-red-600">{{ validationErrors.pool_ids[0] }}</p>
            </div>
            <div v-else-if="selectedCustomer" class="text-center py-8">
              <p class="text-gray-500">No pools found for this customer.</p>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500">Please select a customer to see available pools.</p>
            </div>
          </div>

          <!-- Agreement Details -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Agreement Details</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                <select
                  v-model="form.frequency"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p v-if="validationErrors.frequency" class="mt-2 text-sm text-red-600">{{ validationErrors.frequency[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Billing Cycle *</label>
                <select
                  v-model="form.billing_cycle"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <p v-if="validationErrors.billing_cycle" class="mt-2 text-sm text-red-600">{{ validationErrors.billing_cycle[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    v-model="form.price"
                    step="0.01"
                    min="0.01"
                    class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-8 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00"
                  />
                </div>
                <p v-if="validationErrors.price" class="mt-2 text-sm text-red-600">{{ validationErrors.price[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Technician</label>
                <select
                  v-model="form.assigned_technician_id"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Unassigned</option>
                  <option v-for="technician in technicians" :key="technician.id" :value="technician.id">
                    {{ technician.name }}
                  </option>
                </select>
                <p v-if="technicians.length === 0" class="mt-2 text-sm text-yellow-600">
                  No technicians available. Agreement can still be created without assigning a technician.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  v-model="form.start_date"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p v-if="validationErrors.start_date" class="mt-2 text-sm text-red-600">{{ validationErrors.start_date[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  v-model="form.end_date"
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p v-if="validationErrors.end_date" class="mt-2 text-sm text-red-600">{{ validationErrors.end_date[0] }}</p>
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
                  <div class="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="createAgreement"
              :disabled="submitting || !isFormValid"
              class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!submitting">Create Agreement</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Agreement...
              </span>
            </button>
            <button
              @click="cancel"
              class="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                    <span
                      v-for="poolId in form.pool_ids"
                      :key="poolId"
                      class="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                    >
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
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import api from '../../../../services/api'
import Swal from 'sweetalert2'

const router = useRouter()
const submitting = ref(false)
const searchQuery = ref('')

const customers = ref([])
const technicians = ref([])
const validationErrors = reactive({})

const form = reactive({
  customer_id: '',
  frequency: 'weekly',
  price: '',
  billing_cycle: 'monthly',
  assigned_technician_id: '',
  start_date: '',
  end_date: '',
  auto_renew: true,
  pool_ids: []
})

// Computed
const selectedCustomer = computed(() => {
  return customers.value.find(c => c.id === form.customer_id)
})

const selectedTechnician = computed(() => {
  return technicians.value.find(t => t.id === form.assigned_technician_id)
})

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value
  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(customer => 
    customer.contact_name?.toLowerCase().includes(query) ||
    customer.email?.toLowerCase().includes(query) ||
    customer.phone?.includes(query)
  )
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

const isFormValid = computed(() => {
  return (
    form.customer_id &&
    form.frequency &&
    form.price > 0 &&
    form.billing_cycle &&
    form.start_date &&
    form.pool_ids.length > 0
  )
})

// Methods
const getCustomerName = (id) => {
  const customer = customers.value.find(c => c.id === id)
  return customer ? `${customer.contact_name} • ${customer.email}` : ''
}

const getPoolName = (id) => {
  if (!selectedCustomer.value) return ''
  const pool = selectedCustomer.value.pools?.find(p => p.id === id)
  return pool ? pool.name : ''
}

const formatGallons = (gallons) => {
  if (!gallons) return 'N/A'
  return new Intl.NumberFormat().format(gallons) + ' Gallons'
}

const loadCustomers = async () => {
  try {
    const response = await api.get('/customer-management/customers-advance', {
      params: { with: 'pools,agreements' }
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
  try {
    const response = await api.get('/user-management/technicians')
    technicians.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load technicians:', error)
    // Non-critical, just log error
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
  if (form.end_date && form.end_date <= form.start_date) {
    validationErrors.end_date = ['End date must be after start date']
    return
  }
  if (form.pool_ids.length === 0) {
    validationErrors.pool_ids = ['Please select at least one pool']
    return
  }

  try {
    submitting.value = true

    const payload = {
      customer_id: form.customer_id,
      frequency: form.frequency,
      price: Number(form.price),
      billing_cycle: form.billing_cycle,
      assigned_technician_id: form.assigned_technician_id || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      auto_renew: form.auto_renew,
      pool_ids: form.pool_ids
    }

    const response = await api.post('/service-agreement-management/agreements', payload)

    await Swal.fire({
      icon: 'success',
      title: 'Agreement Created',
      text: response.data.message || 'Service agreement created successfully'
    })

    router.push('/provider/customers-agreements')
  } catch (error) {
    // Handle Laravel validation errors
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

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCustomers(),
    loadTechnicians()
  ])
})
</script>