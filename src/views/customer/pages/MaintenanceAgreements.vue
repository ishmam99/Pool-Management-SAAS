<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/40 p-4 md:p-8">
    <div v-if="loading" class="max-w-5xl mx-auto animate-pulse space-y-6">
      <div class="h-10 w-56 bg-gray-200 rounded-xl"></div>
      <div v-for="i in 2" :key="i" class="h-40 bg-gray-200 rounded-2xl"></div>
    </div>

    <div v-else class="mx-auto">
      <header class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xl shadow-lg">
          <i class="ri-file-text-line"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Maintenance Agreements</h1>
          <p class="text-gray-500">Your active maintenance agreements</p>
        </div>
      </header>

      <div v-if="agreements.length === 0" class="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <div class="text-5xl mb-4">📋</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No agreements found</h3>
        <p class="text-gray-500">Contact your service provider to set up a maintenance plan.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="agreement in agreements"
          :key="agreement.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition"
        >
          <div class="h-1.5 bg-gradient-to-r from-emerald-400 to-green-500"></div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ agreement.title || `Agreement #${agreement.id}` }}</h2>
                <p v-if="agreement.customer" class="text-sm text-gray-500 mt-1">
                  {{ agreement.customer.contact_name }} • {{ agreement.customer.phone }}
                </p>
                <p v-if="agreement.created_by" class="text-sm text-gray-500 mt-1">
                  Created by: {{ agreement.created_by.name }}
                </p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass(agreement.status)">
                {{ formatStatus(agreement.status || 'active') }}
              </span>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-emerald-600">{{ formatCurrency(agreement.price) }}</span>
                <span class="text-sm text-gray-500">one‑time</span>
              </div>

              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div v-if="agreement.scheduled_date" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Scheduled Date</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ formatDate(agreement.scheduled_date) }}</dd>
                </div>
                <div v-if="agreement.start_time && agreement.end_time" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Time</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ formatTime(agreement.start_time) }} – {{ formatTime(agreement.end_time) }}</dd>
                </div>
                <div v-if="agreement.warranty_period" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Warranty</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ agreement.warranty_period }}</dd>
                </div>
                <div v-if="agreement.work_order_id" class="bg-gray-50 rounded-lg p-3">
                  <dt class="text-gray-500 text-xs">Work Order #</dt>
                  <dd class="font-medium text-gray-800 mt-0.5">{{ agreement.work_order_id }}</dd>
                </div>
              </dl>
            </div>

            <div v-if="agreement.service_includes?.length" class="space-y-3 mb-6">
              <h3 class="text-sm font-semibold text-gray-900">Services Included</h3>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li v-for="(item, idx) in agreement.service_includes" :key="idx">{{ item }}</li>
              </ul>
            </div>

            <div v-if="agreement.notes" class="text-sm text-gray-600 border-t pt-4 leading-relaxed">
              {{ agreement.notes }}
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { customerPortalApi, getApiErrorMessage } from '../../../services/customerPortalApi.js'
import api from '../../../services/api.js'
import { useAuthStore } from '../../../store/AuthStore.js'

const authStore = useAuthStore()

const loading = ref(true)
const agreements = ref([])

const fetchAgreements = async () => {
  loading.value = true
  try {
  const data = await customerPortalApi.getMaintenanceAgreements()
    agreements.value = Array.isArray(data) ? data : data?.agreements || []
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Load Agreements',
      text: getApiErrorMessage(error)
    })
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatCurrency = (value) => {
  if (!value) return '$0.00'
  const num = parseFloat(value)
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatTime = (timeString) => {
  if (!timeString) return '—'
  const date = new Date(timeString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  const map = {
    'active': 'Active',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'pending': 'Pending',
    'scheduled': 'Scheduled'
  }
  return map[status.toLowerCase()] || status
}

const statusBadgeClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const lower = status.toLowerCase()
  switch (lower) {
    case 'active':
    case 'scheduled':
      return 'bg-emerald-100 text-emerald-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
watch(
  () => authStore.customerId,
  (newId, oldId) => {
    if (newId === oldId) return

    fetchAgreements()
  }
)


onMounted(() => {
  fetchAgreements()
})
</script>