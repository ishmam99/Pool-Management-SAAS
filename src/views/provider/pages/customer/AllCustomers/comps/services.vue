<template>
  <div class="bg-gray-50 p-4 md:p-1">
    <div class="bg-pink-50 rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center gap-3 mb-2">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">4</span>
        <h2 class="text-lg font-semibold text-gray-900">Service Information</h2>
        <span v-if="hasAgreement" class="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
          Agreement #{{ existingAgreement?.id }}
        </span>
        <span v-else class="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          No Agreement
        </span>
      </div>
      <p class="text-sm text-gray-600 mb-4 ml-11">Select the services that are included in this agreement.</p>

      <!-- Service Checklist -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="task in serviceTasks" :key="task" class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <input 
            type="checkbox" 
            :id="`service-${task.replace(/\s+/g, '-').toLowerCase()}`" 
            :value="task" 
            v-model="form.service_includes"
            class="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            :disabled="!hasAgreement || submitting"
          />
          <label :for="`service-${task.replace(/\s+/g, '-').toLowerCase()}`" class="flex-1 cursor-pointer text-sm text-gray-700" :class="{ 'cursor-not-allowed opacity-60': !hasAgreement || submitting }">
            {{ task }}
          </label>
        </div>
      </div>

      <!-- Selected Services Summary -->
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

      <!-- Action Button -->
      <div class="py-4 flex items-center justify-end">
        <button
          @click="updateServices"
          :disabled="!hasAgreement || submitting"
          class="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg w-1/4 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
        >
          <i v-if="submitting" class="ri-loader-4-line animate-spin"></i>
          {{ buttonLabel }}
        </button>
      </div>
      <p v-if="!hasAgreement" class="text-center text-sm text-amber-600 mt-2">
        <i class="ri-information-line mr-1"></i> Create a Price agreement first to enable service selection.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
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
const validationErrors = reactive({})

// ─── Form ──────────────────────────────────────────────────
const form = reactive({
  service_includes: []
})

// ─── Service Tasks (full list) ───────────────────────────
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

// ─── Computed ──────────────────────────────────────────────
const hasAgreement = computed(() => {
  return props.customer?.agreements?.length > 0
})

const existingAgreement = computed(() => {
  return hasAgreement.value ? props.customer.agreements[0] : null
})

// Check if the agreement has any services selected
const hasServices = computed(() => {
  if (!hasAgreement.value) return false
  const agreement = existingAgreement.value
  if (!agreement.service_includes) return false

  try {
    let services = []
    if (typeof agreement.service_includes === 'string') {
      services = JSON.parse(agreement.service_includes)
    } else if (Array.isArray(agreement.service_includes)) {
      services = agreement.service_includes
    }
    // If it's an array of objects with 'item', extract items
    if (services.length && typeof services[0] === 'object' && services[0].item) {
      services = services.map(s => s.item)
    }
    return services.length > 0
  } catch (e) {
    return false
  }
})

const buttonLabel = computed(() => {
  if (!hasAgreement.value) return 'Add Service Information'
  return hasServices.value ? 'Update Service Information' : 'Add Service Information'
})

// ─── Watch Customer ──────────────────────────────────────
watch(() => props.customer, (newCustomer) => {
  if (!newCustomer) return

  if (hasAgreement.value) {
    const agreement = existingAgreement.value
    let services = []

    if (agreement.service_includes) {
      try {
        if (typeof agreement.service_includes === 'string') {
          services = JSON.parse(agreement.service_includes)
        } else if (Array.isArray(agreement.service_includes)) {
          services = agreement.service_includes
        }
        // Extract just the item strings
        if (services.length && typeof services[0] === 'object' && services[0].item) {
          services = services.map(s => s.item)
        }
      } catch (e) {
        console.warn('Could not parse service_includes:', e)
        services = []
      }
    }
    form.service_includes = services
  } else {
    form.service_includes = []
  }
}, { immediate: true })

// ─── Submit ──────────────────────────────────────────────
const updateServices = async () => {
  if (!hasAgreement.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'No Agreement Found',
      text: 'Please create a Price agreement first.',
      confirmButtonColor: '#4f46e5'
    })
    return
  }

  submitting.value = true
  try {
    // Format service_includes as array of { item, isChecked: "false" }
    const serviceIncludesArray = form.service_includes.map(item => ({
      item: item,
      isChecked: "false"
    }))
    const serviceIncludesJson = JSON.stringify(serviceIncludesArray)

    const agreementId = existingAgreement.value.id

    // Send only service_includes with PUT method
    const payload = {
      service_includes: serviceIncludesJson,
      _method: 'PUT'
    }

    await api().post(`/service-agreement-management/agreements/${agreementId}`, payload)

    await Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Service information updated successfully.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })

    // Notify parent to refresh customer data
    emit('refresh')

  } catch (error) {
    console.error('Failed to update services:', error)
    let message = error.response?.data?.message || 'Something went wrong.'
    if (error.response?.data?.errors) {
      const errMsgs = Object.values(error.response.data.errors).flat()
      message = errMsgs.join(', ')
    }
    await Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: message,
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    submitting.value = false
  }
}
</script>