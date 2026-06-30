<template>
  <div class=" bg-gray-50 p-4 md:p-8">
    <div class="">
    

      <div class=" gap-8">
        <!-- Main Form -->
        <div class=" space-y-6">

          <!-- Service Includes -->
          <div class="bg-pink-50 rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">4</span>
              <h2 class="text-lg font-semibold text-gray-900">Service Information </h2>
            </div>
            <p class="text-sm text-gray-600 mb-4 ml-11">Select the services that are included in this agreement.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="task in serviceTasks" :key="task" class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  :id="`service-${task.replace(/\s+/g, '-').toLowerCase()}`" 
                  :value="task" 
                  v-model="form.service_includes"
                  class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label :for="`service-${task.replace(/\s+/g, '-').toLowerCase()}`" class="flex-1 cursor-pointer text-sm text-gray-700">
                  {{ task }}
                </label>
              </div>
            </div>

            <div v-if="form.service_includes && form.service_includes.length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-2">Selected Services ({{ form.service_includes.length }})</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="item in form.service_includes" 
                  :key="item"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                >
                  {{ item }}
                </span>
              </div>
            </div>
                        <div class="py-4 flex items-center justify-center">
              <button class="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg w-1/4 text-white">
                Add Service Information
              </button>
            </div>
          </div>

          <!-- Actions -->
          <!-- <div class="flex flex-col sm:flex-row gap-4">
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
          </div> -->
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