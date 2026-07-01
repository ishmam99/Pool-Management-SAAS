<template>
  <div class="bg-gray-50 p-4">
    <div class="bg-green-50 rounded-xl shadow-sm border border-gray-200 p-4">
      <div class="flex items-center gap-3 mb-4">
        <!-- <h2 class="text-lg font-semibold text-gray-900">Price</h2> -->
        <span v-if="hasAgreement" class="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
          Active Agreement
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Frequency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
          <select v-model="form.frequency"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <p v-if="validationErrors.frequency" class="mt-2 text-sm text-red-600">{{ validationErrors.frequency[0] }}</p>
        </div>

        <!-- Billing Cycle -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Billing Cycle *</label>
          <select v-model="form.billing_cycle"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <p v-if="validationErrors.billing_cycle" class="mt-2 text-sm text-red-600">{{ validationErrors.billing_cycle[0] }}</p>
        </div>

        <!-- Price -->
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

        <!-- Technician -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Technician</label>
          <select v-model="form.assigned_technician_id"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
            <option value="">-- Unassigned --</option>
            <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
              {{ tech.name }}
            </option>
          </select>
          <p class="mt-2 text-sm text-gray-500">Optional: Leave unassigned to assign later</p>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
          <input type="date" v-model="form.start_date"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <p v-if="validationErrors.start_date" class="mt-2 text-sm text-red-600">{{ validationErrors.start_date[0] }}</p>
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input type="date" v-model="form.end_date"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <p v-if="validationErrors.end_date" class="mt-2 text-sm text-red-600">{{ validationErrors.end_date[0] }}</p>
        </div>
      </div>

      <!-- Auto Renew -->
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

      <!-- Submit Button -->
      <div class="py-4 flex items-center justify-end">
        <button
          @click="submitAgreement"
          :disabled="submitting"
          class="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-lg w-1/4 text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i v-if="submitting" class="ri-loader-4-line animate-spin"></i>
          {{ submitButtonLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import api from '../../../../../../services/api'
import Swal from 'sweetalert2'

// ─── Props & Emits ───────────────────────────────────────────
const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['refresh'])

// ─── State ──────────────────────────────────────────────────
const submitting = ref(false)
const technicians = ref([])
const validationErrors = reactive({})

// ─── Form ──────────────────────────────────────────────────
const form = reactive({
  customer_id: '',
  frequency: 'weekly',
  price: '',
  billing_cycle: 'monthly',
  assigned_technician_id: '',
  start_date: '',
  end_date: '',
  auto_renew: true,
  pool_ids: []  // will be auto‑filled with all customer pool IDs
})

// ─── Computed ──────────────────────────────────────────────
const hasAgreement = computed(() => {
  return props.customer?.agreements?.length > 0
})

const existingAgreement = computed(() => {
  return hasAgreement.value ? props.customer.agreements[0] : null
})

const submitButtonLabel = computed(() => {
  return hasAgreement.value ? 'Update Price' : 'Add Price'
})

// ─── Helpers ──────────────────────────────────────────────
const getDefaultStartDate = () => {
  const now = new Date()
  now.setDate(now.getDate() + 7) // +1 week
  return now.toISOString().split('T')[0]
}

// ─── Load Technicians ─────────────────────────────────────
const loadTechnicians = async () => {
  try {
    const response = await api().get('/user-management/technicians')
    technicians.value = response.data || []
  } catch (error) {
    console.error('Failed to load technicians:', error)
  }
}

// ─── Populate Form from Existing Agreement ───────────────
const populateFormFromAgreement = () => {
  const agreement = existingAgreement.value
  if (!agreement) return

  form.frequency = agreement.frequency || 'weekly'
  form.price = agreement.price || ''
  form.billing_cycle = agreement.billing_cycle || 'monthly'
  form.assigned_technician_id = agreement.assigned_technician_id || ''
  form.start_date = agreement.start_date?.split('T')[0] || getDefaultStartDate()
  form.end_date = agreement.end_date?.split('T')[0] || ''
  form.auto_renew = agreement.auto_renew == 1
  // pool_ids will be set separately (always all customer pools)
}

// ─── Watch Customer ──────────────────────────────────────
watch(() => props.customer, (newCustomer) => {
  if (!newCustomer) return

  // Set customer ID
  form.customer_id = newCustomer.id

  // Auto‑select all pools from the customer
  if (newCustomer.pools && newCustomer.pools.length) {
    form.pool_ids = newCustomer.pools.map(p => p.id)
  } else {
    form.pool_ids = []
  }

  // If agreement exists, populate other fields; else reset to defaults
  if (hasAgreement.value) {
    populateFormFromAgreement()
  } else {
    form.frequency = 'weekly'
    form.price = ''
    form.billing_cycle = 'monthly'
    form.assigned_technician_id = ''
    form.start_date = getDefaultStartDate()
    form.end_date = ''
    form.auto_renew = true
  }
}, { immediate: true })

// ─── Submit ──────────────────────────────────────────────
const submitAgreement = async () => {
  // Clear validation errors
  Object.keys(validationErrors).forEach(key => delete validationErrors[key])

  // ── Validate ──
  if (!form.customer_id) {
    validationErrors.customer_id = ['Customer is required']
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
    validationErrors.pool_ids = ['No pools available for this customer.']
    return
  }

  submitting.value = true

  try {
    // ── Build Payload ──
    const payload = {
      customer_id: Number(form.customer_id),
      frequency: form.frequency,
      price: Number(form.price),
      billing_cycle: form.billing_cycle,
      start_date: form.start_date,
      end_date: form.end_date || null,
      auto_renew: form.auto_renew ? 1 : 0,
      pool_ids: form.pool_ids.map(Number),
      assigned_technician_id: form.assigned_technician_id || null
    }

    if (hasAgreement.value) {
      // ── UPDATE ──
      const agreementId = existingAgreement.value.id
      await api().put(`/service-agreement-management/agreements/${agreementId}`, payload)
      await Swal.fire({
        icon: 'success',
        title: 'Agreement Updated',
        text: 'Service agreement updated successfully.'
      })
    } else {
      // ── CREATE ──
      await api().post('/service-agreement-management/agreements', payload)
      await Swal.fire({
        icon: 'success',
        title: 'Agreement Created',
        text: 'Service agreement created successfully.'
      })
    }

    // Notify parent to refresh customer data
    emit('refresh')

  } catch (error) {
    console.error('Failed to save agreement:', error)
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
        title: 'Failed to Save Agreement',
        text: error.response?.data?.message || 'Something went wrong'
      })
    }
  } finally {
    submitting.value = false
  }
}

// ─── Init ────────────────────────────────────────────────
onMounted(() => {
  loadTechnicians()
})
</script>