<template>
  <div class=" bg-gray-50 p-4 ">
    <div class="">


      <div class="gap-8">
        <!-- Main Form -->
        <div class="">






          <!-- Agreement Details -->
          <div class="bg-green-50 rounded-xl shadow-sm border border-gray-200 p-4">
            <div class="flex items-center gap-3 mb-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">3</span>
              <h2 class="text-lg font-semibold text-gray-900">Price</h2>
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
            <div class="py-4 flex items-center justify-center">
              <button class="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-lg w-1/4 text-white">
                Add Price
              </button>
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
import api from '../../../../../../services/api'
import Swal from 'sweetalert2'

const router = useRouter()
const submitting = ref(false)

const customers = ref([])
const technicians = ref([])
const validationErrors = reactive({})

// Service tasks checklist
const serviceTasks = [
  'Skim Pool Surface',
  'Brush Pool Walls',
  'Brush Pool Steps',
  'Vacuum Pool',
  'Check Water Level',
  'Test Water Chemistry',
  'Balance Chemicals',
  'Add Chlorine',
  'Add Acid / pH Adjuster',
  'Clean Pool Filter',
  'Backwash Filter (if applicable)',
  'Inspect Pump & Motor',
  'Inspect Pool Equipment',
  'Check Timer Settings',
  'Inspect Pool Lights',
  'Clean Tile Line',
  'Remove Debris',
  'Inspect for Leaks',
  'Final Equipment Check'
]

const form = reactive({
  customer_id: '',
  frequency: 'weekly',
  price: '',
  billing_cycle: 'monthly',
  assigned_technician_id: '',
  start_date: '',
  end_date: '',
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

const serviceIncludesFormatted = form.service_includes.map(item => ({
  item: item,
  isChecked: "false"
}))

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
  try {
    const response = await api().get('/customer-management/customers-advance', {
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
  try {
    const response = await api().get('/user-management/technicians')
    technicians.value = response.data || []
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

    // Format service_includes for API - convert array of strings to array of objects
    const serviceIncludesArray = form.service_includes.map(item => ({
      item: item,
      isChecked: "false"
    }))
    
    const serviceIncludesJson = JSON.stringify(serviceIncludesArray)

    const payload = {
      customer_id: form.customer_id,
      frequency: form.frequency,
      price: Number(form.price),
      billing_cycle: form.billing_cycle,
      assigned_technician_id: form.assigned_technician_id || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      auto_renew: form.auto_renew == true ? 1 : 0,
      pool_ids: form.pool_ids,
      // status: "active",
      service_includes: serviceIncludesJson
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

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCustomers(),
    loadTechnicians()
  ])
})
</script>